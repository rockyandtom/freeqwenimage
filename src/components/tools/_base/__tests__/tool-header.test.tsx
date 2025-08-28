import { render, screen } from '@testing-library/react'
import { ToolHeader } from '../tool-header'

describe('ToolHeader', () => {
  const defaultProps = {
    title: 'AI Image Generator',
    description: 'Generate stunning images using AI technology',
  }

  it('renders title and description correctly', () => {
    render(<ToolHeader {...defaultProps} />)
    
    expect(screen.getByText('AI Image Generator')).toBeInTheDocument()
    expect(screen.getByText('Generate stunning images using AI technology')).toBeInTheDocument()
  })

  it('renders title as heading element', () => {
    render(<ToolHeader {...defaultProps} />)
    
    const titleElement = screen.getByRole('heading', { name: 'AI Image Generator' })
    expect(titleElement).toBeInTheDocument()
  })

  it('applies correct CSS classes for styling', () => {
    const { container } = render(<ToolHeader {...defaultProps} />)
    
    // Check if the component has proper structure
    expect(container.firstChild).toHaveClass()
  })

  it('handles empty title gracefully', () => {
    render(<ToolHeader title="" description={defaultProps.description} />)
    
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument()
  })

  it('handles empty description gracefully', () => {
    render(<ToolHeader title={defaultProps.title} description="" />)
    
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument()
  })

  it('renders with custom className when provided', () => {
    const { container } = render(
      <ToolHeader {...defaultProps} className="custom-header-class" />
    )
    
    expect(container.firstChild).toHaveClass('custom-header-class')
  })

  it('handles special characters in title and description', () => {
    const specialProps = {
      title: 'AI Tool & Generator (v2.0)',
      description: 'Create images with special chars: @#$%^&*()_+{}[]|\\:";\'<>?,./`~',
    }
    
    render(<ToolHeader {...specialProps} />)
    
    expect(screen.getByText(specialProps.title)).toBeInTheDocument()
    expect(screen.getByText(specialProps.description)).toBeInTheDocument()
  })

  it('maintains accessibility standards', () => {
    render(<ToolHeader {...defaultProps} />)
    
    // Check for proper heading hierarchy
    const heading = screen.getByRole('heading')
    expect(heading).toBeInTheDocument()
    
    // Ensure description is readable by screen readers
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument()
  })
})