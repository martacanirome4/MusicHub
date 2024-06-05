const express = require('express');
const router = express.Router();
const trackController = require('../controllers/trackController');
const auth = require('../middleware/auth');

// Route to get a track from Spotify by its ID, without authentication
router.get('/:id', auth, trackController.getTrack);

module.exports = router;
