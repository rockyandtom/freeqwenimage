import { test, expect, devices } from '@playwright/test';

test.describe('Mobile Compatibility', () => {
  test.use({ ...devices['iPhone 12'] });

  test('should display mobile-optimized layout', async ({ page }) => {
    await page.goto('/ai-tools');
    
    // Check mobile viewport
    const viewport = page.viewportSize();
    expect(viewport?.width).toBeLessThan(768);
    
    // Check mobile-specific elements
    await expect(page.locator('[data-testid="mobile-navigation"]')).toBeVisible();
    
    // Check tool cards are stacked vertically on mobile
    const toolCards = page.locator('[data-testid="tool-card"]');
    const firstCard = toolCards.first();
    const secondCard = toolCards.nth(1);
    
    const firstCardBox = await firstCard.boundingBox();
    const secondCardBox = await secondCard.boundingBox();
    
    // On mobile, cards should be stacked (second card below first)
    expect(secondCardBox?.y).toBeGreaterThan(firstCardBox?.y! + firstCardBox?.height!);
  });

  test('should handle touch interactions', async ({ page }) => {
    await page.goto('/ai-tools/image/text-to-image');
    
    // Test touch scrolling
    await page.touchscreen.tap(200, 300);
    
    // Test textarea touch interaction
    const textarea = page.locator('textarea[placeholder*="describe"]');
    await textarea.tap();
    await expect(textarea).toBeFocused();
    
    // Test virtual keyboard doesn't break layout
    await textarea.fill('Test prompt for mobile');
    await expect(page.locator('button:has-text("Generate Image")')).toBeVisible();
  });

  test('should support mobile file upload', async ({ page }) => {
    await page.goto('/ai-tools/image/image-to-image');
    
    // Test file input on mobile
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible();
    
    // Check if camera capture is available (accept attribute)
    const acceptAttr = await fileInput.getAttribute('accept');
    expect(acceptAttr).toContain('image/*');
    
    // Test drag and drop area is touch-friendly
    const dropZone = page.locator('[data-testid="file-drop-zone"]');
    await expect(dropZone).toBeVisible();
    
    const dropZoneBox = await dropZone.boundingBox();
    expect(dropZoneBox?.height).toBeGreaterThan(100); // Minimum touch target size
  });

  test('should handle mobile-specific gestures', async ({ page }) => {
    await page.goto('/ai-tools/image/text-to-image');
    
    // Fill prompt and generate image (mocked)
    await page.fill('textarea[placeholder*="describe"]', 'Test image');
    
    // Mock successful generation
    await page.route('/api/runninghubAPI/text-to-image', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { taskId: 'test-123', status: 'pending' }
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
            resultUrl: 'https://example.com/image.jpg'
          }
        })
      });
    });
    
    await page.click('button:has-text("Generate Image")');
    
    // Wait for image to appear
    await expect(page.locator('img[alt*="Generated"]')).toBeVisible({ timeout: 10000 });
    
    // Test pinch-to-zoom on generated image (simulate)
    const image = page.locator('img[alt*="Generated"]');
    await image.tap();
    
    // Check if image modal or zoom functionality works
    await expect(page.locator('[data-testid="image-modal"]')).toBeVisible();
  });

  test('should optimize performance on mobile', async ({ page }) => {
    // Start performance monitoring
    await page.goto('/ai-tools');
    
    // Check page load performance
    const performanceEntries = await page.evaluate(() => {
      return JSON.stringify(performance.getEntriesByType('navigation'));
    });
    
    const navigation = JSON.parse(performanceEntries)[0];
    
    // Mobile performance thresholds
    expect(navigation.loadEventEnd - navigation.loadEventStart).toBeLessThan(3000); // 3s load time
    expect(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart).toBeLessThan(1500); // 1.5s DOM ready
  });

  test('should handle mobile network conditions', async ({ page }) => {
    // Simulate slow 3G connection
    await page.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 100)); // Add 100ms delay
      await route.continue();
    });
    
    await page.goto('/ai-tools/image/text-to-image');
    
    // Check loading states are shown appropriately
    await expect(page.locator('[data-testid="page-loader"]')).toBeVisible();
    
    // Check that the page eventually loads
    await expect(page.locator('textarea[placeholder*="describe"]')).toBeVisible({ timeout: 10000 });
  });

  test('should support mobile accessibility features', async ({ page }) => {
    await page.goto('/ai-tools');
    
    // Check touch target sizes (minimum 44px)
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const box = await button.boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(box.width).toBeGreaterThanOrEqual(44);
      }
    }
    
    // Check text is readable (minimum font size)
    const textElements = page.locator('p, span, div').filter({ hasText: /\w+/ });
    const textCount = await textElements.count();
    
    for (let i = 0; i < Math.min(textCount, 5); i++) {
      const element = textElements.nth(i);
      const fontSize = await element.evaluate(el => {
        return window.getComputedStyle(el).fontSize;
      });
      
      const fontSizeNum = parseInt(fontSize.replace('px', ''));
      expect(fontSizeNum).toBeGreaterThanOrEqual(16); // Minimum readable font size
    }
  });

  test('should handle mobile orientation changes', async ({ page }) => {
    await page.goto('/ai-tools/image/text-to-image');
    
    // Test portrait mode
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('textarea[placeholder*="describe"]')).toBeVisible();
    
    // Test landscape mode
    await page.setViewportSize({ width: 667, height: 375 });
    await expect(page.locator('textarea[placeholder*="describe"]')).toBeVisible();
    
    // Check layout adapts to landscape
    const textarea = page.locator('textarea[placeholder*="describe"]');
    const textareaBox = await textarea.boundingBox();
    
    // In landscape, textarea should be wider
    expect(textareaBox?.width).toBeGreaterThan(300);
  });
});

test.describe('Tablet Compatibility', () => {
  test.use({ ...devices['iPad'] });

  test('should display tablet-optimized layout', async ({ page }) => {
    await page.goto('/ai-tools');
    
    // Check tablet viewport
    const viewport = page.viewportSize();
    expect(viewport?.width).toBeGreaterThanOrEqual(768);
    expect(viewport?.width).toBeLessThan(1024);
    
    // Check tool cards are displayed in grid (2 columns on tablet)
    const toolCards = page.locator('[data-testid="tool-card"]');
    const firstCard = toolCards.first();
    const secondCard = toolCards.nth(1);
    
    const firstCardBox = await firstCard.boundingBox();
    const secondCardBox = await secondCard.boundingBox();
    
    // On tablet, cards should be side by side
    expect(Math.abs(firstCardBox?.y! - secondCardBox?.y!)).toBeLessThan(50);
    expect(secondCardBox?.x).toBeGreaterThan(firstCardBox?.x! + firstCardBox?.width!);
  });

  test('should handle tablet-specific interactions', async ({ page }) => {
    await page.goto('/ai-tools/image/image-to-image');
    
    // Test larger touch targets on tablet
    const fileUploadArea = page.locator('[data-testid="file-drop-zone"]');
    const uploadBox = await fileUploadArea.boundingBox();
    
    // Tablet should have larger upload area
    expect(uploadBox?.height).toBeGreaterThan(200);
    expect(uploadBox?.width).toBeGreaterThan(300);
    
    // Test multi-touch gestures (if supported)
    await fileUploadArea.tap();
    await expect(page.locator('input[type="file"]')).toBeVisible();
  });
});