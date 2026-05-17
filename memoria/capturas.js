/**
 * Generador automático de capturas de Planfy para la memoria.
 * Toma capturas de las pantallas clave en escritorio y móvil,
 * en modo claro y oscuro.
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'capturas');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const FRONT = 'http://127.0.0.1:4200';
const API = 'http://localhost:8008';

async function login(page) {
  // Hacemos login directo via API y guardamos el token en localStorage
  await page.goto(FRONT + '/login', { waitUntil: 'networkidle0', timeout: 30000 });
  const r = await page.evaluate(async (api) => {
    const res = await fetch(api + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@planfy.com', password: 'test1234' }),
    });
    return res.json();
  }, API);
  if (!r.token) throw new Error('Login falló: ' + JSON.stringify(r));
  await page.evaluate((tok, ref) => {
    localStorage.setItem('planfy_jwt', tok);
    localStorage.setItem('planfy_refresh', ref);
    localStorage.setItem('planfy_tour_done', '1');
  }, r.token, r.refreshToken);
}

async function setTheme(page, mode /* 'light' | 'dark' */) {
  await page.evaluate((m) => {
    localStorage.setItem('planfy_theme', m);
    document.documentElement.classList.remove('dark', 'auto-theme');
    if (m === 'dark') document.documentElement.classList.add('dark');
  }, mode);
}

async function snap(page, name, opts = {}) {
  await new Promise(r => setTimeout(r, opts.wait || 1500));
  const out = path.join(OUT, name + '.png');
  await page.screenshot({ path: out, fullPage: !!opts.full });
  console.log(' ✓ ' + name);
  return out;
}

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1280, height: 900 },
  });

  try {
    // ─────── DESKTOP ───────
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });

    // 1. Login en modo OSCURO
    await page.goto(FRONT + '/login', { waitUntil: 'networkidle0' });
    await page.evaluate(() => { localStorage.setItem('planfy_theme', 'dark'); document.documentElement.classList.add('dark'); });
    await page.reload({ waitUntil: 'networkidle0' });
    await snap(page, '01-login-oscuro');

    // 2. Login en modo CLARO
    await page.evaluate(() => { localStorage.setItem('planfy_theme', 'light'); document.documentElement.classList.remove('dark', 'auto-theme'); });
    await page.reload({ waitUntil: 'networkidle0' });
    await snap(page, '02-login-claro');

    // Login real para acceder al resto
    await login(page);
    await setTheme(page, 'light');

    // 3. Dashboard escritorio (claro)
    await page.goto(FRONT + '/dashboard', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 3500)); // que cargue imagen
    await snap(page, '03-dashboard-escritorio-claro');

    // 4. Dashboard escritorio (oscuro)
    await setTheme(page, 'dark');
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 3500));
    await snap(page, '04-dashboard-escritorio-oscuro');

    // 5. Modal detalle abierto
    await page.click('.info-btn').catch(() => page.click('.action-btn.info-circle-btn').catch(() => {}));
    await new Promise(r => setTimeout(r, 1500));
    await snap(page, '05-modal-detalle');

    // Cerrar modal
    await page.keyboard.press('Escape').catch(() => {});
    await new Promise(r => setTimeout(r, 800));

    // 6. Filtros desplegados
    await page.click('button[aria-label="Filtros"]').catch(() => {});
    await new Promise(r => setTimeout(r, 1200));
    await snap(page, '06-filtros-panel');

    // Cerrar filtros
    await page.click('button[aria-label="Filtros"]').catch(() => {});
    await new Promise(r => setTimeout(r, 800));

    // 7. Búsqueda desplegada
    await page.click('button[aria-label="Buscar"]').catch(() => {});
    await new Promise(r => setTimeout(r, 1000));
    await snap(page, '07-busqueda-panel');
    await page.click('button[aria-label="Buscar"]').catch(() => {});
    await new Promise(r => setTimeout(r, 800));

    // 8. Favoritos
    await page.goto(FRONT + '/favorites', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 4000));
    await snap(page, '08-favoritos-grid');

    // 9. Cuenta (con stats + theme picker + achievements)
    await page.goto(FRONT + '/account', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 3000));
    await snap(page, '09-cuenta-completa', { full: true });

    // 10. Tour de bienvenida (necesita borrar planfy_tour_done)
    await page.evaluate(() => { localStorage.removeItem('planfy_tour_done'); });
    await page.goto(FRONT + '/dashboard', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 3000));
    await snap(page, '10-onboarding-tour');
    // Cerramos tour para no afectar siguientes
    await page.evaluate(() => { localStorage.setItem('planfy_tour_done', '1'); });

    // ─────── MÓVIL (iPhone 13) ───────
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

    // 11. Dashboard móvil
    await page.goto(FRONT + '/dashboard', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 3500));
    await snap(page, '11-dashboard-movil');

    // 12. Login móvil
    await page.evaluate(() => { localStorage.clear(); });
    await page.goto(FRONT + '/login', { waitUntil: 'networkidle0' });
    await snap(page, '12-login-movil');

    console.log('\n✅ ' + fs.readdirSync(OUT).length + ' capturas generadas en ' + OUT);
  } finally {
    await browser.close();
  }
})().catch(err => { console.error('❌', err); process.exit(1); });
