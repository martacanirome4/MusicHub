require('dotenv').config();
const express = require('express');
const router = express.Router();
const dbo = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;
const MAX_RESULTS = parseInt(process.env.MAX_RESULTS);

router.get('/', async (req, res) => {
    let next = req.query.next;
    let query = {};

    if (next) {
        query = { _id: { $lt: new ObjectId(next) } };
    }

    const dbConnect = dbo.getDb();

    try {
        let results = await dbConnect
            .collection('music')
            .find(query)
            .sort({ _id: -1 })
            .limit(MAX_RESULTS)
            .toArray();

        next = results.length > 0 ? results[results.length - 1]._id : null;

        // Procesar los resultados para tomar solo el primer elemento de artist_uris y artist_names
        results = results.map(artist => {
            artist.artist_uris = Array.isArray(artist.artist_uris) ? artist.artist_uris[0] || '' : '';
            artist.artist_names = Array.isArray(artist.artist_names) ? artist.artist_names[0] || '' : '';
            return artist;
        });

        res.json({ artists: results, next: next });
    } catch (err) {
        res.status(400).json({ error: 'Error al buscar artistas' });
    }
});

router.get('/:artist_uri', async (req, res) => {
    const artistUri = decodeURIComponent(req.params.artist_uri);
    const dbConnect = dbo.getDb();
    const limit = 1;
    const next = req.query.next ? parseInt(req.query.next, 1) : 0;

    try {
        const artists = await dbConnect.collection('music')
            .find({ artist_uris: artistUri })
            .skip(next)
            .limit(limit)
            .toArray();

        if (!artists.length) {
            return res.status(404).json({ message: 'Artista no encontrado' });
        }

        const nextPage = artists.length === limit ? next + limit : null;

        res.status(200).json({ artists, next: nextPage });
    } catch (err) {
        res.status(500).json({ error: 'Error al buscar el artista' });
    }
});

router.put('/:artist_uri', async (req, res) => {
    const artistUri = decodeURIComponent(req.params.artist_uri);
    const updatedartist = req.body;
    const dbConnect = dbo.getDb();

    try {
        const result = await dbConnect
            .collection('music')
            .updateOne({ artist_uris: artistUri }, { $set: updatedartist });

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Artista no encontrado' });
        }

        res.status(200).json(updatedartist);
    } catch (err) {
        res.status(400).json({ error: 'Error al actualizar el artista' });
    }
});

router.delete('/:artist_uri', async (req, res) => {
    const artistUri = decodeURIComponent(req.params.artist_uri);
    const dbConnect = dbo.getDb();

    try {
        const result = await dbConnect.collection('music').deleteOne({ artist_uri: artistUri });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Artista no encontrado' });
        }

        res.status(200).json({ message: 'Artista eliminado correctamente' });
    } catch (err) {
        res.status(400).json({ error: 'Error al eliminar el artista' });
    }
});

router.get('/:artist_uri/artist', async (req, res) => {
    const artistUri = decodeURIComponent(req.params.artist_uri);
    const dbConnect = dbo.getDb();

    try {
        const artist = await dbConnect
            .collection('music')
            .findOne({ artist_uri: artistUri });

        if (!artist) {
            return res.status(404).json({ message: 'Artista no encontrado' });
        }

        const artistDetails = {
            artist_uris: artist.artist_uris,
            artist_names: artist.artist_names
        };

        res.status(200).json(artistDetails);
    } catch (err) {
        res.status(500).json({ error: 'Error al buscar el artista' });
    }
});

router.post('/', async (req, res) => {
    let newartist = req.body; 

    if (typeof newartist.artist_names === 'string') {
        newartist.artist_names = newartist.artist_names.split(',').map(name => name.trim());
    } else if (!Array.isArray(newartist.artist_names)) {
        newartist.artist_names = [];
    }

    const dbConnect = dbo.getDb();
    try {
        const result = await dbConnect.collection('music').insertOne(newartist);
        res.status(201).json({ message: 'Artista añadido correctamente' });
    } catch (err) {
        res.status(400).json({ error: 'Error al añadir el artista' });
    }
});

module.exports = router;
