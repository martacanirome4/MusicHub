// cliente/routes/spotify.js
const express = require('express');
const router = express.Router();
const spotifyController = require('../controllers/spotifyController');

// Route to render Spotify search page
router.get('/', (req, res) => {
  res.render('spotify');
});

// Route to search tracks
router.get('/search', spotifyController.searchTracks);

module.exports = router;



