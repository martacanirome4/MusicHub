// File: api/utils/spotifyAuth.js
const axios = require('axios');
const qs = require('qs');
require('dotenv').config();

const getSpotifyToken = async () => {
  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const data = qs.stringify({ grant_type: 'client_credentials' });
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: 'Basic ' + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')
  };

  try {
    const response = await axios.post(tokenUrl, data, { headers });
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching Spotify token:', error);
    throw error;
  }
};

module.exports = getSpotifyToken;
