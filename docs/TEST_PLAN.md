# Plan de pruebas · SauceDemo

## 1. Objetivo

Verificar que los flujos principales de la tienda [SauceDemo](https://www.saucedemo.com) (ingresar, explorar el catálogo, armar un carrito y completar una compra) funcionan según lo esperado, y dejar esas verificaciones automatizadas para poder repetirlas en cada cambio.

## 2. Alcance

**Dentro del alcance**
- Login: ingreso válido, usuarios inválidos o bloqueados, campos obligatorios, acceso sin sesión y cierre de sesión.
- Catálogo: cantidad de productos, ordenamiento y manejo del contador del carrito.
- Carrito: productos agregados, quitar productos, continuar comprando y persistencia.
- Checkout: compra completa, validaciones de los datos de envío, cancelación y cálculo del total.
- Comportamiento del usuario `problem_user` (defectos conocidos).

**Fuera del alcance**
- Pruebas de rendimiento, seguridad y accesibilidad.
- Otros navegadores además de Chromium.
- Usuarios `performance_glitch_user`, `error_user` y `visual_user`.
- Pruebas de API (la web de práctica no la expone).

## 3. Estrategia

| Tipo | Cómo se aplica |
| --- | --- |
| Pruebas funcionales | Un caso por comportamiento, con resultado esperado verificable |
| Pruebas de validación | Campos obligatorios y mensajes de error |
| Pruebas de cálculo | Subtotal, impuestos y total del checkout |
| Smoke testing | Los 4 flujos críticos están marcados `@smoke` y se pueden correr solos |
| Detección de defectos | Exploración guiada con `problem_user` y reporte de cada bug con evidencia |
| Automatización | Playwright + Page Object Model; ejecución en GitHub Actions |

## 4. Entorno

| Dato | Valor |
| --- | --- |
| Aplicación | https://www.saucedemo.com (sitio de práctica de terceros) |
| Navegador | Chromium (Desktop Chrome) |
| Herramienta | Playwright Test 1.63, Node.js 22 |
| Datos | Usuarios publicados por SauceDemo en su pantalla de login |

## 5. Casos de prueba

La prioridad es mía y se puede ajustar según el riesgo que se quiera cubrir.

### Login

| ID | Caso | Tipo | Prioridad | Smoke |
| --- | --- | --- | --- | :-: |
| TC-LOGIN-01 | Un usuario válido ingresa al catálogo | Funcional | Alta | ✔ |
| TC-LOGIN-02 | Un usuario bloqueado no puede ingresar | Funcional | Alta | |
| TC-LOGIN-03 | Credenciales inexistentes muestran un error | Validación | Alta | |
| TC-LOGIN-04 | El usuario es obligatorio | Validación | Media | |
| TC-LOGIN-05 | La contraseña es obligatoria | Validación | Media | |
| TC-LOGIN-06 | No se puede entrar al catálogo sin iniciar sesión | Seguridad básica | Alta | |
| TC-LOGIN-07 | Cerrar sesión vuelve a la pantalla de login | Funcional | Media | |

### Catálogo

| ID | Caso | Tipo | Prioridad | Smoke |
| --- | --- | --- | --- | :-: |
| TC-INV-01 | El catálogo muestra todos los productos | Funcional | Alta | ✔ |
| TC-INV-02 | Ordenar por nombre de la A a la Z | Funcional | Media | |
| TC-INV-03 | Ordenar por nombre de la Z a la A | Funcional | Media | |
| TC-INV-04 | Ordenar por precio de menor a mayor | Funcional | Media | |
| TC-INV-05 | Ordenar por precio de mayor a menor | Funcional | Media | |
| TC-INV-06 | Agregar un producto actualiza el contador | Funcional | Alta | |
| TC-INV-07 | Agregar varios productos suma en el contador | Funcional | Media | |
| TC-INV-08 | Quitar el único producto elimina el contador | Funcional | Media | |

### Carrito

| ID | Caso | Tipo | Prioridad | Smoke |
| --- | --- | --- | --- | :-: |
| TC-CART-01 | El carrito muestra los productos agregados | Funcional | Alta | ✔ |
| TC-CART-02 | Quitar un producto desde el carrito lo elimina | Funcional | Media | |
| TC-CART-03 | Quitar todos los productos deja el carrito vacío | Funcional | Media | |
| TC-CART-04 | "Continue Shopping" vuelve al catálogo | Navegación | Baja | |
| TC-CART-05 | Los productos del carrito se conservan al volver al catálogo | Funcional | Media | |

### Checkout

| ID | Caso | Tipo | Prioridad | Smoke |
| --- | --- | --- | --- | :-: |
| TC-CHK-01 | Una compra completa termina con la confirmación | Funcional (extremo a extremo) | Alta | ✔ |
| TC-CHK-02 | El nombre es obligatorio | Validación | Media | |
| TC-CHK-03 | El apellido es obligatorio | Validación | Media | |
| TC-CHK-04 | El código postal es obligatorio | Validación | Media | |
| TC-CHK-05 | Cancelar el checkout vuelve al carrito | Navegación | Baja | |
| TC-CHK-06 | El total es el subtotal más los impuestos | Cálculo | Alta | |
| TC-CHK-07 | El subtotal coincide con el precio del catálogo | Cálculo | Alta | |
| TC-CHK-08 | Tras finalizar, el carrito queda vacío | Funcional | Media | |

### Defectos conocidos (`problem_user`)

Cada test describe el comportamiento **correcto** y está marcado como fallo esperado. Detalle en [`BUG_REPORTS.md`](BUG_REPORTS.md).

| ID | Defecto | Severidad |
| --- | --- | --- |
| BUG-001 | Ningún producto muestra su imagen | Baja |
| BUG-002 | El ordenamiento no tiene efecto | Media |
| BUG-003 | No se pueden agregar 3 de 6 productos (3 tests) | Alta |
| BUG-004 | No se pueden quitar 3 de 6 productos desde el catálogo (3 tests) | Media |
| BUG-005 | El apellido se escribe en el campo "First Name" | Crítica |

## 6. Criterios

- **Entrada:** la web está disponible y los usuarios de prueba pueden iniciar sesión.
- **Salida:** todos los casos `TC-*` pasan y cada bug conocido sigue reproduciéndose (si alguno deja de fallar, se revisa y se actualiza su reporte).

## 7. Riesgos y limitaciones

- La web es de terceros: si cambian sus selectores o su comportamiento, los tests pueden fallar sin que haya un defecto real.
- Los datos de prueba están publicados por SauceDemo; no representan usuarios reales.
- Solo se prueba en Chromium: no hay cobertura de Firefox ni Safari.
