import { NextResponse } from 'next/server';
import { TOOLS_CONFIG } from '@/config/tools';

// 模拟工具使用统计数据
// 在实际应用中，这些数据应该来自数据库或分析服务
const TOOL_USAGE_STATS = {
  'text-to-image': {
    totalUses: 15420,
    weeklyGrowth: 12.5,
    trending: true,
    popular: true,
    averageRating: 4.8,
    lastUsed: new Date().toISOString()
  },
  'image-enhancer': {
    totalUses: 12350,
    weeklyGrowth: 8.3,
    trending: false,
    popular: true,
    averageRating: 4.7,
    lastUsed: new Date().toISOString()
  },
  'image-to-image': {
    totalUses: 8760,
    weeklyGrowth: 18.7,
    trending: true,
    popular: false,
    averageRating: 4.6,
    lastUsed: new Date().toISOString()
  },
  'image-to-video': {
    totalUses: 6540,
    weeklyGrowth: 25.4,
    trending: true,
    popular: false,
    averageRating: 4.5,
    lastUsed: new Date().toISOString()
  }
};

export async function GET() {
  try {
    // 计算总体统计
    const totalUses = Object.values(TOOL_USAGE_STATS).reduce((sum, stat) => sum + stat.totalUses, 0);
    const averageGrowth = Object.values(TOOL_USAGE_STATS).reduce((sum, stat) => sum + stat.weeklyGrowth, 0) / Object.keys(TOOL_USAGE_STATS).length;
    const trendingCount = Object.values(TOOL_USAGE_STATS).filter(stat => stat.trending).length;
    const popularCount = Object.values(TOOL_USAGE_STATS).filter(stat => stat.popular).length;

    // 构建响应数据
    const response = {
      success: true,
      data: {
        overview: {
          totalUses,
          averageGrowth: Math.round(averageGrowth * 10) / 10,
          trendingTools: trendingCount,
          popularTools: popularCount,
          activeTools: TOOLS_CONFIG.filter(tool => tool.status === 'active').length
        },
        tools: Object.entries(TOOL_USAGE_STATS).map(([toolId, stats]) => {
          const toolConfig = TOOLS_CONFIG.find(tool => tool.id === toolId);
          return {
            id: toolId,
            name: toolConfig?.name || toolId,
            category: toolConfig?.category || 'unknown',
            ...stats
          };
        }),
        lastUpdated: new Date().toISOString()
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching tool stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tool statistics' },
      { status: 500 }
    );
  }
}

// POST endpoint for updating tool usage (for future implementation)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { toolId, action } = body;

    if (!toolId || !action) {
      return NextResponse.json(
        { success: false, error: 'Tool ID and action are required' },
        { status: 400 }
      );
    }

    // 在实际应用中，这里会更新数据库中的使用统计
    // 目前只是返回成功响应
    console.log(`Tool usage tracked: ${toolId} - ${action}`);

    return NextResponse.json({
      success: true,
      message: 'Usage tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking tool usage:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track usage' },
      { status: 500 }
    );
  }
}