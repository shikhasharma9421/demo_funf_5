import { test, expect } from '@playwright/test';

const URL = 'https://www.saucedemo.com/';

test.describe('SauceDemo Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  // 1. Positive
  test('Valid login test', {tag: ['@smoke']}, async ({ page }) => {
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });

  // 2. Negative - wrong password
  test('Invalid password',{tag: ['@smoke']}, async ({ page }) => {
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('wrong_pass');
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toContainText(
      'Username and password do not match'
    );
  });

  // 3. Negative - wrong username
  test('Invalid username',{tag: ['@smoke']}, async ({ page }) => {
    await page.locator('[data-test="username"]').fill('wrong_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  // 4. Validation - empty username
  test('Empty username',{tag: ['@smoke']}, async ({ page }) => {
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
  });

  // 5. Validation - empty password
  test('Empty password',{tag: ['@smoke']}, async ({ page }) => {
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toContainText('Password is required');
  });

  // 6. Business rule - locked user
  test('Locked out user', {tag: ['@regression']}, async ({ page }) => {
    await page.locator('[data-test="username"]').fill('locked_out_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toContainText('locked out');
  });

});
