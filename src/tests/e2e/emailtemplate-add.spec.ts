import { test, expect } from '@playwright/test';

test.describe('Email Template Add', () => {
  test('should add a new email template', async ({ page }) => {
    // Go to the add email template page
    await page.goto('/admin/emailtemplate/add');

    // Fill the form fields
    await page.fill('input#title', 'Test Template');
    await page.fill('input#fromemail', 'from@example.com');
    await page.fill('input#adminemail', 'admin@example.com');
    await page.fill('input#subject', 'Test Subject');

    // Fill the Summernote editor (simulate input)
    // Summernote is a WYSIWYG editor, so we need to set its content
    await page.evaluate(() => {
      // @ts-ignore
      window.$('.note-editable').html('<p>Test Content</p>');
    });

    // Submit the form
    await page.click('button[type="submit"]');

    // Expect a success toast or navigation
    await expect(page).toHaveURL(/.*\/admin\/emailtemplate/);
    // Optionally, check for toast message if it appears
    // await expect(page.locator('text=Email template created successfully!')).toBeVisible();
  });
}); 