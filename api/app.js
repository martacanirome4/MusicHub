// file: api/app.js
require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const tracksRouter = require('./routes/tracks');
const openAI = require("openai");
const albumsRouter = require('./routes/albums');
const conn = require('./db/conn');
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyTracks = require('./routes/spotifyTracks');
const weatherRouter = require('./routes/weather');
const spotifyRouter = require('./routes/spotify');
const artistsRouter = require('./routes/artists');
const base_uri = process.env.BASE_URI;

const app = express();

// Database connection
conn.connectToDatabase();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(base_uri + '/tracks', tracksRouter);
app.use(base_uri + '/albums', albumsRouter);
app.use(base_uri + '/artists', artistsRouter);
app.use(base_uri + '/spotify-tracks', spotifyTracks);
app.use(base_uri + '/weather', weatherRouter);
app.use(base_uri + '/spotify', spotifyRouter);

// Spotify API configuration
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Spotify API authentication
spotifyApi.clientCredentialsGrant()
    .then(data => {
        console.log('Authenticated successfully');
        spotifyApi.setAccessToken(data.body['access_token']);
    })
    .catch(error => {
        console.error('Authentication error:', error);
    });

// Chat function
app.get('/api/v1/chat', (req, res) => {
    res.render('chat');
});

async function chat(userMessage) {
    const client = new openAI.OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    try {
        const completion = await client.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a poetic assistant, skilled in explaining complex programming concepts with creative flair." },
                { role: "user", content: userMessage }
            ]
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

app.post('/send-message', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await chat(userMessage);
        res.json({ message: response });
    } catch (error) {
        console.error('Error processing message:', error);
        res.status(500).json({ message: 'Error processing message' });
    }
});

app.get('/chat', (req, res) => {
    res.render('chat');
});

// Error handler
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

console.log('App running on url: http://localhost:3000/api/v1/');

module.exports = app;
