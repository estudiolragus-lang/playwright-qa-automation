import { test, expect } from '../fixtures/index.js';
import { PRODUCTS, SORT, TOTAL_PRODUCTS } from '../data/products.js';

test.describe('Catálogo de productos', () => {
  test('TC-INV-01: el catálogo muestra todos los productos', { tag: '@smoke' }, async ({ loggedInInventory: inventory }) => {
    await expect(inventory.items).toHaveCount(TOTAL_PRODUCTS);
  });

  test('TC-INV-02: ordenar por nombre de la A a la Z', async ({ loggedInInventory: inventory }) => {
    await inventory.sortBy(SORT.nameAsc);

    const names = await inventory.getNames();
    expect(names).toEqual([...names].sort());
  });

  test('TC-INV-03: ordenar por nombre de la Z a la A', async ({ loggedInInventory: inventory }) => {
    await inventory.sortBy(SORT.nameDesc);

    const names = await inventory.getNames();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('TC-INV-04: ordenar por precio de menor a mayor', async ({ loggedInInventory: inventory }) => {
    await inventory.sortBy(SORT.priceAsc);

    const prices = await inventory.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('TC-INV-05: ordenar por precio de mayor a menor', async ({ loggedInInventory: inventory }) => {
    await inventory.sortBy(SORT.priceDesc);

    const prices = await inventory.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('TC-INV-06: agregar un producto actualiza el contador del carrito', async ({ loggedInInventory: inventory }) => {
    await inventory.addToCart(PRODUCTS.backpack);

    await expect(inventory.cartBadge).toHaveText('1');
  });

  test('TC-INV-07: agregar varios productos suma en el contador', async ({ loggedInInventory: inventory }) => {
    await inventory.addToCart(PRODUCTS.backpack);
    await inventory.addToCart(PRODUCTS.bikeLight);
    await inventory.addToCart(PRODUCTS.onesie);

    await expect(inventory.cartBadge).toHaveText('3');
  });

  test('TC-INV-08: quitar el único producto elimina el contador', async ({ loggedInInventory: inventory }) => {
    await inventory.addToCart(PRODUCTS.backpack);
    await expect(inventory.cartBadge).toHaveText('1');

    await inventory.removeFromCart(PRODUCTS.backpack);

    await expect(inventory.cartBadge).toBeHidden();
  });
});
