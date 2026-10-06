import { test, expect } from '../fixtures/index.js';
import { USERS } from '../data/users.js';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('TC-LOGIN-01: un usuario válido ingresa al catálogo', { tag: '@smoke' }, async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(USERS.standard);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('TC-LOGIN-02: un usuario bloqueado no puede ingresar', async ({ page, loginPage }) => {
    await loginPage.login(USERS.lockedOut);

    await expect(loginPage.error).toContainText('this user has been locked out');
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('TC-LOGIN-03: credenciales inexistentes muestran un error', async ({ loginPage }) => {
    await loginPage.login(USERS.invalid);

    await expect(loginPage.error).toContainText('Username and password do not match any user');
  });

  test('TC-LOGIN-04: el usuario es obligatorio', async ({ loginPage }) => {
    await loginPage.loginButton.click();

    await expect(loginPage.error).toContainText('Username is required');
  });

  test('TC-LOGIN-05: la contraseña es obligatoria', async ({ loginPage }) => {
    await loginPage.username.fill(USERS.standard.username);
    await loginPage.loginButton.click();

    await expect(loginPage.error).toContainText('Password is required');
  });

  test('TC-LOGIN-06: no se puede entrar al catálogo sin iniciar sesión', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');

    await expect(loginPage.error).toContainText('You can only access');
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('TC-LOGIN-07: cerrar sesión vuelve a la pantalla de login', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(USERS.standard);
    await expect(inventoryPage.title).toBeVisible();

    await inventoryPage.logout();

    await expect(loginPage.loginButton).toBeVisible();
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
  });
});
