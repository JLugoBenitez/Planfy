/**
 * Presentación de defensa del TFG — Planfy
 * 17 slides, 16:9, paleta brand turquesa→azul.
 * Cada slide está marcada para 30-60s de exposición → ~12 minutos en total.
 */
const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

const pres = new PptxGenJS();
pres.layout = 'LAYOUT_WIDE';     // 13.33 x 7.5 inches (16:9)
pres.author = 'Javier Lugo Benítez';
pres.company = 'IES Los Alcores';
pres.title = 'Planfy — Defensa TFG';

// ─── Paleta brand ─────────────────────────────────────────
const C = {
  brand1: '0ECFBE',  // turquesa mint
  brand2: '0891B2',  // azul-teal
  bgDark: '0A1719',
  bgMid:  '122024',
  text:   'F1F5F9',
  textSec:'94A3B8',
  textOn: 'FFFFFF',
  light:  'F5FDFB',
  lightTxt: '0F172A',
  warn:   'F59E0B',
  red:    'FF6B6B',
  border: '1E3A40',
};
const FONT_HEAD = 'Calibri';
const FONT_BODY = 'Calibri';

// ─── Helpers ──────────────────────────────────────────────
const SLIDE_W = 13.33;
const SLIDE_H = 7.5;

function darkBg(slide) {
  slide.background = { color: C.bgDark };
  // Blob superior
  slide.addShape('ellipse', { x: -2.5, y: -2.5, w: 7, h: 7, fill: { color: C.brand1, transparency: 90 }, line: { color: C.brand1, transparency: 100 } });
  slide.addShape('ellipse', { x: SLIDE_W - 4, y: SLIDE_H - 4, w: 7, h: 7, fill: { color: C.brand2, transparency: 90 }, line: { color: C.brand2, transparency: 100 } });
}
function lightBg(slide) {
  slide.background = { color: C.light };
  slide.addShape('ellipse', { x: -2, y: -2, w: 5, h: 5, fill: { color: C.brand1, transparency: 92 }, line: { color: C.brand1, transparency: 100 } });
}
function pageNumber(slide, n, total = 17) {
  slide.addText(`${n} / ${total}`, {
    x: SLIDE_W - 1.2, y: SLIDE_H - 0.5, w: 0.8, h: 0.3,
    fontSize: 10, color: C.textSec, fontFace: FONT_BODY, align: 'right',
  });
}
function brandFooter(slide, dark = true) {
  slide.addText('Planfy · TFG 2025-26 · Javier Lugo Benítez', {
    x: 0.5, y: SLIDE_H - 0.5, w: 6, h: 0.3,
    fontSize: 10, color: dark ? C.textSec : '8898A6', fontFace: FONT_BODY,
  });
}

// Línea decorativa (no bajo el título — solo lateral)
function leftAccent(slide, color = C.brand1) {
  slide.addShape('rect', { x: 0, y: 0, w: 0.18, h: SLIDE_H, fill: { color }, line: { color, transparency: 100 } });
}

// Imagen real con caption opcional. Si no existe el archivo, fallback a placeholder.
const CAP_DIR = require('path').join(__dirname, 'capturas');
function realCapture(slide, opts) {
  const { x, y, w, h, file, label } = opts;
  const fullPath = require('path').join(CAP_DIR, file);
  if (fs.existsSync(fullPath)) {
    // Sombra contenedora
    slide.addShape('roundRect', { x, y, w, h, rectRadius: 0.1, fill: { color: '0d1f24' }, line: { color: C.brand1, width: 1 } });
    // Imagen ajustada con margen
    const m = 0.08;
    slide.addImage({ path: fullPath, x: x + m, y: y + m, w: w - 2 * m, h: h - 2 * m, sizing: { type: 'contain', w: w - 2 * m, h: h - 2 * m } });
  } else {
    captureBox(slide, { x, y, w, h, label });
  }
}
// Caja de captura placeholder (mantiene la firma anterior por compatibilidad)
function captureBox(slide, opts) {
  const { x, y, w, h, label } = opts;
  slide.addShape('rect', { x, y, w, h, fill: { color: C.bgMid }, line: { color: C.brand1, width: 1.5, dashType: 'dash' } });
  slide.addText([
    { text: 'PEGAR CAPTURA\n', options: { fontSize: 11, bold: true, color: C.brand1 } },
    { text: label, options: { fontSize: 10, color: C.textSec, italic: true } },
  ], { x, y, w, h, align: 'center', valign: 'middle', fontFace: FONT_BODY, color: C.text });
}

// ═════════════════════════════════════════════════════════════
// SLIDE 1 — PORTADA
// ═════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);
  // Logo embebido (favicon de Planfy)
  s.addShape('roundRect', { x: 5.66, y: 1.0, w: 2, h: 2, rectRadius: 0.3, fill: { color: 'FFFFFF' }, line: { type: 'none' } });
  try {
    s.addImage({ path: '../frontend/planfyApp/src/assets/icon/favicon.png', x: 5.96, y: 1.2, w: 1.4, h: 1.6 });
  } catch (_) {}

  s.addText('PLANFY', {
    x: 0.5, y: 3.4, w: SLIDE_W - 1, h: 1.2,
    fontSize: 80, bold: true, color: C.brand1, fontFace: FONT_HEAD, align: 'center',
    glow: { size: 12, opacity: 0.25, color: C.brand1 },
  });
  s.addText('Aplicación de descubrimiento de planes mediante swipe', {
    x: 0.5, y: 4.6, w: SLIDE_W - 1, h: 0.5,
    fontSize: 22, italic: true, color: C.text, fontFace: FONT_BODY, align: 'center',
  });
  s.addText('CFGS Desarrollo de Aplicaciones Web', {
    x: 0.5, y: 5.4, w: SLIDE_W - 1, h: 0.4,
    fontSize: 16, color: C.brand1, bold: true, fontFace: FONT_HEAD, align: 'center',
  });
  // Bloque de datos del alumno
  s.addText([
    { text: 'Javier Lugo Benítez', options: { fontSize: 16, bold: true, color: C.text, breakLine: true } },
    { text: 'Tutor: Javier García', options: { fontSize: 13, color: C.textSec, breakLine: true } },
    { text: 'IES Los Alcores · Curso 2025-26', options: { fontSize: 13, color: C.textSec } },
  ], { x: 0.5, y: 6.0, w: SLIDE_W - 1, h: 1.2, align: 'center', fontFace: FONT_BODY });
}

