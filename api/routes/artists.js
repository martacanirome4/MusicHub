require('dotenv').config(); // Importar configuraciones de entorno
const express = require('express');
const router = express.Router();
const dbo = require('../db/conn'); // Asegúrate de que esta ruta sea correcta
const ObjectId = require('mongodb').ObjectId;
const MAX_RESULTS = parseInt(process.env.MAX_RESULTS);

router.get('/', async (req, res) => {
  let next = req.query.next;
  let query = {};

  if (next) {
      query = { _id: { $lt: new ObjectId(next) } };
  }

  const dbConnect = dbo.getDb();

  let results = await dbConnect
      .collection('music')
      .find(query)
      .sort({ _id: -1 })
      .limit(MAX_RESULTS)
      .toArray()
      .catch(err => res.status(400).send('Error al buscar artista'));

  next = results.length > 0 ? results[results.length - 1]._id : null;

  // Procesar los resultados para tomar solo el primer elemento de artist_uris y artist_names
  results = results.map(artist => {
      artist.artist_uris = Array.isArray(artist.artist_uris) ? artist.artist_uris[0] || '' : '';
      artist.artist_names = Array.isArray(artist.artist_names) ? artist.artist_names[0] || '' : '';
      return artist;
  });

  res.render('artists', { artists: results, next: next });
});

router.get('/:artist_uri', async (req, res) => {
  const artistUri = decodeURIComponent(req.params.artist_uri);
  const dbConnect = dbo.getDb();
  const limit = 1; // Limita la cantidad de resultados por página
  const next = req.query.next ? parseInt(req.query.next, 1) : 0; // Obtener el parámetro 'next' o usar 0

  try {
      // Buscar el álbum por su URI
      console.log(artistUri)
      const artists = await dbConnect.collection('music')
          .find({ artist_uris: artistUri })
          .skip(next) // Saltar los primeros 'next' resultados para la paginación
          .limit(limit) // Limitar los resultados a 'limit'
          .toArray();

      // Si no se encuentran álbumes, devolver un mensaje de error
      if (!artists.length) {
          return res.status(404).render('artists', { artists: [], message: 'Artista no encontrado' });
      }

      // Calcular el valor del próximo 'next' para la siguiente página
      const nextPage = artists.length === limit ? next + limit : null;

      // Renderizar la vista con los álbumes encontrados y el valor de 'nextPage'
      res.status(200).render('artists', { artists, next: nextPage, message: '' });
  } catch (err) {
      res.status(500).send('Error al buscar ');
  }
});

router.post('/', async (req, res) => {
    let newArtist = req.body; 
    console.log(newArtist);

    // Procesar artist_names
    if (typeof newArtist.artist_names === 'string') {
        newArtist.artist_names = newArtist.artist_names.split(',').map(name => name.trim());
    } else if (!Array.isArray(newArtist.artist_names)) {
        newArtist.artist_names = [];
    }

    // Procesar artist_uris
    if (typeof newArtist.artist_uris === 'string') {
        newArtist.artist_uris = newArtist.artist_uris.split(',').map(uri => uri.trim());
    } else if (!Array.isArray(newArtist.artist_uris)) {
        newArtist.artist_uris = [];
    }

    const dbConnect = dbo.getDb();
    try {
        const result = await dbConnect.collection('music').insertOne(newArtist);
        res.redirect(req.get('referer'));
    } catch (err) {
        res.status(400).send('Error al añadir el álbum');
    }
});

module.exports = router;
