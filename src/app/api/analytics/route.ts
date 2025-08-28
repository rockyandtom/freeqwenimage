import { NextRequest, NextResponse } from 'next/server';

interface AnalyticsData {
  sessionId: string;
  events: Array<{
    type: string;
    target: string;
    timestamp: number;
    metadata?: Record<string, any>;
  }>;
  toolStats: Record<string, any>;
  sessionStats: Record<string, any>;
  timestamp: number;
}

// 存储分析数据（生产环境中应该使用数据库）
const analyticsStore = new Map<string, AnalyticsData>();

export async function POST(request: NextRequest) {
  try {
    const data: AnalyticsData = await request.json();
    
    // 验证数据
    if (!data.sessionId || !Array.isArray(data.events)) {
      return NextResponse.json(
        { success: false, error: 'Invalid analytics data' },
        { status: 400 }
      );
    }

    // 存储分析数据
    analyticsStore.set(data.sessionId, data);

    // 在开发环境中记录到控制台
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics received:', {
        sessionId: data.sessionId,
        eventsCount: data.events.length,
        toolsUsed: Object.keys(data.toolStats).length,
        sessionDuration: data.sessionStats.sessionDuration
      });
    }

    // 这里可以添加发送到外部分析服务的逻辑
    // 例如：Google Analytics, Mixpanel, Amplitude 等

    return NextResponse.json({ 
      success: true, 
      message: 'Analytics data received' 
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (sessionId) {
      // 获取特定会话的数据
      const sessionData = analyticsStore.get(sessionId);
      if (!sessionData) {
        return NextResponse.json(
          { success: false, error: 'Session not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: sessionData });
    }

    // 获取汇总统计
    const allSessions = Array.from(analyticsStore.values());
    const summary = {
      totalSessions: allSessions.length,
      totalEvents: allSessions.reduce((sum, session) => sum + session.events.length, 0),
      averageSessionDuration: allSessions.reduce((sum, session) => 
        sum + (session.sessionStats.sessionDuration || 0), 0) / allSessions.length,
      popularTools: getPopularTools(allSessions),
      recentSessions: allSessions
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10)
        .map(session => ({
          sessionId: session.sessionId,
          timestamp: session.timestamp,
          eventsCount: session.events.length,
          toolsUsed: Object.keys(session.toolStats).length
        }))
    };

    return NextResponse.json({ success: true, data: summary });

  } catch (error) {
    console.error('Analytics GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getPopularTools(sessions: AnalyticsData[]) {
  const toolUsage: Record<string, number> = {};
  
  sessions.forEach(session => {
    Object.entries(session.toolStats).forEach(([toolId, stats]: [string, any]) => {
      toolUsage[toolId] = (toolUsage[toolId] || 0) + (stats.totalUsage || 0);
    });
  });

  return Object.entries(toolUsage)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([toolId, usage]) => ({ toolId, usage }));
}