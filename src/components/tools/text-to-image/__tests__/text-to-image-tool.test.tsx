import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TextToImageTool } from '../text-to-image-tool'

// Mock the useAITool hook
jest.mock('@/hooks/use-ai-tool', () => ({
  useAITool: jest.fn(() => ({
    execute: jest.fn(),
    isLoading: false,
    result: null,
    error: null,
    progress: 0,
    reset: jest.fn(),
  })),
}))

// Mock the ToolLayout component
jest.mock('../../_base/tool-layout', () => ({
  ToolLayout: ({ title, description, children }: any) => (
    <div data-testid="tool-layout">
      <h1>{title}</h1>
      <p>{description}</p>
      {children}
    </div>
  ),
}))

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}))

jest.mock('@/components/ui/textarea', () => ({
  Textarea: ({ value, onChange, placeholder, ...props }: any) => (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...props}
    />
  ),
}))

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}))

describe('TextToImageTool', () => {
  const mockExecute = jest.fn()
  const mockReset = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    const { useAITool } = require('@/hooks/use-ai-tool')
    useAITool.mockReturnValue({
      execute: mockExecute,
      isLoading: false,
      result: null,
      error: null,
      progress: 0,
      reset: mockReset,
    })
  })

  it('renders text-to-image tool interface', () => {
    render(<TextToImageTool />)
    
    expect(screen.getByTestId('tool-layout')).toBeInTheDocument()
    expect(screen.getByText('Text to Image')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/describe the image/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /generate image/i })).toBeInTheDocument()
  })

  it('allows user to input prompt text', async () => {
    const user = userEvent.setup()
    render(<TextToImageTool />)
    
    const textarea = screen.getByPlaceholderText(/describe the image/i)
    await user.type(textarea, 'A beautiful sunset over mountains')
    
    expect(textarea).toHaveValue('A beautiful sunset over mountains')
  })

  it('calls execute function when generate button is clicked', async () => {
    const user = userEvent.setup()
    render(<TextToImageTool />)
    
    const textarea = screen.getByPlaceholderText(/describe the image/i)
    const generateButton = screen.getByRole('button', { name: /generate image/i })
    
    await user.type(textarea, 'Test prompt')
    await user.click(generateButton)
    
    expect(mockExecute).toHaveBeenCalledWith({
      prompt: 'Test prompt'
    })
  })

  it('disables generate button when prompt is empty', () => {
    render(<TextToImageTool />)
    
    const generateButton = screen.getByRole('button', { name: /generate image/i })
    expect(generateButton).toBeDisabled()
  })

  it('shows loading state when processing', () => {
    const { useAITool } = require('@/hooks/use-ai-tool')
    useAITool.mockReturnValue({
      execute: mockExecute,
      isLoading: true,
      result: null,
      error: null,
      progress: 50,
      reset: mockReset,
    })

    render(<TextToImageTool />)
    
    expect(screen.getByText(/generating/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /generating/i })).toBeDisabled()
  })

  it('displays progress when available', () => {
    const { useAITool } = require('@/hooks/use-ai-tool')
    useAITool.mockReturnValue({
      execute: mockExecute,
      isLoading: true,
      result: null,
      error: null,
      progress: 75,
      reset: mockReset,
    })

    render(<TextToImageTool />)
    
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('displays generated image when result is available', () => {
    const mockResult = {
      imageUrl: 'https://example.com/generated-image.jpg',
      taskId: 'task_123'
    }

    const { useAITool } = require('@/hooks/use-ai-tool')
    useAITool.mockReturnValue({
      execute: mockExecute,
      isLoading: false,
      result: mockResult,
      error: null,
      progress: 100,
      reset: mockReset,
    })

    render(<TextToImageTool />)
    
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('src', mockResult.imageUrl)
  })

  it('displays error message when error occurs', () => {
    const { useAITool } = require('@/hooks/use-ai-tool')
    useAITool.mockReturnValue({
      execute: mockExecute,
      isLoading: false,
      result: null,
      error: 'Failed to generate image',
      progress: 0,
      reset: mockReset,
    })

    render(<TextToImageTool />)
    
    expect(screen.getByText('Failed to generate image')).toBeInTheDocument()
  })

  it('provides download functionality for generated image', () => {
    const mockResult = {
      imageUrl: 'https://example.com/generated-image.jpg',
      taskId: 'task_123'
    }

    const { useAITool } = require('@/hooks/use-ai-tool')
    useAITool.mockReturnValue({
      execute: mockExecute,
      isLoading: false,
      result: mockResult,
      error: null,
      progress: 100,
      reset: mockReset,
    })

    render(<TextToImageTool />)
    
    const downloadButton = screen.getByRole('button', { name: /download/i })
    expect(downloadButton).toBeInTheDocument()
  })

  it('allows user to reset and generate new image', async () => {
    const user = userEvent.setup()
    const mockResult = {
      imageUrl: 'https://example.com/generated-image.jpg',
      taskId: 'task_123'
    }

    const { useAITool } = require('@/hooks/use-ai-tool')
    useAITool.mockReturnValue({
      execute: mockExecute,
      isLoading: false,
      result: mockResult,
      error: null,
      progress: 100,
      reset: mockReset,
    })

    render(<TextToImageTool />)
    
    const newImageButton = screen.getByRole('button', { name: /generate new image/i })
    await user.click(newImageButton)
    
    expect(mockReset).toHaveBeenCalled()
  })

  it('validates prompt length', async () => {
    const user = userEvent.setup()
    render(<TextToImageTool />)
    
    const textarea = screen.getByPlaceholderText(/describe the image/i)
    const longPrompt = 'a'.repeat(1001) // Assuming 1000 char limit
    
    await user.type(textarea, longPrompt)
    
    expect(screen.getByText(/prompt too long/i)).toBeInTheDocument()
  })

  it('handles accessibility requirements', () => {
    render(<TextToImageTool />)
    
    const textarea = screen.getByPlaceholderText(/describe the image/i)
    const generateButton = screen.getByRole('button', { name: /generate image/i })
    
    // Check for proper labeling
    expect(textarea).toHaveAttribute('aria-label')
    expect(generateButton).toBeInTheDocument()
    
    // Check for keyboard navigation
    expect(textarea).not.toHaveAttribute('tabindex', '-1')
    expect(generateButton).not.toHaveAttribute('tabindex', '-1')
  })
})