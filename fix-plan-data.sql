-- Planfy local data repair.
-- Keeps plan ids stable, fixes city/category links, assigns curated images,
-- and removes unused duplicated metadata created by older seed scripts.

BEGIN;

-- Canonical cities used by current plans.
INSERT INTO ciudades (nombre)
SELECT v.nombre
FROM (VALUES
  ('Madrid'),
  ('Barcelona'),
  ('Valencia'),
  ('Sevilla'),
  ('Málaga'),
  ('Bilbao'),
  ('Granada'),
  ('Zaragoza'),
  ('Mallorca')
) AS v(nombre)
WHERE NOT EXISTS (SELECT 1 FROM ciudades c WHERE c.nombre = v.nombre);

-- Canonical categories shown in the app.
INSERT INTO categorias (nombre)
SELECT v.nombre
FROM (VALUES
  ('Ocio'),
  ('Cultura'),
  ('Gastronomía'),
  ('Deporte'),
  ('Naturaleza'),
  ('Ocio nocturno'),
  ('Arte'),
  ('Música'),
  ('Aventura')
) AS v(nombre)
WHERE NOT EXISTS (SELECT 1 FROM categorias c WHERE c.nombre = v.nombre);

CREATE TEMP TABLE plan_repair (
  nombre text PRIMARY KEY,
  ciudad text NOT NULL,
  categoria text NOT NULL,
  imagen_url text NOT NULL
) ON COMMIT DROP;