// ═════════════════════════════════════════════════════════════
// SLIDE 2 — ¿QUÉ ES PLANFY?
// ═════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  lightBg(s);
  leftAccent(s);

  s.addText('¿Qué es Planfy?', {
    x: 0.7, y: 0.5, w: 12, h: 0.9,
    fontSize: 40, bold: true, color: C.brand2, fontFace: FONT_HEAD,
  });

  s.addText([
    { text: 'Una app multiplataforma que ', options: { fontSize: 18, color: C.lightTxt } },
    { text: 'descubre planes de ocio ', options: { fontSize: 18, bold: true, color: C.brand2 } },
    { text: 'mediante una interacción tipo swipe', options: { fontSize: 18, color: C.lightTxt } },
  ], { x: 0.7, y: 1.6, w: 7, h: 1, fontFace: FONT_BODY });

  // 3 features en cards
  // Iconos coloreados (todos a color para mantener coherencia visual)
  const feats = [
    { icon: '🃏',   t: 'Desliza',     d: 'Tarjetas estilo Tinder.\nDecisión binaria, rápida.' },
    { icon: '⭐',   t: 'Guarda',      d: 'Tus favoritos quedan\nen tu cuenta privada.' },
    { icon: '🌍',   t: 'Descubre',    d: '49 planes en 8 ciudades\ny 8 categorías.' },
  ];
  feats.forEach((f, i) => {
    const x = 0.7 + i * 4.1;
    s.addShape('roundRect', { x, y: 3.2, w: 3.8, h: 3, rectRadius: 0.2, fill: { color: 'FFFFFF' }, line: { color: C.brand1, width: 1 } });
    s.addText(f.icon, { x, y: 3.4, w: 3.8, h: 0.9, fontSize: 44, align: 'center', fontFace: FONT_BODY });
    s.addText(f.t,    { x, y: 4.4, w: 3.8, h: 0.5, fontSize: 22, bold: true, color: C.brand2, align: 'center', fontFace: FONT_HEAD });
    s.addText(f.d,    { x: x + 0.2, y: 4.95, w: 3.4, h: 1.1, fontSize: 13, color: '475569', align: 'center', fontFace: FONT_BODY });
  });

  brandFooter(s, false);
  pageNumber(s, 2);
}

// ═════════════════════════════════════════════════════════════
// SLIDE 3 — EL PROBLEMA
// ═════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  s.addText('El problema', {
    x: 0.5, y: 0.5, w: 12, h: 0.9,
    fontSize: 40, bold: true, color: C.brand1, fontFace: FONT_HEAD,
  });

  s.addText('"¿Qué hago este finde?"', {
    x: 0.5, y: 1.5, w: 12, h: 0.7,
    fontSize: 32, italic: true, color: C.text, fontFace: FONT_HEAD, align: 'center',
  });

  // Stat callout
  s.addShape('roundRect', { x: 1.5, y: 2.8, w: 4, h: 3.3, rectRadius: 0.2, fill: { color: C.bgMid }, line: { color: C.warn, width: 2 } });
  s.addText('73%', { x: 1.5, y: 2.9, w: 4, h: 1.4, fontSize: 96, bold: true, color: C.warn, align: 'center', fontFace: FONT_HEAD });
  s.addText('de los usuarios abandonan apps de planes por exceso de información', {
    x: 1.7, y: 4.5, w: 3.6, h: 1.4, fontSize: 14, color: C.text, align: 'center', fontFace: FONT_BODY,
  });

  // Lista derecha
  s.addText([
    { text: 'Plataformas existentes\n', options: { fontSize: 16, bold: true, color: C.brand1, breakLine: true } },
    { text: '•  Listados infinitos en TripAdvisor, Civitatis…\n', options: { fontSize: 15, color: C.text } },
    { text: '•  Filtros complejos que hay que configurar\n', options: { fontSize: 15, color: C.text } },
    { text: '•  Información dispersa en mil tabs\n', options: { fontSize: 15, color: C.text } },
    { text: '\nLo que el usuario quiere:\n', options: { fontSize: 16, bold: true, color: C.brand1 } },
    { text: '✓  Una opción cada vez\n', options: { fontSize: 15, color: C.text } },
    { text: '✓  Decisión sí/no de un vistazo\n', options: { fontSize: 15, color: C.text } },
    { text: '✓  Resultado relevante a su gusto', options: { fontSize: 15, color: C.text } },
  ], { x: 6.5, y: 2.9, w: 6.3, h: 4, fontFace: FONT_BODY });

  brandFooter(s);
  pageNumber(s, 3);
}

