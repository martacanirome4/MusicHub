require('dotenv').config();
const express = require('express');
const router = express.Router();
const dbo = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;
const MAX_RESULTS = parseInt(process.env.MAX_RESULTS);

// Ruta para obtener todas las canciones
router.get('/', async (req, res) => {
  // Obtener el valor de `next` de la consulta
  let next = req.query.next;
  let query = {};
  
  // Si `next` está presente, construir la consulta para obtener los álbumes siguientes
  if (next) {
      query = { _id: { $lt: new ObjectId(next) } };
  }

  const options = {
      projection: { _id: 0 }
  };
  
  const dbConnect = dbo.getDb();
  
  // Realizar la consulta a la base de datos usando el valor de `next`
  let results = await dbConnect
      .collection('music')
      .find(query)
      .sort({ _id: -1 })
      .limit(MAX_RESULTS) // Usar MAX_RESULTS para limitar la cantidad de resultados
      .toArray()
      .catch(err => res.status(400).send('Error al buscar álbumes'));
  
  // Calcular el valor de `next` para el siguiente conjunto de álbumes
  next = results.length > 0 ? results[results.length - 1]._id : null;

  // Renderizar la plantilla EJS con los resultados de la consulta
  res.render('tracks', { tracks: results, next: next });
});

// Ruta para obtener detalles de una canción específica
router.get('/:track_uri', async (req, res) => {
  const trackUri = decodeURIComponent(req.params.track_uri);
  const dbConnect = dbo.getDb();
  const limit = 1; // Limita la cantidad de resultados por página
  const next = req.query.next ? parseInt(req.query.next, 1) : 0; // Obtener el parámetro 'next' o usar 0

  try {
      // Buscar el álbum por su URI
      const tracks = await dbConnect.collection('music')
          .find({ track_uri: trackUri })
          .skip(next) // Saltar los primeros 'next' resultados para la paginación
          .limit(limit) // Limitar los resultados a 'limit'
          .toArray();

      // Si no se encuentran álbumes, devolver un mensaje de error
      if (!tracks.length) {
          return res.status(404).render('tracks', { tracks: [], message: 'Álbum no encontrado' });
      }

      // Calcular el valor del próximo 'next' para la siguiente página
      const nextPage = tracks.length === limit ? next + limit : null;

      // Renderizar la vista con los álbumes encontrados y el valor de 'nextPage'
      res.status(200).render('tracks', { tracks, next: nextPage, message: '' });
  } catch (err) {
      res.status(500).send('Error al buscar el álbum');
  }
});

router.post('/', async (req, res) => {
  const dbConnect = dbo.getDb();
  let result = await dbConnect
    .collection('music')
    .insertOne(req.body);
  res.status(201).send(result);
});

router.put('/:id', async (req, res) => {
  const query = {track_uri: {$eq: (decodeURIComponent(req.params.id))}};
  const update = {$set:{
    track_name: req.body.track_name,
  }};
  const dbConnect = dbo.getDb();
  let result = await dbConnect
    .collection('music')
    .updateOne(query, update);
  res.status(200).send(result);
});

router.delete('/:id', async (req, res) => {
  const query = {track_uri: {$eq: decodeURIComponent(req.params.id)}};
  const dbConnect = dbo.getDb();
  let result = await dbConnect
    .collection('music')
    .deleteOne(query);
  res.status(200).send(result);
});

module.exports = router;