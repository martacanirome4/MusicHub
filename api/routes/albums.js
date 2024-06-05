require('dotenv').config(); // Importar configuraciones de entorno
const express = require('express');
const router = express.Router();
const dbo = require('../db/conn'); // Asegúrate de que esta ruta sea correcta
const ObjectId = require('mongodb').ObjectId;
const MAX_RESULTS = parseInt(process.env.MAX_RESULTS);

// Ruta para obtener todos los álbumes
router.get('/', async (req, res) => {
  let limit = MAX_RESULTS;
  if (req.query.limit){
    limit = Math.min(parseInt(req.query.limit), MAX_RESULTS);
  }
  let next = req.query.next;
  let query = {}
  if (next){
    query = {_id: {$lt: new ObjectId(next)}}
  }
  const options = {
    projection: {_id: 0}
  }
  const dbConnect = dbo.getDb();
  let results = await dbConnect
    .collection('music')
    .find({album_uri: {$exists: true}})
    .sort({_id: -1})
    .limit(limit)
    .toArray()
    .catch(err => res.status(400).send('Error al buscar álbumes'));
  next = results.length === limit ? results[results.length - 1]._id : null;
  res.json({results, next}).status(200);
});


// Ruta para obtener detalles de un álbum específico
router.get('/:album_uri', async (req, res) => {
  const albumUri = decodeURIComponent(req.params.album_uri); // Decodificar el URI del álbum
  const dbConnect = dbo.getDb();
  const album = await dbConnect
    .collection('music')
    .findOne({album_uri: albumUri})
    .catch(err => res.status(400).send('Error al buscar el álbum'));
  if (!album) {
    return res.status(404).json({message: 'Álbum no encontrado'});
  }
  res.json(album).status(200);
});

// Ruta para actualizar un álbum existente
router.put('/:album_uri', async (req, res) => {
  const albumUri = decodeURIComponent(req.params.album_uri); // Decodificar el URI del álbum
  const updatedAlbum = req.body;
  const dbConnect = dbo.getDb();
  await dbConnect
    .collection('music')
    .updateOne({album_uri: albumUri}, {$set: updatedAlbum})
    .then(result => {
      if (result.modifiedCount === 0) {
        return res.status(404).json({message: 'Álbum no encontrado'});
      }
      res.json(updatedAlbum).status(200);
    })
    .catch(err => res.status(400).send('Error al actualizar el álbum'));
});

// Ruta para eliminar un álbum
router.delete('/:album_uri', async (req, res) => {
  const albumUri = decodeURIComponent(req.params.album_uri); // Decodificar el URI del álbum
  const dbConnect = dbo.getDb();
  await dbConnect
    .collection('music')
    .deleteOne({album_uri: albumUri})
    .then(result => {
      if (result.deletedCount === 0) {
        return res.status(404).json({message: 'Álbum no encontrado'});
      }
      res.status(204).send();
    })
    .catch(err => res.status(400).send('Error al eliminar el álbum'));
});

module.exports = router;
