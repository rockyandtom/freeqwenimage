import { render, screen } from '@testing-library/react'
import { ToolLayout } from '../tool-layout'

// Mock the tool header component
jest.mock('../tool-header', () => ({
  ToolHeader: ({ title, description }: { title: string; description: string }) => (
    <div data-testid="tool-header">
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  ),
}))

describe('ToolLayout', () => {
  const defaultProps = {
    title: 'Test Tool',
    description: 'This is a test tool description',
    children: <div data-testid="tool-content">Tool content</div>,
  }

  it('renders tool layout with title and description', () => {
    render(<ToolLayout {...defaultProps} />)
    
    expect(screen.getByTestId('tool-header')).toBeInTheDocument()
    expect(screen.getByText('Test Tool')).toBeInTheDocument()
    expect(screen.getByText('This is a test tool description')).toBeInTheDocument()
  })

  it('renders children content', () => {
    render(<ToolLayout {...defaultProps} />)
    
    expect(screen.getByTestId('tool-content')).toBeInTheDocument()
    expect(screen.getByText('Tool content')).toBeInTheDocument()
  })

  it('applies custom className when provided', () => {
    const { container } = render(
      <ToolLayout {...defaultProps} className="custom-class" />
    )
    
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('renders without crashing when no children provided', () => {
    const propsWithoutChildren = {
      title: 'Test Tool',
      description: 'Test description',
    }
    
    expect(() => render(<ToolLayout {...propsWithoutChildren} />)).not.toThrow()
  })

  it('handles long title and description text', () => {
    const longProps = {
      title: 'Very Long Tool Title That Should Still Render Properly',
      description: 'This is a very long description that contains multiple sentences and should still be displayed correctly without breaking the layout or causing any rendering issues.',
      children: <div>Content</div>,
    }
    
    render(<ToolLayout {...longProps} />)
    
    expect(screen.getByText(longProps.title)).toBeInTheDocument()
    expect(screen.getByText(longProps.description)).toBeInTheDocument()
  })
})