import { test, expect } from '@playwright/test';

test.describe('LumiDeck App', () => {
  test('has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/LumiDeck/);
  });

  test('displays main interface', async ({ page }) => {
    await page.goto('/');

    // Should have main navigation
    await expect(page.getByRole('main')).toBeVisible();

    // Should have basic UI elements
    await expect(page.getByText('LumiDeck')).toBeVisible();
  });

  test('responsive design works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await expect(page.getByRole('main')).toBeVisible();
  });
});
