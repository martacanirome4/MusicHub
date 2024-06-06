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
const dotenv = require('dotenv');
const albumsRouter = require('./routes/albums');
const conn = require('./db/conn');
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyTracks = require('./routes/spotifyTracks');
const axios = require('axios');
const weatherRouter = require('./routes/weather');
const base_uri = process.env.BASE_URI

const app = express();

// Configuración de conexión a la base de datos
conn.connectToDatabase();

// Configuración del motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware de logging
app.use(logger('dev'));

// Middleware para parsear solicitudes JSON
app.use(express.json());

// Middleware para parsear solicitudes con URL codificada
app.use(express.urlencoded({ extended: false }));

// Middleware para parsear cookies
app.use(cookieParser());

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(base_uri + '/tracks', tracksRouter);
app.use(base_uri + '/albums', albumsRouter);
app.use(base_uri + '/spotify-tracks', spotifyTracks);
app.use(base_uri + '/weather', weatherRouter);

// Configuración de la API de Spotify
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    accessToken: process.env.SPOTIFY_ACCESS_TOKEN
});

// Autenticación de la API de Spotify
spotifyApi.clientCredentialsGrant()
    .then(data => {
        console.log('Autenticado con éxito');
        spotifyApi.setAccessToken(data.body['access_token']);
    })
    .catch(error => {
        console.log('Error de autenticación:', error);
    });

// Función para manejar el chat
app.get('/api/v1/chat', (req, res) => {
    res.render('chat'); // Esto renderizará la vista chat.ejs
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

// Ruta para manejar los mensajes del cliente
app.post('/send-message', async (req, res) => {
    const userMessage = req.body.message;
    // Lógica para procesar el mensaje del usuario y obtener la respuesta del chat
    try {
        const response = await chat(userMessage);
        res.json({ message: response });
    } catch (error) {
        console.error('Error processing message:', error);
        res.status(500).json({ message: 'Error processing message' });
    }
});

// Ruta para mostrar la interfaz de chat
app.get('/chat', (req, res) => {
    res.render('chat'); // Renderiza el archivo chat.ejs
});

// Manejador de errores
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

function addAlbum() {
    // Obtener los datos del formulario
    const formData = new FormData(document.getElementById("addAlbumForm"));

    // Enviar la solicitud POST al servidor utilizando AJAX
    fetch('/api/v1/albums', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al añadir el álbum');
        }
        return response.json();
    })
    .then(album => {
        // Actualizar la página o realizar alguna acción adicional
        location.reload(); // Actualizar la página después de añadir el álbum
    })
    .catch(error => {
        console.error('Error:', error);
        // Manejar el error si la solicitud falla
    });
}

console.log('App running on url: http://localhost:3000/api/v1/');

module.exports = app;
