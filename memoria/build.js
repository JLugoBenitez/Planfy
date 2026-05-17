/**
 * Generador de la Memoria del TFG — Planfy
 * Cumple los requisitos de la programación didáctica:
 *  - Arial Narrow 12, justificado
 *  - Encabezado con nombre + título del proyecto (excepto la portada)
 *  - Pie con número de página
 *  - Capítulos, apartados y subapartados numerados
 *  - 30 a 60 páginas
 */

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Header, Footer, PageNumber, PageBreak,
  AlignmentType, HeadingLevel, LevelFormat, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, ExternalHyperlink, TableOfContents,
  TabStopType, TabStopPosition, ImageRun,
} = require('docx');

const CAP = path.join(__dirname, 'capturas');

/** Empotra una PNG (de capturas/) centrada con caption. Siempre devuelve un array. */
const imagen = (filename, captionText, opts = {}) => {
  const file = path.join(CAP, filename);
  if (!fs.existsSync(file)) {
    return [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 80 },
        border: { top: { style: BorderStyle.DASHED, size: 6, color: 'F59E0B' }, bottom: { style: BorderStyle.DASHED, size: 6, color: 'F59E0B' }, left: { style: BorderStyle.DASHED, size: 6, color: 'F59E0B' }, right: { style: BorderStyle.DASHED, size: 6, color: 'F59E0B' } },
        children: [new TextRun({ text: '📸 PEGAR CAPTURA AQUÍ — ' + filename, font: 'Arial Narrow', size: 22, bold: true, color: 'D97706' })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 200 },
        children: [new TextRun({ text: captionText || '', font: 'Arial Narrow', size: 20, italics: true, color: '64748B' })] }),
    ];
  }
  const data = fs.readFileSync(file);
  const w = opts.width || 480;
  const h = opts.height || (w * 0.62);
  const blocks = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 80 },
      children: [new ImageRun({
        type: 'png',
        data,
        transformation: { width: w, height: h },
        altText: { title: filename, description: captionText, name: filename },
      })],
    }),
  ];
  if (captionText) {
    blocks.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 200 },
      children: [new TextRun({ text: captionText, font: 'Arial Narrow', size: 20, italics: true, color: '64748B' })],
    }));
  }
  return blocks;
};

// ─── Helpers ──────────────────────────────────────────────────────────────
const FONT = 'Arial Narrow';
const SIZE = 24;       // 12pt = 24 half-points
const SIZE_H1 = 36;    // 18pt
const SIZE_H2 = 30;    // 15pt
const SIZE_H3 = 26;    // 13pt

const BRAND_BLUE = '0891B2';
const BRAND_TEAL = '0ECFBE';

const p = (text, opts = {}) => new Paragraph({
  alignment: opts.align || AlignmentType.JUSTIFIED,
  spacing: { after: 120, line: 300 },
  ...opts.paragraph,
  children: [new TextRun({ text, font: FONT, size: SIZE, ...opts.run })],
});

/** Párrafo justificado de texto enriquecido (negrita, cursiva, runs múltiples) */
const pRich = (runs, opts = {}) => new Paragraph({
  alignment: opts.align || AlignmentType.JUSTIFIED,
  spacing: { after: 120, line: 300 },
  ...opts.paragraph,
  children: runs.map(r => typeof r === 'string'
    ? new TextRun({ text: r, font: FONT, size: SIZE })
    : new TextRun({ font: FONT, size: SIZE, ...r })),
});

const h1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  pageBreakBefore: true,
  spacing: { before: 360, after: 240 },
  children: [new TextRun({ text, font: FONT, size: SIZE_H1, bold: true, color: BRAND_BLUE })],
});

const h2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 280, after: 160 },
  children: [new TextRun({ text, font: FONT, size: SIZE_H2, bold: true, color: BRAND_BLUE })],
});

const h3 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_3,
  spacing: { before: 200, after: 120 },
  children: [new TextRun({ text, font: FONT, size: SIZE_H3, bold: true, color: '333333' })],
});

const bullet = (text) => new Paragraph({
  numbering: { reference: 'bullets', level: 0 },
  spacing: { after: 80 },
  alignment: AlignmentType.JUSTIFIED,
  children: [new TextRun({ text, font: FONT, size: SIZE })],
});

const numbered = (text) => new Paragraph({
  numbering: { reference: 'numbers', level: 0 },
  spacing: { after: 80 },
  alignment: AlignmentType.JUSTIFIED,
  children: [new TextRun({ text, font: FONT, size: SIZE })],
});

/** Marca para insertar captura. Estilo destacado para que el alumno lo vea */
const captura = (descripcion) => new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 160, after: 160 },
  border: {
    top:    { style: BorderStyle.DASHED, size: 6, color: BRAND_BLUE },
    bottom: { style: BorderStyle.DASHED, size: 6, color: BRAND_BLUE },
    left:   { style: BorderStyle.DASHED, size: 6, color: BRAND_BLUE },
    right:  { style: BorderStyle.DASHED, size: 6, color: BRAND_BLUE },
  },
  children: [
    new TextRun({ text: '📸 [CAPTURA: ', font: FONT, size: SIZE, bold: true, color: BRAND_BLUE }),
    new TextRun({ text: descripcion, font: FONT, size: SIZE, italics: true, color: '555555' }),
    new TextRun({ text: ']', font: FONT, size: SIZE, bold: true, color: BRAND_BLUE }),
  ],
});

/** Bloque de código monoespaciado */
const code = (text) => new Paragraph({
  spacing: { before: 80, after: 120 },
  shading: { type: ShadingType.CLEAR, fill: 'F4F8FA' },
  border: {
    top:    { style: BorderStyle.SINGLE, size: 4, color: 'D5E8F0' },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: 'D5E8F0' },
    left:   { style: BorderStyle.SINGLE, size: 4, color: 'D5E8F0' },
    right:  { style: BorderStyle.SINGLE, size: 4, color: 'D5E8F0' },
  },
  children: text.split('\n').flatMap((line, i, arr) => {
    const runs = [new TextRun({ text: line || ' ', font: 'Consolas', size: 20, color: '0F172A' })];
    return i < arr.length - 1 ? [...runs, new TextRun({ break: 1 })] : runs;
  }),
});

const link = (text, url) => new ExternalHyperlink({
  link: url,
  children: [new TextRun({ text, font: FONT, size: SIZE, color: BRAND_BLUE, underline: {} })],
});

/** Celda de tabla simple */
const cell = (text, opts = {}) => new TableCell({
  width: { size: opts.width || 4680, type: WidthType.DXA },
  shading: opts.fill ? { type: ShadingType.CLEAR, fill: opts.fill } : undefined,
  margins: { top: 80, bottom: 80, left: 120, right: 120 },
  borders: {
    top:    { style: BorderStyle.SINGLE, size: 4, color: 'B8DDE5' },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: 'B8DDE5' },
    left:   { style: BorderStyle.SINGLE, size: 4, color: 'B8DDE5' },
    right:  { style: BorderStyle.SINGLE, size: 4, color: 'B8DDE5' },
  },
  children: [new Paragraph({
    alignment: opts.align || AlignmentType.LEFT,
    children: [new TextRun({
      text, font: FONT, size: opts.size || SIZE, bold: !!opts.bold,
      color: opts.color || (opts.fill ? '0891B2' : '0F172A'),
    })],
  })],
});

const PLACEHOLDER_NAME = 'Javier Lugo Benítez';
const PLACEHOLDER_TUTOR = 'Javier García';
const CENTRO = 'IES Los Alcores';
const GITHUB_URL = 'https://github.com/JLugoBenitez/Planfy';
const PROJECT_TITLE = 'Planfy — Aplicación de descubrimiento de planes mediante swipe';

