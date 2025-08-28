import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Tool Workflows', () => {
  test('should complete text-to-image workflow', async ({ page }) => {
    await page.goto('/ai-tools/image/text-to-image');
    
    // Fill in the prompt
    const promptText = 'A beautiful sunset over mountains';
    await page.fill('textarea[placeholder*="describe"]', promptText);
    
    // Check that generate button is enabled
    const generateButton = page.locator('button:has-text("Generate Image")');
    await expect(generateButton).toBeEnabled();
    
    // Mock the API response
    await page.route('/api/runninghubAPI/text-to-image', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            taskId: 'test-task-123',
            status: 'pending'
          }
        })
      });
    });
    
    await page.route('/api/runninghubAPI/status', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            status: 'completed',
            progress: 100,
            resultUrl: 'https://example.com/generated-image.jpg'
          }
        })
      });
    });
    
    // Click generate button
    await generateButton.click();
    
    // Check loading state
    await expect(page.locator('text=Generating')).toBeVisible();
    
    // Wait for completion
    await expect(page.locator('img[alt*="Generated"]')).toBeVisible({ timeout: 10000 });
    
    // Check download button appears
    await expect(page.locator('button:has-text("Download")')).toBeVisible();
  });

  test('should complete image-to-image workflow', async ({ page }) => {
    await page.goto('/ai-tools/image/image-to-image');
    
    // Upload test image
    const fileInput = page.locator('input[type="file"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.png');
    
    // Create a test image file if it doesn't exist
    await page.evaluate(() => {
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(0, 0, 100, 100);
      return canvas.toDataURL();
    });
    
    // Mock file upload
    await fileInput.setInputFiles({
      name: 'test-image.png',
      mimeType: 'image/png',
      buffer: Buffer.from('test-image-data')
    });
    
    // Fill transformation prompt
    await page.fill('textarea[placeholder*="transform"]', 'Make it more colorful');
    
    // Mock API responses
    await page.route('/api/runninghubAPI/image-to-image', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            taskId: 'test-task-456',
            status: 'pending'
          }
        })
      });
    });
    
    await page.route('/api/runninghubAPI/status', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            status: 'completed',
            progress: 100,
            resultUrl: 'https://example.com/transformed-image.jpg'
          }
        })
      });
    });
    
    // Click transform button
    await page.click('button:has-text("Transform Image")');
    
    // Check loading state
    await expect(page.locator('text=Transforming')).toBeVisible();
    
    // Wait for completion and check before/after comparison
    await expect(page.locator('text=Before')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=After')).toBeVisible();
  });

  test('should complete image enhancement workflow', async ({ page }) => {
    await page.goto('/ai-tools/image/image-enhancer');
    
    // Upload test image
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test-image.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('test-image-data')
    });
    
    // Wait for image preview
    await expect(page.locator('img[alt*="Preview"]')).toBeVisible();
    
    // Adjust quality settings
    const qualitySlider = page.locator('input[type="range"]');
    await qualitySlider.fill('80');
    
    // Mock API responses
    await page.route('/api/runninghubAPI/Image-Enhancer', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          code: 0,
          data: {
            taskId: 'test-task-789',
            status: 'pending'
          }
        })
      });
    });
    
    await page.route('/api/runninghubAPI/status', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            status: 'completed',
            progress: 100,
            resultUrl: 'https://example.com/enhanced-image.jpg'
          }
        })
      });
    });
    
    // Click enhance button
    await page.click('button:has-text("Enhance Image")');
    
    // Check loading state
    await expect(page.locator('text=Enhancing')).toBeVisible();
    
    // Wait for completion
    await expect(page.locator('text=Enhancement Complete')).toBeVisible({ timeout: 10000 });
    
    // Check download functionality
    await expect(page.locator('button:has-text("Download Enhanced")')).toBeVisible();
  });

  test('should complete image-to-video workflow', async ({ page }) => {
    await page.goto('/ai-tools/video/image-to-video');
    
    // Upload test image
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test-image.png',
      mimeType: 'image/png',
      buffer: Buffer.from('test-image-data')
    });
    
    // Wait for image preview
    await expect(page.locator('img[alt*="Preview"]')).toBeVisible();
    
    // Select video duration
    await page.selectOption('select[name="duration"]', '5');
    
    // Select animation style
    await page.selectOption('select[name="animationStyle"]', 'smooth');
    
    // Mock API responses
    await page.route('/api/runninghubAPI/image-to-video', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            taskId: 'test-task-video-123',
            status: 'pending'
          }
        })
      });
    });
    
    await page.route('/api/runninghubAPI/status', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            status: 'completed',
            progress: 100,
            resultUrl: 'https://example.com/generated-video.mp4'
          }
        })
      });
    });
    
    // Click generate video button
    await page.click('button:has-text("Generate Video")');
    
    // Check loading state with progress
    await expect(page.locator('text=Generating Video')).toBeVisible();
    await expect(page.locator('text=This may take several minutes')).toBeVisible();
    
    // Wait for completion
    await expect(page.locator('video')).toBeVisible({ timeout: 15000 });
    
    // Check download functionality
    await expect(page.locator('button:has-text("Download Video")')).toBeVisible();
  });

  test('should handle workflow errors gracefully', async ({ page }) => {
    await page.goto('/ai-tools/image/text-to-image');
    
    // Fill in prompt
    await page.fill('textarea[placeholder*="describe"]', 'Test prompt');
    
    // Mock API error response
    await page.route('/api/runninghubAPI/text-to-image', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Invalid prompt provided'
        })
      });
    });
    
    // Click generate button
    await page.click('button:has-text("Generate Image")');
    
    // Check error message appears
    await expect(page.locator('text=Invalid prompt provided')).toBeVisible();
    
    // Check retry button appears
    await expect(page.locator('button:has-text("Try Again")')).toBeVisible();
  });

  test('should handle network errors', async ({ page }) => {
    await page.goto('/ai-tools/image/text-to-image');
    
    // Fill in prompt
    await page.fill('textarea[placeholder*="describe"]', 'Test prompt');
    
    // Mock network error
    await page.route('/api/runninghubAPI/text-to-image', async route => {
      await route.abort('failed');
    });
    
    // Click generate button
    await page.click('button:has-text("Generate Image")');
    
    // Check network error message
    await expect(page.locator('text=Network error')).toBeVisible();
  });
});