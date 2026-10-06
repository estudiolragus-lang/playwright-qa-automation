import { test, expect } from '../fixtures/index.js';
import { PRODUCTS } from '../data/products.js';

test.describe('Carrito', () => {
  test('TC-CART-01: el carrito muestra los productos agregados', { tag: '@smoke' }, async ({ loggedInInventory: inventory, cartPage }) => {
    await inventory.addToCart(PRODUCTS.backpack);
    await inventory.addToCart(PRODUCTS.bikeLight);

    await inventory.openCart();

    await expect(cartPage.items).toHaveCount(2);
    expect(await cartPage.getNames()).toEqual([PRODUCTS.backpack.name, PRODUCTS.bikeLight.name]);
  });

  test('TC-CART-02: quitar un producto desde el carrito lo elimina de la lista', async ({ loggedInInventory: inventory, cartPage }) => {
    await inventory.addToCart(PRODUCTS.backpack);
    await inventory.addToCart(PRODUCTS.bikeLight);
    await inventory.openCart();

    await cartPage.removeItem(PRODUCTS.backpack);

    await expect(cartPage.items).toHaveCount(1);
    expect(await cartPage.getNames()).toEqual([PRODUCTS.bikeLight.name]);
  });

  test('TC-CART-03: quitar todos los productos deja el carrito vacío', async ({ loggedInInventory: inventory, cartPage }) => {
    await inventory.addToCart(PRODUCTS.backpack);
    await inventory.openCart();

    await cartPage.removeItem(PRODUCTS.backpack);

    await expect(cartPage.items).toHaveCount(0);
    await expect(inventory.cartBadge).toBeHidden();
  });

  test('TC-CART-04: "Continue Shopping" vuelve al catálogo', async ({ page, loggedInInventory: inventory, cartPage }) => {
    await inventory.openCart();

    await cartPage.continueShoppingButton.click();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventory.title).toHaveText('Products');
  });

  test('TC-CART-05: los productos del carrito se conservan al volver al catálogo', async ({ loggedInInventory: inventory, cartPage }) => {
    await inventory.addToCart(PRODUCTS.backpack);
    await inventory.openCart();

    await cartPage.continueShoppingButton.click();

    await expect(inventory.cartBadge).toHaveText('1');
  });
});
