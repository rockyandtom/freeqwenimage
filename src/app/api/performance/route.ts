import { NextRequest, NextResponse } from 'next/server';

interface PerformanceMetric {
  componentName: string;
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  memoryUsage?: number;
  timestamp: number;
}

// 存储性能指标（生产环境中应该使用数据库）
const performanceStore: PerformanceMetric[] = [];
const MAX_METRICS = 1000; // 最多保存1000条记录

export async function POST(request: NextRequest) {
  try {
    const metrics: PerformanceMetric[] = await request.json();
    
    // 验证数据
    if (!Array.isArray(metrics)) {
      return NextResponse.json(
        { success: false, error: 'Invalid performance data' },
        { status: 400 }
      );
    }

    // 添加时间戳
    const timestampedMetrics = metrics.map(metric => ({
      ...metric,
      timestamp: Date.now()
    }));

    // 存储性能指标
    performanceStore.push(...timestampedMetrics);

    // 保持最大记录数限制
    if (performanceStore.length > MAX_METRICS) {
      performanceStore.splice(0, performanceStore.length - MAX_METRICS);
    }

    // 在开发环境中记录到控制台
    if (process.env.NODE_ENV === 'development') {
      console.log('📈 Performance metrics received:', timestampedMetrics.length);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Performance metrics received' 
    });

  } catch (error) {
    console.error('Performance API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const componentName = searchParams.get('component');
    const timeRange = searchParams.get('timeRange') || '1h'; // 默认1小时

    // 计算时间范围
    const timeRangeMs = getTimeRangeMs(timeRange);
    const cutoffTime = Date.now() - timeRangeMs;

    // 过滤数据
    let filteredMetrics = performanceStore.filter(metric => 
      metric.timestamp > cutoffTime
    );

    if (componentName) {
      filteredMetrics = filteredMetrics.filter(metric => 
        metric.componentName === componentName
      );
    }

    // 生成统计报告
    const report = generatePerformanceReport(filteredMetrics);

    return NextResponse.json({ success: true, data: report });

  } catch (error) {
    console.error('Performance GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getTimeRangeMs(timeRange: string): number {
  const ranges: Record<string, number> = {
    '5m': 5 * 60 * 1000,
    '15m': 15 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '6h': 6 * 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000
  };
  return ranges[timeRange] || ranges['1h'];
}

function generatePerformanceReport(metrics: PerformanceMetric[]) {
  if (metrics.length === 0) {
    return {
      totalMetrics: 0,
      components: {},
      summary: {
        averageLoadTime: 0,
        averageRenderTime: 0,
        averageInteractionTime: 0,
        averageMemoryUsage: 0
      }
    };
  }

  // 按组件分组
  const componentGroups: Record<string, PerformanceMetric[]> = {};
  metrics.forEach(metric => {
    if (!componentGroups[metric.componentName]) {
      componentGroups[metric.componentName] = [];
    }
    componentGroups[metric.componentName].push(metric);
  });

  // 计算每个组件的统计信息
  const components: Record<string, any> = {};
  Object.entries(componentGroups).forEach(([componentName, componentMetrics]) => {
    const loadTimes = componentMetrics.map(m => m.loadTime);
    const renderTimes = componentMetrics.map(m => m.renderTime);
    const interactionTimes = componentMetrics.map(m => m.interactionTime);
    const memoryUsages = componentMetrics
      .map(m => m.memoryUsage)
      .filter(Boolean) as number[];

    components[componentName] = {
      count: componentMetrics.length,
      loadTime: {
        average: average(loadTimes),
        min: Math.min(...loadTimes),
        max: Math.max(...loadTimes),
        p95: percentile(loadTimes, 95)
      },
      renderTime: {
        average: average(renderTimes),
        min: Math.min(...renderTimes),
        max: Math.max(...renderTimes),
        p95: percentile(renderTimes, 95)
      },
      interactionTime: {
        average: average(interactionTimes),
        min: Math.min(...interactionTimes),
        max: Math.max(...interactionTimes),
        p95: percentile(interactionTimes, 95)
      },
      memoryUsage: memoryUsages.length > 0 ? {
        average: average(memoryUsages),
        min: Math.min(...memoryUsages),
        max: Math.max(...memoryUsages),
        p95: percentile(memoryUsages, 95)
      } : null,
      performanceScore: calculatePerformanceScore({
        loadTime: average(loadTimes),
        renderTime: average(renderTimes),
        interactionTime: average(interactionTimes),
        memoryUsage: memoryUsages.length > 0 ? average(memoryUsages) : undefined
      })
    };
  });

  // 计算总体统计
  const allLoadTimes = metrics.map(m => m.loadTime);
  const allRenderTimes = metrics.map(m => m.renderTime);
  const allInteractionTimes = metrics.map(m => m.interactionTime);
  const allMemoryUsages = metrics
    .map(m => m.memoryUsage)
    .filter(Boolean) as number[];

  return {
    totalMetrics: metrics.length,
    components,
    summary: {
      averageLoadTime: average(allLoadTimes),
      averageRenderTime: average(allRenderTimes),
      averageInteractionTime: average(allInteractionTimes),
      averageMemoryUsage: allMemoryUsages.length > 0 ? average(allMemoryUsages) : 0
    }
  };
}

function average(numbers: number[]): number {
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}

function percentile(numbers: number[], p: number): number {
  const sorted = [...numbers].sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[index];
}

function calculatePerformanceScore(metrics: {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  memoryUsage?: number;
}): string {
  let score = 100;
  
  // 加载时间评分 (目标: < 2000ms)
  if (metrics.loadTime > 2000) score -= 20;
  else if (metrics.loadTime > 1000) score -= 10;
  
  // 渲染时间评分 (目标: < 100ms)
  if (metrics.renderTime > 100) score -= 15;
  else if (metrics.renderTime > 50) score -= 5;
  
  // 交互时间评分 (目标: < 100ms)
  if (metrics.interactionTime > 100) score -= 15;
  else if (metrics.interactionTime > 50) score -= 5;
  
  // 内存使用评分 (目标: < 50MB)
  if (metrics.memoryUsage) {
    const memoryMB = metrics.memoryUsage / 1024 / 1024;
    if (memoryMB > 100) score -= 20;
    else if (memoryMB > 50) score -= 10;
  }
  
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Poor';
}