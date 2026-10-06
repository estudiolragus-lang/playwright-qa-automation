import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // Los tests son independientes entre sí, así que pueden correr en paralelo
  fullyParallel: true,
  // En CI, falla si quedó algún test.only olvidado
  forbidOnly: !!process.env.CI,
  // En CI se reintenta 2 veces para distinguir un fallo real de uno intermitente
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  // Consola + reporte HTML (se abre con `npm run report`)
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: 'https://www.saucedemo.com',
    // SauceDemo identifica sus elementos con data-test en vez de data-testid
    testIdAttribute: 'data-test',
    // Evidencia solo cuando algo falla
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
