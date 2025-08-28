"use client"

import { useState, useCallback, useRef, useEffect } from 'react';
import { getToolById } from '@/config/tools';
import { toast } from 'sonner';
import { trackToolUsage } from '@/lib/user-analytics';
import { ApiMonitor } from '@/lib/api-monitor';

export interface UseAIToolOptions {
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
  pollInterval?: number; // 轮询间隔，默认2秒
  maxRetries?: number; // 最大重试次数
  enableCache?: boolean; // 启用结果缓存
  enableHistory?: boolean; // 启用历史记录
  autoToast?: boolean; // 自动显示toast消息
}

export interface TaskHistory {
  id: string;
  toolId: string;
  params: any;
  result: any;
  timestamp: number;
  duration: number;
}

export interface UseAIToolReturn {
  execute: (params: any) => Promise<void>;
  isLoading: boolean;
  result: any;
  error: string | null;
  progress: number;
  reset: () => void;
  retry: () => void;
  cancel: () => void;
  history: TaskHistory[];
  clearHistory: () => void;
}

export function useAITool(toolId: string, options: UseAIToolOptions = {}): UseAIToolReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState<TaskHistory[]>([]);

  const { 
    onSuccess, 
    onError, 
    pollInterval = 2000,
    maxRetries = 3,
    enableCache = true,
    enableHistory = true,
    autoToast = true
  } = options;

  // 用于取消请求和轮询
  const abortControllerRef = useRef<AbortController | null>(null);
  const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastParamsRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);

  // 缓存管理
  const cacheRef = useRef<Map<string, any>>(new Map());

  // 清理函数
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
    };
  }, []);

  // 生成缓存键
  const getCacheKey = useCallback((params: any) => {
    return `${toolId}-${JSON.stringify(params)}`;
  }, [toolId]);

  // 添加到历史记录
  const addToHistory = useCallback((params: any, result: any, duration: number) => {
    if (!enableHistory) return;
    
    const historyItem: TaskHistory = {
      id: Date.now().toString(),
      toolId,
      params,
      result,
      timestamp: Date.now(),
      duration
    };
    
    setHistory(prev => [historyItem, ...prev.slice(0, 9)]); // 保留最近10条记录
  }, [toolId, enableHistory]);

  // 轮询任务状态（增强版）
  const pollTaskStatus = useCallback(async (taskId: string, retryCount = 0) => {
    const maxAttempts = 30; // 最多轮询30次 (60秒)
    let attempts = 0;

    const poll = async () => {
      try {
        // 检查是否被取消
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }

        const response = await fetch('/api/runninghubAPI/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId }),
          signal: abortControllerRef.current?.signal
        });

        const statusResult = await response.json();
        
        if (!statusResult.success) {
          throw new Error(statusResult.error || 'Failed to get task status');
        }

        const { status, progress: taskProgress, imageUrl } = statusResult.data;
        
        // 更新进度（指数平滑）
        if (taskProgress !== undefined) {
          setProgress(prev => Math.max(prev, taskProgress));
        } else {
          // 模拟进度增长
          setProgress(prev => Math.min(prev + 2, 95));
        }

        if (status === 'completed' || status === 'SUCCESS') {
          const finalResult = { imageUrl, taskId, status };
          setResult(finalResult);
          setProgress(100);
          
          // 添加到缓存
          if (enableCache && lastParamsRef.current) {
            const cacheKey = getCacheKey(lastParamsRef.current);
            cacheRef.current.set(cacheKey, finalResult);
          }
          
          // 添加到历史记录
          const duration = Date.now() - startTimeRef.current;
          addToHistory(lastParamsRef.current, finalResult, duration);
          
          if (autoToast) {
            toast.success('Processing completed successfully!');
          }
          
          // 跟踪成功的工具使用
          const generationTime = Date.now() - startTimeRef.current;
          trackToolUsage(toolId, 'success', generationTime);
          
          onSuccess?.(statusResult.data);
          return;
        }

        if (status === 'failed' || status === 'FAILED' || status === 'ERROR') {
          throw new Error('Task processing failed');
        }

        // 继续轮询
        attempts++;
        if (attempts < maxAttempts) {
          pollTimeoutRef.current = setTimeout(poll, pollInterval);
        } else {
          throw new Error('Task timeout - processing took too long');
        }

      } catch (err) {
        // 重试逻辑
        if (retryCount < maxRetries && !abortControllerRef.current?.signal.aborted) {
          if (autoToast) {
            toast.warning(`Retrying... (${retryCount + 1}/${maxRetries})`);
          }
          setTimeout(() => pollTaskStatus(taskId, retryCount + 1), 1000);
          return;
        }
        
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        
        if (autoToast) {
          toast.error(errorMessage);
        }
        
        onError?.(errorMessage);
      }
    };

    poll();
  }, [pollInterval, onSuccess, onError, maxRetries, enableCache, getCacheKey, addToHistory, autoToast]);

  const execute = useCallback(async (params: any) => {
    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // 创建新的AbortController
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);
    setError(null);
    setResult(null);
    setProgress(0);
    startTimeRef.current = Date.now();
    lastParamsRef.current = params;
    
    // 跟踪工具使用开始
    trackToolUsage(toolId, 'start');
    
    try {
      // 检查缓存
      if (enableCache) {
        const cacheKey = getCacheKey(params);
        const cachedResult = cacheRef.current.get(cacheKey);
        if (cachedResult) {
          setResult(cachedResult);
          setProgress(100);
          if (autoToast) {
            toast.success('Loaded from cache');
          }
          onSuccess?.(cachedResult);
          return;
        }
      }

      // 获取工具配置
      const tool = getToolById(toolId);
      if (!tool) {
        throw new Error(`Tool ${toolId} not found`);
      }

      if (autoToast) {
        toast.loading('Processing your request...');
      }

      // 调用对应API（带性能监控）
      const apiStartTime = Date.now();
      const response = await fetch(tool.apiEndpoint, {
        method: 'POST',
        headers: params instanceof FormData ? {} : {
          'Content-Type': 'application/json'
        },
        body: params instanceof FormData ? params : JSON.stringify(params),
        signal: abortControllerRef.current.signal
      });
      
      // 记录API性能
      const apiResponseTime = Date.now() - apiStartTime;
      const apiMonitor = ApiMonitor.getInstance();
      apiMonitor.recordApiCall(
        tool.apiEndpoint,
        'POST',
        apiResponseTime,
        response.status,
        response.ok
      );

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'API request failed');
      }

      // 如果返回taskId，开始轮询状态
      if (result.data?.taskId) {
        await pollTaskStatus(result.data.taskId);
      } else {
        // 直接返回结果
        setResult(result.data);
        setProgress(100);
        
        // 添加到缓存
        if (enableCache) {
          const cacheKey = getCacheKey(params);
          cacheRef.current.set(cacheKey, result.data);
        }
        
        // 添加到历史记录
        const duration = Date.now() - startTimeRef.current;
        addToHistory(params, result.data, duration);
        
        if (autoToast) {
          toast.success('Processing completed!');
        }
        
        onSuccess?.(result.data);
      }

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        if (autoToast) {
          toast.info('Request cancelled');
        }
        return;
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      
      // 跟踪失败的工具使用
      trackToolUsage(toolId, 'error');
      
      if (autoToast) {
        toast.error(errorMessage);
      }
      
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [toolId, pollTaskStatus, onSuccess, onError, enableCache, getCacheKey, addToHistory, autoToast]);

  const reset = useCallback(() => {
    // 取消当前请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // 清除轮询定时器
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
    }
    
    setIsLoading(false);
    setResult(null);
    setError(null);
    setProgress(0);
    lastParamsRef.current = null;
  }, []);

  const retry = useCallback(() => {
    if (lastParamsRef.current) {
      execute(lastParamsRef.current);
    }
  }, [execute]);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
    }
    
    setIsLoading(false);
    setError(null);
    
    if (autoToast) {
      toast.info('Request cancelled');
    }
  }, [autoToast]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return { 
    execute, 
    isLoading, 
    result, 
    error, 
    progress,
    reset,
    retry,
    cancel,
    history,
    clearHistory
  };
}