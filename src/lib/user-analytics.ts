interface UserEvent {
  type: 'click' | 'view' | 'generate' | 'download' | 'error' | 'navigation';
  target: string;
  timestamp: number;
  metadata?: Record<string, any>;
  sessionId: string;
}

interface ToolUsageStats {
  toolId: string;
  totalUsage: number;
  successfulGenerations: number;
  failedGenerations: number;
  averageGenerationTime: number;
  lastUsed: number;
}

class UserAnalytics {
  private static instance: UserAnalytics;
  private events: UserEvent[] = [];
  private sessionId: string;
  private toolStats: Map<string, ToolUsageStats> = new Map();

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeEventListeners();
  }

  static getInstance(): UserAnalytics {
    if (!UserAnalytics.instance) {
      UserAnalytics.instance = new UserAnalytics();
    }
    return UserAnalytics.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeEventListeners() {
    if (typeof window === 'undefined') return;

    // 页面可见性变化监听
    document.addEventListener('visibilitychange', () => {
      this.trackEvent('view', document.visibilityState, {
        url: window.location.pathname
      });
    });

    // 页面卸载监听
    window.addEventListener('beforeunload', () => {
      this.sendAnalytics();
    });
  }

  // 跟踪事件
  trackEvent(
    type: UserEvent['type'],
    target: string,
    metadata?: Record<string, any>
  ) {
    const event: UserEvent = {
      type,
      target,
      timestamp: Date.now(),
      metadata,
      sessionId: this.sessionId
    };

    this.events.push(event);

    // 开发环境下记录到控制台
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 User Event:', event);
    }

    // 限制事件数量
    if (this.events.length > 500) {
      this.events = this.events.slice(-500);
    }
  }

  // 跟踪工具使用
  trackToolUsage(
    toolId: string,
    action: 'start' | 'success' | 'error',
    generationTime?: number
  ) {
    if (!this.toolStats.has(toolId)) {
      this.toolStats.set(toolId, {
        toolId,
        totalUsage: 0,
        successfulGenerations: 0,
        failedGenerations: 0,
        averageGenerationTime: 0,
        lastUsed: Date.now()
      });
    }

    const stats = this.toolStats.get(toolId)!;

    switch (action) {
      case 'start':
        stats.totalUsage++;
        stats.lastUsed = Date.now();
        break;
      case 'success':
        stats.successfulGenerations++;
        if (generationTime) {
          const totalTime = stats.averageGenerationTime * (stats.successfulGenerations - 1) + generationTime;
          stats.averageGenerationTime = totalTime / stats.successfulGenerations;
        }
        break;
      case 'error':
        stats.failedGenerations++;
        break;
    }

    this.trackEvent('generate', toolId, {
      action,
      generationTime,
      stats: { ...stats }
    });
  }

  // 获取工具使用统计
  getToolStats(toolId?: string) {
    if (toolId) {
      return this.toolStats.get(toolId) || null;
    }
    return Object.fromEntries(this.toolStats);
  }

  // 获取最受欢迎的工具
  getPopularTools(limit = 5) {
    return Array.from(this.toolStats.values())
      .sort((a, b) => b.totalUsage - a.totalUsage)
      .slice(0, limit);
  }

  // 获取用户会话统计
  getSessionStats() {
    const now = Date.now();
    const sessionStart = Math.min(...this.events.map(e => e.timestamp));
    const sessionDuration = now - sessionStart;

    const eventTypes = this.events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const uniquePages = new Set(
      this.events
        .filter(e => e.type === 'navigation')
        .map(e => e.target)
    ).size;

    return {
      sessionId: this.sessionId,
      sessionDuration,
      totalEvents: this.events.length,
      eventTypes,
      uniquePages,
      toolsUsed: this.toolStats.size
    };
  }

  // 发送分析数据到服务器
  async sendAnalytics() {
    if (this.events.length === 0) return;

    try {
      const analyticsData = {
        sessionId: this.sessionId,
        events: this.events,
        toolStats: Object.fromEntries(this.toolStats),
        sessionStats: this.getSessionStats(),
        timestamp: Date.now()
      };

      // 发送到分析端点
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(analyticsData)
      });

      // 清除已发送的事件
      this.events = [];
    } catch (error) {
      console.warn('Failed to send analytics:', error);
    }
  }

  // 定期发送分析数据
  startPeriodicReporting(intervalMinutes = 5) {
    setInterval(() => {
      this.sendAnalytics();
    }, intervalMinutes * 60 * 1000);
  }
}

// 便捷的跟踪函数
export const trackClick = (target: string, metadata?: Record<string, any>) => {
  UserAnalytics.getInstance().trackEvent('click', target, metadata);
};

export const trackNavigation = (page: string) => {
  UserAnalytics.getInstance().trackEvent('navigation', page);
};

export const trackToolUsage = (
  toolId: string,
  action: 'start' | 'success' | 'error',
  generationTime?: number
) => {
  UserAnalytics.getInstance().trackToolUsage(toolId, action, generationTime);
};

export { UserAnalytics };