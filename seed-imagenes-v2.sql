-- ═══════════════════════════════════════════════════════════════════════════
-- PLANFY · Imágenes curadas v2
-- - Wikipedia Commons para landmarks (URL estable, foto oficial)
-- - Unsplash CDN para actividades genéricas (foto real, alta calidad)
-- - Cuando Wikipedia devolvió un thumbnail no relevante, lo sustituyo manualmente.
-- ═══════════════════════════════════════════════════════════════════════════

UPDATE planes SET imagen_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Museo_del_Prado_2016_%2825185969599%29.jpg/800px-Museo_del_Prado_2016_%2825185969599%29.jpg' WHERE id = 1;
UPDATE planes SET imagen_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Palacio_de_Cristal.jpg/800px-Palacio_de_Cristal.jpg' WHERE id = 2;
-- Tapas La Latina: Wikipedia devolvió iglesia → forzamos Unsplash food
UPDATE planes SET imagen_url = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop' WHERE id = 3;
-- Sagrada Familia: Wikipedia devolvió pintura religiosa → forzamos Unsplash sagrada-familia
UPDATE planes SET imagen_url = 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80&auto=format&fit=crop' WHERE id = 4;
UPDATE planes SET imagen_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Catedral_de_Barcelona_%289248804702%29.jpg/800px-Catedral_de_Barcelona_%289248804702%29.jpg' WHERE id = 5;
UPDATE planes SET imagen_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/SerraTramuntana2.jpg/800px-SerraTramuntana2.jpg' WHERE id = 6;
UPDATE planes SET imagen_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Torres_serrans_abril.jpg/800px-Torres_serrans_abril.jpg' WHERE id = 7;
UPDATE planes SET imagen_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Dawn_Charles_V_Palace_Alhambra_Granada_Andalusia_Spain.jpg/800px-Dawn_Charles_V_Palace_Alhambra_Granada_Andalusia_Spain.jpg' WHERE id = 8;
-- Flamenco: Wikipedia devolvió persona random → Unsplash bailaora
UPDATE planes SET imagen_url = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80&auto=format&fit=crop' WHERE id = 9;
UPDATE planes SET imagen_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Mundaka%2C_Euskal_Herria.jpg/800px-Mundaka%2C_Euskal_Herria.jpg' WHERE id = 10;
UPDATE planes SET imagen_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Barcelona_-_Mercat_de_Sant_Josep_%28la_Boqueria%29_-_Entrance.jpg/800px-Barcelona_-_Mercat_de_Sant_Josep_%28la_Boqueria%29_-_Entrance.jpg' WHERE id = 11;
UPDATE planes SET imagen_url = 'https://images.unsplash.com/photo-1551817958-d9d86fb29431?w=800&q=80&auto=format&fit=crop' WHERE id = 12;
UPDATE planes SET imagen_url = 'https://images.unsplash.com/photo-1530870110042-98b2cb110834?w=800&q=80&auto=format&fit=crop' WHERE id = 13;
UPDATE planes SET imagen_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Museo_Guggenheim%2C_Bilbao_%2831273245344%29.jpg/800px-Museo_Guggenheim%2C_Bilbao_%2831273245344%29.jpg' WHERE id = 14;
UPDATE planes SET imagen_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Costa_Brava_Calas.JPG/800px-Costa_Brava_Calas.JPG' WHERE id = 15;
UPDATE planes SET imagen_url = 'https://images.unsplash.com/photo-1551817958-d9d86fb29431?w=800&q=80&auto=format&fit=crop' WHERE id = 16;
UPDATE planes SET imagen_url = 'https://images.unsplash.com/photo-1538677949574-2def2bbe34d3?w=800&q=80&auto=format&fit=crop' WHERE id = 17;
UPDATE planes SET imagen_url = 'https://images.unsplash.com/photo-1599818073506-72d2e57b2451?w=800&q=80&auto=format&fit=crop' WHERE id = 18;
UPDATE planes SET imagen_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Museo_del_Prado_2016_%2825185969599%29.jpg/800px-Museo_del_Prado_2016_%2825185969599%29.jpg' WHERE id = 19;
-- Paseo Literario: Wikipedia "Madrid 20" no específico → Unsplash library
UPDATE planes SET imagen_url = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80&auto=format&fit=crop' WHERE id = 20;
-- Tablao flamenco: Wikipedia devolvió grabado de 1885 → Unsplash flamenco
UPDATE planes SET imagen_url = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80&auto=format&fit=crop' WHERE id = 21;
-- Malasaña tapas: Wikipedia devolvió monumento → Unsplash food
UPDATE planes SET imagen_url = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop' WHERE id = 22;
UPDATE planes SET imagen_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Mercado_de_San_Miguel_2025.jpg/800px-Mercado_de_San_Miguel_2025.jpg' WHERE id = 23;
UPDATE planes SET imagen_url = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop' WHERE id = 24;
UPDATE planes SET imagen_url = 'https://images.unsplash.com/photo-1583900985737-6d0495555783?w=800&q=80&auto=format&fit=crop' WHERE id = 25;
UPDATE planes SET imagen_url = 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&q=80&auto=format&fit=crop' WHERE id = 26;
UPDATE planes SET imagen_url = 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80&auto=format&fit=crop' WHERE id = 27;
UPDATE planes SET imagen_url = 'https://images.unsplash.com/photo-1605125571635-09a1ec068dad?w=800&q=80&auto=format&fit=crop' WHERE id = 28;
UPDATE planes SET imagen_url = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80&auto=format&fit=crop' WHERE id = 29;
UPDATE planes SET imagen_url = 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80&auto=format&fit=crop' WHERE id = 30;
UPDATE planes SET imagen_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Bioparc_Valencia_II_%282787453634%29.jpg/800px-Bioparc_Valencia_II_%282787453634%29.jpg' WHERE id = 31;
UPDATE planes SET imagen_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Ciutat_de_les_Arts_i_les_Ci%C3%A8ncies.jpg/800px-Ciutat_de_les_Arts_i_les_Ci%C3%A8ncies.jpg' WHERE id = 32;
UPDATE planes SET imagen_url = 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80&auto=format&fit=crop' WHERE id = 33;
UPDATE planes SET imagen_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Valencia%2C_loggia_della_seta%2C_interno%2C_sala_delle_colonne.jpg/800px-Valencia%2C_loggia_della_seta%2C_interno%2C_sala_delle_colonne.jpg' WHERE id = 34;
UPDATE planes SET imagen_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/01_Paella_Valenciana_original.jpg/800px-01_Paella_Valenciana_original.jpg' WHERE id = 35;
-- Horchata: Wikipedia devolvió Centre Cultural irrelevante → Unsplash drink
UPDATE planes SET imagen_url = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80&auto=format&fit=crop' WHERE id = 36;
UPDATE planes SET imagen_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Playa_de_la_Malvarrosa_%28Valencia%29_01.jpg/800px-Playa_de_la_Malvarrosa_%28Valencia%29_01.jpg' WHERE id = 37;
UPDATE planes SET imagen_url = 'https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?w=800&q=80&auto=format&fit=crop' WHERE id = 38;
UPDATE planes SET imagen_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/G%C3%BCell_BCN_edited.jpg/800px-G%C3%BCell_BCN_edited.jpg' WHERE id = 39;
UPDATE planes SET imagen_url = 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=800&q=80&auto=format&fit=crop' WHERE id = 40;
-- Sagrada Familia (id 41): mismo problema que id 4 → Unsplash
UPDATE planes SET imagen_url = 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80&auto=format&fit=crop' WHERE id = 41;
UPDATE planes SET imagen_url = 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=800&q=80&auto=format&fit=crop' WHERE id = 42;
UPDATE planes SET imagen_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Casa_Batll%C3%B3%2C_Antoni_Gaud%C3%AD.jpg/800px-Casa_Batll%C3%B3%2C_Antoni_Gaud%C3%AD.jpg' WHERE id = 43;
UPDATE planes SET imagen_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Passeig_del_Born_Barcelona_Catalonia.JPG/800px-Passeig_del_Born_Barcelona_Catalonia.JPG' WHERE id = 44;
UPDATE planes SET imagen_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Barcelona_-_Mercat_de_Sant_Josep_%28la_Boqueria%29_-_Entrance.jpg/800px-Barcelona_-_Mercat_de_Sant_Josep_%28la_Boqueria%29_-_Entrance.jpg' WHERE id = 45;
UPDATE planes SET imagen_url = 'https://images.unsplash.com/photo-1535063406830-ab9eecfa37ff?w=800&q=80&auto=format&fit=crop' WHERE id = 46;
-- Collserola: Wikipedia devolvió foto genérica BCN → Unsplash hiking
UPDATE planes SET imagen_url = 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80&auto=format&fit=crop' WHERE id = 47;
UPDATE planes SET imagen_url = 'https://images.unsplash.com/photo-1521405617584-1d9b25fa5e1c?w=800&q=80&auto=format&fit=crop' WHERE id = 48;
UPDATE planes SET imagen_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Montserrat-aire.jpg/800px-Montserrat-aire.jpg' WHERE id = 49;

SELECT id, nombre, substring(imagen_url, 1, 70) AS img FROM planes ORDER BY id LIMIT 10;