// ═════════════════════════════════════════════════════════════
// SLIDE 4 — DEMO
// ═════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  s.addText('Demo en directo', {
    x: 0.5, y: 0.5, w: 12, h: 0.9,
    fontSize: 40, bold: true, color: C.brand1, fontFace: FONT_HEAD,
  });

  s.addText('Veamos Planfy en acción', {
    x: 0.5, y: 1.4, w: 12, h: 0.5,
    fontSize: 18, italic: true, color: C.textSec, fontFace: FONT_BODY,
  });

  realCapture(s, { x: 1.6, y: 2.3, w: 4.3, h: 4.4, file: '03-dashboard-escritorio-claro.png', label: 'Dashboard escritorio' });
  realCapture(s, { x: 6.3, y: 2.3, w: 2.5, h: 4.4, file: '11-dashboard-movil.png',           label: 'Dashboard móvil' });
  realCapture(s, { x: 9.2, y: 2.3, w: 3.5, h: 4.4, file: '08-favoritos-grid.png',            label: 'Favoritos' });

  brandFooter(s);
  pageNumber(s, 4);
}

// ═════════════════════════════════════════════════════════════
// SLIDE 5 — STACK TECNOLÓGICO
// ═════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  lightBg(s);
  leftAccent(s);

  s.addText('Stack tecnológico', {
    x: 0.7, y: 0.5, w: 12, h: 0.9,
    fontSize: 40, bold: true, color: C.brand2, fontFace: FONT_HEAD,
  });

  const stacks = [
    { col: 'FRONTEND',  items: [['Angular 20', 'SPA standalone'], ['Ionic 8', 'UI mobile-first'], ['Capacitor 7', 'Empaquetado nativo'], ['TypeScript', 'Tipado fuerte']] },
    { col: 'BACKEND',   items: [['Java 21', 'Última LTS'], ['Spring Boot 3', 'Framework REST'], ['Spring Security', 'JWT auth'], ['Hibernate / JPA', 'ORM']] },
    { col: 'DATOS Y OPS', items: [['PostgreSQL 16', 'BBDD relacional'], ['Docker Compose', 'Orquestación'], ['Maven', 'Build backend'], ['npm', 'Build frontend']] },
  ];
  stacks.forEach((g, i) => {
    const x = 0.8 + i * 4.1;
    // Header de columna
    s.addShape('roundRect', { x, y: 1.7, w: 3.8, h: 0.6, rectRadius: 0.1, fill: { color: C.brand2 }, line: { color: C.brand2, width: 0 } });
    s.addText(g.col, { x, y: 1.7, w: 3.8, h: 0.6, fontSize: 14, bold: true, color: C.textOn, align: 'center', fontFace: FONT_HEAD });
    // Items
    g.items.forEach((it, j) => {
      const yy = 2.5 + j * 1.0;
      s.addShape('roundRect', { x, y: yy, w: 3.8, h: 0.85, rectRadius: 0.1, fill: { color: 'FFFFFF' }, line: { color: 'D5E8F0', width: 1 } });
      s.addText(it[0], { x: x + 0.2, y: yy + 0.05, w: 3.4, h: 0.45, fontSize: 15, bold: true, color: C.brand2, fontFace: FONT_HEAD });
      s.addText(it[1], { x: x + 0.2, y: yy + 0.45, w: 3.4, h: 0.4, fontSize: 11, color: '64748B', fontFace: FONT_BODY });
    });
  });

  brandFooter(s, false);
  pageNumber(s, 5);
}

// ═════════════════════════════════════════════════════════════
// SLIDE 6 — ARQUITECTURA
// ═════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  s.addText('Arquitectura', {
    x: 0.5, y: 0.5, w: 12, h: 0.9,
    fontSize: 40, bold: true, color: C.brand1, fontFace: FONT_HEAD,
  });
  s.addText('Tres capas desacopladas comunicadas por estándares abiertos', {
    x: 0.5, y: 1.4, w: 12, h: 0.5, fontSize: 16, italic: true, color: C.textSec, fontFace: FONT_BODY,
  });

  // 3 cajas con flechas
  const boxes = [
    { title: 'CLIENTE',   sub: 'Angular + Ionic',  port: ':4200', icon: '📱' },
    { title: 'BACKEND',   sub: 'Spring Boot',      port: ':8008', icon: '⚙️' },
    { title: 'BBDD',      sub: 'PostgreSQL 16',    port: ':5444', icon: '🗄️' },
  ];
  const yBox = 2.6;
  const wBox = 3.4;
  boxes.forEach((b, i) => {
    const x = 0.7 + i * 4.3;
    s.addShape('roundRect', { x, y: yBox, w: wBox, h: 3.2, rectRadius: 0.25, fill: { color: C.bgMid }, line: { color: C.brand1, width: 2 } });
    s.addText(b.icon,   { x, y: yBox + 0.2,  w: wBox, h: 1.0, fontSize: 56, align: 'center', fontFace: FONT_BODY });
    s.addText(b.title,  { x, y: yBox + 1.4,  w: wBox, h: 0.6, fontSize: 22, bold: true, color: C.brand1, align: 'center', fontFace: FONT_HEAD });
    s.addText(b.sub,    { x, y: yBox + 2.0,  w: wBox, h: 0.4, fontSize: 14, color: C.text, align: 'center', fontFace: FONT_BODY });
    s.addText(b.port,   { x, y: yBox + 2.5,  w: wBox, h: 0.4, fontSize: 12, color: C.brand1, italic: true, align: 'center', fontFace: 'Consolas' });
  });

  // Flechas más pequeñas y centradas verticalmente entre cajas
  s.addShape('rightArrow', { x: 4.15, y: 4.05, w: 0.4, h: 0.35, fill: { color: C.brand1 }, line: { type: 'none' } });
  s.addShape('rightArrow', { x: 8.45, y: 4.05, w: 0.4, h: 0.35, fill: { color: C.brand1 }, line: { type: 'none' } });

  // Etiquetas centradas debajo de cada flecha
  // Caja CLIENTE (centrada en x ~ 0.7+1.7 = 2.4) → flecha en x 4.15-4.55
  // Caja BACKEND (centrada en x 5.0+1.7 = 6.7) → flecha en x 8.45-8.85
  // Caja BBDD   (centrada en x 9.3+1.7 = 11.0)
  // Etiqueta entre cliente y backend → centrada en x ~ 4.35
  // Etiqueta entre backend y bbdd → centrada en x ~ 8.65
  s.addText('REST · JWT', { x: 4.05, y: 4.5, w: 0.6, h: 0.4, fontSize: 10, color: C.textSec, align: 'center', fontFace: FONT_BODY });
  s.addText('JDBC',       { x: 8.35, y: 4.5, w: 0.6, h: 0.4, fontSize: 10, color: C.textSec, align: 'center', fontFace: FONT_BODY });

  brandFooter(s);
  pageNumber(s, 6);
}

