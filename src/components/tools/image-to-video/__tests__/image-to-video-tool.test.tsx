import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ImageToVideoTool } from '../image-to-video-tool'

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

jest.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange }: any) => (
    <select onChange={(e) => onValueChange?.(e.target.value)}>
      {children}
    </select>
  ),
  SelectContent: ({ children }: any) => <>{children}</>,
  SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>,
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
}))

describe('ImageToVideoTool', () => {
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

  it('renders image-to-video tool interface', () => {
    render(<ImageToVideoTool />)
    
    expect(screen.getByText(/image to video/i)).toBeInTheDocument()
    expect(screen.getByText(/upload an image to convert/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/upload image/i)).toBeInTheDocument()
  })

  it('allows user to upload an image', async () => {
    const user = userEvent.setup()
    render(<ImageToVideoTool />)
    
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const fileInput = screen.getByLabelText(/upload image/i)
    
    await user.upload(fileInput, file)
    
    expect(fileInput).toHaveProperty('files', expect.arrayContaining([file]))
  })

  it('validates image file format', async () => {
    const user = userEvent.setup()
    render(<ImageToVideoTool />)
    
    const invalidFile = new File(['test'], 'test.mp4', { type: 'video/mp4' })
    const fileInput = screen.getByLabelText(/upload image/i)
    
    await user.upload(fileInput, invalidFile)
    
    expect(screen.getByText(/please upload a valid image file/i)).toBeInTheDocument()
  })

  it('shows video generation options after image upload', async () => {
    const user = userEvent.setup()
    render(<ImageToVideoTool />)
    
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const fileInput = screen.getByLabelText(/upload image/i)
    
    global.URL.createObjectURL = jest.fn(() => 'blob:test-url')
    
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(screen.getByText(/video settings/i)).toBeInTheDocument()
      expect(screen.getByText(/duration/i)).toBeInTheDocument()
      expect(screen.getByText(/animation style/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /generate video/i })).toBeInTheDocument()
    })
  })

  it('provides duration selection options', async () => {
    const user = userEvent.setup()
    render(<ImageToVideoTool />)
    
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const fileInput = screen.getByLabelText(/upload image/i)
    
    global.URL.createObjectURL = jest.fn(() => 'blob:test-url')
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(screen.getByText(/3 seconds/i)).toBeInTheDocument()
      expect(screen.getByText(/5 seconds/i)).toBeInTheDocument()
      expect(screen.getByText(/10 seconds/i)).toBeInTheDocument()
    })
  })

  it('provides animation style options', async () => {
    const user = userEvent.setup()
    render(<ImageToVideoTool />)
    
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const fileInput = screen.getByLabelText(/upload image/i)
    
    global.URL.createObjectURL = jest.fn(() => 'blob:test-url')
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(screen.getByText(/smooth/i)).toBeInTheDocument()
      expect(screen.getByText(/dynamic/i)).toBeInTheDocument()
      expect(screen.getByText(/cinematic/i)).toBeInTheDocument()
    })
  })

  it('calls execute with correct parameters', async () => {
    const user = userEvent.setup()
    render(<ImageToVideoTool />)
    
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const fileInput = screen.getByLabelText(/upload image/i)
    
    global.URL.createObjectURL = jest.fn(() => 'blob:test-url')
    await user.upload(fileInput, file)
    
    await waitFor(async () => {
      const generateButton = screen.getByRole('button', { name: /generate video/i })
      await user.click(generateButton)
    })
    
    expect(mockExecute).toHaveBeenCalledWith({
      imageUrl: expect.any(String),
      duration: expect.any(Number),
      animationStyle: expect.any(String)
    })
  })

  it('shows loading state during video generation', () => {
    const { useAITool } = require('@/hooks/use-ai-tool')
    useAITool.mockReturnValue({
      execute: mockExecute,
      isLoading: true,
      result: null,
      error: null,
      progress: 45,
      reset: mockReset,
    })

    render(<ImageToVideoTool />)
    
    expect(screen.getByText(/generating video/i)).toBeInTheDocument()
    expect(screen.getByText('45%')).toBeInTheDocument()
    expect(screen.getByText(/this may take several minutes/i)).toBeInTheDocument()
  })

  it('displays generated video result', () => {
    const mockResult = {
      videoUrl: 'https://example.com/generated-video.mp4',
      thumbnailUrl: 'https://example.com/thumbnail.jpg'
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

    render(<ImageToVideoTool />)
    
    expect(screen.getByText(/video generation complete/i)).toBeInTheDocument()
    expect(screen.getByRole('video')).toHaveAttribute('src', mockResult.videoUrl)
  })

  it('provides video download functionality', () => {
    const mockResult = {
      videoUrl: 'https://example.com/generated-video.mp4'
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

    render(<ImageToVideoTool />)
    
    const downloadButton = screen.getByRole('button', { name: /download video/i })
    expect(downloadButton).toBeInTheDocument()
  })

  it('handles video generation errors', () => {
    const { useAITool } = require('@/hooks/use-ai-tool')
    useAITool.mockReturnValue({
      execute: mockExecute,
      isLoading: false,
      result: null,
      error: 'Video generation failed: Image resolution too low',
      progress: 0,
      reset: mockReset,
    })

    render(<ImageToVideoTool />)
    
    expect(screen.getByText(/video generation failed/i)).toBeInTheDocument()
    expect(screen.getByText(/image resolution too low/i)).toBeInTheDocument()
  })

  it('allows user to generate new video', async () => {
    const user = userEvent.setup()
    const mockResult = {
      videoUrl: 'https://example.com/generated-video.mp4'
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

    render(<ImageToVideoTool />)
    
    const newVideoButton = screen.getByRole('button', { name: /generate new video/i })
    await user.click(newVideoButton)
    
    expect(mockReset).toHaveBeenCalled()
  })

  it('shows estimated processing time', async () => {
    const user = userEvent.setup()
    render(<ImageToVideoTool />)
    
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const fileInput = screen.getByLabelText(/upload image/i)
    
    global.URL.createObjectURL = jest.fn(() => 'blob:test-url')
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(screen.getByText(/estimated processing time/i)).toBeInTheDocument()
      expect(screen.getByText(/2-5 minutes/i)).toBeInTheDocument()
    })
  })

  it('validates image resolution requirements', async () => {
    const user = userEvent.setup()
    render(<ImageToVideoTool />)
    
    // Mock image with low resolution
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const fileInput = screen.getByLabelText(/upload image/i)
    
    // Mock image loading to simulate low resolution
    global.Image = class {
      constructor() {
        setTimeout(() => {
          this.width = 100
          this.height = 100
          this.onload?.()
        }, 0)
      }
    } as any
    
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(screen.getByText(/image resolution is too low/i)).toBeInTheDocument()
      expect(screen.getByText(/minimum 512x512 pixels/i)).toBeInTheDocument()
    })
  })

  it('supports video preview before download', () => {
    const mockResult = {
      videoUrl: 'https://example.com/generated-video.mp4',
      thumbnailUrl: 'https://example.com/thumbnail.jpg'
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

    render(<ImageToVideoTool />)
    
    const video = screen.getByRole('video')
    expect(video).toHaveAttribute('controls')
    expect(video).toHaveAttribute('poster', mockResult.thumbnailUrl)
  })

  it('maintains accessibility standards', async () => {
    const user = userEvent.setup()
    render(<ImageToVideoTool />)
    
    const fileInput = screen.getByLabelText(/upload image/i)
    expect(fileInput).toHaveAttribute('aria-label')
    
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    global.URL.createObjectURL = jest.fn(() => 'blob:test-url')
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      const generateButton = screen.getByRole('button', { name: /generate video/i })
      expect(generateButton).not.toHaveAttribute('tabindex', '-1')
      
      const durationSelect = screen.getByRole('combobox')
      expect(durationSelect).toHaveAttribute('aria-label')
    })
  })
})