// ═══════════════════════════════════════════════════════════════════════════
// PORTADA
// ═══════════════════════════════════════════════════════════════════════════
const portada = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1200 },
    children: [new TextRun({ text: 'CFGS Desarrollo de Aplicaciones Web', font: FONT, size: 32, bold: true, color: BRAND_BLUE })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 240 },
    children: [new TextRun({ text: 'Proyecto Intermodular', font: FONT, size: 28, color: '555555' })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1800 },
    children: [new TextRun({ text: 'PLANFY', font: FONT, size: 72, bold: true, color: BRAND_BLUE })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200 },
    children: [new TextRun({ text: 'Aplicación de descubrimiento de planes mediante swipe', font: FONT, size: 28, italics: true, color: '666666' })] }),
  // Logo Planfy (sin caption en portada)
  ...(() => {
    const logoFile = path.join(__dirname, '..', 'frontend', 'planfyApp', 'src', 'assets', 'icon', 'favicon.png');
    if (fs.existsSync(logoFile)) {
      return [new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 600, after: 600 },
        children: [new ImageRun({
          type: 'png',
          data: fs.readFileSync(logoFile),
          transformation: { width: 180, height: 180 },
          altText: { title: 'Logo Planfy', description: 'Logo de Planfy', name: 'logo' },
        })],
      })];
    }
    return [];
  })(),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 600 },
    children: [new TextRun({ text: 'Alumno: ', font: FONT, size: SIZE, bold: true }),
               new TextRun({ text: PLACEHOLDER_NAME, font: FONT, size: SIZE })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100 },
    children: [new TextRun({ text: 'Tutor docente: ', font: FONT, size: SIZE, bold: true }),
               new TextRun({ text: PLACEHOLDER_TUTOR, font: FONT, size: SIZE })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100 },
    children: [new TextRun({ text: 'Centro: ', font: FONT, size: SIZE, bold: true }),
               new TextRun({ text: CENTRO, font: FONT, size: SIZE })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100 },
    children: [new TextRun({ text: 'Curso 2025-2026', font: FONT, size: SIZE })] }),

  new Paragraph({ children: [new PageBreak()] }),
];

// ═══════════════════════════════════════════════════════════════════════════
// 1. ÍNDICE
// ═══════════════════════════════════════════════════════════════════════════
const indice = [
  h1('1. Índice'),
  pRich([
    'Este documento recoge la memoria completa del proyecto intermodular ',
    { text: 'Planfy', bold: true },
    ', desarrollado durante el curso 2025-2026 como cierre del Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Web. La memoria se estructura en seis capítulos numerados que abordan, respectivamente, el análisis del problema, la ejecución técnica, la documentación del sistema y las conclusiones.',
  ]),
  new Paragraph({ spacing: { before: 240 }, children: [
    new TextRun({ text: 'Tabla de contenidos', font: FONT, size: SIZE_H3, bold: true, color: BRAND_BLUE }),
  ]}),
  new TableOfContents('Tabla de contenidos', { hyperlink: true, headingStyleRange: '1-3' }),
];