// ═════════════════════════════════════════════════════════════
// SLIDE 7 — MODELO DE DATOS
// ═════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  lightBg(s);
  leftAccent(s);

  s.addText('Modelo de datos', {
    x: 0.7, y: 0.5, w: 12, h: 0.9,
    fontSize: 40, bold: true, color: C.brand2, fontFace: FONT_HEAD,
  });

  s.addText('5 entidades en tercera forma normal', {
    x: 0.7, y: 1.4, w: 12, h: 0.5, fontSize: 16, italic: true, color: '475569', fontFace: FONT_BODY,
  });

  realCapture(s, { x: 0.7, y: 2.1, w: 7.5, h: 4.8, file: 'diag-er.png', label: 'Diagrama Entidad-Relación' });

  // Stats laterales
  const stats = [
    { n: '5',  l: 'Tablas' },
    { n: '49', l: 'Planes' },
    { n: '8',  l: 'Ciudades' },
    { n: '8',  l: 'Categorías' },
  ];
  stats.forEach((st, i) => {
    const y = 2.1 + i * 1.2;
    s.addShape('roundRect', { x: 8.6, y, w: 4.2, h: 1.0, rectRadius: 0.15, fill: { color: C.brand2 }, line: { color: C.brand2, width: 0 } });
    s.addText(st.n, { x: 8.6, y, w: 1.2, h: 1.0, fontSize: 36, bold: true, color: C.textOn, align: 'center', fontFace: FONT_HEAD });
    s.addText(st.l, { x: 9.8, y, w: 3.0, h: 1.0, fontSize: 16, color: C.textOn, valign: 'middle', fontFace: FONT_BODY });
  });

  brandFooter(s, false);
  pageNumber(s, 7);
}

// ═════════════════════════════════════════════════════════════
// SLIDE 8 — BACKEND
// ═════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  s.addText('Backend — Spring Boot', {
    x: 0.5, y: 0.5, w: 12, h: 0.9,
    fontSize: 40, bold: true, color: C.brand1, fontFace: FONT_HEAD,
  });

  // Capas
  const layers = [
    { t: 'Controller',  d: 'AuthController · PlanController · LikeController · MetaController',  c: C.brand1 },
    { t: 'Service',     d: 'AuthService · PlanService · LikeService · JwtService',                c: C.brand1 },
    { t: 'Repository',  d: 'JPA Repositories sobre Hibernate',                                     c: C.brand1 },
    { t: 'Entidades',   d: 'Plan · Ciudad · Categoria · Usuario · Rol · UserLikePlan',             c: C.brand1 },
  ];
  layers.forEach((l, i) => {
    const y = 1.8 + i * 1.05;
    s.addShape('roundRect', { x: 0.7, y, w: 6.5, h: 0.85, rectRadius: 0.1, fill: { color: C.bgMid }, line: { color: l.c, width: 1 } });
    s.addText(l.t, { x: 0.9, y: y + 0.05, w: 1.7, h: 0.75, fontSize: 16, bold: true, color: l.c, fontFace: FONT_HEAD, valign: 'middle' });
    s.addText(l.d, { x: 2.6, y: y + 0.05, w: 4.5, h: 0.75, fontSize: 12, color: C.text, fontFace: FONT_BODY, valign: 'middle' });
  });

  // Endpoints sample (a la derecha)
  s.addShape('roundRect', { x: 7.5, y: 1.8, w: 5.3, h: 4.4, rectRadius: 0.1, fill: { color: '0d1f24' }, line: { color: C.brand1, width: 1 } });
  s.addText('Endpoints REST', { x: 7.7, y: 1.9, w: 5, h: 0.4, fontSize: 14, bold: true, color: C.brand1, fontFace: FONT_HEAD });
  s.addText([
    { text: 'POST  /auth/login\n',          options: { color: C.brand1, fontSize: 12, breakLine: true } },
    { text: 'POST  /auth/register\n',       options: { color: C.brand1, fontSize: 12, breakLine: true } },
    { text: 'GET   /plans/swipe\n',         options: { color: C.text,   fontSize: 12, breakLine: true } },
    { text: 'POST  /plans/{id}/like\n',     options: { color: C.text,   fontSize: 12, breakLine: true } },
    { text: 'POST  /plans/{id}/dislike\n',  options: { color: C.text,   fontSize: 12, breakLine: true } },
    { text: 'DELETE /plans/{id}/vote\n',    options: { color: C.text,   fontSize: 12, breakLine: true } },
    { text: 'GET   /plans/me/liked\n',      options: { color: C.text,   fontSize: 12, breakLine: true } },
    { text: 'GET   /ciudades\n',            options: { color: C.textSec, fontSize: 12, breakLine: true } },
    { text: 'GET   /categorias',            options: { color: C.textSec, fontSize: 12 } },
  ], { x: 7.7, y: 2.4, w: 5, h: 3.7, fontFace: 'Consolas' });

  brandFooter(s);
  pageNumber(s, 8);
}

