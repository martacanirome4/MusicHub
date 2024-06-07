// file: api/routes/weather.js
const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// Ruta para obtener datos del clima
router.get('/', weatherController.getWeather);

module.exports = router;