// ═══════════════════════════════════════════════════════════════════════════
// 2. ESTUDIO DEL PROBLEMA Y ANÁLISIS DEL SISTEMA
// ═══════════════════════════════════════════════════════════════════════════
const cap2 = [
  h1('2. Estudio del problema y análisis del sistema'),

  h2('2.1. Introducción'),
  p('Planfy es una aplicación web progresiva (PWA) y multiplataforma orientada al descubrimiento de planes de ocio mediante una interacción tipo «swipe» —similar a la que popularizó Tinder— en la que el usuario desliza una tarjeta hacia la derecha si un plan le resulta atractivo o hacia la izquierda en caso contrario. La aplicación está construida sobre una arquitectura cliente-servidor desacoplada: un frontend desarrollado con Angular 20 e Ionic 8 que se ejecuta tanto en navegador como en dispositivo móvil empaquetado mediante Capacitor, y un backend implementado en Spring Boot 3 con persistencia en PostgreSQL 16, todo orquestado mediante contenedores Docker para facilitar el despliegue.'),
  p('La aplicación dispone de un catálogo de planes geolocalizados en distintas ciudades españolas, organizados por categorías como Cultura, Naturaleza, Gastronomía, Deporte, Ocio nocturno, Arte, Música y Aventura. Cada plan cuenta con información detallada (nombre, descripción, duración, precio, ciudad, categoría, coordenadas e imagen representativa procedente de Wikipedia Commons) que se muestra al usuario en una tarjeta visualmente atractiva. El usuario puede aplicar filtros por ciudad, categoría o precio máximo, realizar búsquedas textuales, gestionar sus planes favoritos y consultar estadísticas personalizadas en su perfil.'),

  h2('2.2. Justificación del proyecto'),
  p('La motivación principal de Planfy nace de la observación de un problema cotidiano: la dificultad de decidir qué hacer en el tiempo libre. Las plataformas existentes (TripAdvisor, Civitatis, Google Maps) presentan listados extensos que requieren un esfuerzo cognitivo elevado para filtrar y comparar opciones. La metáfora del swipe, ampliamente asimilada por los usuarios gracias a aplicaciones como Tinder, Bumble o Stylink, reduce esta carga al presentar una única opción cada vez y permitir una decisión binaria e inmediata.'),
  p('Adicionalmente, el proyecto integra de forma transversal todos los módulos del ciclo formativo: el modelado de datos en Bases de Datos, la programación orientada a objetos en Programación, el maquetado y comportamiento en Lenguajes de Marcas, los diagramas de análisis en Entornos de Desarrollo, la administración del servidor en Sistemas Informáticos, el desarrollo backend con API REST en Desarrollo Web en Entorno Servidor, el consumo de servicios y validación en Desarrollo Web en Entorno Cliente, el diseño responsive en Diseño de Interfaces Web y la contenedorización en Despliegue de Aplicaciones Web. Por ello, Planfy resulta un caso idóneo para articular y demostrar las competencias adquiridas a lo largo del ciclo.'),

  h2('2.3. Objetivos, funciones y rendimientos deseados'),
  p('Los objetivos generales del sistema se han definido en torno a tres ejes —experiencia de usuario, robustez técnica y aprendizaje del alumno— que guían el resto de decisiones de diseño:'),
  bullet('Construir una aplicación funcional, multiplataforma y responsive que permita descubrir planes de ocio mediante una interfaz intuitiva basada en gestos.'),
  bullet('Implementar una arquitectura de microservicios desacoplada en la que el backend exponga una API REST consumida por el frontend, garantizando la portabilidad y escalabilidad del sistema.'),
  bullet('Aplicar buenas prácticas de seguridad, en particular autenticación basada en JSON Web Tokens, validación de entrada en formularios y manejo controlado de errores en ambos extremos.'),
  bullet('Proporcionar un despliegue reproducible mediante Docker Compose que permita levantar el entorno completo (base de datos, backend y frontend) con un único comando.'),
  bullet('Incorporar funcionalidades complementarias que enriquezcan la experiencia de usuario: modo oscuro automático, sistema de logros, recomendaciones según preferencias previas, deshacer última acción y compartir planes vía Web Share API.'),

  p('Las funciones concretas del sistema, derivadas de los objetivos anteriores, se enumeran a continuación:'),
  numbered('Registro y autenticación de usuarios mediante correo electrónico y contraseña, con generación de access token y refresh token JWT.'),
  numbered('Visualización de planes en formato tarjeta con imagen, categoría, precio, ciudad, descripción y duración.'),
  numbered('Interacción mediante gestos de swipe (arrastrar la tarjeta) y mediante botones para «me gusta» y «no me gusta», con animaciones suaves de salida.'),
  numbered('Filtrado por ciudad, categoría, precio máximo y planes gratuitos.'),
  numbered('Búsqueda textual que detecta automáticamente la ciudad o categoría mencionada y aplica el filtro correspondiente.'),
  numbered('Modo descubrir, que activa de forma automática planes aleatorios cuando el usuario ha votado todos los disponibles.'),
  numbered('Listado de favoritos con vista en cuadrícula adaptativa (1 / 2 / 3 / 4 columnas según el tamaño de pantalla) y eliminación con actualización optimista.'),
  numbered('Pantalla de cuenta con estadísticas personales (categoría favorita, ciudad favorita, total de favoritos, planes gratuitos), selector de tema y sistema de logros desbloqueables.'),
  numbered('Modal de detalle del plan con imagen ampliada, metadatos y botones de compartir (Web Share API con copia al portapapeles como respaldo) y enlace al mapa.'),
  numbered('Funcionalidad de deshacer la última acción de swipe.'),

  p('En cuanto a rendimientos esperados, la aplicación debe responder fluida tanto en navegador de escritorio como en móvil, con un tiempo de carga de la card siguiente inferior a 300 ms gracias a la precarga proactiva (warm-image) y los headers preconnect / dns-prefetch hacia los CDN de imágenes. El backend debe sostener al menos 50 peticiones concurrentes de swipe sin degradación apreciable, cifra adecuada para el ámbito académico del proyecto.'),

  h2('2.4. Ciclo de vida del proyecto'),
  p('El proyecto se ha desarrollado siguiendo un ciclo de vida iterativo e incremental, dividido en cinco fases que se han solapado parcialmente para favorecer la retroalimentación entre análisis e implementación. A continuación se describe cada una de ellas.'),

  h3('2.4.1. Fase de análisis'),
  p('Comprende la identificación del problema, la definición de los objetivos, la elaboración de los requisitos funcionales y no funcionales, así como el diseño preliminar del modelo de datos y de los casos de uso principales. Esta fase culmina con la elaboración de los diagramas Entidad-Relación, de Clases y de Casos de Uso, que se incluyen en el capítulo 3 de esta memoria.'),

  h3('2.4.2. Fase de diseño'),
  p('Definición de la arquitectura del sistema (cliente-servidor con API REST), elección del stack tecnológico, diseño del esquema de base de datos en tercera forma normal, prototipado visual de las pantallas y elaboración del manual de estilo (paleta de colores extraída del logo, tipografía, escala tipográfica). Se decidió en esta fase la separación estricta entre el backend y el frontend, comunicándose únicamente mediante JSON sobre HTTPS.'),

  h3('2.4.3. Fase de implementación'),
  p('Desarrollo del código, dividido a su vez en bloques funcionales que se han abordado en orden de dependencia: primero la base de datos y el modelo JPA, después los servicios de autenticación y el filtro JWT, posteriormente los endpoints REST de planes y favoritos, y finalmente el frontend con sus páginas, servicios e interceptores. La implementación frontend ha seguido la metodología "página por página" (login → dashboard → favoritos → cuenta), validando cada una de forma aislada antes de pasar a la siguiente.'),

  h3('2.4.4. Fase de pruebas'),
  p('Pruebas manuales de aceptación de cada funcionalidad por separado, smoke tests automáticos contra los endpoints REST mediante PowerShell e Invoke-RestMethod, comprobación visual de la responsividad en distintos tamaños de pantalla (móvil 414×844, tablet 768×1024, escritorio 1920×1080), y revisión exhaustiva de errores en consola del navegador. Se han corregido todos los errores HTTP 500 detectados (especialmente los derivados de la expiración del token JWT) reescribiendo el filtro para que devuelva 401 controlado.'),

  h3('2.4.5. Fase de despliegue y documentación'),
  p('Empaquetado de la aplicación en imágenes Docker, definición del fichero docker-compose.yml para orquestar los tres servicios (PostgreSQL, backend, frontend), redacción de los manuales de usuario e instalación, y elaboración de esta memoria.'),

  h2('2.5. Recursos'),

  h3('2.5.1. Recursos humanos'),
  p('El proyecto ha sido desarrollado íntegramente por un único alumno (autor de esta memoria), con la supervisión y orientación del tutor docente del módulo. No se ha contado con personal técnico adicional. En el ámbito de los usuarios finales, el sistema está orientado a un perfil de uso individual: cualquier persona mayor de edad con interés en descubrir planes de ocio en ciudades españolas. La autenticación garantiza el aislamiento de datos entre usuarios.'),

  h3('2.5.2. Recursos hardware'),
  p('El desarrollo se ha realizado en un equipo personal estándar y el despliegue se ha llevado al servidor de prácticas del aula. No se ha tenido que adquirir hardware específico para el proyecto, por lo que el coste directo en este apartado es nulo. La siguiente tabla recoge los requisitos mínimos y recomendados para poder trabajar con comodidad en Planfy.'),

  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2800, 3280, 3280],
    rows: [
      new TableRow({ children: [
        cell('Recurso',     { width: 2800, fill: 'D5E8F0', bold: true }),
        cell('Mínimo',      { width: 3280, fill: 'D5E8F0', bold: true }),
        cell('Recomendado', { width: 3280, fill: 'D5E8F0', bold: true }),
      ]}),
      new TableRow({ children: [
        cell('Procesador',  { width: 2800 }),
        cell('CPU x64 con 4 núcleos', { width: 3280 }),
        cell('CPU moderna con 8 hilos o más', { width: 3280 }),
      ]}),
      new TableRow({ children: [
        cell('Memoria RAM', { width: 2800 }),
        cell('8 GB',        { width: 3280 }),
        cell('16 GB',       { width: 3280 }),
      ]}),
      new TableRow({ children: [
        cell('Almacenamiento', { width: 2800 }),
        cell('5 GB libres en SSD', { width: 3280 }),
        cell('10 GB libres en SSD (incluye imágenes Docker y node_modules)', { width: 3280 }),
      ]}),
      new TableRow({ children: [
        cell('Sistema operativo', { width: 2800 }),
        cell('Windows 10, macOS 12 o Linux moderno', { width: 3280 }),
        cell('Windows 11 con WSL 2 / Linux nativo', { width: 3280 }),
      ]}),
      new TableRow({ children: [
        cell('Internet',    { width: 2800 }),
        cell('Banda ancha (descarga única de imágenes Docker)', { width: 3280 }),
        cell('Conexión estable durante el desarrollo', { width: 3280 }),
      ]}),
      new TableRow({ children: [
        cell('Coste',       { width: 2800, fill: 'F4F8FA', bold: true }),
        cell('0 € (equipo personal del alumno)', { width: 3280, fill: 'F4F8FA', bold: true }),
        cell('0 € (servidor de aula para despliegue)', { width: 3280, fill: 'F4F8FA', bold: true }),
      ]}),
    ],
  }),

  p('El despliegue de la aplicación se ha realizado sobre el servidor del aula del IES Los Alcores, que ya disponía de Docker instalado. De este modo, el alumno y el profesor pueden acceder a Planfy desde cualquier equipo de la red local del centro sin necesidad de levantar la pila localmente. En un futuro escenario de puesta en producción real, el coste de un VPS modesto rondaría los 4 a 8 euros mensuales, suficiente para soportar tráfico de varios cientos de usuarios al día.'),

  h3('2.5.3. Recursos software'),
  p('Todo el software empleado pertenece al ámbito libre o gratuito para uso académico, por lo que el coste directo del proyecto en licencias es nulo. Los principales componentes son:'),

  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3120, 4680, 1560],
    rows: [
      new TableRow({ children: [
        cell('Producto',          { width: 3120, fill: 'D5E8F0', bold: true }),
        cell('Uso en el proyecto', { width: 4680, fill: 'D5E8F0', bold: true }),
        cell('Licencia',          { width: 1560, fill: 'D5E8F0', bold: true }),
      ]}),
      new TableRow({ children: [
        cell('Java JDK 21',                  { width: 3120 }),
        cell('Compilación y ejecución del backend Spring Boot', { width: 4680 }),
        cell('GPL/CDDL',                     { width: 1560 }),
      ]}),
      new TableRow({ children: [
        cell('Spring Boot 3',                { width: 3120 }),
        cell('Framework backend, inyección de dependencias y servidor embebido Tomcat', { width: 4680 }),
        cell('Apache 2.0',                   { width: 1560 }),
      ]}),
      new TableRow({ children: [
        cell('Spring Security + JJWT 0.11',  { width: 3120 }),
        cell('Autenticación, autorización y gestión de tokens JWT', { width: 4680 }),
        cell('Apache 2.0',                   { width: 1560 }),
      ]}),
      new TableRow({ children: [
        cell('Hibernate / JPA',              { width: 3120 }),
        cell('Mapeo objeto-relacional sobre PostgreSQL', { width: 4680 }),
        cell('LGPL',                         { width: 1560 }),
      ]}),
      new TableRow({ children: [
        cell('PostgreSQL 16',                { width: 3120 }),
        cell('Base de datos relacional persistente', { width: 4680 }),
        cell('PostgreSQL',                   { width: 1560 }),
      ]}),
      new TableRow({ children: [
        cell('Maven',                        { width: 3120 }),
        cell('Gestor de dependencias y compilación del backend', { width: 4680 }),
        cell('Apache 2.0',                   { width: 1560 }),
      ]}),
      new TableRow({ children: [
        cell('Node.js 20 + npm',             { width: 3120 }),
        cell('Runtime y gestor de paquetes para el frontend', { width: 4680 }),
        cell('MIT',                          { width: 1560 }),
      ]}),
      new TableRow({ children: [
        cell('Angular 20',                   { width: 3120 }),
        cell('Framework SPA del frontend', { width: 4680 }),
        cell('MIT',                          { width: 1560 }),
      ]}),
      new TableRow({ children: [
        cell('Ionic 8',                      { width: 3120 }),
        cell('Componentes UI mobile-first y plataforma híbrida', { width: 4680 }),
        cell('MIT',                          { width: 1560 }),
      ]}),
      new TableRow({ children: [
        cell('Capacitor 7',                  { width: 3120 }),
        cell('Empaquetado en aplicación nativa Android/iOS', { width: 4680 }),
        cell('MIT',                          { width: 1560 }),
      ]}),
      new TableRow({ children: [
        cell('Docker Desktop + Compose',     { width: 3120 }),
        cell('Contenedorización del entorno completo', { width: 4680 }),
        cell('Apache 2.0',                   { width: 1560 }),
      ]}),
      new TableRow({ children: [
        cell('Visual Studio Code',           { width: 3120 }),
        cell('IDE para frontend, scripts y memoria', { width: 4680 }),
        cell('MIT',                          { width: 1560 }),
      ]}),
      new TableRow({ children: [
        cell('IntelliJ IDEA Community',      { width: 3120 }),
        cell('IDE para el backend Java/Spring', { width: 4680 }),
        cell('Apache 2.0',                   { width: 1560 }),
      ]}),
      new TableRow({ children: [
        cell('DBeaver Community',            { width: 3120 }),
        cell('Cliente gráfico de PostgreSQL para inspección y seed', { width: 4680 }),
        cell('Apache 2.0',                   { width: 1560 }),
      ]}),
      new TableRow({ children: [
        cell('Postman',                      { width: 3120 }),
        cell('Pruebas manuales de la API REST', { width: 4680 }),
        cell('Freemium',                     { width: 1560 }),
      ]}),
      new TableRow({ children: [
        cell('Git + GitHub',                 { width: 3120 }),
        cell('Control de versiones y alojamiento del código', { width: 4680 }),
        cell('GPL/Freemium',                 { width: 1560 }),
      ]}),
      new TableRow({ children: [
        cell('Trello',                       { width: 3120 }),
        cell('Gestión de tareas durante la fase de implementación', { width: 4680 }),
        cell('Freemium',                     { width: 1560 }),
      ]}),
      new TableRow({ children: [
        cell('Coste total de licencias',     { width: 3120, fill: 'F4F8FA', bold: true }),
        cell('0 €', { width: 4680, fill: 'F4F8FA', bold: true }),
        cell('—',                            { width: 1560, fill: 'F4F8FA' }),
      ]}),
    ],
  }),
];

