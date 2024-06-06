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
  let newTrack = req.body; // Obtener los datos del formulario
  console.log(newTrack);

  // Convertir artist_names a un array si es una cadena
  if (typeof newTrack.artist_names === 'string') {
      newTrack.artist_names = newTrack.artist_names.split(',').map(name => name.trim());
  } else if (!Array.isArray(newTrack.artist_names)) {
      newTrack.artist_names = [];
  }

  const dbConnect = dbo.getDb();
  try {
      const result = await dbConnect.collection('music').insertOne(newTrack);
      res.redirect(req.get('referer'));
  } catch (err) {
      res.status(400).send('Error al añadir la canción');
  }
});

router.put('/:track_uri', async (req, res) => {
  const trackUri = decodeURIComponent(req.params.track_uri); // Decodificar el URI del álbum
  const updatedtrack = req.body;
  const dbConnect = dbo.getDb();

  await dbConnect
    .collection('music')
    .updateOne({track_uri: trackUri}, {$set: updatedtrack})
    .then(result => {
      if (result.modifiedCount === 0) {
        return res.status(404).json({message: 'Álbum no encontrado'});
      }
      res.json(trackUri).status(200);
    })
    .catch(err => res.status(400).send('Error al actualizar el álbum'));
});

// Ruta para eliminar una canción
router.delete('/:track_uri', async (req, res) => {
  const trackUri = decodeURIComponent(req.params.track_uri);
  const dbConnect = dbo.getDb();
  console.log("aqui3")

  try {
    const result = await dbConnect.collection('music').deleteOne({ track_uri: trackUri });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Canción no encontrada' });
    }
    res.redirect('/api/v1/tracks');
  } catch (err) {
    res.status(400).send('Error al eliminar la canción');
  }
});


module.exports = router;