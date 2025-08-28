import { NextRequest } from 'next/server';
import { TOOLS_CONFIG, getToolsByCategory, getActiveTools, getToolCategories } from '@/config/tools';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    
    let tools = TOOLS_CONFIG;
    
    // Filter by category
    if (category && category !== 'all') {
      tools = getToolsByCategory(category as any);
    }
    
    // Filter by status
    if (status && status !== 'all') {
      tools = tools.filter(tool => tool.status === status);
    }
    
    // Filter active tools only
    if (featured === 'true') {
      tools = getActiveTools();
    }
    
    // Add usage statistics (mock data for now)
    const toolsWithStats = tools.map(tool => ({
      ...tool,
      stats: {
        totalUsage: Math.floor(Math.random() * 10000) + 1000,
        monthlyUsage: Math.floor(Math.random() * 1000) + 100,
        rating: (4.0 + Math.random()).toFixed(1),
        lastUpdated: tool.metadata.updatedAt
      }
    }));
    
    return Response.json({
      success: true,
      data: {
        tools: toolsWithStats,
        categories: getToolCategories(),
        total: toolsWithStats.length,
        filters: {
          category: category || 'all',
          status: status || 'all',
          featured: featured === 'true'
        }
      }
    });
    
  } catch (error) {
    console.error('Tools list API error:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch tools list' },
      { status: 500 }
    );
  }
}