// ═══════════════════════════════════════════════════════════════════════════
// 3. EJECUCIÓN DEL PROYECTO
// ═══════════════════════════════════════════════════════════════════════════
const cap3 = [
  h1('3. Ejecución del proyecto'),

  h2('3.1. Requisitos funcionales y no funcionales'),
  p('Como paso previo a la implementación se ha elaborado un catálogo de requisitos siguiendo la nomenclatura RF-XX para los requisitos funcionales y RNF-XX para los no funcionales.'),

  h3('3.1.1. Requisitos funcionales'),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1200, 8160],
    rows: [
      new TableRow({ children: [ cell('Código', { width: 1200, fill: 'D5E8F0', bold: true }), cell('Descripción', { width: 8160, fill: 'D5E8F0', bold: true }) ]}),
      new TableRow({ children: [ cell('RF-01', { width: 1200, bold: true }), cell('El sistema permitirá registrar nuevos usuarios proporcionando nombre, correo electrónico, contraseña y rol.', { width: 8160 }) ]}),
      new TableRow({ children: [ cell('RF-02', { width: 1200, bold: true }), cell('El sistema permitirá iniciar sesión a usuarios existentes mediante correo y contraseña, devolviendo un access token y un refresh token.', { width: 8160 }) ]}),
      new TableRow({ children: [ cell('RF-03', { width: 1200, bold: true }), cell('Los usuarios autenticados podrán solicitar el siguiente plan no votado mediante el endpoint de swipe, con posibilidad de aplicar filtros.', { width: 8160 }) ]}),
      new TableRow({ children: [ cell('RF-04', { width: 1200, bold: true }), cell('Los usuarios podrán dar «me gusta» o «no me gusta» a un plan; cada voto se persistirá en la base de datos.', { width: 8160 }) ]}),
      new TableRow({ children: [ cell('RF-05', { width: 1200, bold: true }), cell('Los usuarios podrán deshacer su última acción de voto, eliminando el registro correspondiente.', { width: 8160 }) ]}),
      new TableRow({ children: [ cell('RF-06', { width: 1200, bold: true }), cell('Los usuarios podrán consultar el listado de sus planes favoritos en cualquier momento.', { width: 8160 }) ]}),
      new TableRow({ children: [ cell('RF-07', { width: 1200, bold: true }), cell('El sistema ofrecerá los listados completos de ciudades y categorías para alimentar los selectores del filtro.', { width: 8160 }) ]}),
      new TableRow({ children: [ cell('RF-08', { width: 1200, bold: true }), cell('Los usuarios podrán cambiar entre tema claro, oscuro y automático según la preferencia del sistema.', { width: 8160 }) ]}),
      new TableRow({ children: [ cell('RF-09', { width: 1200, bold: true }), cell('La aplicación calculará y mostrará estadísticas individuales: número de favoritos, categoría favorita, ciudad favorita y planes gratuitos.', { width: 8160 }) ]}),
      new TableRow({ children: [ cell('RF-10', { width: 1200, bold: true }), cell('La aplicación incluirá un sistema de logros progresivo desbloqueable conforme el usuario interactúa con planes.', { width: 8160 }) ]}),
      new TableRow({ children: [ cell('RF-11', { width: 1200, bold: true }), cell('Los usuarios podrán compartir un plan mediante la Web Share API o, en su defecto, copiando el enlace al portapapeles.', { width: 8160 }) ]}),
      new TableRow({ children: [ cell('RF-12', { width: 1200, bold: true }), cell('La aplicación mostrará un tour de bienvenida la primera vez que un usuario accede al panel principal.', { width: 8160 }) ]}),
    ],
  }),

  h3('3.1.2. Requisitos no funcionales'),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1200, 8160],
    rows: [
      new TableRow({ children: [ cell('Código', { width: 1200, fill: 'D5E8F0', bold: true }), cell('Descripción', { width: 8160, fill: 'D5E8F0', bold: true }) ]}),
      new TableRow({ children: [ cell('RNF-01', { width: 1200, bold: true }), cell('Seguridad: las contraseñas se almacenarán hasheadas con BCrypt y los tokens JWT se firmarán mediante HMAC-SHA256.', { width: 8160 }) ]}),
      new TableRow({ children: [ cell('RNF-02', { width: 1200, bold: true }), cell('Rendimiento: la aplicación responderá a una petición de swipe en menos de 500 ms en condiciones normales de red.', { width: 8160 }) ]}),
      new TableRow({ children: [ cell('RNF-03', { width: 1200, bold: true }), cell('Usabilidad: la interfaz se adaptará a pantallas desde 320 px hasta 4K, con experiencia táctil en móvil y de ratón en escritorio.', { width: 8160 }) ]}),
      new TableRow({ children: [ cell('RNF-04', { width: 1200, bold: true }), cell('Accesibilidad: todos los elementos interactivos dispondrán de aria-label; se respetará prefers-reduced-motion.', { width: 8160 }) ]}),
      new TableRow({ children: [ cell('RNF-05', { width: 1200, bold: true }), cell('Mantenibilidad: el código seguirá las convenciones de Angular (servicios standalone) y Spring (capas Controller-Service-Repository).', { width: 8160 }) ]}),
      new TableRow({ children: [ cell('RNF-06', { width: 1200, bold: true }), cell('Portabilidad: el sistema podrá levantarse en cualquier máquina con Docker Compose mediante un único comando.', { width: 8160 }) ]}),
      new TableRow({ children: [ cell('RNF-07', { width: 1200, bold: true }), cell('Robustez: el backend devolverá errores HTTP semánticamente correctos (401 ante token caducado, 403 ante falta de permisos, 404 ante recurso inexistente).', { width: 8160 }) ]}),
      new TableRow({ children: [ cell('RNF-08', { width: 1200, bold: true }), cell('Internacionalización futura: los textos están centralizados en plantillas, listos para una posible extracción i18n.', { width: 8160 }) ]}),
    ],
  }),

  h2('3.2. Diagrama Entidad-Relación'),
  p('El modelo de datos de Planfy consta de cinco tablas principales relacionadas mediante claves foráneas. La tabla central es planes, que mantiene relaciones N:1 con ciudades y categorias para facilitar la categorización de cada plan. La tabla usuarios se vincula con roles también mediante una relación N:1, y se conecta con planes a través de la tabla intermedia user_like_plan, que materializa una relación N:M y registra la dirección del voto (campo liked booleano) y el momento de su creación.'),
  ...imagen('diag-er.png', 'Figura 1. Diagrama Entidad-Relación de Planfy', { width: 560, height: 380 }),
  p('A continuación se muestra el script DDL simplificado de las tablas principales:'),
  code(`CREATE TABLE roles (
    id   BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE usuarios (
    id        BIGSERIAL PRIMARY KEY,
    nombre    VARCHAR(100) NOT NULL,
    email     VARCHAR(150) UNIQUE NOT NULL,
    password  VARCHAR(255) NOT NULL,
    role_id   BIGINT REFERENCES roles(id)
);

CREATE TABLE ciudades    ( id BIGSERIAL PK, nombre VARCHAR(80) UNIQUE );
CREATE TABLE categorias  ( id BIGSERIAL PK, nombre VARCHAR(80) UNIQUE );

CREATE TABLE planes (
    id             BIGSERIAL PRIMARY KEY,
    nombre         VARCHAR(150) NOT NULL,
    descripcion    VARCHAR(1000),
    duracion       DOUBLE PRECISION,
    gratuito       BOOLEAN,
    precio         DOUBLE PRECISION,
    latitud        DOUBLE PRECISION,
    longitud       DOUBLE PRECISION,
    imagen_url     VARCHAR(500),
    ciudad_id      BIGINT REFERENCES ciudades(id),
    categoria_id   BIGINT REFERENCES categorias(id)
);

CREATE TABLE user_like_plan (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT REFERENCES usuarios(id),
    plan_id    BIGINT REFERENCES planes(id),
    liked      BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, plan_id)
);`),

  h2('3.3. Casos de uso'),
  p('Se han identificado tres actores principales —Usuario anónimo, Usuario autenticado y Administrador— y los siguientes casos de uso que abarcan la totalidad de las funcionalidades del sistema:'),
  bullet('CU-01 Registrarse en la plataforma (actor: Usuario anónimo).'),
  bullet('CU-02 Iniciar sesión (actor: Usuario anónimo).'),
  bullet('CU-03 Ver siguiente plan según preferencias y filtros (Usuario autenticado).'),
  bullet('CU-04 Dar «me gusta» o «no me gusta» a un plan (Usuario autenticado).'),
  bullet('CU-05 Consultar listado de favoritos (Usuario autenticado).'),
  bullet('CU-06 Eliminar un plan de favoritos (Usuario autenticado).'),
  bullet('CU-07 Ver detalles ampliados de un plan (Usuario autenticado).'),
  bullet('CU-08 Compartir un plan (Usuario autenticado).'),
  bullet('CU-09 Cambiar el tema de la aplicación (Usuario autenticado).'),
  bullet('CU-10 Cerrar sesión (Usuario autenticado).'),
  bullet('CU-11 Gestionar el catálogo de planes —alta, modificación, baja— (Administrador, ampliación futura).'),
  ...imagen('diag-casos_uso.png', 'Figura 2. Diagrama de casos de uso', { width: 560, height: 360 }),

  h2('3.4. Diagrama de clases'),
  p('El diagrama de clases del backend refleja la separación clásica en capas Controller-Service-Repository propia de Spring. Las entidades JPA (Plan, Ciudad, Categoria, Usuario, Rol, UserLikePlan) representan las tablas de la base de datos. Los servicios (PlanService, LikeService, AuthService, JwtService) encapsulan la lógica de negocio. Los controladores (PlanController, LikeController, AuthController, MetaController) exponen los endpoints REST. Finalmente, los componentes de seguridad (JwtAuthenticationFilter, SecurityConfig, CustomUserDetailsService) gestionan la autenticación.'),
  ...imagen('diag-clases.png', 'Figura 3. Diagrama de clases del backend', { width: 560, height: 380 }),
  p('En el frontend, la arquitectura sigue el modelo de servicios inyectables y componentes standalone propios de Angular 17+. Los servicios principales son AuthService, PlanService, MetaService, ImageService, ProgressService y ThemeService. Los componentes de página (LoginPage, DashboardPage, FavoritesPage, AccountPage) consumen estos servicios mediante inyección con la función inject.'),
  ...imagen('diag-clases.png', 'Figura 4. Relación entre páginas y servicios del frontend (mismo modelo conceptual)', { width: 560, height: 380 }),

  h2('3.5. Documentación técnica'),

  h3('3.5.1. Arquitectura general del sistema'),
  p('Planfy se asienta sobre una arquitectura de tres capas perfectamente desacopladas que se comunican mediante protocolos estándar (HTTP/JSON entre frontend y backend, JDBC entre backend y base de datos). Esta separación garantiza que cualquiera de las tres capas pueda ser sustituida —por ejemplo, intercambiando Angular por React en el cliente, o PostgreSQL por MySQL en la persistencia— sin afectar al resto del sistema.'),
  ...imagen('diag-arquitectura.png', 'Figura 5. Arquitectura de tres capas desacopladas', { width: 600, height: 220 }),

  h3('3.5.2. Base de datos'),
  p('La persistencia se ha implementado en PostgreSQL 16 ejecutándose en un contenedor Docker. Hibernate genera el esquema automáticamente mediante spring.jpa.hibernate.ddl-auto=update y la población inicial se ha realizado mediante el script datos-prueba.sql, que inserta 8 ciudades, 8 categorías y 49 planes con sus correspondientes coordenadas y URLs de imagen procedentes de Wikipedia Commons. El campo imagen_url se añadió en una iteración posterior una vez que se decidió incorporar fotografías reales en las tarjetas, sustituyendo los gradientes por defecto.'),
  ...imagen('14-dbeaver-tabla-planes.png', 'Figura 6. Estructura de la tabla planes en DBeaver. (Pega aquí la captura)', { width: 560, height: 320 }),
  ...imagen('15-dbeaver-select.png', 'Figura 7. Datos reales en la tabla planes. (Pega aquí la captura)', { width: 560, height: 280 }),

  h3('3.5.3. Backend — Spring Boot'),
  p('El backend está estructurado en los paquetes habituales del patrón MVC para REST: controller, service, repository, model, dto y security. Cada controlador delega la lógica en un servicio, que a su vez utiliza los repositorios JPA para acceder a la base de datos.'),
  pRich([
    'Como ejemplo representativo se incluye a continuación el filtro ',
    { text: 'JwtAuthenticationFilter', font: 'Consolas' },
    ', responsable de validar el token JWT en cada petición y, en caso de detectar un token expirado, devolver un código ',
    { text: '401 Unauthorized', font: 'Consolas' },
    ' con un mensaje claro en JSON en lugar de propagar la excepción y producir un error 500. Esta corrección fue clave durante la fase de pruebas, en la que se observó que la primera implementación del filtro permitía que la excepción ',
    { text: 'ExpiredJwtException', font: 'Consolas' },
    ' burbujease hasta el dispatcher, generando un 500 que el frontend no podía gestionar correctamente.',
  ]),
  code(`@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired private JwtService jwtService;
    @Autowired private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String path = req.getServletPath();
        if (path.startsWith("/auth") || path.startsWith("/error")) { chain.doFilter(req, res); return; }

        String header = req.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) { chain.doFilter(req, res); return; }

        String jwt = header.substring(7);
        try {
            String email = jwtService.extractUsername(jwt);
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails ud = userDetailsService.loadUserByUsername(email);
                if (jwtService.isTokenValid(jwt, ud.getUsername())) {
                    var auth = new UsernamePasswordAuthenticationToken(ud, null, ud.getAuthorities());
                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
        } catch (ExpiredJwtException ex) {
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            res.setContentType("application/json");
            res.getWriter().write("{\\"error\\":\\"token_expired\\"}");
            return;
        } catch (JwtException | IllegalArgumentException ex) {
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            res.setContentType("application/json");
            res.getWriter().write("{\\"error\\":\\"invalid_token\\"}");
            return;
        }
        chain.doFilter(req, res);
    }
}`),
  ...imagen('16-intellij-backend.png', 'Figura 8. Estructura del proyecto backend en IntelliJ IDEA. (Pega aquí la captura)', { width: 460, height: 380 }),

  h3('3.5.4. Frontend — Angular y Ionic'),
  p('El frontend se ha desarrollado con Angular 20 e Ionic 8 utilizando exclusivamente componentes standalone, lo que elimina la necesidad de NgModules y simplifica notablemente la organización del código. La estructura sigue las convenciones del CLI de Angular: una carpeta pages para los componentes de pantalla, una carpeta services para los servicios inyectables, una carpeta interceptors para interceptores HTTP y una carpeta guards para los guardas de ruta.'),
  pRich([
    'Como ejemplo se muestra el ',
    { text: 'authInterceptor', font: 'Consolas' },
    ', encargado de inyectar el token JWT en cada petición saliente (excepto en las rutas públicas de autenticación) y de capturar las respuestas 401 para redirigir automáticamente a la pantalla de login. Su correcto registro en ',
    { text: 'main.ts', font: 'Consolas' },
    ' fue otro de los puntos críticos detectados durante las pruebas: la primera versión del proyecto registraba el interceptor en un fichero ',
    { text: 'app.config.ts', font: 'Consolas' },
    ' que no era importado por main.ts, lo que provocaba que ninguna petición autenticada llegase con el header ',
    { text: 'Authorization', font: 'Consolas' },
    '.',
  ]),
  code(`export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(StorageService);
  const router = inject(Router);
  const PUBLIC = ['/auth/login', '/auth/register'];
  const isPublic = PUBLIC.some(p => req.url.includes(p));
  const token = isPublic ? null : storage.getToken();

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: \`Bearer \${token}\` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !isPublic) {
        storage.clearAll();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};`),
  ...imagen('17-vscode-frontend.png', 'Figura 9. Estructura del proyecto frontend en VS Code. (Pega aquí la captura)', { width: 460, height: 380 }),

  h3('3.5.5. Capturas de la aplicación'),
  p('A continuación se incluyen las capturas más representativas de la interfaz, tomadas tanto en modo claro como en modo oscuro y en distintos tamaños de pantalla.'),
  ...imagen('01-login-oscuro.png',                 'Figura 10. Pantalla de inicio de sesión en modo oscuro', { width: 480, height: 380 }),
  ...imagen('02-login-claro.png',                  'Figura 11. La misma pantalla en modo claro: el sistema de temas funciona', { width: 480, height: 380 }),
  ...imagen('03-dashboard-escritorio-claro.png',   'Figura 12. Dashboard principal en escritorio: imagen del plan, badges, descripción y botones de acción', { width: 540, height: 380 }),
  ...imagen('11-dashboard-movil.png',              'Figura 13. Mismo dashboard en móvil (390 × 844 px) — el layout adapta el ancho de la card y compacta la cabecera', { width: 280, height: 580 }),
  ...imagen('05-modal-detalle.png',                'Figura 14. Modal de detalle del plan: imagen hero ampliada, metadatos y acciones (mapa y compartir)', { width: 540, height: 360 }),
  ...imagen('06-filtros-panel.png',                'Figura 15. Panel de filtros desplegado con dropdowns dinámicos de ciudad y categoría', { width: 540, height: 340 }),
  ...imagen('08-favoritos-grid.png',               'Figura 16. Pantalla de favoritos en escritorio con cuadrícula adaptativa de 3 columnas', { width: 540, height: 380 }),
  ...imagen('09-cuenta-completa.png',              'Figura 17. Pantalla de cuenta: avatar, estadísticas, recomendación, selector de tema, logros y acciones', { width: 480, height: 600 }),
  ...imagen('10-onboarding-tour.png',              'Figura 18. Tour de bienvenida en su primer paso (solo se muestra la primera vez tras registrarse)', { width: 540, height: 360 }),

  h2('3.6. Enlaces al repositorio y descarga'),
  p('El código fuente íntegro del proyecto se aloja en GitHub bajo licencia MIT. Cualquier persona con la dirección puede clonar el repositorio, levantar el entorno y comenzar a probar la aplicación en menos de cinco minutos siguiendo el manual de instalación incluido en el capítulo 4.'),
  pRich([ 'Repositorio principal: ', link(GITHUB_URL, GITHUB_URL) ]),
  pRich([ 'Descarga directa (ZIP): ', link(GITHUB_URL + '/archive/refs/heads/main.zip', GITHUB_URL + '/archive/refs/heads/main.zip') ]),
];

