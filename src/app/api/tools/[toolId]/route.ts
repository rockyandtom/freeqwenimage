import { NextRequest } from 'next/server';
import { getToolById } from '@/config/tools';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ toolId: string }> }
) {
  try {
    const { toolId } = await params;
    
    const tool = getToolById(toolId);
    
    if (!tool) {
      return Response.json(
        { success: false, error: 'Tool not found' },
        { status: 404 }
      );
    }
    
    // Add detailed statistics and information
    const toolDetails = {
      ...tool,
      stats: {
        totalUsage: Math.floor(Math.random() * 10000) + 1000,
        monthlyUsage: Math.floor(Math.random() * 1000) + 100,
        weeklyUsage: Math.floor(Math.random() * 500) + 50,
        rating: (4.0 + Math.random()).toFixed(1),
        reviewCount: Math.floor(Math.random() * 500) + 50,
        lastUpdated: tool.metadata.updatedAt,
        averageProcessingTime: Math.floor(Math.random() * 20) + 10 + 's'
      },
      capabilities: {
        maxFileSize: '10MB',
        supportedFormats: tool.category === 'image' 
          ? ['JPG', 'PNG', 'WEBP', 'GIF']
          : tool.category === 'video'
          ? ['MP4', 'MOV', 'AVI']
          : ['TXT', 'MD'],
        outputFormats: tool.category === 'image'
          ? ['JPG', 'PNG', 'WEBP']
          : tool.category === 'video'
          ? ['MP4', 'GIF']
          : ['TXT', 'MD'],
        processingTime: '10-30 seconds',
        qualityOptions: ['Standard', 'High', 'Ultra']
      },
      examples: [
        {
          title: `${tool.name} Example 1`,
          description: `Sample ${tool.category} processing result`,
          inputUrl: `/images/examples/${tool.id}-input-1.jpg`,
          outputUrl: `/images/examples/${tool.id}-output-1.jpg`
        },
        {
          title: `${tool.name} Example 2`, 
          description: `Another ${tool.category} processing example`,
          inputUrl: `/images/examples/${tool.id}-input-2.jpg`,
          outputUrl: `/images/examples/${tool.id}-output-2.jpg`
        }
      ]
    };
    
    return Response.json({
      success: true,
      data: toolDetails
    });
    
  } catch (error) {
    console.error('Tool details API error:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch tool details' },
      { status: 500 }
    );
  }
}