const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const conn = require('./db/conn');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

require('dotenv').config(); // Carga las variables de entorno desde el archivo .env

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Configura la Spotify API con tus credenciales
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    accessToken: process.env.SPOTIFY_ACCESS_TOKEN
});

// Autenticación de la Spotify API
spotifyApi.clientCredentialsGrant()
  .then(data => {
    console.log('Autenticado con éxito');
    // Guarda el token de acceso
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Error de autenticación:', error);
  });

// Ejemplo de uso: buscar artistas
spotifyApi.searchArtists('David Bowie')
  .then(data => {
    console.log('Resultados de la búsqueda:', data.body.artists);
  })
  .catch(error => {

    console.log('Error al buscar artistas:', error);
  });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