// ═══════════════════════════════════════════════════════════════════════════
// 4. DOCUMENTACIÓN DEL SISTEMA
// ═══════════════════════════════════════════════════════════════════════════
const cap4 = [
  h1('4. Documentación del sistema'),

  h2('4.1. Manual de instalación, despliegue y configuración'),
  p('Planfy ha sido diseñado desde el primer momento para ser totalmente reproducible mediante Docker Compose. Esta sección recoge los pasos detallados para levantar el entorno completo en una máquina nueva.'),

  p('Existen dos modos de uso de la aplicación: ejecución local en el equipo del alumno (útil durante el desarrollo) y acceso al despliegue centralizado en el servidor del aula del IES Los Alcores, que es el modo en el que el tutor podrá probar la aplicación durante la corrección.'),

  h3('4.1.1. Requisitos previos'),
  bullet('Docker Desktop instalado (Windows 10/11 con WSL 2, macOS 13+ o cualquier distribución Linux moderna).'),
  bullet('Git instalado para clonar el repositorio.'),
  bullet('Mínimo 4 GB de RAM libres y 5 GB de espacio en disco.'),
  bullet('Conexión a Internet la primera vez (para descargar las imágenes Docker base de PostgreSQL y Eclipse Temurin).'),
  bullet('Puertos 4200, 5444 y 8008 disponibles en localhost.'),

  h3('4.1.2. Pasos de instalación'),
  numbered('Clonar el repositorio: git clone ' + GITHUB_URL + '.git && cd Planfy'),
  numbered('Verificar que Docker Desktop está en ejecución y muestra el icono verde "Engine running".'),
  numbered('Levantar todos los servicios con un único comando: docker compose up -d'),
  numbered('Esperar aproximadamente 60 segundos hasta que el contenedor planfy_backend esté en estado healthy.'),
  numbered('Sembrar la base de datos con los datos de prueba: docker cp datos-prueba.sql planfy_postgres:/tmp/seed.sql && docker exec planfy_postgres psql -U admin -d planfy -f /tmp/seed.sql'),
  numbered('Sembrar también las imágenes de los planes: docker cp seed-imagenes-safe.sql planfy_postgres:/tmp/img.sql && docker exec planfy_postgres psql -U admin -d planfy -f /tmp/img.sql'),
  numbered('Acceder al frontend en http://localhost:4200 y registrar un usuario nuevo o iniciar sesión con las credenciales de prueba (test@planfy.com / test1234).'),

  h3('4.1.3. Despliegue en el servidor del aula'),
  p('Para evitar que el tutor tenga que clonar y levantar el proyecto, el código se ha desplegado en el servidor del aula del centro mediante la misma configuración Docker Compose. El acceso desde la red interna del IES Los Alcores se realiza a través de la IP del servidor en los puertos 4200 (frontend) y 8008 (API). Los datos de prueba ya están sembrados, por lo que tras un nuevo registro o el inicio de sesión con la cuenta de prueba se puede empezar a deslizar planes inmediatamente.'),
  ...imagen('13-docker-compose-ps.png', 'Figura 19. Estado de los tres contenedores Docker tras docker compose up -d', { width: 580, height: 320 }),

  h3('4.1.4. Variables de entorno y configuración'),
  p('Los parámetros principales se definen en el fichero docker-compose.yml. Para un despliegue en producción se recomienda externalizarlos a un fichero .env y modificar los siguientes valores:'),
  bullet('SPRING_DATASOURCE_PASSWORD: cambiar admin_pass por una contraseña fuerte aleatoria.'),
  bullet('JWT_SECRET (en JwtService.java): sustituir la cadena de 32 caracteres por una secreta de al menos 256 bits generada con openssl rand -base64 32.'),
  bullet('CORS allowed-origins: restringir a los dominios reales en lugar de "*".'),

  h3('4.1.5. Detener y limpiar'),
  p('Para detener los contenedores conservando los datos: docker compose stop. Para eliminarlos preservando los volúmenes: docker compose down. Para borrar todo, incluida la base de datos: docker compose down -v.'),

  h2('4.2. Manual de usuario'),
  p('Planfy ha sido pensada para que cualquier persona pueda utilizarla sin necesidad de formación previa. Los siguientes apartados describen las acciones disponibles desde la perspectiva del usuario final.'),

  h3('4.2.1. Registro y acceso'),
  p('Al acceder por primera vez se presenta una pantalla con dos opciones: iniciar sesión o registrar una cuenta nueva mediante el enlace «¿No tienes cuenta? Regístrate gratis». El registro requiere nombre, correo y contraseña (mínimo seis caracteres). Tras un registro exitoso, el usuario es redirigido automáticamente al panel principal y no necesita iniciar sesión nuevamente.'),
  ...imagen('02-login-claro.png', 'Figura 20. Formulario de inicio de sesión (la cara posterior de la flip-card contiene el formulario de registro)', { width: 480, height: 380 }),

  h3('4.2.2. Descubrimiento de planes (swipe)'),
  p('La pantalla principal muestra una tarjeta con la información del plan actual. El usuario puede deslizar la tarjeta hacia la derecha para indicar que le gusta o hacia la izquierda para descartarlo; alternativamente puede pulsar los botones inferiores con un corazón o una equis. También están disponibles las flechas izquierda y derecha del teclado. El icono de información (ⓘ) abre un modal con los detalles ampliados del plan.'),
  ...imagen('04-dashboard-escritorio-oscuro.png', 'Figura 21. Dashboard en modo oscuro mostrando todos los controles disponibles', { width: 540, height: 380 }),

  h3('4.2.3. Filtros y búsqueda'),
  p('El icono de filtros (deslizadores horizontales) en la esquina superior derecha despliega un panel con tres controles: ciudad, categoría y precio máximo. Aplicar cualquier filtro provoca que la siguiente card mostrada respete las restricciones. La barra de búsqueda (icono de lupa) permite escribir libremente; si el texto coincide con una ciudad o una categoría, se aplica automáticamente como filtro.'),
  ...imagen('07-busqueda-panel.png', 'Figura 22. Barra de búsqueda inteligente que detecta automáticamente ciudades y categorías', { width: 540, height: 320 }),

  h3('4.2.4. Favoritos'),
  p('Todos los planes a los que se les ha dado «me gusta» aparecen automáticamente en la pestaña Favoritos del menú inferior. Esta pantalla muestra una cuadrícula adaptativa (1 columna en móvil, 2 en tablet, 3 en escritorio y hasta 4 en pantallas anchas) con cards que incluyen la imagen, el nombre, el precio, una breve descripción y los chips de duración y ciudad. Para eliminar un favorito basta con pulsar el icono de corazón tachado en la esquina superior derecha de la card.'),
  ...imagen('08-favoritos-grid.png', 'Figura 23. Cuadrícula de favoritos en pantalla amplia', { width: 540, height: 380 }),

  h3('4.2.5. Cuenta y personalización'),
  p('La pestaña Cuenta presenta el avatar del usuario, su correo electrónico y cuatro tarjetas de estadísticas: Favoritos, Categoría top, Ciudad top y Gratuitos. Las dos centrales son interactivas: al pulsarlas, se vuelve al dashboard con el filtro correspondiente preaplicado. Más abajo se encuentra el selector de tema (Claro / Oscuro / Auto), la información de sesión y el botón Cerrar sesión.'),
  ...imagen('09-cuenta-completa.png', 'Figura 24. Pantalla completa de cuenta con todas sus secciones', { width: 480, height: 600 }),

  h2('4.3. Enlace a la presentación'),
  p('La presentación de defensa del proyecto, con un mínimo de 15 diapositivas, se encuentra disponible en formato Google Slides en el enlace siguiente:'),
  pRich([ 'Presentación: ', link('[ENLACE_PRESENTACION]', 'https://docs.google.com/presentation/d/[ID]') ]),
];

