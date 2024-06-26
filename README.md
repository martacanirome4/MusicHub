# MusicHub

![Version](https://img.shields.io/badge/version-2.0.0-yellow)

## Descripción

MusicHub es una API RESTful con temática musical desarrollada con Node.js y Express, que permite explorar y gestionar información musical a través de diversas fuentes de datos como MongoDB, Spotify y MusicBrainz, así como un chat integrado de OpenAI.

## Características

- **Exploración de música**: Busca y explora álbumes, canciones y artistas.
- **ChatBot**: Pide recomendaciones musicales o solicita información de artistas y canciones.
- **Integración con Spotify**: Obtén y gestiona datos de música de Spotify.
- **Búsqueda de artistas en MusicBrainz**: Encuentra información detallada sobre artistas.
- **Interfaz de usuario atractiva**: Interfaz moderna y fácil de usar inspirada en Spotify.

## Contenido del Proyecto

- **Interfaz REST para la API** (/api)
- **Archivo OpenAPI con la descripción del servicio** (/api/schema/musichub.yaml')
- **Interfaz de usuario para cliente** (/cliente)
- **Base de datos MongoDB** (/dataset/musichub_dataset.json) (dataset/musichub_dataset.csv)
- **Script para cargar los datos iniciales en la base de datos** (/setup/setup_musichub.sh)
- **Presentación de la API** (sw-MusicHub.pdf)

## Requisitos

- Node.js v14+
- MongoDB
- Cuenta de desarrollador de Spotify (para la key)
- Cuenta de OpenAI (para la key)

## Instalación

1. Clona este repositorio:
    ```bash
    git clone https://github.com/martacanirome4/MusicHub.git
    cd MusicHub/
    ```

3. Configura las variables de entorno en un archivo `.env` en '/api':
    ```env
    BASE_URI=/api/v1
    SPOTIFY_CLIENT_ID=tu-spotify-client-id
    SPOTIFY_CLIENT_SECRET=tu-spotify-client-secret
    MONGODB_URI=tu-mongodb-uri
    OPENAI_API_KEY=tu-openai-api-key
    MAX_RESULTS=10
    ```

4. Inicia el servidor desde '/api':
     ```bash
    npm install
    npm start
    ```
4. **Inicia el cliente desde '/cliente'**:
   
   Crea otro archivo '/.env' y asegúrate de tener lo siguiente:
   ```env
   BASE_URI=/
   ```
 
    Instala las dependencias e inicia el lado del cliente:
    ```bash
    npm install
    npm start
    ```
5. Disfruta de la API:
   
   Introduce la siguiente URL en tu navegador y navega por sus recursos:
   ```bash
   http://localhost:3003/
   ```

### Endpoints Principales de la API

- **Álbumes**: `/albums`
- **Artistas**: `/artists`
- **Canciones**: `/tracks`

### Ejemplos de Solicitudes

Obtener los álbumes (con paginación):
```bash
GET http://localhost:3000/api/v1/albums

```
Buscar una canción de Spotify:
```bash
GET http://localhost:3000/api/v1/spotify/search?name=supercalifragilisticexpialidocious

```
Obtener metadatos de un artista de MusicBrainz:
```bash
GET http://localhost:3000/api/v1/musicbrainz/search?name=adele
```
Añadir un artista: 
({BASE_URI} = **http://localhost:3000/api/v1/**)
![postartist](https://github.com/martacanirome4/MusicHub/assets/50625677/ebb53804-fa18-4419-bf0a-666e50f657a9)

## Temática
Música

## Miembros del equipo
- Dulibeth Medina 
- Xavier Alexander Mora
- Guillermo Woivre
- Marta Canino
