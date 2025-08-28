import { renderHook, act, waitFor } from '@testing-library/react'
import { useAITool } from '../use-ai-tool'

// Mock fetch
global.fetch = jest.fn()

// Mock toast notifications
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
  },
}))

describe('useAITool', () => {
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockClear()
  })

  it('initializes with default state', () => {
    const { result } = renderHook(() => useAITool('text-to-image'))
    
    expect(result.current.isLoading).toBe(false)
    expect(result.current.result).toBe(null)
    expect(result.current.error).toBe(null)
    expect(result.current.progress).toBe(0)
    expect(typeof result.current.execute).toBe('function')
    expect(typeof result.current.reset).toBe('function')
  })

  it('handles successful API call', async () => {
    const mockResponse = {
      success: true,
      data: {
        taskId: 'task_123',
        status: 'pending'
      }
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    const { result } = renderHook(() => useAITool('text-to-image'))

    await act(async () => {
      await result.current.execute({ prompt: 'test prompt' })
    })

    expect(mockFetch).toHaveBeenCalledWith('/api/runninghubAPI/text-to-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: 'test prompt' }),
    })
  })

  it('sets loading state during execution', async () => {
    mockFetch.mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({ success: true, data: { taskId: 'task_123' } }),
        } as Response), 100)
      )
    )

    const { result } = renderHook(() => useAITool('text-to-image'))

    act(() => {
      result.current.execute({ prompt: 'test prompt' })
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('handles API errors', async () => {
    const errorMessage = 'API request failed'
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: async () => ({ error: errorMessage }),
    } as Response)

    const { result } = renderHook(() => useAITool('text-to-image'))

    await act(async () => {
      await result.current.execute({ prompt: 'test prompt' })
    })

    expect(result.current.error).toBe(errorMessage)
    expect(result.current.isLoading).toBe(false)
  })

  it('handles network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useAITool('text-to-image'))

    await act(async () => {
      await result.current.execute({ prompt: 'test prompt' })
    })

    expect(result.current.error).toBe('Network error')
    expect(result.current.isLoading).toBe(false)
  })

  it('polls task status for long-running operations', async () => {
    // Mock initial task creation
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { taskId: 'task_123', status: 'pending' }
      }),
    } as Response)

    // Mock status polling responses
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { status: 'running', progress: 50 }
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { status: 'completed', progress: 100, resultUrl: 'https://example.com/result.jpg' }
        }),
      } as Response)

    const { result } = renderHook(() => useAITool('text-to-image'))

    await act(async () => {
      await result.current.execute({ prompt: 'test prompt' })
    })

    // Should have made multiple API calls for polling
    expect(mockFetch).toHaveBeenCalledTimes(3)
    expect(result.current.progress).toBe(100)
    expect(result.current.result).toEqual({
      status: 'completed',
      progress: 100,
      resultUrl: 'https://example.com/result.jpg'
    })
  })

  it('updates progress during polling', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { taskId: 'task_123', status: 'pending' }
      }),
    } as Response)

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { status: 'running', progress: 75 }
      }),
    } as Response)

    const { result } = renderHook(() => useAITool('text-to-image'))

    await act(async () => {
      await result.current.execute({ prompt: 'test prompt' })
    })

    await waitFor(() => {
      expect(result.current.progress).toBe(75)
    })
  })

  it('stops polling when task fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { taskId: 'task_123', status: 'pending' }
      }),
    } as Response)

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { status: 'failed', error: 'Processing failed' }
      }),
    } as Response)

    const { result } = renderHook(() => useAITool('text-to-image'))

    await act(async () => {
      await result.current.execute({ prompt: 'test prompt' })
    })

    expect(result.current.error).toBe('Processing failed')
    expect(result.current.isLoading).toBe(false)
  })

  it('resets state correctly', () => {
    const { result } = renderHook(() => useAITool('text-to-image'))

    // Set some state
    act(() => {
      result.current.reset()
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.result).toBe(null)
    expect(result.current.error).toBe(null)
    expect(result.current.progress).toBe(0)
  })

  it('handles different tool types', async () => {
    const mockResponse = {
      success: true,
      data: { taskId: 'task_456' }
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    const { result } = renderHook(() => useAITool('image-enhancer'))

    await act(async () => {
      await result.current.execute({ imageUrl: 'test.jpg' })
    })

    expect(mockFetch).toHaveBeenCalledWith('/api/runninghubAPI/Image-Enhancer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl: 'test.jpg' }),
    })
  })

  it('handles timeout during polling', async () => {
    jest.useFakeTimers()

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { taskId: 'task_123', status: 'pending' }
      }),
    } as Response)

    // Mock status polling to always return running
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: { status: 'running', progress: 50 }
      }),
    } as Response)

    const { result } = renderHook(() => useAITool('text-to-image'))

    act(() => {
      result.current.execute({ prompt: 'test prompt' })
    })

    // Fast-forward time to trigger timeout
    act(() => {
      jest.advanceTimersByTime(300000) // 5 minutes
    })

    await waitFor(() => {
      expect(result.current.error).toContain('timeout')
    })

    jest.useRealTimers()
  })

  it('prevents multiple concurrent executions', async () => {
    mockFetch.mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({ success: true, data: { taskId: 'task_123' } }),
        } as Response), 100)
      )
    )

    const { result } = renderHook(() => useAITool('text-to-image'))

    // Start first execution
    act(() => {
      result.current.execute({ prompt: 'first prompt' })
    })

    expect(result.current.isLoading).toBe(true)

    // Try to start second execution while first is running
    await act(async () => {
      await result.current.execute({ prompt: 'second prompt' })
    })

    // Should only have made one API call
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('cleans up polling on unmount', () => {
    const { result, unmount } = renderHook(() => useAITool('text-to-image'))

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { taskId: 'task_123', status: 'pending' }
      }),
    } as Response)

    act(() => {
      result.current.execute({ prompt: 'test prompt' })
    })

    // Unmount while polling
    unmount()

    // Should not cause any errors or memory leaks
    expect(() => unmount()).not.toThrow()
  })
})