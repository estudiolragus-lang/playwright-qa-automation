import { test, expect } from '../fixtures/index.js';
import { PRODUCTS, SORT, TOTAL_PRODUCTS } from '../data/products.js';
import { SHIPPING } from '../data/checkout.js';

/*
 * BUGS CONOCIDOS con `problem_user`
 *
 * SauceDemo incluye este usuario con fallos a propósito, para practicar la detección de bugs.
 * Cada test describe el comportamiento CORRECTO esperado y se marca con `test.fail()`:
 *   - Mientras el bug exista, el test falla y Playwright lo da por "esperado" (la suite sigue en verde).
 *   - Si el bug se corrige, el test pasaría y Playwright avisa con un error, para revisar el reporte.
 * El detalle de cada bug (pasos, resultado esperado y actual, evidencia) está en docs/BUG_REPORTS.md.
 */
test.describe('Bugs conocidos · problem_user', { tag: '@bug' }, () => {
  test('BUG-001 · las imágenes de los productos son distintas entre sí', async ({ problemUserInventory: inventory }) => {
    test.fail(true, 'BUG-001: todos los productos muestran la misma imagen de error');

    const sources = await inventory.items.locator('img').evaluateAll((images) => images.map((img) => img.getAttribute('src')));

    expect(new Set(sources).size).toBe(TOTAL_PRODUCTS);
  });

  test('BUG-002 · ordenar de la Z a la A reordena el catálogo', async ({ problemUserInventory: inventory }) => {
    test.fail(true, 'BUG-002: el selector de orden no modifica la lista');

    await inventory.sortBy(SORT.nameDesc);

    const names = await inventory.getNames();
    expect(names).toEqual([...names].sort().reverse());
  });

  for (const product of [PRODUCTS.boltTShirt, PRODUCTS.fleeceJacket, PRODUCTS.redTShirt]) {
    test(`BUG-003 · se puede agregar "${product.name}" al carrito`, async ({ problemUserInventory: inventory }) => {
      test.fail(true, 'BUG-003: el botón "Add to cart" no responde en este producto');

      await inventory.addToCart(product);

      await expect(inventory.cartBadge).toHaveText('1');
    });
  }

  for (const product of [PRODUCTS.backpack, PRODUCTS.bikeLight, PRODUCTS.onesie]) {
    test(`BUG-004 · se puede quitar "${product.name}" desde el catálogo`, async ({ problemUserInventory: inventory }) => {
      test.fail(true, 'BUG-004: el botón "Remove" no responde en este producto');

      await inventory.addToCart(product);
      await expect(inventory.cartBadge).toHaveText('1');

      await inventory.removeFromCart(product);

      await expect(inventory.cartBadge).toBeHidden();
    });
  }

  test('BUG-005 · el apellido se guarda en su propio campo durante el checkout', async ({
    problemUserInventory: inventory,
    cartPage,
    checkoutPage,
  }) => {
    test.fail(true, 'BUG-005: el apellido se escribe en el campo "First Name" y "Last Name" queda vacío');

    await inventory.addToCart(PRODUCTS.backpack);
    await inventory.openCart();
    await cartPage.checkout();

    await checkoutPage.fillShipping(SHIPPING);

    await expect(checkoutPage.firstName).toHaveValue(SHIPPING.firstName);
    await expect(checkoutPage.lastName).toHaveValue(SHIPPING.lastName);
  });
});
