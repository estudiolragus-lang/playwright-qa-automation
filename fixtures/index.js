import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { USERS } from '../data/users.js';

// Un "fixture" prepara lo que un test necesita antes de correr y lo limpia después.
// Acá se arman los Page Objects y la sesión iniciada, para no repetirlo en cada test.
export const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  // Entrega el catálogo con la sesión de `problem_user` (usuario con fallos intencionales)
  problemUserInventory: async ({ loginPage, inventoryPage }, use) => {
    await loginPage.goto();
    await loginPage.login(USERS.problem);
    await expect(inventoryPage.title).toHaveText('Products');
    await use(inventoryPage);
  },

  // Entrega el catálogo con la sesión del usuario estándar ya iniciada
  loggedInInventory: async ({ loginPage, inventoryPage }, use) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard);
    await expect(inventoryPage.title).toHaveText('Products');
    await use(inventoryPage);
  },
});

export { expect };
