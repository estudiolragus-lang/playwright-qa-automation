// Page Object de la pantalla de login.
// Un Page Object concentra los selectores y las acciones de una pantalla:
// si la web cambia, se corrige en un solo lugar y no en cada test.
export class LoginPage {
  constructor(page) {
    this.page = page;
    this.username = page.getByTestId('username');
    this.password = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.error = page.getByTestId('error');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login({ username, password }) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}
