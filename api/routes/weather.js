// file: api/routes/weather.js
const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// Route to get weather data in XML and convert it to JSON
router.get('/:city', weatherController.getWeatherData);

module.exports = router;

