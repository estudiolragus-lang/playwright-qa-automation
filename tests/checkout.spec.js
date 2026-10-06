import { test, expect } from '../fixtures/index.js';
import { PRODUCTS } from '../data/products.js';
import { SHIPPING } from '../data/checkout.js';

test.describe('Checkout', () => {
  // Cada test parte con un producto en el carrito y en el primer paso del checkout
  test.beforeEach(async ({ loggedInInventory: inventory, cartPage }) => {
    await inventory.addToCart(PRODUCTS.backpack);
    await inventory.openCart();
    await cartPage.checkout();
  });

  test('TC-CHK-01: una compra completa termina con la confirmación del pedido', { tag: '@smoke' }, async ({ checkoutPage }) => {
    await checkoutPage.fillShipping(SHIPPING);
    await checkoutPage.continue();
    await checkoutPage.finish();

    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('TC-CHK-02: el nombre es obligatorio', async ({ checkoutPage }) => {
    await checkoutPage.fillShipping({ ...SHIPPING, firstName: '' });
    await checkoutPage.continue();

    await expect(checkoutPage.error).toContainText('First Name is required');
  });

  test('TC-CHK-03: el apellido es obligatorio', async ({ checkoutPage }) => {
    await checkoutPage.fillShipping({ ...SHIPPING, lastName: '' });
    await checkoutPage.continue();

    await expect(checkoutPage.error).toContainText('Last Name is required');
  });

  test('TC-CHK-04: el código postal es obligatorio', async ({ checkoutPage }) => {
    await checkoutPage.fillShipping({ ...SHIPPING, postalCode: '' });
    await checkoutPage.continue();

    await expect(checkoutPage.error).toContainText('Postal Code is required');
  });

  test('TC-CHK-05: cancelar el checkout vuelve al carrito', async ({ page, checkoutPage }) => {
    await checkoutPage.cancelButton.click();

    await expect(page).toHaveURL(/cart\.html/);
  });

  test('TC-CHK-06: el total del resumen es el subtotal más los impuestos', async ({ checkoutPage }) => {
    await checkoutPage.fillShipping(SHIPPING);
    await checkoutPage.continue();

    const { subtotal, tax, total } = await checkoutPage.getSummary();

    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  test('TC-CHK-07: el subtotal coincide con el precio del producto del catálogo', async ({ page, checkoutPage, inventoryPage }) => {
    await checkoutPage.fillShipping(SHIPPING);
    await checkoutPage.continue();
    const { subtotal } = await checkoutPage.getSummary();

    // Se vuelve al catálogo para leer el precio publicado del producto
    await page.goto('/inventory.html');
    const catalogPrice = await inventoryPage.priceOf(PRODUCTS.backpack);

    expect(subtotal).toBe(catalogPrice);
  });

  test('TC-CHK-08: tras finalizar la compra el carrito queda vacío', async ({ checkoutPage, inventoryPage }) => {
    await checkoutPage.fillShipping(SHIPPING);
    await checkoutPage.continue();
    await checkoutPage.finish();

    await expect(checkoutPage.completeHeader).toBeVisible();
    await expect(inventoryPage.cartBadge).toBeHidden();
  });
});
