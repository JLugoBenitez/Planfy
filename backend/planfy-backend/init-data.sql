-- Script para poblar la base de datos con datos de prueba
-- Este script se puede ejecutar manualmente después de que las tablas sean creadas por Hibernate

-- Insertar más planes de ejemplo
INSERT INTO planes (nombre, descripcion, duracion, gratuito, precio, latitud, longitud, ciudad_id, categoria_id)
VALUES
-- Madrid - Ocio
('Escape Room Madrid', 'Resuelve enigmas en un escape room temático en el centro de Madrid', 1.5, false, 20.0, 40.4168, -3.7038, 3, 1),
('Bolera Retro', 'Bolos vintage con música de los 80s y comida americana', 2.0, false, 15.0, 40.4215, -3.6904, 3, 1),
('Parque de Atracciones', 'Día de diversión en el parque de atracciones con más de 40 atracciones', 6.0, false, 32.0, 40.4729, -3.7490, 3, 1),

-- Madrid - Cultura
('Museo del Prado', 'Visita guiada al museo más importante de España con obras de Velázquez y Goya', 3.0, true, 0.0, 40.4138, -3.6922, 3, 4),
('Paseo Literario', 'Ruta por el Barrio de las Letras siguiendo los pasos de Cervantes y Lope de Vega', 2.5, true, 0.0, 40.4150, -3.6967, 3, 4),
('Flamenco en Corral de la Morería', 'Show de flamenco en uno de los tablaos más prestigiosos de Madrid', 2.0, false, 45.0, 40.4136, -3.7103, 3, 4),

-- Madrid - Gastronomía
('Ruta de Tapas por Malasaña', 'Descubre los mejores bares y tabernas del barrio más bohemio de Madrid', 3.0, false, 35.0, 40.4281, -3.7042, 3, 2),
('Mercado de San Miguel', 'Degustación de productos gourmet en un mercado histórico', 2.0, false, 25.0, 40.4153, -3.7094, 3, 2),
('Clase de Cocina Española', 'Aprende a cocinar paella y tortilla española con un chef profesional', 4.0, false, 60.0, 40.4234, -3.6992, 3, 2),

-- Madrid - Deportes
('Karting Indoor', 'Carreras de karting en un circuito cubierto con amigos', 1.5, false, 28.0, 40.4473, -3.6843, 3, 3),
('Escalada Boulder', 'Sesión de escalada en rocódromo con diferentes niveles de dificultad', 2.0, false, 12.0, 40.4319, -3.6904, 3, 3),
('Yoga en el Retiro', 'Clase de yoga al aire libre en el Parque del Retiro', 1.5, true, 0.0, 40.4165, -3.6831, 3, 3),

-- Madrid - Aventura
('Parque de Tirolinas', 'Circuito de aventura con tirolinas y puentes colgantes', 3.0, false, 35.0, 40.5134, -3.6231, 3, 5),
('Paintball', 'Batalla de paintball en un campo con escenarios tácticos', 2.5, false, 30.0, 40.3892, -3.7341, 3, 5),

-- Valencia - Ocio
('Cines Kinépolis', 'Última tecnología en cine con pantallas IMAX', 2.5, false, 10.0, 39.4699, -0.3763, 2, 1),
('Bioparc Valencia', 'Zoo de inmersión que recrea hábitats africanos', 4.0, false, 24.0, 39.4805, -0.4109, 2, 1),

-- Valencia - Cultura  
('Ciudad de las Artes y las Ciencias', 'Visita al complejo arquitectónico futurista más emblemático de Valencia', 4.0, false, 8.0, 39.4547, -0.3502, 2, 4),
('Teatro Principal', 'Obra de teatro clásico español', 2.5, false, 18.0, 39.4754, -0.3773, 2, 4),
('Lonja de la Seda', 'Visita al edificio gótico Patrimonio de la Humanidad', 1.5, true, 0.0, 39.4746, -0.3787, 2, 4),

-- Valencia - Gastronomía
('Paella Valenciana Auténtica', 'Aprende a cocinar paella valenciana tradicional con un chef local', 3.5, false, 45.0, 39.4699, -0.3763, 2, 2),
('Ruta de la Horchata', 'Degustación de horchata y fartons en las horchatería más tradicionales', 2.0, false, 15.0, 39.4794, -0.3371, 2, 2),

-- Valencia - Deportes
('Surf en la Malvarrosa', 'Clases de surf en la playa de la Malvarrosa', 2.0, false, 30.0, 39.4822, -0.3257, 2, 3),
('Alquiler de Bicicletas', 'Recorre Valencia en bicicleta por los jardines del Turia', 3.0, false, 10.0, 39.4699, -0.3763, 2, 3),

-- Barcelona - Ocio
('Park Güell', 'Visita al famoso parque diseñado por Gaudí', 2.5, false, 10.0, 41.4145, 2.1527, 1, 1),
('Acuario de Barcelona', 'Explora el mundo marino con túnel de tiburones', 3.0, false, 21.0, 41.3763, 2.1835, 1, 1),

-- Barcelona - Cultura
('Sagrada Familia', 'Visita a la basílica inacabada de Gaudí', 2.0, false, 26.0, 41.4036, 2.1744, 1, 4),
('Museo Picasso', 'Colección de obras de Picasso en el Barrio Gótico', 2.5, false, 12.0, 41.3851, 2.1809, 1, 4),
('Casa Batlló', 'Tour por la casa modernista de Gaudí', 1.5, false, 25.0, 41.3916, 2.1649, 1, 4),

-- Barcelona - Gastronomía
('Tapas en el Born', 'Ruta gastronómica por el barrio del Born', 3.0, false, 40.0, 41.3837, 2.1820, 1, 2),
('Mercado de la Boquería', 'Degustación en el mercado más famoso de Barcelona', 2.0, false, 20.0, 41.3818, 2.1716, 1, 2),

-- Barcelona - Deportes
('Patinaje en Barcelona', 'Alquiler de patines para recorrer el paseo marítimo', 2.0, false, 8.0, 41.3784, 2.1900, 1, 3),
('Senderismo en Collserola', 'Ruta de senderismo con vistas panorámicas de Barcelona', 4.0, true, 0.0, 41.4237, 2.1154, 1, 3),

-- Barcelona - Aventura
('Paracaidismo Indoor', 'Experiencia de caída libre en túnel de viento', 1.0, false, 50.0, 41.3496, 2.1122, 1, 5),
('Escalada en Montserrat', 'Escalada en roca natural en el parque de Montserrat', 5.0, false, 45.0, 41.5931, 1.8378, 1, 5);

-- Asegurarse de que hay ciudades y categorías
INSERT INTO ciudades (nombre) VALUES ('Barcelona'), ('Valencia'), ('Madrid') ON CONFLICT DO NOTHING;
INSERT INTO categorias (nombre) VALUES ('Ocio'), ('Gastronomía'), ('Deportes'), ('Cultura'), ('Aventura') ON CONFLICT DO NOTHING;

-- Crear rol USER si no existe
INSERT INTO roles (name) VALUES ('USER') ON CONFLICT DO NOTHING;
