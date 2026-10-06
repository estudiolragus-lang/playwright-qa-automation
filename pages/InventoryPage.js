import { parsePrice } from '../utils/price.js';

// Page Object del catálogo de productos.
export class InventoryPage {
  constructor(page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.sortSelect = page.getByTestId('product-sort-container');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.getByTestId('logout-sidebar-link');
  }

  async addToCart(product) {
    await this.page.getByTestId(`add-to-cart-${product.slug}`).click();
  }

  async removeFromCart(product) {
    await this.page.getByTestId(`remove-${product.slug}`).click();
  }

  async sortBy(option) {
    await this.sortSelect.selectOption(option);
  }

  async getNames() {
    return this.itemNames.allInnerTexts();
  }

  async getPrices() {
    const texts = await this.itemPrices.allInnerTexts();
    return texts.map(parsePrice);
  }

  // Precio de un producto puntual, tal como lo muestra el catálogo
  async priceOf(product) {
    const text = await this.items
      .filter({ hasText: product.name })
      .getByTestId('inventory-item-price')
      .innerText();
    return parsePrice(text);
  }

  async openCart() {
    await this.cartLink.click();
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}
