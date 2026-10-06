import { parsePrice } from '../utils/price.js';

// Page Object del proceso de compra (datos de envío, resumen y confirmación).
export class CheckoutPage {
  constructor(page) {
    this.page = page;
    // Paso 1: datos de envío
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.cancelButton = page.getByTestId('cancel');
    this.error = page.getByTestId('error');
    // Paso 2: resumen
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
    // Paso 3: confirmación
    this.completeHeader = page.getByTestId('complete-header');
  }

  // Cualquier campo puede omitirse para probar las validaciones
  async fillShipping({ firstName = '', lastName = '', postalCode = '' } = {}) {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.postalCode.fill(postalCode);
  }

  async continue() {
    await this.continueButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }

  async getSummary() {
    return {
      subtotal: parsePrice(await this.subtotalLabel.innerText()),
      tax: parsePrice(await this.taxLabel.innerText()),
      total: parsePrice(await this.totalLabel.innerText()),
    };
  }
}
