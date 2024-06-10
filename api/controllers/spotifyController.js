// file: api/controllers/spotifyController.js
const axios = require('axios');
const getSpotifyToken = require('../utils/spotifyAuth');

const searchTracks = async (req, res) => {
  const query = req.query.name;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter "name" is required' });
  }

  try {
    const token = await getSpotifyToken();
    const response = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const tracks = response.data.tracks.items.map(track => ({
      name: track.name,
      id: track.id,
      artists: track.artists.map(artist => artist.name),
      album: track.album.name,
      release_date: track.album.release_date,
      preview_url: track.preview_url
    }));

    res.json(tracks);
  } catch (error) {
    console.error('Error searching tracks:', error);

    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      res.status(500).json({ error: 'No response from Spotify' });
    } else {
      res.status(500).json({ error: 'Error searching tracks on Spotify' });
    }
  }
};

module.exports = {
  searchTracks
};
