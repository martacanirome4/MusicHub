// cliente/app.js
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/albums');
const openAI = require("openai");
const conn = require('./db/conn');
const apiErrorHandler = require('./middleware/apiErrorHandler');
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyRouter = require('./routes/spotify');
const musicBrainzRouter = require('./routes/musicBrainz');
const chatRouter = require('./routes/chat');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/albums', apiRouter);
app.use('/spotify', spotifyRouter);
app.use('/musicBrainz', musicBrainzRouter);
app.use('/chat', chatRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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

app.post('/send-message', async (req, res) => {  // Ajuste aquí
    const userMessage = req.body.message;

    try {
        const response = await chat(userMessage);
        res.json({ message: response });
    } catch (error) {
        console.error('Error processing message:', error);
        res.status(500).json({ message: 'Error processing message' });
    }
});

// Error handler
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
    console.error(err.stack);
});

module.exports = app;