INSERT INTO plan_repair (nombre, ciudad, categoria, imagen_url) VALUES
('Tapas por el centro', 'Madrid', 'Gastronomía', 'https://commons.wikimedia.org/wiki/Special:FilePath/Tapas_in_Sevilla.jpg?width=800'),
('Tour por el casco antiguo', 'Madrid', 'Cultura', 'https://commons.wikimedia.org/wiki/Special:FilePath/Plaza_Mayor_de_Madrid_06.jpg?width=800'),
('Ruta gastronómica por Sevilla', 'Sevilla', 'Gastronomía', 'https://commons.wikimedia.org/wiki/Special:FilePath/Tapas_in_Sevilla.jpg?width=800'),
('Visita al Museo del Prado', 'Madrid', 'Cultura', 'https://commons.wikimedia.org/wiki/Special:FilePath/Museo_del_Prado_2016_(25185969599).jpg?width=800'),
('Ruta por el Parque del Retiro', 'Madrid', 'Naturaleza', 'https://commons.wikimedia.org/wiki/Special:FilePath/Palacio_de_Cristal.jpg?width=800'),
('Tapas por el barrio de La Latina', 'Madrid', 'Gastronomía', 'https://commons.wikimedia.org/wiki/Special:FilePath/Tapas_in_Sevilla.jpg?width=800'),
('Visita a la Sagrada Familia', 'Barcelona', 'Cultura', 'https://commons.wikimedia.org/wiki/Special:FilePath/La_Sagrada_Familia_Barcelona.jpg?width=800'),
('Ruta por el Barrio Gótico', 'Barcelona', 'Cultura', 'https://commons.wikimedia.org/wiki/Special:FilePath/Catedral_de_Barcelona_(9248804702).jpg?width=800'),
('Senderismo en la Serra de Tramuntana', 'Mallorca', 'Naturaleza', 'https://commons.wikimedia.org/wiki/Special:FilePath/SerraTramuntana2.jpg?width=800'),
('Noche en el Barrio del Carmen', 'Valencia', 'Ocio nocturno', 'https://commons.wikimedia.org/wiki/Special:FilePath/Torres_serrans_abril.jpg?width=800'),
('Paseo por la Alhambra', 'Granada', 'Cultura', 'https://commons.wikimedia.org/wiki/Special:FilePath/Dawn_Charles_V_Palace_Alhambra_Granada_Andalusia_Spain.jpg?width=800'),
('Flamenco en directo en Sevilla', 'Sevilla', 'Música', 'https://commons.wikimedia.org/wiki/Special:FilePath/Woman%20Flamenco%20dancer.jpg?width=800'),
('Surf en Mundaka', 'Bilbao', 'Aventura', 'https://commons.wikimedia.org/wiki/Special:FilePath/Mundaka,_Euskal_Herria.jpg?width=800'),
('Mercado de La Boqueria', 'Barcelona', 'Gastronomía', 'https://commons.wikimedia.org/wiki/Special:FilePath/Barcelona_-_Mercat_de_Sant_Josep_(la_Boqueria)_-_Entrance.jpg?width=800'),
('Escape room temático', 'Madrid', 'Ocio', 'https://commons.wikimedia.org/wiki/Special:FilePath/Escape_room_overhead.jpg?width=800'),
('Kayak por el río Turia', 'Valencia', 'Aventura', 'https://commons.wikimedia.org/wiki/Special:FilePath/Kayak%20Playboat%20ManchesterNH.jpg?width=800'),
('Visita al Guggenheim Bilbao', 'Bilbao', 'Arte', 'https://commons.wikimedia.org/wiki/Special:FilePath/Museo_Guggenheim,_Bilbao_(31273245344).jpg?width=800'),
('Cicloturismo por la Costa Brava', 'Barcelona', 'Deporte', 'https://commons.wikimedia.org/wiki/Special:FilePath/Costa_Brava_Calas.JPG?width=800'),
('Escape Room Madrid', 'Madrid', 'Ocio', 'https://commons.wikimedia.org/wiki/Special:FilePath/Escape_room_overhead.jpg?width=800'),
('Bolera Retro', 'Madrid', 'Ocio', 'https://commons.wikimedia.org/wiki/Special:FilePath/Bowling_pins.jpg?width=800'),
('Parque de Atracciones', 'Madrid', 'Ocio', 'https://commons.wikimedia.org/wiki/Special:FilePath/Roller_coaster_(Toverland).jpg?width=800'),
('Museo del Prado', 'Madrid', 'Cultura', 'https://commons.wikimedia.org/wiki/Special:FilePath/Museo_del_Prado_2016_(25185969599).jpg?width=800'),
('Paseo Literario', 'Madrid', 'Cultura', 'https://commons.wikimedia.org/wiki/Special:FilePath/Reading_old_book.jpg?width=800'),
('Flamenco en Corral de la Morería', 'Madrid', 'Cultura', 'https://commons.wikimedia.org/wiki/Special:FilePath/Flamenco_in_Madrid_03.jpg?width=800'),
('Ruta de Tapas por Malasaña', 'Madrid', 'Gastronomía', 'https://commons.wikimedia.org/wiki/Special:FilePath/Tapas_in_Sevilla.jpg?width=800'),
('Mercado de San Miguel', 'Madrid', 'Gastronomía', 'https://commons.wikimedia.org/wiki/Special:FilePath/Mercado_de_San_Miguel_2025.jpg?width=800'),
('Clase de Cocina Española', 'Madrid', 'Gastronomía', 'https://commons.wikimedia.org/wiki/Special:FilePath/Paella_de_marisco_01_(cropped)_4.3.jpg?width=800'),
('Karting Indoor', 'Madrid', 'Deporte', 'https://commons.wikimedia.org/wiki/Special:FilePath/Karting_at_Le_Mans.jpg?width=800'),
('Escalada Boulder', 'Madrid', 'Deporte', 'https://commons.wikimedia.org/wiki/Special:FilePath/Bouldering_by_Gleb_Kalinin.jpg?width=800'),
('Yoga en el Retiro', 'Madrid', 'Deporte', 'https://commons.wikimedia.org/wiki/Special:FilePath/Yoga_at_a_gym.JPG?width=800'),
('Parque de Tirolinas', 'Madrid', 'Aventura', 'https://commons.wikimedia.org/wiki/Special:FilePath/Zip-line_Eden_Project.jpg?width=800'),
('Paintball', 'Madrid', 'Aventura', 'https://commons.wikimedia.org/wiki/Special:FilePath/Paintball_player.jpg?width=800'),
('Cines Kinépolis', 'Valencia', 'Ocio', 'https://commons.wikimedia.org/wiki/Special:FilePath/Sala_de_cine.jpg?width=800'),
('Bioparc Valencia', 'Valencia', 'Ocio', 'https://commons.wikimedia.org/wiki/Special:FilePath/Bioparc_Valencia_II_(2787453634).jpg?width=800'),
('Ciudad de las Artes y las Ciencias', 'Valencia', 'Cultura', 'https://commons.wikimedia.org/wiki/Special:FilePath/Ciutat_de_les_Arts_i_les_Ci%C3%A8ncies.jpg?width=800'),
('Teatro Principal', 'Valencia', 'Cultura', 'https://commons.wikimedia.org/wiki/Special:FilePath/Teatro_Principal_de_Valencia.jpg?width=800'),
('Lonja de la Seda', 'Valencia', 'Cultura', 'https://commons.wikimedia.org/wiki/Special:FilePath/Lonja%20de%20la%20Seda,%20Valencia,%20Espa%C3%B1a,%202014-06-29,%20DD%2022.JPG?width=800'),
('Paella Valenciana Auténtica', 'Valencia', 'Gastronomía', 'https://commons.wikimedia.org/wiki/Special:FilePath/01_Paella_Valenciana_original.jpg?width=800'),
('Ruta de la Horchata', 'Valencia', 'Gastronomía', 'https://commons.wikimedia.org/wiki/Special:FilePath/Vaso_de_horchata.jpg?width=800'),
('Surf en la Malvarrosa', 'Valencia', 'Deporte', 'https://commons.wikimedia.org/wiki/Special:FilePath/Playa_de_la_Malvarrosa_(Valencia)_01.jpg?width=800'),
('Alquiler de Bicicletas', 'Valencia', 'Deporte', 'https://commons.wikimedia.org/wiki/Special:FilePath/Bicycle_in_Amsterdam.jpg?width=800'),
('Park Güell', 'Barcelona', 'Ocio', 'https://commons.wikimedia.org/wiki/Special:FilePath/G%C3%BCell_BCN_edited.jpg?width=800'),
('Acuario de Barcelona', 'Barcelona', 'Ocio', 'https://commons.wikimedia.org/wiki/Special:FilePath/LAquarium-Barcelona.jpg?width=800'),
('Sagrada Familia', 'Barcelona', 'Cultura', 'https://commons.wikimedia.org/wiki/Special:FilePath/Sagrada_Familia_Barcelona.jpg?width=800'),
('Museo Picasso', 'Barcelona', 'Cultura', 'https://commons.wikimedia.org/wiki/Special:FilePath/Museu-Picasso_Barcelona.jpg?width=800'),
('Casa Batlló', 'Barcelona', 'Cultura', 'https://commons.wikimedia.org/wiki/Special:FilePath/Casa_Batll%C3%B3,_Antoni_Gaud%C3%AD.jpg?width=800'),
('Tapas en el Born', 'Barcelona', 'Gastronomía', 'https://commons.wikimedia.org/wiki/Special:FilePath/Passeig_del_Born_Barcelona_Catalonia.JPG?width=800'),
('Mercado de la Boquería', 'Barcelona', 'Gastronomía', 'https://commons.wikimedia.org/wiki/Special:FilePath/Barcelona_-_Mercat_de_Sant_Josep_(la_Boqueria)_-_Entrance.jpg?width=800'),
('Patinaje en Barcelona', 'Barcelona', 'Deporte', 'https://commons.wikimedia.org/wiki/Special:FilePath/Roller-skate.jpg?width=800'),
('Senderismo en Collserola', 'Barcelona', 'Naturaleza', 'https://commons.wikimedia.org/wiki/Special:FilePath/Senderismo-GR-11-Prineos.jpg?width=800'),
('Paracaidismo Indoor', 'Barcelona', 'Aventura', 'https://commons.wikimedia.org/wiki/Special:FilePath/Indoor_skydiving_-_Frankfurt.jpg?width=800'),
('Escalada en Montserrat', 'Barcelona', 'Aventura', 'https://commons.wikimedia.org/wiki/Special:FilePath/Montserrat-aire.jpg?width=800');

UPDATE planes p
SET
  ciudad_id = (SELECT MIN(c.id) FROM ciudades c WHERE c.nombre = r.ciudad),
  categoria_id = (SELECT MIN(ca.id) FROM categorias ca WHERE ca.nombre = r.categoria),
  imagen_url = r.imagen_url
FROM plan_repair r
WHERE p.nombre = r.nombre;

-- Remove duplicated metadata rows that are no longer referenced.
DELETE FROM ciudades c
WHERE c.id NOT IN (SELECT MIN(c2.id) FROM ciudades c2 GROUP BY c2.nombre)
  AND NOT EXISTS (SELECT 1 FROM planes p WHERE p.ciudad_id = c.id);

DELETE FROM categorias c
WHERE c.id NOT IN (SELECT MIN(c2.id) FROM categorias c2 GROUP BY c2.nombre)
  AND NOT EXISTS (SELECT 1 FROM planes p WHERE p.categoria_id = c.id);

CREATE UNIQUE INDEX IF NOT EXISTS uq_ciudades_nombre ON ciudades (nombre);
CREATE UNIQUE INDEX IF NOT EXISTS uq_categorias_nombre ON categorias (nombre);

COMMIT;
