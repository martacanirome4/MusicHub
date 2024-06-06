require('dotenv').config();
const express = require('express');
const router = express.Router();
const dbo = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;
const MAX_RESULTS = parseInt(process.env.MAX_RESULTS);

// Ruta para obtener todas las canciones

router.get('/', async (req, res) => {
  try {
    let limit = MAX_RESULTS;
    if (req.query.limit) {
      limit = Math.min(parseInt(req.query.limit), MAX_RESULTS);
    }
    let next = req.query.next;
    let query = {};
    if (next) {
      query = { _id: { $lt: new ObjectId(next) } };
    }
    const options = {
      projection: { _id: 0 }
    };
    const dbConnect = dbo.getDb();
    let tracks = await dbConnect
      .collection('music')
      .find(query, options)
      .sort({ _id: -1 })
      .limit(limit)
      .toArray();
    next = tracks.length == limit ? tracks[tracks.length - 1]._id : null;
    res.render('tracks', { tracks, next }); // Renderizar la plantilla EJS con los resultados de las canciones
  } catch (error) {
    console.error('Error al buscar las canciones:', error);
    res.status(500).send('Error al buscar las canciones');
  }
});

//BUSCAR POR URI
router.get('/:track_uri', async (req, res) => {
  const trackUri = decodeURIComponent(req.params.track_uri); // Corregido para usar 'track_uri' en lugar de 'album_uri'
  const dbConnect = dbo.getDb();
  const limit = 1; // Limita la cantidad de resultados por página
  const next = req.query.next ? parseInt(req.query.next, 1) : 0; // Obtener el parámetro 'next' o usar 0

  try {
      // Buscar la canción por su URI
      const tracks = await dbConnect.collection('music')
          .find({ track_uri: trackUri })
          .skip(next) // Saltar los primeros 'next' resultados para la paginación
          .limit(limit) // Limitar los resultados a 'limit'
          .toArray();

      // Si no se encuentran canciones, devolver un mensaje de error
      if (!tracks.length) {
          return res.status(404).render('tracks', { tracks: [], message: 'Canción no encontrada' }); // Corregido el mensaje
      }

      // Calcular el valor del próximo 'next' para la siguiente página
      const nextPage = tracks.length === limit ? next + limit : null;

      // Renderizar la vista con las canciones encontradas y el valor de 'nextPage'
      res.status(200).render('tracks', { tracks, next: nextPage, message: '' });
  } catch (err) {
      res.status(500).send('Error al buscar la canción'); // Corregido el mensaje
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