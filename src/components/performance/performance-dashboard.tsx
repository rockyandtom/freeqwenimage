'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PerformanceCollector } from '@/lib/performance-collector';
import { ApiMonitor } from '@/lib/api-monitor';
import { UserAnalytics } from '@/lib/user-analytics';

interface PerformanceDashboardProps {
  className?: string;
}

export default function PerformanceDashboard({ className }: PerformanceDashboardProps) {
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [apiStats, setApiStats] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);

  useEffect(() => {
    const updateStats = () => {
      // 获取性能数据
      const perfCollector = PerformanceCollector.getInstance();
      const perfReport = perfCollector.generateReport();
      setPerformanceData(perfReport);

      // 获取API统计
      const apiMonitor = ApiMonitor.getInstance();
      const apiData = apiMonitor.getAllStats();
      setApiStats(apiData);

      // 获取用户分析数据
      const analytics = UserAnalytics.getInstance();
      const sessionStats = analytics.getSessionStats();
      const toolStats = analytics.getToolStats();
      setUserStats({ sessionStats, toolStats });
    };

    updateStats();
    const interval = setInterval(updateStats, 5000); // 每5秒更新一次

    return () => clearInterval(interval);
  }, []);

  const getScoreColor = (score: string) => {
    switch (score) {
      case 'Excellent': return 'bg-green-500';
      case 'Good': return 'bg-blue-500';
      case 'Fair': return 'bg-yellow-500';
      case 'Poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (!performanceData && !apiStats && !userStats) {
    return (
      <div className={className}>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              正在加载性能数据...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 组件性能统计 */}
      {performanceData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🚀 组件性能统计
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(performanceData).map(([componentName, data]: [string, any]) => (
                <div key={componentName} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{componentName}</h4>
                    <Badge className={getScoreColor(data.performance_score)}>
                      {data.performance_score}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>加载时间: {data.average?.loadTime?.toFixed(0)}ms</div>
                    <div>渲染时间: {data.average?.renderTime?.toFixed(0)}ms</div>
                    <div>使用次数: {data.count}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* API性能统计 */}
      {apiStats && Object.keys(apiStats).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🌐 API性能统计
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(apiStats).map(([endpoint, stats]: [string, any]) => (
                <div key={endpoint} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{endpoint}</h4>
                    <Badge variant={stats.successRate > 95 ? 'default' : 'destructive'}>
                      {stats.successRate.toFixed(1)}% 成功率
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">总调用</div>
                      <div className="font-medium">{stats.totalCalls}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">平均响应</div>
                      <div className="font-medium">{stats.averageResponseTime.toFixed(0)}ms</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">最快响应</div>
                      <div className="font-medium">{stats.minResponseTime}ms</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">最慢响应</div>
                      <div className="font-medium">{stats.maxResponseTime}ms</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 用户行为统计 */}
      {userStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              👤 用户行为统计
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 会话统计 */}
              <div>
                <h4 className="font-medium mb-3">会话信息</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">会话时长</span>
                    <span>{Math.round(userStats.sessionStats.sessionDuration / 1000 / 60)}分钟</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">总事件数</span>
                    <span>{userStats.sessionStats.totalEvents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">访问页面</span>
                    <span>{userStats.sessionStats.uniquePages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">使用工具</span>
                    <span>{userStats.sessionStats.toolsUsed}</span>
                  </div>
                </div>
              </div>

              {/* 工具使用统计 */}
              <div>
                <h4 className="font-medium mb-3">工具使用</h4>
                <div className="space-y-2">
                  {Object.entries(userStats.toolStats).map(([toolId, stats]: [string, any]) => (
                    <div key={toolId} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{toolId}</span>
                      <div className="flex items-center gap-2">
                        <span>{stats.totalUsage}次</span>
                        <Badge variant={stats.successfulGenerations > stats.failedGenerations ? 'default' : 'secondary'}>
                          {stats.successfulGenerations}成功
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}