// ═══════════════════════════════════════════════════════════════════════════
// 5. CONCLUSIONES
// ═══════════════════════════════════════════════════════════════════════════
const cap5 = [
  h1('5. Conclusiones finales'),

  h2('5.1. Tiempo estimado y tiempo empleado'),
  p('La planificación inicial estimaba un esfuerzo total de aproximadamente 100 horas distribuidas a lo largo del segundo trimestre. La realidad ha superado ligeramente esa cifra debido principalmente a la fase de pruebas y depuración, donde aparecieron incidencias inesperadas (registro del interceptor en main.ts en lugar de app.config.ts, manejo de excepciones JWT en el filtro, validación rigurosa de URLs de imagen, etcétera). La siguiente tabla compara las estimaciones con los tiempos reales:'),

  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [4680, 2340, 2340],
    rows: [
      new TableRow({ children: [
        cell('Fase', { width: 4680, fill: 'D5E8F0', bold: true }),
        cell('Estimado (h)', { width: 2340, fill: 'D5E8F0', bold: true, align: AlignmentType.CENTER }),
        cell('Empleado (h)', { width: 2340, fill: 'D5E8F0', bold: true, align: AlignmentType.CENTER }),
      ]}),
      new TableRow({ children: [
        cell('Análisis y diseño',                             { width: 4680 }),
        cell('15',                                            { width: 2340, align: AlignmentType.CENTER }),
        cell('14',                                            { width: 2340, align: AlignmentType.CENTER }),
      ]}),
      new TableRow({ children: [
        cell('Implementación backend (Spring Boot, BBDD, JWT)', { width: 4680 }),
        cell('30',                                            { width: 2340, align: AlignmentType.CENTER }),
        cell('38',                                            { width: 2340, align: AlignmentType.CENTER }),
      ]}),
      new TableRow({ children: [
        cell('Implementación frontend (Angular, Ionic, UI)',  { width: 4680 }),
        cell('40',                                            { width: 2340, align: AlignmentType.CENTER }),
        cell('56',                                            { width: 2340, align: AlignmentType.CENTER }),
      ]}),
      new TableRow({ children: [
        cell('Pruebas, despliegue Docker y depuración',       { width: 4680 }),
        cell('10',                                            { width: 2340, align: AlignmentType.CENTER }),
        cell('14',                                            { width: 2340, align: AlignmentType.CENTER }),
      ]}),
      new TableRow({ children: [
        cell('Documentación y memoria',                       { width: 4680 }),
        cell('15',                                            { width: 2340, align: AlignmentType.CENTER }),
        cell('12',                                            { width: 2340, align: AlignmentType.CENTER }),
      ]}),
      new TableRow({ children: [
        cell('TOTAL',                                         { width: 4680, fill: 'F4F8FA', bold: true }),
        cell('110',                                           { width: 2340, fill: 'F4F8FA', bold: true, align: AlignmentType.CENTER }),
        cell('134',                                           { width: 2340, fill: 'F4F8FA', bold: true, align: AlignmentType.CENTER }),
      ]}),
    ],
  }),

  h2('5.2. Grado de cumplimiento de los objetivos'),
  p('La totalidad de los requisitos funcionales formulados en el apartado 3.1 se ha implementado y validado, con la única excepción del CU-11 (panel administrativo de gestión del catálogo) que se planteó como ampliación futura. Los doce requisitos no funcionales también se cumplen: la aplicación responde con tiempos por debajo de los 500 ms para las peticiones de swipe, las contraseñas se almacenan hasheadas con BCrypt, el diseño responsivo funciona desde 320 px hasta 4K, y todo el entorno se levanta con un único comando Docker Compose.'),
  p('Adicionalmente, durante el desarrollo se han añadido funcionalidades no contempladas inicialmente que enriquecen la experiencia: el sistema de logros, las recomendaciones inteligentes basadas en categoría favorita, el tour de bienvenida y la integración de imágenes temáticas reales procedentes de Wikipedia Commons. La sustitución de las URLs aleatorias originales por imágenes verificadas de fuentes moderadas garantiza la idoneidad del contenido visual.'),

  h2('5.3. Propuestas de modificaciones y ampliaciones futuras'),
  p('A partir de la experiencia adquirida durante el desarrollo y de las observaciones recibidas durante las pruebas, se proponen las siguientes líneas de evolución para una segunda fase del proyecto:'),
  bullet('Implementar el panel administrativo CU-11 para que un usuario con rol ADMIN pueda crear, editar y eliminar planes desde el navegador, sustituyendo el actual seed manual.'),
  bullet('Añadir geolocalización mediante la API de Capacitor Geolocation, de manera que el dashboard ofrezca «Planes a menos de X km de mi posición actual» calculando distancias mediante la fórmula del haversine.'),
  bullet('Incorporar un sistema de reseñas y puntuaciones, con valoración media por plan visible en la card y lista de comentarios de otros usuarios.'),
  bullet('Desarrollar un módulo social que permita seguir a otros usuarios y descubrir planes en común («matches»), inspirado en aplicaciones como Bumble Friends.'),
  bullet('Migrar la autenticación a OAuth 2.0 con proveedores de identidad externos (Google, Apple) para reducir la fricción del registro.'),
  bullet('Habilitar notificaciones push mediante Capacitor Local Notifications para recordar planes guardados o sugerir nuevos planes según los intereses del usuario.'),
  bullet('Empaquetar y publicar la versión Android en la Google Play Store mediante el módulo Capacitor ya configurado.'),
  bullet('Implementar internacionalización (es, en, ca, eu) extrayendo todos los textos a ficheros de traducción.'),
  bullet('Desplegar el backend en un VPS público con HTTPS gestionado por Let\u2019s Encrypt y un dominio personalizado.'),
];

