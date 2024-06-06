# MusicHub

![License](https://img.shields.io/github/license/martacanirome4/API_REST_SWII)
![Version](https://img.shields.io/badge/version-1.0.0-brightgreen)

## Descripción

MusicHub es una API RESTful con temática musical desarrollada con Node.js y Express, que permite explorar y gestionar información musical a través de diversas fuentes de datos como MongoDB, Spotify y MusicBrainz.

## Características

- **Exploración de música**: Busca y explora álbumes, canciones y artistas.
- **Integración con Spotify**: Obtén y gestiona datos de música de Spotify.
- **Búsqueda de artistas en MusicBrainz**: Encuentra información detallada sobre artistas.
- **Interfaz de usuario atractiva**: Interfaz moderna y fácil de usar inspirada en Spotify.

## Requisitos

- Node.js v14+
- MongoDB
- Cuenta de desarrollador de Spotify

## Instalación

1. Clona este repositorio:
    ```bash
    git clone https://github.com/martacanirome4/API_REST_SWII
    cd tu-repo/api
    ```

2. Instala las dependencias:
    ```bash
    npm install
    ```

3. Configura las variables de entorno en un archivo `.env`:
    ```env
    BASE_URI=/api/v1
    SPOTIFY_CLIENT_ID=tu-spotify-client-id
    SPOTIFY_CLIENT_SECRET=tu-spotify-client-secret
    MONGODB_URI=tu-mongodb-uri
    OPENAI_API_KEY=tu-openai-api-key
    MAX_RESULTS=10
    ```

4. Inicia el servidor:
    ```bash
    npm start
    ```

## Uso

### Endpoints Principales

- **Álbumes**: `/api/v1/albums`
- **Canciones**: `/api/v1/tracks`
- **Spotify**: `/api/v1/spotify`
- **MusicBrainz**: `/api/v1/musicbrainz`
- **Chat**: `/api/v1/chat`

### Ejemplo de Solicitud

Busca un artista en MusicBrainz:
```bash
GET /api/v1/musicbrainz/search?name=artista

## Temática
Música

## Miembros del equipo
- Dulibeth Medina 
- Xavier Alexander Mora
- Guillermo Woivre
- Marta Canino

