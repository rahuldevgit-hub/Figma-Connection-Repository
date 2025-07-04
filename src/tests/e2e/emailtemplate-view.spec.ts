import { test, expect } from '@playwright/test';

test.describe('Email Template View', () => {
  test('should view an email template format in modal', async ({ page }) => {
    // Go to the email template list page
    await page.goto('/admin/emailtemplate');
    // Wait for table to load and click the first View button
    await page.waitForSelector('button:text("View")');
    const viewButtons = await page.locator('button:text("View")').all();
    if (viewButtons.length === 0) throw new Error('No view buttons found');
    await viewButtons[0].click();
    // Modal should appear
    await expect(page.locator('text=Email Template Preview')).toBeVisible();
    // Should show some HTML content
    await expect(page.locator('.prose')).toBeVisible();
    // Close modal
    await page.click('button:has(svg[data-icon="x"])');
    await expect(page.locator('text=Email Template Preview')).not.toBeVisible();
  });
}); 