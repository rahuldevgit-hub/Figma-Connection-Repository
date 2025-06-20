import { test, expect } from '@playwright/test';

test('admin login: invalid → message, valid → dashboard', async ({ page }) => {
  await page.goto('/administrator');

  // 🔴 Step 1: Invalid
  await page.fill('input[name="email"]', 'wrong@test.com');
  await page.fill('input[name="password"]', 'wrongpass');
  await page.click('button[type="submit"]');
  await expect(page.locator('body')).toContainText(/login failed/i);

  // 🟢 Step 2: Valid
  await page.fill('input[name="email"]', 'info@eboxtenders.com');
  await page.fill('input[name="password"]', 'Passw0rd!');
  await Promise.all([
    page.waitForNavigation(),
    page.click('button[type="submit"]'),
  ]);

  // ✅ Check dashboard URL
  await expect(page).toHaveURL(/admin\/dashboard/);

  // ✅ Replace this with actual dashboard text
  await expect(page.locator('text=Total Revenue')).toBeVisible();
});
