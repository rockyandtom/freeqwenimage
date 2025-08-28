interface ApiMetrics {
  endpoint: string;
  method: string;
  responseTime: number;
  status: number;
  timestamp: number;
  success: boolean;
}

class ApiMonitor {
  private static instance: ApiMonitor;
  private metrics: ApiMetrics[] = [];
  private maxMetrics = 1000; // 最多保存1000条记录

  static getInstance(): ApiMonitor {
    if (!ApiMonitor.instance) {
      ApiMonitor.instance = new ApiMonitor();
    }
    return ApiMonitor.instance;
  }

  // 记录API调用
  recordApiCall(
    endpoint: string,
    method: string,
    responseTime: number,
    status: number,
    success: boolean
  ) {
    const metric: ApiMetrics = {
      endpoint,
      method,
      responseTime,
      status,
      timestamp: Date.now(),
      success
    };

    this.metrics.push(metric);

    // 保持最大记录数限制
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // 开发环境下记录到控制台
    if (process.env.NODE_ENV === 'development') {
      const statusColor = success ? '🟢' : '🔴';
      console.log(
        `${statusColor} API ${method} ${endpoint} - ${responseTime}ms (${status})`
      );
    }
  }

  // 获取指定端点的统计信息
  getEndpointStats(endpoint: string) {
    const endpointMetrics = this.metrics.filter(m => m.endpoint === endpoint);
    
    if (endpointMetrics.length === 0) {
      return null;
    }

    const responseTimes = endpointMetrics.map(m => m.responseTime);
    const successCount = endpointMetrics.filter(m => m.success).length;
    
    return {
      totalCalls: endpointMetrics.length,
      successRate: (successCount / endpointMetrics.length) * 100,
      averageResponseTime: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
      minResponseTime: Math.min(...responseTimes),
      maxResponseTime: Math.max(...responseTimes),
      recentCalls: endpointMetrics.slice(-10) // 最近10次调用
    };
  }

  // 获取所有API统计信息
  getAllStats() {
    const endpoints = [...new Set(this.metrics.map(m => m.endpoint))];
    const stats: Record<string, any> = {};

    endpoints.forEach(endpoint => {
      stats[endpoint] = this.getEndpointStats(endpoint);
    });

    return stats;
  }

  // 获取性能警告
  getPerformanceWarnings() {
    const warnings: string[] = [];
    const stats = this.getAllStats();

    Object.entries(stats).forEach(([endpoint, stat]: [string, any]) => {
      if (stat.averageResponseTime > 5000) {
        warnings.push(`${endpoint}: 平均响应时间过长 (${stat.averageResponseTime.toFixed(0)}ms)`);
      }
      
      if (stat.successRate < 95) {
        warnings.push(`${endpoint}: 成功率过低 (${stat.successRate.toFixed(1)}%)`);
      }
    });

    return warnings;
  }

  // 清除旧数据
  clearOldMetrics(olderThanHours = 24) {
    const cutoffTime = Date.now() - (olderThanHours * 60 * 60 * 1000);
    this.metrics = this.metrics.filter(m => m.timestamp > cutoffTime);
  }
}

// 创建监控装饰器函数
export function withApiMonitoring<T extends (...args: any[]) => Promise<Response>>(
  endpoint: string,
  method: string,
  apiFunction: T
): T {
  return (async (...args: any[]) => {
    const startTime = Date.now();
    const monitor = ApiMonitor.getInstance();
    
    try {
      const response = await apiFunction(...args);
      const responseTime = Date.now() - startTime;
      const success = response.ok;
      
      monitor.recordApiCall(endpoint, method, responseTime, response.status, success);
      
      return response;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      monitor.recordApiCall(endpoint, method, responseTime, 500, false);
      throw error;
    }
  }) as T;
}

export { ApiMonitor };