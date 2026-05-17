-- ═══════════════════════════════════════════════════════════════════════════
-- PLANFY · Asignación de imagen por plan
-- Cada plan recibe una URL temática estable basada en su nombre/categoría.
-- Loremflickr sirve fotos de Flickr filtradas por keyword (sin API key).
-- El parámetro `lock={id}` garantiza que cada plan SIEMPRE muestra la misma foto.
-- ═══════════════════════════════════════════════════════════════════════════

-- Plantilla: https://loremflickr.com/800/600/{keywords}?lock={planId}

UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/museum,prado,art?lock=1'        WHERE id = 1;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/park,retiro,madrid?lock=2'      WHERE id = 2;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/tapas,spanish,food?lock=3'      WHERE id = 3;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/sagrada-familia,gaudi?lock=4'   WHERE id = 4;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/barcelona,gothic-quarter?lock=5' WHERE id = 5;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/mallorca,mountains,hiking?lock=6' WHERE id = 6;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/valencia,nightlife,bar?lock=7'  WHERE id = 7;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/alhambra,granada?lock=8'        WHERE id = 8;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/flamenco,sevilla,dance?lock=9'  WHERE id = 9;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/surf,beach,wave?lock=10'        WHERE id = 10;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/boqueria,market,barcelona?lock=11' WHERE id = 11;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/escape-room,puzzle?lock=12'     WHERE id = 12;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/kayak,river,water-sport?lock=13' WHERE id = 13;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/guggenheim,bilbao,museum?lock=14' WHERE id = 14;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/cycling,bike,coast?lock=15'     WHERE id = 15;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/escape-room,mystery?lock=16'    WHERE id = 16;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/bowling,retro,80s?lock=17'      WHERE id = 17;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/theme-park,roller-coaster?lock=18' WHERE id = 18;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/museum,prado,velazquez?lock=19' WHERE id = 19;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/library,books,literature?lock=20' WHERE id = 20;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/flamenco,tablao,madrid?lock=21' WHERE id = 21;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/tapas,malasana,bar?lock=22'     WHERE id = 22;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/mercado,san-miguel,gourmet?lock=23' WHERE id = 23;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/cooking-class,paella,chef?lock=24' WHERE id = 24;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/karting,race,track?lock=25'     WHERE id = 25;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/climbing,bouldering,gym?lock=26' WHERE id = 26;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/yoga,park,sunrise?lock=27'      WHERE id = 27;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/zipline,adventure,forest?lock=28' WHERE id = 28;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/paintball,team,combat?lock=29'  WHERE id = 29;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/cinema,movie-theater,imax?lock=30' WHERE id = 30;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/zoo,animals,bioparc?lock=31'    WHERE id = 31;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/calatrava,futuristic,valencia?lock=32' WHERE id = 32;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/theater,stage,curtain?lock=33'  WHERE id = 33;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/gothic,architecture,silk?lock=34' WHERE id = 34;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/paella,valencia,rice?lock=35'   WHERE id = 35;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/horchata,drink,fartons?lock=36' WHERE id = 36;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/surf,malvarrosa,beach?lock=37'  WHERE id = 37;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/bicycle,rental,city?lock=38'    WHERE id = 38;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/park-guell,gaudi,mosaic?lock=39' WHERE id = 39;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/aquarium,fish,barcelona?lock=40' WHERE id = 40;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/sagrada-familia,basilica?lock=41' WHERE id = 41;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/picasso,art,museum?lock=42'     WHERE id = 42;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/casa-batllo,gaudi,facade?lock=43' WHERE id = 43;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/tapas,born,barcelona?lock=44'   WHERE id = 44;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/boqueria,fresh-food,market?lock=45' WHERE id = 45;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/skating,roller,barcelona?lock=46' WHERE id = 46;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/hiking,collserola,forest?lock=47' WHERE id = 47;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/skydiving,indoor,wind-tunnel?lock=48' WHERE id = 48;
UPDATE planes SET imagen_url = 'https://loremflickr.com/800/600/montserrat,climbing,catalonia?lock=49' WHERE id = 49;

-- Para planes futuros que se inserten sin imagen, fallback genérico
-- (lo gestionará el frontend si imagen_url es NULL)

SELECT id, nombre, imagen_url FROM planes ORDER BY id LIMIT 5;