// ═══════════════════════════════════════════════════════════════════════════
// 6. BIBLIOGRAFÍA Y WEBGRAFÍA
// ═══════════════════════════════════════════════════════════════════════════
const cap6 = [
  h1('6. Bibliografía y Webgrafía'),
  p('Las fuentes consultadas durante el desarrollo del proyecto se recogen a continuación siguiendo, en la medida de lo posible, las normas de citación APA 7ª edición. Se distinguen dos categorías: documentación oficial de los frameworks empleados y artículos técnicos o vídeos de apoyo.'),

  h3('Documentación oficial'),
  pRich([ 'Spring. (2025). ', { italics: true, text: 'Spring Boot Reference Documentation. ' }, link('https://docs.spring.io/spring-boot/docs/current/reference/html/', 'https://docs.spring.io/spring-boot/docs/current/reference/html/') ]),
  pRich([ 'Spring. (2025). ', { italics: true, text: 'Spring Security Reference. ' }, link('https://docs.spring.io/spring-security/reference/', 'https://docs.spring.io/spring-security/reference/') ]),
  pRich([ 'Google. (2025). ', { italics: true, text: 'Angular Documentation. ' }, link('https://angular.dev', 'https://angular.dev') ]),
  pRich([ 'Ionic. (2025). ', { italics: true, text: 'Ionic Framework Documentation. ' }, link('https://ionicframework.com/docs', 'https://ionicframework.com/docs') ]),
  pRich([ 'Capacitor. (2025). ', { italics: true, text: 'Capacitor Documentation. ' }, link('https://capacitorjs.com/docs', 'https://capacitorjs.com/docs') ]),
  pRich([ 'PostgreSQL Global Development Group. (2025). ', { italics: true, text: 'PostgreSQL 16 Documentation. ' }, link('https://www.postgresql.org/docs/16/', 'https://www.postgresql.org/docs/16/') ]),
  pRich([ 'Docker, Inc. (2025). ', { italics: true, text: 'Docker Compose Specification. ' }, link('https://docs.docker.com/compose/', 'https://docs.docker.com/compose/') ]),
  pRich([ 'JJWT. (2024). ', { italics: true, text: 'Java JWT — JSON Web Token for Java. ' }, link('https://github.com/jwtk/jjwt', 'https://github.com/jwtk/jjwt') ]),

  h3('Recursos didácticos consultados'),
  pRich([ 'Mozilla. (2025). ', { italics: true, text: 'MDN Web Docs — JavaScript & Web APIs. ' }, link('https://developer.mozilla.org/', 'https://developer.mozilla.org/') ]),
  pRich([ 'Baeldung. (2024). ', { italics: true, text: 'Spring Security with JWT Authentication. ' }, link('https://www.baeldung.com/spring-security-oauth-jwt', 'https://www.baeldung.com/spring-security-oauth-jwt') ]),
  pRich([ 'Wikimedia Foundation. (2025). ', { italics: true, text: 'Wikimedia Commons. Banco de imágenes libres con licencia. ' }, link('https://commons.wikimedia.org', 'https://commons.wikimedia.org') ]),
  pRich([ 'OpenStreetMap Foundation. (2025). ', { italics: true, text: 'OpenStreetMap. ' }, link('https://www.openstreetmap.org/', 'https://www.openstreetmap.org/') ]),

  h3('Materiales del ciclo'),
  bullet('Apuntes y prácticas del módulo Bases de Datos (1.º DAW).'),
  bullet('Apuntes y prácticas del módulo Programación (1.º DAW).'),
  bullet('Apuntes y prácticas del módulo Lenguajes de Marcas y Sistemas de Gestión de Información (1.º DAW).'),
  bullet('Apuntes y prácticas del módulo Entornos de Desarrollo (1.º DAW).'),
  bullet('Apuntes y prácticas del módulo Sistemas Informáticos (1.º DAW).'),
  bullet('Apuntes y prácticas del módulo Desarrollo Web en Entorno Servidor (2.º DAW).'),
  bullet('Apuntes y prácticas del módulo Desarrollo Web en Entorno Cliente (2.º DAW).'),
  bullet('Apuntes y prácticas del módulo Diseño de Interfaces Web (2.º DAW).'),
  bullet('Apuntes y prácticas del módulo Despliegue de Aplicaciones Web (2.º DAW).'),
];

