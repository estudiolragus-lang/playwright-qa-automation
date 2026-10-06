// Script de exploración: recorre SauceDemo como `problem_user` y registra qué comportamientos
// no son los esperados. NO es un test: sirve para descubrir bugs y juntar evidencia
// (capturas + datos) antes de escribir los reportes y los tests.
//
// Uso:  node scripts/explore-problem-user.js
import { chromium, selectors } from '@playwright/test';
import { mkdirSync, writeFileSync, appendFileSync } from 'node:fs';
import { USERS } from '../data/users.js';

// Este script corre solo (sin playwright.config.js), así que hay que indicar
// que SauceDemo usa el atributo data-test en vez de data-testid.
selectors.setTestIdAttribute('data-test');

const OUT = 'docs/evidence';
mkdirSync(OUT, { recursive: true });

// Todo lo que se muestra en pantalla también se guarda en un archivo de registro,
// para poder revisar qué pasó aunque el script se corte.
const LOG_FILE = `${OUT}/ejecucion.log`;
writeFileSync(LOG_FILE, `Ejecución: ${new Date().toISOString()}\n`);
const say = (text) => {
  console.log(text);
  appendFileSync(LOG_FILE, `${text}\n`);
};

const findings = {};
const log = (title, data) => {
  findings[title] = data;
  say(`\n=== ${title} ===`);
  say(JSON.stringify(data, null, 2));
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(8000);
const t = (id) => page.getByTestId(id);

async function section(title, fn) {
  try {
    await fn();
  } catch (error) {
    log(title, { errorDeExploracion: String(error.message).split('\n')[0] });
  }
}

try {
  // --- Login como problem_user
  await page.goto('https://www.saucedemo.com/');
  await t('username').fill(USERS.problem.username);
  await t('password').fill(USERS.problem.password);
  await t('login-button').click();
  await page.waitForURL(/inventory\.html/);

  const items = t('inventory-item');

  // 1) Imágenes de los productos
  await section('1. Imágenes del catálogo', async () => {
    const data = await items.evaluateAll((nodes) =>
      nodes.map((n) => ({
        producto: n.querySelector('[data-test="inventory-item-name"]').innerText,
        imagen: n.querySelector('img').getAttribute('src'),
      })),
    );
    log('1. Imágenes del catálogo', {
      cantidadDeProductos: data.length,
      imagenesDistintas: new Set(data.map((d) => d.imagen)).size,
      detalle: data,
    });
    await page.screenshot({ path: `${OUT}/catalogo-problem-user.png` });
  });

  // 2) Ordenamiento
  await section('2. Ordenamiento', async () => {
    const result = {};
    const before = await t('inventory-item-name').allInnerTexts();
    for (const option of ['za', 'lohi', 'hilo']) {
      await t('product-sort-container').selectOption(option);
      result[option] = {
        nombres: await t('inventory-item-name').allInnerTexts(),
        precios: await t('inventory-item-price').allInnerTexts(),
      };
    }
    result.ordenOriginal = before;
    result.cambioElOrdenAlElegirZA = JSON.stringify(result.za.nombres) !== JSON.stringify(before);
    log('2. Ordenamiento', result);
    await page.screenshot({ path: `${OUT}/ordenamiento-problem-user.png` });
    await t('product-sort-container').selectOption('az');
  });

  // 3) Agregar y quitar productos desde el catálogo
  await section('3. Agregar y quitar productos', async () => {
    const count = await items.count();
    const result = [];
    for (let i = 0; i < count; i++) {
      const item = items.nth(i);
      const name = await item.getByTestId('inventory-item-name').innerText();
      const button = item.locator('button');
      const labelBefore = (await button.innerText()).trim();
      await button.click();
      const labelAfterAdd = (await item.locator('button').innerText()).trim();
      const badgeAfterAdd = (await t('shopping-cart-badge').count()) ? await t('shopping-cart-badge').innerText() : 'sin contador';
      let labelAfterRemove = labelAfterAdd;
      let badgeAfterRemove = badgeAfterAdd;
      if (labelAfterAdd === 'Remove') {
        await item.locator('button').click();
        labelAfterRemove = (await item.locator('button').innerText()).trim();
        badgeAfterRemove = (await t('shopping-cart-badge').count()) ? await t('shopping-cart-badge').innerText() : 'sin contador';
      }
      result.push({ producto: name, labelBefore, labelAfterAdd, badgeAfterAdd, labelAfterRemove, badgeAfterRemove });
    }
    log('3. Agregar y quitar productos', result);
    await page.screenshot({ path: `${OUT}/carrito-problem-user.png` });
  });

  // 4) Detalle de un producto
  await section('4. Detalle de producto', async () => {
    const first = items.first();
    const listName = await first.getByTestId('inventory-item-name').innerText();
    await first.getByTestId('inventory-item-name').click();
    await page.waitForLoadState();
    const detailName = await t('inventory-item-name').first().innerText();
    log('4. Detalle de producto', { url: page.url(), nombreEnCatalogo: listName, nombreEnDetalle: detailName, coinciden: listName === detailName });
    await page.screenshot({ path: `${OUT}/detalle-problem-user.png` });
    await page.goBack();
  });

  // 5) Checkout: campos de datos de envío
  await section('5. Checkout - campos de envío', async () => {
    await page.goto('https://www.saucedemo.com/cart.html');
    const inCart = await t('inventory-item').count();
    if (inCart === 0) {
      // Se agrega lo que se pueda para poder llegar al checkout
      await page.goto('https://www.saucedemo.com/inventory.html');
      const count = await items.count();
      for (let i = 0; i < count; i++) {
        const button = items.nth(i).locator('button');
        if ((await button.innerText()).trim() === 'Add to cart') await button.click();
      }
      await page.goto('https://www.saucedemo.com/cart.html');
    }
    await t('checkout').click();
    await t('firstName').fill('Nombre');
    await t('lastName').fill('Apellido');
    await t('postalCode').fill('5000');
    const values = {
      firstName: await t('firstName').inputValue(),
      lastName: await t('lastName').inputValue(),
      postalCode: await t('postalCode').inputValue(),
    };
    await page.screenshot({ path: `${OUT}/checkout-problem-user.png` });
    await t('continue').click();
    const error = (await t('error').count()) ? await t('error').innerText() : null;
    log('5. Checkout - campos de envío', {
      escribi: { firstName: 'Nombre', lastName: 'Apellido', postalCode: '5000' },
      valoresQueQuedaronEnLosCampos: values,
      elApellidoQuedoGuardado: values.lastName === 'Apellido',
      urlDespuesDeContinuar: page.url(),
      errorMostrado: error,
    });
  });

} catch (error) {
  say(`
!!! El script se cortó: ${error.message}`);
  await page.screenshot({ path: `${OUT}/error-ultimo-estado.png` }).catch(() => {});
  say(`URL en el momento del error: ${page.url()}`);
}

await browser.close();
writeFileSync(`${OUT}/problem-user-hallazgos.json`, JSON.stringify(findings, null, 2));
console.log(`\nListo. Capturas y datos guardados en ${OUT}/`);
