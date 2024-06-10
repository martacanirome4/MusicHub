require('dotenv').config();
const express = require('express');
const router = express.Router();
const dbo = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;
const MAX_RESULTS = parseInt(process.env.MAX_RESULTS);

// Ruta para obtener todos los álbumes
router.get('/', async (req, res) => {
    let next = req.query.next;
    let query = {};
  
    if (next) {
        query = { _id: { $lt: new ObjectId(next) } };
    }

    const options = {
        projection: { _id: 1,  track_uri: 0, track_name: 0, artist_uris: 0, album_artist_uris: 0}
    };
  
    const dbConnect = dbo.getDb();
  
    try {
        let results = await dbConnect
            .collection('music')
            .find(query, options)
            .sort({ _id: -1 })
            .limit(MAX_RESULTS)
            .toArray();
  
        next = results.length > 0 ? results[results.length - 1]._id : null;

        res.json({ albums: results, next: next });
    } catch (err) {
        res.status(400).json({ error: 'Error al buscar álbumes' });
    }
});

// Ruta para obtener detalles de un álbum específico
router.get('/:album_uri', async (req, res) => {
    const albumUri = decodeURIComponent(req.params.album_uri);
    const dbConnect = dbo.getDb();
    const limit = 1;
    const next = req.query.next ? parseInt(req.query.next, 1) : 0;

    const options = {
        projection: { _id: 1,  track_uri: 0, track_name: 0, artist_uris: 0, album_artist_uris: 0}
    };

    try {
        const query = { album_uri: albumUri }
        const albums = await dbConnect.collection('music')
            .find(query, options)
            .skip(next)
            .limit(limit)
            .toArray();

        if (!albums.length) {
            return res.status(404).json({ message: 'Álbum no encontrado' });
        }

        const nextPage = albums.length === limit ? next + limit : null;
        res.status(200).json({ albums, next: nextPage });
    } catch (err) {
        res.status(500).json({ error: 'Error al buscar el álbum' });
    }
});

// Ruta para actualizar un álbum existente
router.put('/:album_uri', async (req, res) => {
    const albumUri = decodeURIComponent(req.params.album_uri);
    const updatedAlbum = req.body;
    const dbConnect = dbo.getDb();

    try {
        const result = await dbConnect
            .collection('music')
            .updateOne({ album_uri: albumUri }, { $set: updatedAlbum });

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Álbum no encontrado' });
        }

        res.status(200).json(updatedAlbum);
    } catch (err) {
        res.status(400).json({ error: 'Error al actualizar el álbum' });
    }
});

// Ruta para eliminar un álbum
router.delete('/:album_uri', async (req, res) => {
    const albumUri = decodeURIComponent(req.params.album_uri);
    const dbConnect = dbo.getDb();

    try {
        const result = await dbConnect.collection('music').deleteOne({ album_uri: albumUri });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Álbum no encontrado' });
        }

        res.status(200).json({ message: 'Álbum eliminado correctamente' });
    } catch (err) {
        res.status(400).json({ error: 'Error al eliminar el álbum' });
    }
});

// Ruta para añadir un nuevo álbum
router.post('/', async (req, res) => {
    let newAlbum = req.body;

    if (typeof newAlbum.artist_names === 'string') {
        newAlbum.artist_names = newAlbum.artist_names.split(',').map(name => name.trim());
    } else if (!Array.isArray(newAlbum.artist_names)) {
        newAlbum.artist_names = [];
    }

    const dbConnect = dbo.getDb();

    try {
        const result = await dbConnect.collection('music').insertOne(newAlbum);
        res.status(201).json({ message: 'Álbum añadido correctamente' });
    } catch (err) {
        res.status(400).json({ error: 'Error al añadir el álbum' });
    }
});


module.exports = router;
