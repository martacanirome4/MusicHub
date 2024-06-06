// controllers/weatherController.js
const getWeatherData = require('../utils/weatherAuth');

const getWeather = async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    const weatherData = await getWeatherData(city);
    res.json({
      city: weatherData.current.city[0].$.name,
      temperature: weatherData.current.temperature[0].$.value,
      description: weatherData.current.weather[0].$.value,
      humidity: weatherData.current.humidity[0].$.value,
      wind_speed: weatherData.current.wind[0].speed[0].$.value,
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Verificar si el error es debido a una respuesta HTML
    if (error.message.includes('Unexpected HTML response')) {
      res.status(500).json({ error: 'The OpenWeather API returned an HTML response, indicating a possible error on their end. Please try again later.' });
    } else {
      res.status(500).json({ error: 'Error fetching weather data' });
    }
  }
};

module.exports = {
  getWeather
};
