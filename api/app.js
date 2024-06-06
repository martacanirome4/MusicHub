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
const weatherRoutes = require('./routes/weather');
const apiErrorHandler = require('./middleware/apiErrorHandler');
const spotifyRouter = require('./routes/spotify');
const musicBrainzRouter = require('./routes/musicBrainz');
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
app.use(base_uri + '/', indexRouter); // Ajustar la ruta para manejar el prefijo
app.use('/users', usersRouter);
app.use(base_uri + '/tracks', tracksRouter);
app.use(base_uri + '/albums', albumsRouter);
app.use(base_uri + '/spotify-tracks', spotifyTracks);
app.use(base_uri + '/weather', weatherRoutes);
app.use(base_uri + '/spotify', spotifyRouter);
app.use(base_uri + '/musicbrainz', musicBrainzRouter);

// Middleware para asegurar que se manejen los errores de la API externa sin que la aplicación se caiga
app.use(apiErrorHandler);

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
app.get(base_uri + '/chat', (req, res) => {
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

app.post(base_uri + '/send-message', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await chat(userMessage);
        res.json({ message: response });
    } catch (error) {
        console.error('Error processing message:', error);
        res.status(500).json({ message: 'Error processing message' });
    }
});

app.get(base_uri + '/chat', (req, res) => {
    res.render('chat');
});

// Error handler
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
    console.error(err.stack);
});

console.log('App running on url: http://localhost:3000' + base_uri);

module.exports = app;
