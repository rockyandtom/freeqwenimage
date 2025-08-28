import { NextRequest } from 'next/server';
import { getToolCategories, getToolsByCategory, TOOLS_CONFIG } from '@/config/tools';

export async function GET(request: NextRequest) {
  try {
    const categories = getToolCategories();
    
    const categoriesWithDetails = categories.map(category => {
      const categoryTools = getToolsByCategory(category);
      const activeTools = categoryTools.filter(tool => tool.status === 'active');
      
      return {
        id: category,
        name: category.charAt(0).toUpperCase() + category.slice(1),
        description: getCategoryDescription(category),
        icon: getCategoryIcon(category),
        gradient: getCategoryGradient(category),
        toolCount: categoryTools.length,
        activeToolCount: activeTools.length,
        tools: activeTools.map(tool => ({
          id: tool.id,
          name: tool.name,
          description: tool.description,
          href: tool.href,
          icon: tool.icon,
          features: tool.features.slice(0, 3),
          status: tool.status,
          pricing: tool.pricing
        })),
        stats: {
          totalUsage: activeTools.reduce((sum, tool) => 
            sum + Math.floor(Math.random() * 1000) + 100, 0),
          popularTool: activeTools.length > 0 ? activeTools[0].name : null
        }
      };
    });
    
    // Add overall statistics
    const totalTools = TOOLS_CONFIG.length;
    const activeToolsCount = TOOLS_CONFIG.filter(tool => tool.status === 'active').length;
    
    return Response.json({
      success: true,
      data: {
        categories: categoriesWithDetails,
        summary: {
          totalCategories: categories.length,
          totalTools,
          activeTools: activeToolsCount,
          betaTools: TOOLS_CONFIG.filter(tool => tool.status === 'beta').length,
          comingSoonTools: TOOLS_CONFIG.filter(tool => tool.status === 'coming-soon').length
        }
      }
    });
    
  } catch (error) {
    console.error('Categories API error:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

function getCategoryDescription(category: string): string {
  const descriptions = {
    image: 'Create, enhance, and transform images with AI',
    video: 'Bring your images to life with AI animation',
    audio: 'Generate and process audio with AI',
    text: 'AI-powered text generation and processing'
  };
  return descriptions[category as keyof typeof descriptions] || 'AI-powered tools';
}

function getCategoryIcon(category: string): string {
  const icons = {
    image: '🖼️',
    video: '🎬',
    audio: '🎵',
    text: '📝'
  };
  return icons[category as keyof typeof icons] || '🔧';
}

function getCategoryGradient(category: string): string {
  const gradients = {
    image: 'from-blue-500 to-purple-600',
    video: 'from-purple-500 to-pink-600',
    audio: 'from-green-500 to-teal-600',
    text: 'from-orange-500 to-red-600'
  };
  return gradients[category as keyof typeof gradients] || 'from-gray-500 to-gray-600';
}