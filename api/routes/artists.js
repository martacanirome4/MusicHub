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

  const options = {
      projection: { _id: 0 }
  };

  const dbConnect = dbo.getDb();

  let results = await dbConnect
      .collection('music')
      .find(query, options)
      .sort({ _id: -1 })
      .limit(MAX_RESULTS)
      .toArray()
      .catch(err => res.status(400).send('Error al buscar artistas'));

  // Ajustar los resultados para incluir solo el primer artist_uris y artist_names
  results = results.map(result => {
      if (Array.isArray(result.artist_uris) && result.artist_uris.length > 0) {
          result.artist_uris = result.artist_uris[0];
      }
      if (Array.isArray(result.artist_names) && result.artist_names.length > 0) {
          result.artist_names = result.artist_names[0];
      }
      return result;
  });

  next = results.length > 0 ? results[results.length - 1]._id : null;

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
      res.status(500).send('Error al buscar el artista');
  }
});



router.put('/:artist_uri', async (req, res) => {
  const artistUri = decodeURIComponent(req.params.artist_uri); 
  const updatedartist = req.body;
  const dbConnect = dbo.getDb();

  await dbConnect
    .collection('music')
    .updateOne({artist_uris: artistUri}, {$set: updatedartist})
    .then(result => {
      if (result.modifiedCount === 0) {
        return res.status(404).json({message: 'Artista no encontrado'});
      }
      res.json(updatedartist).status(200);
    })
    .catch(err => res.status(400).send('Error al actualizar el artista'));
});

router.delete('/:artist_uri', async (req, res) => {
  const artistUri = decodeURIComponent(req.params.artist_uri);
  const dbConnect = dbo.getDb();
  console.log("aqui3")

  try {
    const result = await dbConnect.collection('music').deleteOne({ artist_uri: artistUri });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Álbum no encontrado' });
    }
    res.redirect('/api/v1/artists');
  } catch (err) {
    res.status(400).send('Error al eliminar el álbum');
  }
});




router.get('/:artist_uri/artist', async (req, res) => {
    const artistUri = decodeURIComponent(req.params.artist_uri); 
    const dbConnect = dbo.getDb();
    const artist = await dbConnect
      .collection('music')
      .findOne({artist_uri: artistUri})
      .catch(err => res.status(400).send('Error al buscar el álbum'));
    if (!artist) {
      return res.status(404).json({message: 'Álbum no encontrado'});
    }

    const artistDetails = {
      artist_uris: artist.artist_uris,
      artist_names: artist.artist_names

    };
    res.json(artistDetails).status(200);
  });

  router.post('/', async (req, res) => {
    let newartist = req.body; 
    console.log(newartist);

    if (typeof newartist.artist_names === 'string') {
        newartist.artist_names = newartist.artist_names.split(',').map(name => name.trim());
    } else if (!Array.isArray(newartist.artist_names)) {
        newartist.artist_names = [];
    }

    const dbConnect = dbo.getDb();
    try {
        const result = await dbConnect.collection('music').insertOne(newartist);
        res.redirect(req.get('referer'));
    } catch (err) {
        res.status(400).send('Error al añadir el álbum');
    }
});

router.get('/:artist_uri/tracks', async (req, res) => {
    const artistUri = decodeURIComponent(req.params.artist_uri); 
    const dbConnect = dbo.getDb();
    const tracks = await dbConnect
      .collection('music')
      .find({artist_uri: artistUri})
      .toArray()
      .catch(err => res.status(400).send('Error al buscar el artista'));
    if (!tracks || tracks.length === 0) {
      return res.status(404).json({message: 'No se encontro al artista'});
    }

    const tracksDetails = tracks.map(track => ({
      track_uri: track.track_uri,
      track_name: track.track_name,

    }));
    res.json(tracksDetails).status(200);
  });



module.exports = router;
