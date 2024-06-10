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
        projection: { _id: 0 }
    };
  
    const dbConnect = dbo.getDb();
  
    try {
        let results = await dbConnect
            .collection('music')
            .find(query)
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

    try {
        const albums = await dbConnect.collection('music')
            .find({ album_uri: albumUri })
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

// Ruta para obtener detalles del artista asociado a un álbum específico
router.get('/:album_uri/artist', async (req, res) => {
    const albumUri = decodeURIComponent(req.params.album_uri);
    const dbConnect = dbo.getDb();

    try {
        const album = await dbConnect
            .collection('music')
            .findOne({ album_uri: albumUri });

        if (!album) {
            return res.status(404).json({ message: 'Álbum no encontrado' });
        }

        const artistDetails = {
            artist_uris: album.artist_uris,
            artist_names: album.artist_names
        };

        res.status(200).json(artistDetails);
    } catch (err) {
        res.status(500).json({ error: 'Error al buscar el artista asociado al álbum' });
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

// Ruta para obtener todas las canciones asociadas a un álbum específico
router.get('/:album_uri/tracks', async (req, res) => {
    const albumUri = decodeURIComponent(req.params.album_uri);
    const dbConnect = dbo.getDb();

    try {
        const tracks = await dbConnect
            .collection('music')
            .find({ album_uri: albumUri })
            .toArray();

        if (!tracks.length) {
            return res.status(404).json({ message: 'No se encontraron canciones asociadas al álbum' });
        }

        const tracksDetails = tracks.map(track => ({
            track_uri: track.track_uri,
            track_name: track.track_name
        }));

        res.status(200).json(tracksDetails);
    } catch (err) {
        res.status(500).json({ error: 'Error al buscar las canciones del álbum' });
    }
});

module.exports = router;
