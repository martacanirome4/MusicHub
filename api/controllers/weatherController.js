// file: api/controllers/weatherController.js
const axios = require('axios');
const xml2js = require('xml2js');
require('dotenv').config();

const getWeatherData = async (req, res) => {
  const city = req.params.city;

  try {
    const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&mode=xml&appid=${process.env.OPENWEATHERMAP_API_KEY}`);
    const xml = response.data;

    // Convert XML to JSON
    xml2js.parseString(xml, (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error parsing XML' });
      }
      res.json(result);
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ message: 'Error fetching weather data from OpenWeatherMap' });
  }
};

module.exports = {
  getWeatherData
};
