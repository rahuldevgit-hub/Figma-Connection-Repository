import { test, expect } from '@playwright/test';

test.describe('Email Template Edit', () => {
  test('should edit an existing email template', async ({ page }) => {
    // Go to the email template list page
    await page.goto('/admin/emailtemplate');

    // Wait for table to load and click the first edit button
    await page.waitForSelector('button:has(svg[data-icon="edit"])');
    const editButtons = await page.locator('button:has(svg[data-icon="edit"])').all();
    if (editButtons.length === 0) throw new Error('No edit buttons found');
    await editButtons[0].click();

    // Wait for edit form
    await page.waitForSelector('input#title');
    await page.fill('input#title', 'Edited Template');
    await page.fill('input#fromemail', 'edited@example.com');
    await page.fill('input#adminemail', 'admin-edited@example.com');
    await page.fill('input#subject', 'Edited Subject');
    // Set Summernote content
    await page.evaluate(() => {
      // @ts-ignore
      window.$('.note-editable').html('<p>Edited Content</p>');
    });
    // Submit
    await page.click('button[type="submit"]');
    // Expect navigation or toast
    await expect(page).toHaveURL(/.*\/admin\/emailtemplate/);
    // Optionally, check for toast message
    // await expect(page.locator('text=Email Template updated!')).toBeVisible();
  });
}); 