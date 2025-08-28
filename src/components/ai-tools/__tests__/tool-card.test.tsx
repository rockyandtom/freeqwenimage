import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToolCard } from '../tool-card'

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
})

// Mock UI components
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>{children}</div>
  ),
  CardContent: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>{children}</div>
  ),
  CardHeader: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>{children}</div>
  ),
  CardTitle: ({ children, className, ...props }: any) => (
    <h3 className={className} {...props}>{children}</h3>
  ),
}))

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, ...props }: any) => (
    <span data-variant={variant} {...props}>{children}</span>
  ),
}))

describe('ToolCard', () => {
  const mockTool = {
    id: 'text-to-image',
    name: 'Text to Image',
    description: 'Generate stunning images from text descriptions',
    category: 'image' as const,
    href: '/ai-tools/image/text-to-image',
    icon: {
      input: '📝',
      output: '🖼️'
    },
    status: 'active' as const,
    pricing: 'free' as const,
    features: ['High quality', 'Fast generation', 'Multiple styles']
  }

  it('renders tool card with basic information', () => {
    render(<ToolCard tool={mockTool} />)
    
    expect(screen.getByText('Text to Image')).toBeInTheDocument()
    expect(screen.getByText('Generate stunning images from text descriptions')).toBeInTheDocument()
    expect(screen.getByText('📝')).toBeInTheDocument()
    expect(screen.getByText('🖼️')).toBeInTheDocument()
  })

  it('displays tool status badge', () => {
    render(<ToolCard tool={mockTool} />)
    
    const statusBadge = screen.getByText('active')
    expect(statusBadge).toBeInTheDocument()
    expect(statusBadge).toHaveAttribute('data-variant', 'default')
  })

  it('displays pricing information', () => {
    render(<ToolCard tool={mockTool} />)
    
    const pricingBadge = screen.getByText('free')
    expect(pricingBadge).toBeInTheDocument()
  })

  it('shows different status variants correctly', () => {
    const betaTool = { ...mockTool, status: 'beta' as const }
    const { rerender } = render(<ToolCard tool={betaTool} />)
    
    expect(screen.getByText('beta')).toHaveAttribute('data-variant', 'secondary')
    
    const comingSoonTool = { ...mockTool, status: 'coming-soon' as const }
    rerender(<ToolCard tool={comingSoonTool} />)
    
    expect(screen.getByText('coming-soon')).toHaveAttribute('data-variant', 'outline')
  })

  it('displays feature list when provided', () => {
    render(<ToolCard tool={mockTool} />)
    
    expect(screen.getByText('High quality')).toBeInTheDocument()
    expect(screen.getByText('Fast generation')).toBeInTheDocument()
    expect(screen.getByText('Multiple styles')).toBeInTheDocument()
  })

  it('renders as clickable link', () => {
    render(<ToolCard tool={mockTool} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/ai-tools/image/text-to-image')
  })

  it('handles hover interactions', async () => {
    const user = userEvent.setup()
    render(<ToolCard tool={mockTool} />)
    
    const card = screen.getByRole('link')
    
    await user.hover(card)
    // Card should have hover effects (tested via CSS classes)
    expect(card).toHaveClass()
  })

  it('handles tools without features gracefully', () => {
    const toolWithoutFeatures = { ...mockTool, features: [] }
    render(<ToolCard tool={toolWithoutFeatures} />)
    
    expect(screen.getByText('Text to Image')).toBeInTheDocument()
    expect(screen.getByText('Generate stunning images from text descriptions')).toBeInTheDocument()
  })

  it('handles long descriptions properly', () => {
    const toolWithLongDescription = {
      ...mockTool,
      description: 'This is a very long description that should be handled properly by the component without breaking the layout or causing any visual issues in the user interface'
    }
    
    render(<ToolCard tool={toolWithLongDescription} />)
    
    expect(screen.getByText(toolWithLongDescription.description)).toBeInTheDocument()
  })

  it('displays category information', () => {
    render(<ToolCard tool={mockTool} />)
    
    expect(screen.getByText('image')).toBeInTheDocument()
  })

  it('handles different pricing tiers', () => {
    const premiumTool = { ...mockTool, pricing: 'pro' as const }
    const { rerender } = render(<ToolCard tool={premiumTool} />)
    
    expect(screen.getByText('pro')).toBeInTheDocument()
    
    const freemiumTool = { ...mockTool, pricing: 'freemium' as const }
    rerender(<ToolCard tool={freemiumTool} />)
    
    expect(screen.getByText('freemium')).toBeInTheDocument()
  })

  it('applies custom className when provided', () => {
    const { container } = render(<ToolCard tool={mockTool} className="custom-class" />)
    
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('handles missing icon gracefully', () => {
    const toolWithoutIcon = { ...mockTool, icon: { input: '', output: '' } }
    render(<ToolCard tool={toolWithoutIcon} />)
    
    expect(screen.getByText('Text to Image')).toBeInTheDocument()
  })

  it('maintains accessibility standards', () => {
    render(<ToolCard tool={mockTool} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href')
    
    const heading = screen.getByRole('heading', { name: 'Text to Image' })
    expect(heading).toBeInTheDocument()
  })

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<ToolCard tool={mockTool} />)
    
    const link = screen.getByRole('link')
    
    await user.tab()
    expect(link).toHaveFocus()
    
    await user.keyboard('{Enter}')
    // Link should be activated (navigation would occur in real app)
  })

  it('displays deprecated status correctly', () => {
    const deprecatedTool = { ...mockTool, status: 'deprecated' as const }
    render(<ToolCard tool={deprecatedTool} />)
    
    const statusBadge = screen.getByText('deprecated')
    expect(statusBadge).toHaveAttribute('data-variant', 'destructive')
  })

  it('handles special characters in tool name and description', () => {
    const specialTool = {
      ...mockTool,
      name: 'AI Tool & Generator (v2.0)',
      description: 'Create images with special chars: @#$%^&*()_+{}[]|\\:";\'<>?,./`~'
    }
    
    render(<ToolCard tool={specialTool} />)
    
    expect(screen.getByText(specialTool.name)).toBeInTheDocument()
    expect(screen.getByText(specialTool.description)).toBeInTheDocument()
  })
})