// ═══════════════════════════════════════════════════════════════════════════
// MONTAJE DEL DOCUMENTO
// ═══════════════════════════════════════════════════════════════════════════
const doc = new Document({
  creator: PLACEHOLDER_NAME,
  title: PROJECT_TITLE,
  description: 'Memoria del Proyecto Intermodular del CFGS Desarrollo de Aplicaciones Web',
  styles: {
    default: { document: { run: { font: FONT, size: SIZE } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: SIZE_H1, bold: true, font: FONT, color: BRAND_BLUE },
        paragraph: { spacing: { before: 360, after: 240 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: SIZE_H2, bold: true, font: FONT, color: BRAND_BLUE },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: SIZE_H3, bold: true, font: FONT, color: '333333' },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: 'bullets',
        levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: 'numbers',
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ],
  },
  sections: [
    // SECCIÓN 1: PORTADA (sin encabezado ni pie)
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children: portada,
    },
    // SECCIÓN 2: CONTENIDO (con encabezado y pie de página)
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          pageNumbers: { start: 1 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BRAND_BLUE, space: 4 } },
            tabStops: [{ type: TabStopType.RIGHT, position: 9000 }],
            children: [
              new TextRun({ text: PLACEHOLDER_NAME, font: FONT, size: 20, color: '555555' }),
              new TextRun({ text: '\t' + PROJECT_TITLE, font: FONT, size: 20, color: BRAND_BLUE, italics: true }),
            ],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'Página ', font: FONT, size: 20, color: '777777' }),
              new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 20, bold: true, color: BRAND_BLUE }),
              new TextRun({ text: ' de ', font: FONT, size: 20, color: '777777' }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT, size: 20, color: '777777' }),
            ],
          })],
        }),
      },
      children: [
        ...indice,
        ...cap2,
        ...cap3,
        ...cap4,
        ...cap5,
        ...cap6,
      ],
    },
  ],
});

Packer.toBuffer(doc).then(buf => {
  const out = path.join(__dirname, 'Planfy-Memoria-TFG.docx');
  fs.writeFileSync(out, buf);
  const sizeKB = (buf.length / 1024).toFixed(1);
  console.log(`✅ Generada: ${out}  (${sizeKB} KB)`);
}).catch(err => { console.error('❌ Error:', err); process.exit(1); });
