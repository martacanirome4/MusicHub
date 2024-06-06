// utils/weatherAuth.js
const axios = require('axios');
const xml2js = require('xml2js');
require('dotenv').config();

const getWeatherData = async (city) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&mode=xml`;

  try {
    const response = await axios.get(weatherUrl);
    
    // Verificar si la respuesta es HTML (lo que indica un error)
    if (response.headers['content-type'].includes('text/html')) {
      throw new Error('Unexpected HTML response from OpenWeather API');
    }

    const parser = new xml2js.Parser();

    return new Promise((resolve, reject) => {
      parser.parseString(response.data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

module.exports = getWeatherData;
