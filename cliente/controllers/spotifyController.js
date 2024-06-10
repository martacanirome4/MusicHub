// cliente/controllers/spotifyController.js
const axios = require('axios');
const getSpotifyToken = require('../utils/spotifyAuth');

const searchTracks = async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).send('Query is required');
  }

  try {
    const token = await getSpotifyToken();
    const response = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    res.json(response.data.tracks.items.map(track => ({
      name: track.name,
      id: track.id,
      artists: track.artists.map(artist => artist.name),
      album: track.album.name,
      release_date: track.album.release_date,
      preview_url: track.preview_url
    })));
  } catch (error) {
    console.error('Error searching tracks:', error);
    res.status(500).send('Error searching tracks on Spotify');
  }
};

module.exports = {
  searchTracks
};
