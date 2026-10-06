// `slug` es el sufijo que SauceDemo usa en los data-test de cada producto
// (ej: data-test="add-to-cart-sauce-labs-backpack").
export const PRODUCTS = {
  backpack: { slug: 'sauce-labs-backpack', name: 'Sauce Labs Backpack' },
  bikeLight: { slug: 'sauce-labs-bike-light', name: 'Sauce Labs Bike Light' },
  boltTShirt: { slug: 'sauce-labs-bolt-t-shirt', name: 'Sauce Labs Bolt T-Shirt' },
  fleeceJacket: { slug: 'sauce-labs-fleece-jacket', name: 'Sauce Labs Fleece Jacket' },
  onesie: { slug: 'sauce-labs-onesie', name: 'Sauce Labs Onesie' },
  redTShirt: { slug: 'test.allthethings()-t-shirt-(red)', name: 'Test.allTheThings() T-Shirt (Red)' },
};

// Cantidad total de productos que muestra el catálogo
export const TOTAL_PRODUCTS = 6;

// Valores de la lista "Sort" del catálogo
export const SORT = {
  nameAsc: 'az',
  nameDesc: 'za',
  priceAsc: 'lohi',
  priceDesc: 'hilo',
};
