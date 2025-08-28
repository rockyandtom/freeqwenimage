"use client"

import { useState, useEffect, useCallback } from 'react';
import { ApplicationConfig, getApplicationById } from '@/config/applications';

interface UseApplicationReturn {
  application: ApplicationConfig | null;
  isLoading: boolean;
  error: string | null;
  loadApplication: (appId: string) => Promise<void>;
  clearApplication: () => void;
}

/**
 * 应用加载和管理Hook
 * 提供应用的动态加载、状态管理和错误处理
 */
export function useApplication(initialAppId?: string): UseApplicationReturn {
  const [application, setApplication] = useState<ApplicationConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载应用配置
  const loadApplication = useCallback(async (appId: string) => {
    if (!appId) {
      clearApplication();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 获取应用配置
      const appConfig = getApplicationById(appId);
      
      if (!appConfig) {
        throw new Error(`Application ${appId} not found`);
      }

      if (appConfig.status === 'deprecated') {
        throw new Error(`Application ${appId} is deprecated`);
      }

      // 模拟组件预加载（可选）
      if (appConfig.component) {
        // 这里可以添加组件预加载逻辑
        // 例如：await import(`@/components/workspace/applications/${appConfig.component.toLowerCase()}`);
      }

      setApplication(appConfig);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load application';
      setError(errorMessage);
      console.error('Application loading error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 清除应用
  const clearApplication = useCallback(() => {
    setApplication(null);
    setError(null);
    setIsLoading(false);
  }, []);

  // 初始化加载
  useEffect(() => {
    if (initialAppId) {
      loadApplication(initialAppId);
    }
  }, [initialAppId, loadApplication]);

  return {
    application,
    isLoading,
    error,
    loadApplication,
    clearApplication
  };
}

/**
 * 应用历史记录Hook
 * 管理用户使用过的应用历史
 */
export function useApplicationHistory() {
  const [history, setHistory] = useState<string[]>([]);

  // 添加到历史记录
  const addToHistory = useCallback((appId: string) => {
    setHistory(prev => {
      const filtered = prev.filter(id => id !== appId);
      return [appId, ...filtered].slice(0, 10); // 保留最近10个
    });
  }, []);

  // 清除历史记录
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  // 从localStorage加载历史记录
  useEffect(() => {
    try {
      const saved = localStorage.getItem('app-history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (error) {
      console.warn('Failed to load application history:', error);
    }
  }, []);

  // 保存历史记录到localStorage
  useEffect(() => {
    try {
      localStorage.setItem('app-history', JSON.stringify(history));
    } catch (error) {
      console.warn('Failed to save application history:', error);
    }
  }, [history]);

  return {
    history,
    addToHistory,
    clearHistory
  };
}

/**
 * 应用状态同步Hook
 * 处理URL参数与应用状态的同步
 */
export function useApplicationSync() {
  const [syncState, setSyncState] = useState({
    tool: '',
    app: null as string | null,
    isReady: false
  });

  // 更新同步状态
  const updateSyncState = useCallback((tool: string, app: string | null) => {
    setSyncState({
      tool,
      app,
      isReady: true
    });
  }, []);

  // 重置同步状态
  const resetSyncState = useCallback(() => {
    setSyncState({
      tool: '',
      app: null,
      isReady: false
    });
  }, []);

  return {
    syncState,
    updateSyncState,
    resetSyncState
  };
}