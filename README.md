# Playwright QA Automation · SauceDemo

[![Playwright Tests](https://github.com/estudiolragus-lang/playwright-qa-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/estudiolragus-lang/playwright-qa-automation/actions/workflows/playwright.yml)

Suite de pruebas automatizadas end-to-end con **Playwright** y **JavaScript** sobre [SauceDemo](https://www.saucedemo.com), una tienda online de práctica pensada para aprender testing.

Proyecto de **Agustín García**, QA Tester Junior. Forma parte de mi [portfolio](https://portfolio-web-nine-mu.vercel.app/).

## Qué se prueba

**28 casos de prueba** organizados por funcionalidad, más **9 tests que documentan 5 bugs** encontrados con un usuario defectuoso. Cada test lleva un código (`TC-...` o `BUG-...`) para poder trazarlo, como en un plan de pruebas.

Documentación de QA incluida:
- [`docs/TEST_PLAN.md`](docs/TEST_PLAN.md): plan de pruebas con objetivo, alcance, estrategia y todos los casos.
- [`docs/BUG_REPORTS.md`](docs/BUG_REPORTS.md): 5 reportes de bugs con pasos para reproducir, resultado esperado y actual, severidad y evidencia.

| Módulo | Casos | Qué valida |
| --- | --- | --- |
| Login (`TC-LOGIN`) | 7 | Ingreso válido, usuario bloqueado, credenciales inexistentes, campos obligatorios, acceso sin sesión y cierre de sesión |
| Catálogo (`TC-INV`) | 8 | Cantidad de productos, ordenamiento por nombre y por precio, contador del carrito al agregar y quitar |
| Carrito (`TC-CART`) | 5 | Productos agregados, quitar productos, carrito vacío, volver al catálogo y persistencia |
| Checkout (`TC-CHK`) | 8 | Compra completa, validaciones de cada campo, cancelar, cálculo del total y del subtotal, carrito vacío al terminar |

Los tests marcados con `@smoke` cubren los flujos críticos (login, catálogo, carrito y compra) y sirven como prueba rápida.

## Bugs encontrados

SauceDemo incluye el usuario `problem_user` con **fallos intencionales**, pensado para practicar la detección de defectos. Lo exploré, documenté cada bug y lo dejé automatizado.

| ID | Bug | Severidad |
| --- | --- | --- |
| BUG-005 | El apellido se escribe en el campo "First Name" y no se puede completar el checkout | Crítica |
| BUG-003 | No se pueden agregar 3 de los 6 productos al carrito | Alta |
| BUG-004 | No se pueden quitar productos desde el catálogo (3 de 6) | Media |
| BUG-002 | El ordenamiento del catálogo no tiene efecto | Media |
| BUG-001 | Ningún producto muestra su imagen | Baja |

Cada test de bug describe el comportamiento **correcto** y está marcado con `test.fail()`: mientras el bug exista, el test falla "como se espera" y la suite sigue en verde; si algún día se corrige, Playwright avisa para revisar el reporte. Los hallazgos salieron de [`scripts/explore-problem-user.js`](scripts/explore-problem-user.js).

## Tecnologías

- [Playwright Test](https://playwright.dev) · JavaScript (ES modules)
- **Page Object Model** para separar los selectores de los tests
- **Fixtures** de Playwright para preparar la sesión y los Page Objects
- Reporte HTML con capturas, video y trace cuando algo falla
- **GitHub Actions** para correr la suite automáticamente

## Estructura

```
├── tests/        Casos de prueba, uno por módulo (más problem-user.spec.js con los bugs)
├── pages/        Page Objects: Login, Inventory, Cart y Checkout
├── fixtures/     Preparación compartida (Page Objects y sesión iniciada)
├── data/         Usuarios, productos y datos de envío
├── utils/        Funciones de apoyo
├── scripts/      Exploración de bugs con problem_user
├── docs/         Plan de pruebas, reportes de bugs y evidencia (capturas)
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

- Pruebas con otros usuarios de SauceDemo (`performance_glitch_user`, `error_user`, `visual_user`)
- Ejecución en Firefox y WebKit
- Pruebas de accesibilidad con `@axe-core/playwright`
- Segunda suite sobre mi propio portfolio