// ═════════════════════════════════════════════════════════════
// SLIDE 9 — SEGURIDAD JWT
// ═════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  lightBg(s);
  leftAccent(s);

  s.addText('Seguridad — JWT', {
    x: 0.7, y: 0.5, w: 12, h: 0.9,
    fontSize: 40, bold: true, color: C.brand2, fontFace: FONT_HEAD,
  });

  s.addText([
    { text: 'Stateless · Firma HS256 · BCrypt para contraseñas', options: { fontSize: 16, italic: true, color: '475569' } },
  ], { x: 0.7, y: 1.4, w: 12, h: 0.5, fontFace: FONT_BODY });

  // Flujo en 4 pasos
  const steps = [
    { n: '1', t: 'Login',                  d: 'Cliente envía email + password' },
    { n: '2', t: 'Token',                  d: 'Backend devuelve JWT firmado (24h)' },
    { n: '3', t: 'Petición autenticada',   d: 'Header Authorization: Bearer {token}' },
    { n: '4', t: 'Filtro JWT',             d: 'Validación + carga de UserDetails' },
  ];
  steps.forEach((st, i) => {
    const x = 0.7 + i * 3.15;
    s.addShape('ellipse', { x: x + 0.85, y: 2.1, w: 1.3, h: 1.3, fill: { color: C.brand2 }, line: { color: C.brand2, width: 0 } });
    s.addText(st.n, { x: x + 0.85, y: 2.1, w: 1.3, h: 1.3, fontSize: 38, bold: true, color: C.textOn, align: 'center', fontFace: FONT_HEAD });
    s.addText(st.t, { x, y: 3.6, w: 3.0, h: 0.5, fontSize: 18, bold: true, color: C.brand2, align: 'center', fontFace: FONT_HEAD });
    s.addText(st.d, { x, y: 4.1, w: 3.0, h: 1.0, fontSize: 12, color: '475569', align: 'center', fontFace: FONT_BODY });
  });

  // Bug arreglado highlight (con tag textual coherente con el resto del deck)
  s.addShape('roundRect', { x: 0.7, y: 5.7, w: 12, h: 1.1, rectRadius: 0.15, fill: { color: 'FFF8E1' }, line: { color: C.warn, width: 1 } });
  s.addShape('roundRect', { x: 0.9, y: 5.95, w: 1.3, h: 0.55, rectRadius: 0.1, fill: { color: C.warn }, line: { type: 'none' } });
  s.addText('FIX', { x: 0.9, y: 5.95, w: 1.3, h: 0.55, fontSize: 12, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: FONT_HEAD });
  s.addText([
    { text: 'Bug crítico resuelto: ', options: { fontSize: 12, bold: true, color: '92400E' } },
    { text: 'el filtro lanzaba 500 con tokens caducados. Reescrito para devolver 401 que el frontend captura y redirige a /login.', options: { fontSize: 12, color: '78350F' } },
  ], { x: 2.4, y: 5.8, w: 10.2, h: 0.9, fontFace: FONT_BODY, valign: 'middle' });

  brandFooter(s, false);
  pageNumber(s, 9);
}

// ═════════════════════════════════════════════════════════════
// SLIDE 10 — FRONTEND
// ═════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  s.addText('Frontend — Angular + Ionic', {
    x: 0.5, y: 0.5, w: 12, h: 0.9,
    fontSize: 40, bold: true, color: C.brand1, fontFace: FONT_HEAD,
  });

  // Lista izquierda
  s.addText([
    { text: 'Componentes standalone\n', options: { fontSize: 16, bold: true, color: C.brand1, breakLine: true } },
    { text: 'Sin NgModules. Cada página y servicio se importa donde se usa.\n\n', options: { fontSize: 13, color: C.textSec, breakLine: true } },

    { text: 'Servicios inyectables\n', options: { fontSize: 16, bold: true, color: C.brand1, breakLine: true } },
    { text: 'AuthService · PlanService · ImageService · MetaService\nProgressService · ThemeService · StorageService\n\n', options: { fontSize: 13, color: C.textSec, breakLine: true } },

    { text: 'Interceptor HTTP\n', options: { fontSize: 16, bold: true, color: C.brand1, breakLine: true } },
    { text: 'Inyecta el Bearer token y redirige al login si recibe 401.', options: { fontSize: 13, color: C.textSec } },
  ], { x: 0.7, y: 1.7, w: 6, h: 5.5, fontFace: FONT_BODY });

  realCapture(s, { x: 7.0, y: 1.7, w: 5.8, h: 4.7, file: '03-dashboard-escritorio-claro.png', label: 'Vista de la app' });

  brandFooter(s);
  pageNumber(s, 10);
}

