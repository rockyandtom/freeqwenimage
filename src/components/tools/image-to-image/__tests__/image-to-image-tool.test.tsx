import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ImageToImageTool } from '../image-to-image-tool'

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

// Mock file upload utilities
jest.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
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

describe('ImageToImageTool', () => {
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

  it('renders image-to-image tool interface', () => {
    render(<ImageToImageTool />)
    
    expect(screen.getByText(/image to image/i)).toBeInTheDocument()
    expect(screen.getByText(/upload an image/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/describe how to transform/i)).toBeInTheDocument()
  })

  it('allows user to upload an image file', async () => {
    const user = userEvent.setup()
    render(<ImageToImageTool />)
    
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const fileInput = screen.getByLabelText(/upload image/i)
    
    await user.upload(fileInput, file)
    
    expect(fileInput).toHaveProperty('files', expect.arrayContaining([file]))
  })

  it('validates uploaded file type', async () => {
    const user = userEvent.setup()
    render(<ImageToImageTool />)
    
    const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' })
    const fileInput = screen.getByLabelText(/upload image/i)
    
    await user.upload(fileInput, invalidFile)
    
    expect(screen.getByText(/please upload a valid image file/i)).toBeInTheDocument()
  })

  it('validates file size limits', async () => {
    const user = userEvent.setup()
    render(<ImageToImageTool />)
    
    // Create a large file (>10MB)
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.png', { type: 'image/png' })
    const fileInput = screen.getByLabelText(/upload image/i)
    
    await user.upload(fileInput, largeFile)
    
    expect(screen.getByText(/file size too large/i)).toBeInTheDocument()
  })

  it('shows image preview after upload', async () => {
    const user = userEvent.setup()
    render(<ImageToImageTool />)
    
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const fileInput = screen.getByLabelText(/upload image/i)
    
    // Mock URL.createObjectURL
    global.URL.createObjectURL = jest.fn(() => 'blob:test-url')
    
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(screen.getByRole('img')).toBeInTheDocument()
    })
  })

  it('requires both image and prompt for transformation', async () => {
    const user = userEvent.setup()
    render(<ImageToImageTool />)
    
    const transformButton = screen.getByRole('button', { name: /transform image/i })
    expect(transformButton).toBeDisabled()
    
    // Add prompt only
    const textarea = screen.getByPlaceholderText(/describe how to transform/i)
    await user.type(textarea, 'Make it more colorful')
    
    expect(transformButton).toBeDisabled()
    
    // Add image
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const fileInput = screen.getByLabelText(/upload image/i)
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(transformButton).not.toBeDisabled()
    })
  })

  it('calls execute with correct parameters', async () => {
    const user = userEvent.setup()
    render(<ImageToImageTool />)
    
    // Upload image
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const fileInput = screen.getByLabelText(/upload image/i)
    await user.upload(fileInput, file)
    
    // Add prompt
    const textarea = screen.getByPlaceholderText(/describe how to transform/i)
    await user.type(textarea, 'Make it artistic')
    
    // Click transform
    const transformButton = screen.getByRole('button', { name: /transform image/i })
    await user.click(transformButton)
    
    expect(mockExecute).toHaveBeenCalledWith({
      imageUrl: expect.any(String),
      prompt: 'Make it artistic'
    })
  })

  it('shows loading state during transformation', () => {
    const { useAITool } = require('@/hooks/use-ai-tool')
    useAITool.mockReturnValue({
      execute: mockExecute,
      isLoading: true,
      result: null,
      error: null,
      progress: 30,
      reset: mockReset,
    })

    render(<ImageToImageTool />)
    
    expect(screen.getByText(/transforming/i)).toBeInTheDocument()
    expect(screen.getByText('30%')).toBeInTheDocument()
  })

  it('displays transformed image result', () => {
    const mockResult = {
      imageUrl: 'https://example.com/transformed-image.jpg',
      originalUrl: 'https://example.com/original-image.jpg'
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

    render(<ImageToImageTool />)
    
    expect(screen.getByText(/transformation complete/i)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /transformed/i })).toHaveAttribute('src', mockResult.imageUrl)
  })

  it('provides before/after comparison view', () => {
    const mockResult = {
      imageUrl: 'https://example.com/transformed-image.jpg',
      originalUrl: 'https://example.com/original-image.jpg'
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

    render(<ImageToImageTool />)
    
    expect(screen.getByText(/before/i)).toBeInTheDocument()
    expect(screen.getByText(/after/i)).toBeInTheDocument()
    expect(screen.getAllByRole('img')).toHaveLength(2)
  })

  it('handles transformation errors gracefully', () => {
    const { useAITool } = require('@/hooks/use-ai-tool')
    useAITool.mockReturnValue({
      execute: mockExecute,
      isLoading: false,
      result: null,
      error: 'Transformation failed: Invalid image format',
      progress: 0,
      reset: mockReset,
    })

    render(<ImageToImageTool />)
    
    expect(screen.getByText(/transformation failed/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('allows user to start new transformation', async () => {
    const user = userEvent.setup()
    const mockResult = {
      imageUrl: 'https://example.com/transformed-image.jpg'
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

    render(<ImageToImageTool />)
    
    const newTransformButton = screen.getByRole('button', { name: /new transformation/i })
    await user.click(newTransformButton)
    
    expect(mockReset).toHaveBeenCalled()
  })

  it('supports drag and drop file upload', async () => {
    render(<ImageToImageTool />)
    
    const dropZone = screen.getByText(/drag and drop/i).closest('div')
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    
    fireEvent.dragOver(dropZone!)
    fireEvent.drop(dropZone!, {
      dataTransfer: {
        files: [file],
      },
    })
    
    await waitFor(() => {
      expect(screen.getByText(/image uploaded/i)).toBeInTheDocument()
    })
  })

  it('maintains accessibility standards', () => {
    render(<ImageToImageTool />)
    
    const fileInput = screen.getByLabelText(/upload image/i)
    const textarea = screen.getByPlaceholderText(/describe how to transform/i)
    const transformButton = screen.getByRole('button', { name: /transform image/i })
    
    // Check for proper ARIA labels
    expect(fileInput).toHaveAttribute('aria-label')
    expect(textarea).toHaveAttribute('aria-label')
    
    // Check for keyboard accessibility
    expect(fileInput).not.toHaveAttribute('tabindex', '-1')
    expect(textarea).not.toHaveAttribute('tabindex', '-1')
    expect(transformButton).not.toHaveAttribute('tabindex', '-1')
  })
})