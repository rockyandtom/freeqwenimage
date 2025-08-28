interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  memoryUsage?: number;
}

// 性能指标收集器
export class PerformanceCollector {
  private static instance: PerformanceCollector;
  private metrics: Map<string, PerformanceMetrics[]> = new Map();

  static getInstance(): PerformanceCollector {
    if (!PerformanceCollector.instance) {
      PerformanceCollector.instance = new PerformanceCollector();
    }
    return PerformanceCollector.instance;
  }

  addMetrics(componentName: string, metrics: PerformanceMetrics) {
    if (!this.metrics.has(componentName)) {
      this.metrics.set(componentName, []);
    }
    this.metrics.get(componentName)!.push(metrics);
  }

  getMetrics(componentName?: string) {
    if (componentName) {
      return this.metrics.get(componentName) || [];
    }
    return Object.fromEntries(this.metrics);
  }

  getAverageMetrics(componentName: string) {
    const componentMetrics = this.metrics.get(componentName);
    if (!componentMetrics || componentMetrics.length === 0) {
      return null;
    }

    const avg = componentMetrics.reduce(
      (acc, metric) => ({
        loadTime: acc.loadTime + metric.loadTime,
        renderTime: acc.renderTime + metric.renderTime,
        interactionTime: acc.interactionTime + metric.interactionTime,
        memoryUsage: (acc.memoryUsage || 0) + (metric.memoryUsage || 0)
      }),
      { loadTime: 0, renderTime: 0, interactionTime: 0, memoryUsage: 0 }
    );

    const count = componentMetrics.length;
    return {
      loadTime: avg.loadTime / count,
      renderTime: avg.renderTime / count,
      interactionTime: avg.interactionTime / count,
      memoryUsage: (avg.memoryUsage || 0) / count
    };
  }

  clearMetrics(componentName?: string) {
    if (componentName) {
      this.metrics.delete(componentName);
    } else {
      this.metrics.clear();
    }
  }

  // 导出性能报告
  generateReport() {
    const report: Record<string, any> = {};
    
    for (const [componentName, metrics] of this.metrics.entries()) {
      const avgMetrics = this.getAverageMetrics(componentName);
      report[componentName] = {
        count: metrics.length,
        average: avgMetrics,
        latest: metrics[metrics.length - 1],
        performance_score: this.calculatePerformanceScore(avgMetrics)
      };
    }
    
    return report;
  }

  private calculatePerformanceScore(metrics: PerformanceMetrics | null): string {
    if (!metrics) return 'N/A';
    
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
}