/**
 * RunningHub API 类型定义
 * 基于官方 API 文档: runninghub-api-guide.md
 */

// 文件上传响应
export interface RunningHubUploadResponse {
  code: number;
  msg?: string;
  data?: {
    fileName: string;
    fileType?: string | null;
  };
}

// AI 任务创建响应
export interface RunningHubTaskResponse {
  code: number;
  msg?: string;
  data?: {
    netWssUrl: string;
    taskId: string;
    clientId: string;
    taskStatus: string;
    promptTips?: string;
  };
}

// 任务状态响应
export interface RunningHubStatusResponse {
  code: number;
  msg?: string;
  data?: string | {
    status: string;
    progress?: number;
  };
}

// 任务输出项
export interface RunningHubOutputItem {
  fileUrl: string;
  fileType?: string;
  taskCostTime?: string;
  nodeId?: string;
}

// 任务输出响应
export interface RunningHubOutputsResponse {
  code: number;
  msg?: string;
  data?: RunningHubOutputItem[];
}

// AI 任务创建请求
export interface RunningHubTaskRequest {
  webappId: string;
  apiKey: string;
  nodeInfoList: Array<{
    nodeId: string;
    fieldName: string;
    fieldValue: string;
    description?: string;
  }>;
}

// 状态查询请求
export interface RunningHubStatusRequest {
  apiKey: string;
  taskId: string;
}

// WebSocket 消息类型
export interface RunningHubWebSocketMessage {
  type: 'status' | 'progress' | 'execution_start' | 'execution_success' | 'error';
  data?: any;
  status?: string;
  progress?: number;
  error?: string;
  imageUrl?: string;
}

// 任务状态枚举
export type TaskStatus = 
  | 'PENDING' 
  | 'RUNNING' 
  | 'COMPLETED' 
  | 'SUCCESS' 
  | 'FAILED' 
  | 'ERROR' 
  | 'UNKNOWN';

// API 响应包装器
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}