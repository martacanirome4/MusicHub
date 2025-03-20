# 🎧 MusicHub API

![Version](https://img.shields.io/badge/version-2.0.0-yellow)

**API RESTful para explorar, buscar y disfrutar información musical**  
MusicHub combina el poder de **Node.js**, **MongoDB**, **Spotify**, **MusicBrainz** y **OpenAI** para ofrecer una experiencia musical interactiva y divertida, con una interfaz inspirada en Spotify.

---

## 🎼 Descripción

MusicHub es una plataforma para **explorar y gestionar música** a través de múltiples fuentes de datos, con un toque inteligente gracias al chat integrado con OpenAI.

![MusicHub Interface](https://github.com/martacanirome4/MusicHub/assets/50625677/ebb53804-fa18-4419-bf0a-666e50f657a9)

---

## ✨ Características

- 🎵 **Exploración de música**: Busca álbumes, canciones y artistas.
- 💬 **ChatBot musical**: Pide recomendaciones y obtén información musical personalizada.
- 🎧 **Integración con Spotify**: Accede y gestiona datos directamente desde Spotify.
- 🌐 **Búsqueda en MusicBrainz**: Información detallada de artistas a nivel global.
- 🖥️ **Interfaz atractiva**: UI moderna estilo Spotify.

---

## 📦 Contenido del Proyecto

- `/api`: API REST principal.
- `/api/schema/musichub.yaml`: Especificación OpenAPI.
- `/cliente`: Interfaz de usuario.
- `/dataset`: Base de datos (JSON/CSV).
- `/setup/setup_musichub.sh`: Script para cargar datos.
- `sw-MusicHub.pdf`: Presentación de la API.

---

## 🛠️ Requisitos

- Node.js v14+
- MongoDB
- Cuenta de Spotify Developers
- Cuenta de OpenAI

---

## 🚀 Instalación y Ejecución

### 1. Clonar repositorio:
```bash
git clone https://github.com/martacanirome4/MusicHub.git
cd MusicHub/
```

### 2. Configurar variables de entorno en `/api/.env`:
```env
BASE_URI=/api/v1
SPOTIFY_CLIENT_ID=tu-spotify-client-id
SPOTIFY_CLIENT_SECRET=tu-spotify-client-secret
MONGODB_URI=tu-mongodb-uri
OPENAI_API_KEY=tu-openai-api-key
MAX_RESULTS=10
```

### 3. Iniciar servidor (desde `/api`):
```bash
npm install
npm start
```

### 4. Iniciar cliente (desde `/cliente`):
```bash
# Configurar .env
BASE_URI=/

npm install
npm start
```

### 5. Accede a MusicHub en tu navegador:
```bash
http://localhost:3003/
```

---

## 🧩 Endpoints Principales

| Recurso     | Endpoint                                |
|-------------|-----------------------------------------|
| Álbumes     | `/albums`                               |
| Artistas    | `/artists`                              |
| Canciones   | `/tracks`                               |

### Ejemplos de Solicitudes

- Obtener álbumes:
```bash
GET http://localhost:3000/api/v1/albums
```
- Buscar canción en Spotify:
```bash
GET http://localhost:3000/api/v1/spotify/search?name=supercalifragilisticexpialidocious
```
- Buscar artista en MusicBrainz:
```bash
GET http://localhost:3000/api/v1/musicbrainz/search?name=adele
```

---

## 🎥 Recursos Interactivos

- 🎬 [Video: ¿Cómo funciona Spotify? – Tech Vision](https://www.youtube.com/watch?v=7Jr3e3bv5nQ)
- 📚 [API de Spotify – Documentación oficial](https://developer.spotify.com/documentation/web-api)
- 🎵 [MusicBrainz – Proyecto de metadatos musicales](https://musicbrainz.org/)
- 🤖 [OpenAI API – Guía para integraciones](https://platform.openai.com/docs/guides/gpt)

---

## 🎶 Temática
Música

---

## 👥 Miembros del Equipo

- Dulibeth Medina  
- Xavier Alexander Mora  
- Guillermo Woivre  
- Marta Canino Romero  
[@martacanirome4](https://github.com/martacanirome4) – GitHub 2023
