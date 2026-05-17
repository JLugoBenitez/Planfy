-- ─────────────────────────────────────────────────────────────
-- PLANFY - Datos de prueba
-- Ejecutar una vez con el backend ya iniciado (tablas creadas)
-- ─────────────────────────────────────────────────────────────

-- Roles (OBLIGATORIO antes de registrarse)
INSERT INTO roles (name) VALUES ('USER') ON CONFLICT DO NOTHING;
INSERT INTO roles (name) VALUES ('ADMIN') ON CONFLICT DO NOTHING;

-- Ciudades
INSERT INTO ciudades (nombre) VALUES
  ('Madrid'),
  ('Barcelona'),
  ('Valencia'),
  ('Sevilla'),
  ('Málaga'),
  ('Bilbao'),
  ('Granada'),
  ('Zaragoza')
ON CONFLICT DO NOTHING;

-- Categorías
INSERT INTO categorias (nombre) VALUES
  ('Cultura'),
  ('Naturaleza'),
  ('Gastronomía'),
  ('Deporte'),
  ('Ocio nocturno'),
  ('Arte'),
  ('Música'),
  ('Aventura')
ON CONFLICT DO NOTHING;

-- Planes de ejemplo
INSERT INTO planes (nombre, descripcion, duracion, gratuito, precio, latitud, longitud, ciudad_id, categoria_id) VALUES
  ('Visita al Museo del Prado', 'Recorre las colecciones más importantes del arte europeo en el museo más visitado de España.', 3.0, false, 15.0, 40.4138, -3.6921, 1, 1),
  ('Ruta por el Parque del Retiro', 'Paseo tranquilo por el pulmón verde de Madrid, con barcas en el estanque.', 2.0, true, 0.0, 40.4153, -3.6844, 1, 2),
  ('Tapas por el barrio de La Latina', 'Ruta gastronómica por uno de los barrios con más ambiente y mejores tapas de Madrid.', 2.5, false, 20.0, 40.4112, -3.7077, 1, 3),
  ('Visita a la Sagrada Familia', 'Descubre la obra maestra inacabada de Gaudí, símbolo de Barcelona en todo el mundo.', 2.0, false, 26.0, 41.4036, 2.1744, 2, 6),
  ('Ruta por el Barrio Gótico', 'Explora las calles medievales del centro histórico de Barcelona.', 2.5, true, 0.0, 41.3833, 2.1777, 2, 1),
  ('Senderismo en la Serra de Tramuntana', 'Ruta de montaña con vistas espectaculares al Mediterráneo en Mallorca.', 5.0, true, 0.0, 39.7762, 2.8574, 3, 4),
  ('Noche en el Barrio del Carmen', 'Vive el ambiente nocturno más auténtico de Valencia entre terrazas y bares locales.', 4.0, false, 30.0, 39.4736, -0.3790, 3, 5),
  ('Paseo por la Alhambra', 'Visita el conjunto monumental nazarí más importante del mundo, declarado Patrimonio de la Humanidad.', 3.0, false, 18.0, 37.1760, -3.5881, 7, 1),
  ('Flamenco en directo en Sevilla', 'Espectáculo de flamenco auténtico en uno de los tablaos más famosos de Sevilla.', 2.0, false, 35.0, 37.3861, -5.9930, 4, 7),
  ('Surf en Mundaka', 'Clases de surf en una de las mejores olas de Europa en el País Vasco.', 3.0, false, 45.0, 43.4056, -2.6990, 5, 8),
  ('Mercado de La Boqueria', 'Visita el mercado más famoso de Barcelona y prueba productos frescos locales.', 1.5, true, 0.0, 41.3816, 2.1720, 2, 3),
  ('Escape room temático', 'Pon a prueba tu ingenio con amigos en una experiencia de escape room de 60 minutos.', 1.0, false, 18.0, 40.4168, -3.7038, 1, 5),
  ('Kayak por el río Turia', 'Actividad de kayak por el antiguo cauce del río Turia reconvertido en parque urbano.', 2.0, false, 25.0, 39.4561, -0.3743, 3, 4),
  ('Visita al Guggenheim Bilbao', 'Recorre el museo de arte contemporáneo más impactante de España, obra de Frank Gehry.', 2.5, false, 13.0, 43.2687, -2.9340, 6, 6),
  ('Cicloturismo por la Costa Brava', 'Ruta en bici por los paisajes costeros más bonitos de Cataluña.', 4.0, false, 20.0, 41.9965, 3.2064, 2, 4)
ON CONFLICT DO NOTHING;