// ═════════════════════════════════════════════════════════════
// SLIDE 11 — DISEÑO Y UX
// ═════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  lightBg(s);
  leftAccent(s);

  s.addText('Diseño — paleta extraída del logo', {
    x: 0.7, y: 0.5, w: 12, h: 0.9,
    fontSize: 36, bold: true, color: C.brand2, fontFace: FONT_HEAD,
  });

  // Swatches paleta
  const palette = [
    { name: 'Mint',       hex: '#0ECFBE', color: '0ECFBE' },
    { name: 'Teal',       hex: '#0891B2', color: '0891B2' },
    { name: 'Soft mint',  hex: '#7ED9CF', color: '7ED9CF' },
    { name: 'Cool light', hex: '#E6F9F6', color: 'E6F9F6' },
    { name: 'Dark bg',    hex: '#0A1719', color: '0A1719' },
  ];
  palette.forEach((p, i) => {
    const x = 0.7 + i * 2.55;
    // Borde gris oscuro en colores muy claros (Cool light, Soft mint) para que se distingan del fondo crema
    const isLight = ['E6F9F6', '7ED9CF'].includes(p.color);
    s.addShape('roundRect', { x, y: 1.7, w: 2.3, h: 1.5, rectRadius: 0.15, fill: { color: p.color },
      line: isLight ? { color: '64748B', width: 1.5 } : { type: 'none' } });
    s.addText(p.name, { x, y: 3.3,  w: 2.3, h: 0.4, fontSize: 14, bold: true, color: C.lightTxt, align: 'center', fontFace: FONT_HEAD });
    s.addText(p.hex,  { x, y: 3.7,  w: 2.3, h: 0.4, fontSize: 12, color: '475569', align: 'center', fontFace: 'Consolas' });
  });

  // 3 features de UX
  const ux = [
    { i: '🌓', t: 'Dark mode', d: 'Auto / claro / oscuro' },
    { i: '📐', t: 'Responsive', d: '320px → 4K' },
    { i: '♿', t: 'Accesible',  d: 'aria-label · reduced-motion' },
  ];
  ux.forEach((u, i) => {
    const x = 0.7 + i * 4.1;
    s.addShape('roundRect', { x, y: 4.6, w: 3.8, h: 2.0, rectRadius: 0.15, fill: { color: 'FFFFFF' }, line: { color: C.brand1, width: 1 } });
    s.addText(u.i, { x, y: 4.7, w: 3.8, h: 0.7, fontSize: 32, align: 'center', fontFace: FONT_BODY });
    s.addText(u.t, { x, y: 5.5, w: 3.8, h: 0.5, fontSize: 18, bold: true, color: C.brand2, align: 'center', fontFace: FONT_HEAD });
    s.addText(u.d, { x, y: 6.0, w: 3.8, h: 0.5, fontSize: 12, color: '64748B', align: 'center', fontFace: FONT_BODY });
  });

  brandFooter(s, false);
  pageNumber(s, 11);
}

// ═════════════════════════════════════════════════════════════
// SLIDE 12 — FUNCIONALIDADES PRINCIPALES
// ═════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  s.addText('Funcionalidades principales', {
    x: 0.5, y: 0.5, w: 12, h: 0.9,
    fontSize: 36, bold: true, color: C.brand1, fontFace: FONT_HEAD,
  });

  const items = [
    { i: '🃏', t: 'Swipe',                    d: 'Tarjeta animada con drag, atajos teclado y botones físicos' },
    { i: '🔍', t: 'Búsqueda',                 d: 'Detección automática de ciudad o categoría en el texto' },
    { i: '🎛️', t: 'Filtros',                  d: 'Ciudad · categoría · precio máximo · solo gratuitos' },
    { i: '🎲', t: 'Modo descubrir',           d: 'Random shuffle cuando se han votado todos los planes' },
    { i: '📋', t: 'Detalle',                  d: 'Modal con imagen hero, mapa y compartir nativo' },
    { i: '🔄', t: 'Undo',                     d: 'Deshacer la última acción de like / dislike' },
  ];
  items.forEach((it, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.5 + col * 6.4;
    const y = 1.7 + row * 1.7;
    s.addShape('roundRect', { x, y, w: 6.0, h: 1.5, rectRadius: 0.1, fill: { color: C.bgMid }, line: { color: C.brand1, width: 1 } });
    s.addShape('ellipse',   { x: x + 0.2, y: y + 0.25, w: 1.0, h: 1.0, fill: { color: C.brand1 }, line: { color: C.brand1, width: 0 } });
    s.addText(it.i, { x: x + 0.2, y: y + 0.25, w: 1.0, h: 1.0, fontSize: 24, align: 'center', fontFace: FONT_BODY });
    s.addText(it.t, { x: x + 1.4, y: y + 0.15, w: 4.5, h: 0.5, fontSize: 18, bold: true, color: C.brand1, fontFace: FONT_HEAD });
    s.addText(it.d, { x: x + 1.4, y: y + 0.65, w: 4.5, h: 0.8, fontSize: 12, color: C.text, fontFace: FONT_BODY });
  });

  brandFooter(s);
  pageNumber(s, 12);
}

// ═════════════════════════════════════════════════════════════
// SLIDE 13 — FUNCIONALIDADES EXTRA
// ═════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  lightBg(s);
  leftAccent(s);

  s.addText('Funcionalidades extra', {
    x: 0.7, y: 0.5, w: 12, h: 0.9,
    fontSize: 36, bold: true, color: C.brand2, fontFace: FONT_HEAD,
  });
  s.addText('Lo que diferencia a Planfy de un MVP', {
    x: 0.7, y: 1.4, w: 12, h: 0.5, fontSize: 14, italic: true, color: '64748B', fontFace: FONT_BODY,
  });

  const extras = [
    { i: '🏆', t: 'Sistema de logros',  d: '8 badges desbloqueables\nbasados en tu actividad' },
    { i: '🎯', t: 'Recomendaciones',    d: '"Te gusta Cultura"\nFiltro inteligente' },
    { i: '📊', t: 'Stats personales',   d: 'Categoría top, ciudad top,\ngratuitos, total favoritos' },
    { i: '👋', t: 'Tour de bienvenida', d: 'Onboarding 3 pasos\nsolo la primera vez' },
    { i: '📨', t: 'Compartir',          d: 'Web Share API nativa\n+ fallback al portapapeles' },
    { i: '🖼️', t: 'Imágenes reales',    d: 'Wikipedia Commons\npor plan, con preload' },
  ];
  extras.forEach((e, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.7 + col * 4.2;
    const y = 2.2 + row * 2.4;
    s.addShape('roundRect', { x, y, w: 3.9, h: 2.1, rectRadius: 0.15, fill: { color: 'FFFFFF' }, line: { color: C.brand1, width: 1 } });
    s.addText(e.i, { x: x + 0.2, y: y + 0.2, w: 1.0, h: 1.0, fontSize: 32, align: 'center', fontFace: FONT_BODY });
    s.addText(e.t, { x: x + 1.3, y: y + 0.3, w: 2.5, h: 0.5, fontSize: 16, bold: true, color: C.brand2, fontFace: FONT_HEAD });
    s.addText(e.d, { x: x + 1.3, y: y + 0.85, w: 2.5, h: 1.1, fontSize: 11, color: '64748B', fontFace: FONT_BODY });
  });

  brandFooter(s, false);
  pageNumber(s, 13);
}

