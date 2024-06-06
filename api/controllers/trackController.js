// File: api/controllers/trackController.js
const axios = require('axios');
const getSpotifyToken = require('../utils/spotifyAuth');

const getTrack = async (req, res) => {
  const trackId = req.params.id;

  if (!trackId) {
    return res.status(400).send('Track ID is required');
  }

  try {
    const token = await getSpotifyToken();
    const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    res.json({
      name: response.data.name,
      id: response.data.id,
      artists: response.data.artists.map(artist => artist.name),
      album: response.data.album.name,
      release_date: response.data.album.release_date,
      preview_url: response.data.preview_url
    });
  } catch (error) {
    console.error('Error fetching track:', error);
    res.status(500).send('Error fetching track from Spotify');
  }
};

module.exports = {
  getTrack
};
