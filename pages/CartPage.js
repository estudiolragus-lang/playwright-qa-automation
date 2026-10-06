// Page Object del carrito de compras.
export class CartPage {
  constructor(page) {
    this.page = page;
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
  }

  async removeItem(product) {
    await this.page.getByTestId(`remove-${product.slug}`).click();
  }

  async getNames() {
    return this.itemNames.allInnerTexts();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
