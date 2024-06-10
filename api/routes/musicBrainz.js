// file: api/routes/musicbrainz.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('musicBrainz');
});

router.get('/artist/:mbid', async (req, res, next) => {
    const mbid = req.params.mbid;
    const url = `http://musicbrainz.org/ws/2/artist/${mbid}?inc=aliases+tags+ratings&fmt=xml`;

    try {
        const response = await axios.get(url);
        res.type('application/xml');
        res.send(response.data);
    } catch (error) {
        next(error);
    }
});

router.get('/search', async (req, res, next) => {
    const artistName = req.query.name;

    if (!artistName) {
        return res.status(400).json({ error: 'Query parameter "name" is required' });
    }

    const url = `http://musicbrainz.org/ws/2/artist/?query=artist:${encodeURIComponent(artistName)}&fmt=xml`;

    try {
        const response = await axios.get(url);
        res.type('application/xml');
        res.send(response.data);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
