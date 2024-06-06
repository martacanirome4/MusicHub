const axios = require('axios');
require('dotenv').config();

const getWeatherData = async (city) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  try {
    const response = await axios.get(weatherUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

module.exports = getWeatherData;
