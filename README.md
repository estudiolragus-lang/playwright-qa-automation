# Playwright QA Automation · SauceDemo

Suite de pruebas automatizadas end-to-end con **Playwright** y **JavaScript** sobre [SauceDemo](https://www.saucedemo.com), una tienda online de práctica pensada para aprender testing.

Proyecto de **Agustín García**, QA Tester Junior. Forma parte de mi [portfolio](https://portfolio-web-nine-mu.vercel.app/).

## Qué se prueba

28 casos de prueba organizados por funcionalidad. Cada test lleva un código (`TC-...`) para poder trazarlo, como en un plan de pruebas.

| Módulo | Casos | Qué valida |
| --- | --- | --- |
| Login (`TC-LOGIN`) | 7 | Ingreso válido, usuario bloqueado, credenciales inexistentes, campos obligatorios, acceso sin sesión y cierre de sesión |
| Catálogo (`TC-INV`) | 8 | Cantidad de productos, ordenamiento por nombre y por precio, contador del carrito al agregar y quitar |
| Carrito (`TC-CART`) | 5 | Productos agregados, quitar productos, carrito vacío, volver al catálogo y persistencia |
| Checkout (`TC-CHK`) | 8 | Compra completa, validaciones de cada campo, cancelar, cálculo del total y del subtotal, carrito vacío al terminar |

Los tests marcados con `@smoke` cubren los flujos críticos (login, catálogo, carrito y compra) y sirven como prueba rápida.

## Tecnologías

- [Playwright Test](https://playwright.dev) · JavaScript (ES modules)
- **Page Object Model** para separar los selectores de los tests
- **Fixtures** de Playwright para preparar la sesión y los Page Objects
- Reporte HTML con capturas, video y trace cuando algo falla
- **GitHub Actions** para correr la suite automáticamente

## Estructura

```
├── tests/        Casos de prueba, uno por módulo
├── pages/        Page Objects: Login, Inventory, Cart y Checkout
├── fixtures/     Preparación compartida (Page Objects y sesión iniciada)
├── data/         Usuarios, productos y datos de envío
├── utils/        Funciones de apoyo
└── .github/workflows/playwright.yml   Ejecución automática (CI)
```

## Cómo correrlo

Requiere [Node.js](https://nodejs.org) 18 o superior.

```bash
npm install
npx playwright install chromium

npm test              # toda la suite
npm run test:smoke    # solo los tests críticos (@smoke)
npm run test:headed   # viendo el navegador
npm run test:ui       # modo interactivo de Playwright
npm run report        # abre el último reporte HTML
```

## Decisiones de diseño

- **Tests independientes:** cada test inicia su propia sesión, así pueden correr en paralelo y un fallo no arrastra a los demás.
- **Selectores estables:** se usan los atributos `data-test` de la aplicación (configurados como `testIdAttribute`) y roles accesibles, en lugar de clases CSS que cambian con facilidad.
- **Sin esperas fijas:** se usan las aserciones con reintento automático de Playwright (`expect(...).toBeVisible()`), no `waitForTimeout`.
- **Evidencia solo cuando hace falta:** captura de pantalla y video únicamente si un test falla, y trace en el primer reintento.
- **Reintentos solo en CI:** en local un test que falla, falla; en CI se reintenta dos veces para distinguir un error real de uno intermitente.

## Datos de prueba

Los usuarios (`standard_user`, `locked_out_user`) y su contraseña los publica SauceDemo en su propia pantalla de login. Son datos de una web de práctica, no credenciales de nadie.

## Próximos pasos

- Pruebas con otros usuarios de SauceDemo (`problem_user`, `performance_glitch_user`)
- Ejecución en Firefox y WebKit
- Pruebas de accesibilidad con `@axe-core/playwright`
- Segunda suite sobre mi propio portfolio
