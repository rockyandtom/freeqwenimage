/**
 * API工具函数 - 统一错误处理和响应格式
 */

import { NextResponse } from 'next/server';
import type { ApiResponse } from '@/types/runninghub';

// 错误类型枚举
export enum ApiErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  PARSE_ERROR = 'PARSE_ERROR'
}

// 错误信息接口
export interface ApiErrorInfo {
  type: ApiErrorType;
  message: string;
  details?: any;
  statusCode: number;
}

// 日志记录函数
export function logApiRequest(endpoint: string, method: string, params?: any) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] API Request: ${method} ${endpoint}`, params ? { params } : '');
}

export function logApiResponse(endpoint: string, success: boolean, duration?: number, error?: string) {
  const timestamp = new Date().toISOString();
  const status = success ? 'SUCCESS' : 'ERROR';
  const durationText = duration ? ` (${duration}ms)` : '';
  console.log(`[${timestamp}] API Response: ${endpoint} - ${status}${durationText}`, error ? { error } : '');
}

export function logApiError(endpoint: string, error: any, context?: any) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] API Error: ${endpoint}`, {
    error: error.message || error,
    stack: error.stack,
    context
  });
}

// 统一错误响应创建函数
export function createErrorResponse(errorInfo: ApiErrorInfo): NextResponse {
  logApiError('API', errorInfo, { type: errorInfo.type, details: errorInfo.details });
  
  return new NextResponse(errorInfo.message, { 
    status: errorInfo.statusCode,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

// 统一成功响应创建函数
export function createSuccessResponse<T>(data: T, statusCode: number = 200): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    data
  };
  
  return NextResponse.json(response, { status: statusCode });
}

// 验证环境变量
export function validateEnvironmentConfig(): ApiErrorInfo | null {
  if (!process.env.RUNNINGHUB_API_KEY) {
    return {
      type: ApiErrorType.CONFIGURATION_ERROR,
      message: 'RunningHub API key is not configured',
      statusCode: 500
    };
  }

  if (!process.env.RUNNINGHUB_WEBAPP_ID) {
    return {
      type: ApiErrorType.CONFIGURATION_ERROR,
      message: 'RunningHub Webapp ID is not configured',
      statusCode: 500
    };
  }

  return null;
}

// 验证文件类型
export function validateFileType(file: File, allowedTypes: string[]): ApiErrorInfo | null {
  if (!file) {
    return {
      type: ApiErrorType.VALIDATION_ERROR,
      message: 'File is required',
      statusCode: 400
    };
  }

  const fileType = file.type.toLowerCase();
  const isValidType = allowedTypes.some(type => fileType.includes(type.toLowerCase()));
  
  if (!isValidType) {
    return {
      type: ApiErrorType.VALIDATION_ERROR,
      message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
      details: { receivedType: file.type, allowedTypes },
      statusCode: 400
    };
  }

  return null;
}

// 验证文件大小
export function validateFileSize(file: File, maxSizeInMB: number): ApiErrorInfo | null {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  
  if (file.size > maxSizeInBytes) {
    return {
      type: ApiErrorType.VALIDATION_ERROR,
      message: `File size exceeds ${maxSizeInMB}MB limit`,
      details: { fileSize: file.size, maxSize: maxSizeInBytes },
      statusCode: 400
    };
  }

  return null;
}

// RunningHub API响应解析
export async function parseRunningHubResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`RunningHub API error (${response.status}): ${errorText}`);
  }

  const responseText = await response.text();
  
  try {
    return JSON.parse(responseText) as T;
  } catch (parseError) {
    throw new Error(`Invalid JSON response from RunningHub API: ${responseText}`);
  }
}

// 任务状态标准化
export function normalizeTaskStatus(status: string): string {
  const upperStatus = status.toUpperCase();
  
  switch (upperStatus) {
    case 'SUCCESS':
    case 'COMPLETED':
      return 'COMPLETED';
    case 'RUNNING':
    case 'PENDING':
      return 'RUNNING';
    case 'FAILED':
    case 'ERROR':
      return 'ERROR';
    default:
      return status;
  }
}

// 计算进度百分比
export function calculateProgress(status: string, customProgress?: number): number {
  if (customProgress !== undefined && customProgress >= 0 && customProgress <= 100) {
    return customProgress;
  }
  
  const normalizedStatus = normalizeTaskStatus(status);
  
  switch (normalizedStatus) {
    case 'COMPLETED':
      return 100;
    case 'RUNNING':
      return 50; // 默认进度
    case 'ERROR':
      return 0;
    default:
      return 0;
  }
}