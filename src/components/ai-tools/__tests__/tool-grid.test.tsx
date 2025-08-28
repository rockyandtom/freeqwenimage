import { render, screen } from '@testing-library/react'
import { ToolGrid } from '../tool-grid'

// Mock the ToolCard component
jest.mock('../tool-card', () => ({
  ToolCard: ({ tool }: { tool: any }) => (
    <div data-testid={`tool-card-${tool.id}`}>
      <h3>{tool.name}</h3>
      <p>{tool.description}</p>
    </div>
  ),
}))

describe('ToolGrid', () => {
  const mockTools = [
    {
      id: 'text-to-image',
      name: 'Text to Image',
      description: 'Generate images from text',
      category: 'image',
      href: '/ai-tools/image/text-to-image',
      icon: { input: '📝', output: '🖼️' },
      status: 'active',
      pricing: 'free',
      features: ['High quality']
    },
    {
      id: 'image-to-image',
      name: 'Image to Image',
      description: 'Transform existing images',
      category: 'image',
      href: '/ai-tools/image/image-to-image',
      icon: { input: '🖼️', output: '🎨' },
      status: 'active',
      pricing: 'free',
      features: ['Style transfer']
    },
    {
      id: 'image-enhancer',
      name: 'Image Enhancer',
      description: 'Enhance image quality',
      category: 'image',
      href: '/ai-tools/image/image-enhancer',
      icon: { input: '📷', output: '✨' },
      status: 'active',
      pricing: 'free',
      features: ['Quality boost']
    }
  ]

  it('renders all tools in a grid layout', () => {
    render(<ToolGrid tools={mockTools} />)
    
    expect(screen.getByTestId('tool-card-text-to-image')).toBeInTheDocument()
    expect(screen.getByTestId('tool-card-image-to-image')).toBeInTheDocument()
    expect(screen.getByTestId('tool-card-image-enhancer')).toBeInTheDocument()
  })

  it('displays correct tool information', () => {
    render(<ToolGrid tools={mockTools} />)
    
    expect(screen.getByText('Text to Image')).toBeInTheDocument()
    expect(screen.getByText('Generate images from text')).toBeInTheDocument()
    expect(screen.getByText('Image to Image')).toBeInTheDocument()
    expect(screen.getByText('Transform existing images')).toBeInTheDocument()
  })

  it('handles empty tools array', () => {
    render(<ToolGrid tools={[]} />)
    
    expect(screen.getByText(/no tools available/i)).toBeInTheDocument()
  })

  it('applies grid layout classes', () => {
    const { container } = render(<ToolGrid tools={mockTools} />)
    
    const gridContainer = container.firstChild
    expect(gridContainer).toHaveClass('grid')
  })

  it('handles single tool correctly', () => {
    const singleTool = [mockTools[0]]
    render(<ToolGrid tools={singleTool} />)
    
    expect(screen.getByTestId('tool-card-text-to-image')).toBeInTheDocument()
    expect(screen.queryByTestId('tool-card-image-to-image')).not.toBeInTheDocument()
  })

  it('maintains responsive grid layout', () => {
    const { container } = render(<ToolGrid tools={mockTools} />)
    
    const gridContainer = container.firstChild
    expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3')
  })

  it('applies custom className when provided', () => {
    const { container } = render(<ToolGrid tools={mockTools} className="custom-grid" />)
    
    expect(container.firstChild).toHaveClass('custom-grid')
  })

  it('handles large number of tools', () => {
    const manyTools = Array.from({ length: 20 }, (_, i) => ({
      ...mockTools[0],
      id: `tool-${i}`,
      name: `Tool ${i}`,
    }))
    
    render(<ToolGrid tools={manyTools} />)
    
    // Should render all tools
    expect(screen.getAllByText(/Tool \d+/)).toHaveLength(20)
  })

  it('preserves tool order', () => {
    render(<ToolGrid tools={mockTools} />)
    
    const toolCards = screen.getAllByTestId(/tool-card-/)
    expect(toolCards[0]).toHaveAttribute('data-testid', 'tool-card-text-to-image')
    expect(toolCards[1]).toHaveAttribute('data-testid', 'tool-card-image-to-image')
    expect(toolCards[2]).toHaveAttribute('data-testid', 'tool-card-image-enhancer')
  })

  it('handles tools with missing properties gracefully', () => {
    const incompleteTools = [
      {
        id: 'incomplete-tool',
        name: 'Incomplete Tool',
        // Missing description and other properties
      }
    ]
    
    expect(() => render(<ToolGrid tools={incompleteTools as any} />)).not.toThrow()
  })

  it('supports filtering by category', () => {
    const mixedTools = [
      ...mockTools,
      {
        id: 'video-tool',
        name: 'Video Tool',
        description: 'Process videos',
        category: 'video',
        href: '/ai-tools/video/video-tool',
        icon: { input: '🎥', output: '📹' },
        status: 'active',
        pricing: 'free',
        features: []
      }
    ]
    
    render(<ToolGrid tools={mixedTools} category="image" />)
    
    // Should only show image tools
    expect(screen.getByTestId('tool-card-text-to-image')).toBeInTheDocument()
    expect(screen.getByTestId('tool-card-image-to-image')).toBeInTheDocument()
    expect(screen.queryByTestId('tool-card-video-tool')).not.toBeInTheDocument()
  })

  it('shows loading state when tools are being fetched', () => {
    render(<ToolGrid tools={[]} loading={true} />)
    
    expect(screen.getByText(/loading tools/i)).toBeInTheDocument()
  })

  it('displays error state when tools fail to load', () => {
    render(<ToolGrid tools={[]} error="Failed to load tools" />)
    
    expect(screen.getByText(/failed to load tools/i)).toBeInTheDocument()
  })

  it('maintains accessibility standards', () => {
    render(<ToolGrid tools={mockTools} />)
    
    const gridContainer = container.firstChild
    expect(gridContainer).toHaveAttribute('role', 'grid')
    
    // Each tool card should be accessible
    const toolCards = screen.getAllByTestId(/tool-card-/)
    toolCards.forEach(card => {
      expect(card).toBeInTheDocument()
    })
  })

  it('supports keyboard navigation between tools', () => {
    render(<ToolGrid tools={mockTools} />)
    
    const toolCards = screen.getAllByTestId(/tool-card-/)
    
    // All tool cards should be focusable
    toolCards.forEach(card => {
      expect(card).not.toHaveAttribute('tabindex', '-1')
    })
  })

  it('handles tools with different statuses', () => {
    const toolsWithDifferentStatuses = [
      { ...mockTools[0], status: 'active' },
      { ...mockTools[1], status: 'beta' },
      { ...mockTools[2], status: 'coming-soon' }
    ]
    
    render(<ToolGrid tools={toolsWithDifferentStatuses} />)
    
    expect(screen.getByTestId('tool-card-text-to-image')).toBeInTheDocument()
    expect(screen.getByTestId('tool-card-image-to-image')).toBeInTheDocument()
    expect(screen.getByTestId('tool-card-image-enhancer')).toBeInTheDocument()
  })
})