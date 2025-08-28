import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ImageEnhancerTool } from '../image-enhancer-tool'

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

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}))

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}))

jest.mock('@/components/ui/slider', () => ({
  Slider: ({ value, onValueChange, ...props }: any) => (
    <input
      type="range"
      value={value?.[0] || 0}
      onChange={(e) => onValueChange?.([parseInt(e.target.value)])}
      {...props}
    />
  ),
}))

describe('ImageEnhancerTool', () => {
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

  it('renders image enhancer tool interface', () => {
    render(<ImageEnhancerTool />)
    
    expect(screen.getByText(/image enhancer/i)).toBeInTheDocument()
    expect(screen.getByText(/upload an image to enhance/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/upload image/i)).toBeInTheDocument()
  })

  it('allows user to upload an image', async () => {
    const user = userEvent.setup()
    render(<ImageEnhancerTool />)
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const fileInput = screen.getByLabelText(/upload image/i)
    
    await user.upload(fileInput, file)
    
    expect(fileInput).toHaveProperty('files', expect.arrayContaining([file]))
  })

  it('validates image file types', async () => {
    const user = userEvent.setup()
    render(<ImageEnhancerTool />)
    
    const invalidFile = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    const fileInput = screen.getByLabelText(/upload image/i)
    
    await user.upload(fileInput, invalidFile)
    
    expect(screen.getByText(/please select a valid image file/i)).toBeInTheDocument()
  })

  it('shows enhancement options after image upload', async () => {
    const user = userEvent.setup()
    render(<ImageEnhancerTool />)
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const fileInput = screen.getByLabelText(/upload image/i)
    
    global.URL.createObjectURL = jest.fn(() => 'blob:test-url')
    
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(screen.getByText(/enhancement settings/i)).toBeInTheDocument()
      expect(screen.getByText(/quality level/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /enhance image/i })).toBeInTheDocument()
    })
  })

  it('provides quality level adjustment', async () => {
    const user = userEvent.setup()
    render(<ImageEnhancerTool />)
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const fileInput = screen.getByLabelText(/upload image/i)
    
    global.URL.createObjectURL = jest.fn(() => 'blob:test-url')
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      const qualitySlider = screen.getByRole('slider')
      expect(qualitySlider).toBeInTheDocument()
    })
  })

  it('calls execute with correct parameters', async () => {
    const user = userEvent.setup()
    render(<ImageEnhancerTool />)
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const fileInput = screen.getByLabelText(/upload image/i)
    
    global.URL.createObjectURL = jest.fn(() => 'blob:test-url')
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      const enhanceButton = screen.getByRole('button', { name: /enhance image/i })
      return user.click(enhanceButton)
    })
    
    expect(mockExecute).toHaveBeenCalledWith({
      imageUrl: expect.any(String),
      quality: expect.any(Number)
    })
  })

  it('shows loading state during enhancement', () => {
    const { useAITool } = require('@/hooks/use-ai-tool')
    useAITool.mockReturnValue({
      execute: mockExecute,
      isLoading: true,
      result: null,
      error: null,
      progress: 60,
      reset: mockReset,
    })

    render(<ImageEnhancerTool />)
    
    expect(screen.getByText(/enhancing image/i)).toBeInTheDocument()
    expect(screen.getByText('60%')).toBeInTheDocument()
  })

  it('displays enhanced image result', () => {
    const mockResult = {
      imageUrl: 'https://example.com/enhanced-image.jpg',
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

    render(<ImageEnhancerTool />)
    
    expect(screen.getByText(/enhancement complete/i)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /enhanced/i })).toHaveAttribute('src', mockResult.imageUrl)
  })

  it('provides before/after comparison', () => {
    const mockResult = {
      imageUrl: 'https://example.com/enhanced-image.jpg',
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

    render(<ImageEnhancerTool />)
    
    expect(screen.getByText(/original/i)).toBeInTheDocument()
    expect(screen.getByText(/enhanced/i)).toBeInTheDocument()
    expect(screen.getAllByRole('img')).toHaveLength(2)
  })

  it('provides download functionality', () => {
    const mockResult = {
      imageUrl: 'https://example.com/enhanced-image.jpg'
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

    render(<ImageEnhancerTool />)
    
    const downloadButton = screen.getByRole('button', { name: /download enhanced image/i })
    expect(downloadButton).toBeInTheDocument()
  })

  it('handles enhancement errors', () => {
    const { useAITool } = require('@/hooks/use-ai-tool')
    useAITool.mockReturnValue({
      execute: mockExecute,
      isLoading: false,
      result: null,
      error: 'Enhancement failed: Image too large',
      progress: 0,
      reset: mockReset,
    })

    render(<ImageEnhancerTool />)
    
    expect(screen.getByText(/enhancement failed/i)).toBeInTheDocument()
    expect(screen.getByText(/image too large/i)).toBeInTheDocument()
  })

  it('allows user to enhance new image', async () => {
    const user = userEvent.setup()
    const mockResult = {
      imageUrl: 'https://example.com/enhanced-image.jpg'
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

    render(<ImageEnhancerTool />)
    
    const newImageButton = screen.getByRole('button', { name: /enhance new image/i })
    await user.click(newImageButton)
    
    expect(mockReset).toHaveBeenCalled()
  })

  it('supports different enhancement modes', async () => {
    const user = userEvent.setup()
    render(<ImageEnhancerTool />)
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const fileInput = screen.getByLabelText(/upload image/i)
    
    global.URL.createObjectURL = jest.fn(() => 'blob:test-url')
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(screen.getByText(/enhancement mode/i)).toBeInTheDocument()
      expect(screen.getByText(/general/i)).toBeInTheDocument()
      expect(screen.getByText(/photo/i)).toBeInTheDocument()
      expect(screen.getByText(/artwork/i)).toBeInTheDocument()
    })
  })

  it('maintains accessibility standards', async () => {
    const user = userEvent.setup()
    render(<ImageEnhancerTool />)
    
    const fileInput = screen.getByLabelText(/upload image/i)
    expect(fileInput).toHaveAttribute('aria-label')
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    global.URL.createObjectURL = jest.fn(() => 'blob:test-url')
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      const qualitySlider = screen.getByRole('slider')
      expect(qualitySlider).toHaveAttribute('aria-label')
      
      const enhanceButton = screen.getByRole('button', { name: /enhance image/i })
      expect(enhanceButton).not.toHaveAttribute('tabindex', '-1')
    })
  })

  it('handles large file size warnings', async () => {
    const user = userEvent.setup()
    render(<ImageEnhancerTool />)
    
    // Create a large file (>5MB)
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })
    const fileInput = screen.getByLabelText(/upload image/i)
    
    await user.upload(fileInput, largeFile)
    
    expect(screen.getByText(/large file detected/i)).toBeInTheDocument()
    expect(screen.getByText(/processing may take longer/i)).toBeInTheDocument()
  })
})