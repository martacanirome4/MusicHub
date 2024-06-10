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

        res.status(200).json({ tracks: results, next: next });
    } catch (err) {
        res.status(400).json({ error: 'Error al buscar canciones' });
    }
});

router.get('/:track_uri', async (req, res) => {
    const trackUri = decodeURIComponent(req.params.track_uri);
    const dbConnect = dbo.getDb();
    const limit = 1;
    const next = req.query.next ? parseInt(req.query.next, 1) : 0;

    try {
        const tracks = await dbConnect.collection('music')
            .find({ track_uri: trackUri })
            .skip(next)
            .limit(limit)
            .toArray();

        if (!tracks.length) {
            return res.status(404).json({ message: 'Canción no encontrada' });
        }

        const nextPage = tracks.length === limit ? next + limit : null;

        res.status(200).json({ tracks, next: nextPage });
    } catch (err) {
        res.status(500).json({ error: 'Error al buscar la canción' });
    }
});

router.post('/', async (req, res) => {
    let newTrack = req.body;

    if (typeof newTrack.artist_names === 'string') {
        newTrack.artist_names = newTrack.artist_names.split(',').map(name => name.trim());
    } else if (!Array.isArray(newTrack.artist_names)) {
        newTrack.artist_names = [];
    }

    const dbConnect = dbo.getDb();
    try {
        const result = await dbConnect.collection('music').insertOne(newTrack);
        res.status(201).json({ message: 'Canción añadida correctamente' });
    } catch (err) {
        res.status(400).json({ error: 'Error al añadir la canción' });
    }
});

router.put('/:track_uri', async (req, res) => {
    const trackUri = decodeURIComponent(req.params.track_uri);
    const updatedtrack = req.body;
    const dbConnect = dbo.getDb();

    try {
        const result = await dbConnect
            .collection('music')
            .updateOne({ track_uri: trackUri }, { $set: updatedtrack });

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Canción no encontrada' });
        }

        res.status(200).json({ message: 'Canción actualizada correctamente' });
    } catch (err) {
        res.status(400).json({ error: 'Error al actualizar la canción' });
    }
});

router.delete('/:track_uri', async (req, res) => {
    const trackUri = decodeURIComponent(req.params.track_uri);
    const dbConnect = dbo.getDb();

    try {
        const result = await dbConnect.collection('music').deleteOne({ track_uri: trackUri });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Canción no encontrada' });
        }

        res.status(200).json({ message: 'Canción eliminada correctamente' });
    } catch (err) {
        res.status(400).json({ error: 'Error al eliminar la canción' });
    }
});

module.exports = router;