// ═════════════════════════════════════════════════════════════
// SLIDE 14 — DESPLIEGUE DOCKER
// ═════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  s.addText('Despliegue · Docker Compose', {
    x: 0.5, y: 0.5, w: 12, h: 0.9,
    fontSize: 36, bold: true, color: C.brand1, fontFace: FONT_HEAD,
  });

  // Comando hero
  s.addShape('roundRect', { x: 0.7, y: 1.7, w: 12, h: 1.2, rectRadius: 0.1, fill: { color: '0d1f24' }, line: { color: C.brand1, width: 1.5 } });
  s.addText([
    { text: '$ ',                  options: { fontSize: 22, color: C.textSec } },
    { text: 'docker compose up -d', options: { fontSize: 22, bold: true, color: C.brand1 } },
  ], { x: 0.7, y: 1.7, w: 12, h: 1.2, align: 'center', valign: 'middle', fontFace: 'Consolas' });
  s.addText('Un solo comando levanta los 3 contenedores', {
    x: 0.7, y: 3.0, w: 12, h: 0.4, fontSize: 13, italic: true, color: C.textSec, align: 'center', fontFace: FONT_BODY,
  });

  // 3 contenedores (más compactos y elevados para no chocar con el footer)
  const cont = [
    { i: '🗄️', t: 'planfy_postgres',  p: ':5444',  d: 'PostgreSQL 16' },
    { i: '⚙️',  t: 'planfy_backend',   p: ':8008',  d: 'Spring Boot 3' },
    { i: '⚡',  t: 'planfy_frontend',  p: ':4200',  d: 'Angular' },
  ];
  cont.forEach((c, i) => {
    const x = 0.7 + i * 4.1;
    s.addShape('roundRect', { x, y: 3.5, w: 3.9, h: 2.0, rectRadius: 0.15, fill: { color: C.bgMid }, line: { color: C.brand1, width: 1 } });
    s.addText(c.i, { x, y: 3.6, w: 3.9, h: 0.6, fontSize: 30, align: 'center', fontFace: FONT_BODY });
    s.addText(c.t, { x: x + 0.1, y: 4.25, w: 3.7, h: 0.4, fontSize: 14, bold: true, color: C.brand1, align: 'center', fontFace: 'Consolas' });
    s.addText(c.d, { x: x + 0.1, y: 4.65, w: 3.7, h: 0.4, fontSize: 13, color: C.text, align: 'center', fontFace: FONT_BODY });
    s.addText(c.p, { x: x + 0.1, y: 5.05, w: 3.7, h: 0.4, fontSize: 12, color: C.brand1, italic: true, align: 'center', fontFace: 'Consolas' });
  });

  // Caption sin caja gigante — solo texto explicativo discreto
  s.addText('Tres servicios orquestados con un solo comando · datos persistidos en volumen Docker · puertos expuestos al host', {
    x: 0.7, y: 5.85, w: 12, h: 0.7, fontSize: 12, italic: true, color: C.textSec, align: 'center', fontFace: FONT_BODY,
  });

  brandFooter(s);
  pageNumber(s, 14);
}

// ═════════════════════════════════════════════════════════════
// SLIDE 15 — RETOS Y APRENDIZAJES
// ═════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  lightBg(s);
  leftAccent(s);

  s.addText('Retos y aprendizajes', {
    x: 0.7, y: 0.5, w: 12, h: 0.9,
    fontSize: 36, bold: true, color: C.brand2, fontFace: FONT_HEAD,
  });

  const challenges = [
    { p: 'Token JWT caducado producía 500 en lugar de 401',                  s: 'Filtro reescrito con try/catch específico para ExpiredJwtException → respuesta 401 controlada que el frontend captura y redirige a /login.' },
    { p: 'Interceptor HTTP no se aplicaba a las peticiones',                 s: 'Estaba registrado en app.config.ts pero main.ts tenía sus propios providers. Movido withInterceptors([authInterceptor]) a main.ts.' },
    { p: 'Wikipedia bloquea las URLs /thumb/ desde origen externo',          s: 'Migración a commons.wikimedia.org/wiki/Special:FilePath?width=800 — funciona desde cualquier origen.' },
    { p: 'Imágenes irrelevantes con Loremflickr (gato en plan de cocina)',   s: 'Reemplazo total a Wikipedia Commons (catalogada y moderada) + verificación previa con onload=true en el navegador.' },
  ];
  challenges.forEach((c, i) => {
    const y = 1.8 + i * 1.25;
    s.addShape('roundRect', { x: 0.7, y, w: 12, h: 1.1, rectRadius: 0.1, fill: { color: 'FFFFFF' }, line: { color: C.red, width: 1 } });
    // Círculo numerado en lugar de emoji bug
    s.addShape('ellipse', { x: 0.9, y: y + 0.27, w: 0.55, h: 0.55, fill: { color: C.red }, line: { type: 'none' } });
    s.addText(String(i + 1), { x: 0.9, y: y + 0.27, w: 0.55, h: 0.55, fontSize: 18, bold: true, color: C.textOn, align: 'center', valign: 'middle', fontFace: FONT_HEAD });
    s.addText([
      { text: c.p + '\n', options: { fontSize: 13, bold: true, color: C.lightTxt } },
      { text: '→  ' + c.s, options: { fontSize: 11, color: '475569' } },
    ], { x: 1.6, y: y + 0.1, w: 10.9, h: 1.0, valign: 'middle', fontFace: FONT_BODY });
  });

  brandFooter(s, false);
  pageNumber(s, 15);
}

// ═════════════════════════════════════════════════════════════
// SLIDE 16 — CONCLUSIONES Y MEJORAS
// ═════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  s.addText('Conclusiones y mejoras futuras', {
    x: 0.5, y: 0.5, w: 12, h: 0.9,
    fontSize: 36, bold: true, color: C.brand1, fontFace: FONT_HEAD,
  });

  // Stats top
  const stats = [
    { n: '49',   l: 'planes con\nimagen real' },
    { n: '12',   l: 'requisitos\ncumplidos' },
    { n: '134h', l: 'esfuerzo\ntotal' },
    { n: '0',    l: 'errores\nen consola' },
  ];
  stats.forEach((st, i) => {
    const x = 0.5 + i * 3.2;
    s.addShape('roundRect', { x, y: 1.6, w: 3.0, h: 1.7, rectRadius: 0.15, fill: { color: C.bgMid }, line: { color: C.brand1, width: 1 } });
    s.addText(st.n, { x, y: 1.7, w: 3.0, h: 0.9, fontSize: 36, bold: true, color: C.brand1, align: 'center', fontFace: FONT_HEAD });
    s.addText(st.l, { x, y: 2.55, w: 3.0, h: 0.7, fontSize: 12, color: C.text, align: 'center', fontFace: FONT_BODY });
  });

  s.addText('Mejoras futuras', {
    x: 0.5, y: 3.6, w: 12, h: 0.6, fontSize: 20, bold: true, color: C.brand1, fontFace: FONT_HEAD,
  });

  const futuro = [
    { i: '🔧', t: 'Panel admin',            d: 'CRUD de planes para rol ADMIN' },
    { i: '📍', t: 'Geolocalización',        d: 'Planes cerca de mí (haversine)' },
    { i: '⭐', t: 'Reseñas',                d: 'Comentarios y puntuación media' },
    { i: '🔔', t: 'Push notifications',     d: 'Capacitor LocalNotifications' },
    { i: '🌍', t: 'i18n',                   d: 'Traducción a inglés, catalán, euskera' },
    { i: '🚀', t: 'Despliegue producción',  d: 'VPS + HTTPS + dominio propio' },
  ];
  futuro.forEach((f, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.5 + col * 4.2;
    const y = 4.4 + row * 1.4;
    s.addText(f.i, { x: x + 0.1, y, w: 0.7, h: 0.7, fontSize: 24, align: 'center', fontFace: FONT_BODY });
    s.addText([
      { text: f.t + '\n', options: { fontSize: 14, bold: true, color: C.brand1 } },
      { text: f.d, options: { fontSize: 11, color: C.textSec } },
    ], { x: x + 0.85, y: y + 0.05, w: 3.2, h: 1.1, fontFace: FONT_BODY });
  });

  brandFooter(s);
  pageNumber(s, 16);
}

// ═════════════════════════════════════════════════════════════
// SLIDE 17 — GRACIAS / PREGUNTAS
// ═════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  s.addText('Gracias', {
    x: 0.5, y: 2.3, w: SLIDE_W - 1, h: 1.6,
    fontSize: 110, bold: true, color: C.brand1, fontFace: FONT_HEAD, align: 'center',
    glow: { size: 16, opacity: 0.3, color: C.brand1 },
  });
  s.addText('¿Preguntas?', {
    x: 0.5, y: 4.2, w: SLIDE_W - 1, h: 0.7,
    fontSize: 28, italic: true, color: C.text, fontFace: FONT_HEAD, align: 'center',
  });

  // Datos contacto centrados horizontal y verticalmente
  s.addShape('roundRect', { x: 3.0, y: 5.3, w: 7.3, h: 1.6, rectRadius: 0.15, fill: { color: C.bgMid }, line: { color: C.brand1, width: 1 } });
  s.addText('Javier Lugo Benítez', { x: 3.0, y: 5.4, w: 7.3, h: 0.5, fontSize: 18, bold: true, color: C.brand1, align: 'center', fontFace: FONT_BODY });
  s.addText('Tutor: Javier García  ·  IES Los Alcores', { x: 3.0, y: 5.95, w: 7.3, h: 0.4, fontSize: 12, color: C.textSec, align: 'center', fontFace: FONT_BODY });
  s.addText('github.com/JLugoBenitez/Planfy', { x: 3.0, y: 6.4, w: 7.3, h: 0.4, fontSize: 13, color: C.text, align: 'center', fontFace: FONT_BODY });

  pageNumber(s, 17);
}

// ─── Guardar ─────────────────────────────────────────────
const out = path.join(__dirname, 'Planfy-Presentacion-TFG.pptx');
pres.writeFile({ fileName: out }).then(() => {
  console.log('✅ Generada: ' + out);
}).catch(err => { console.error('❌ Error:', err); process.exit(1); });
