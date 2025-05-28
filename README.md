# 🎧 MusicHub API

![Version](https://img.shields.io/badge/version-2.0.0-yellow)
![Node.js](https://img.shields.io/badge/Node.js-v14%2B-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![Spotify API](https://img.shields.io/badge/API-Spotify-blue)
![OpenAI](https://img.shields.io/badge/OpenAI-ChatBot-purple)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

**API RESTful para explorar, buscar y disfrutar información musical**  
MusicHub combina el poder de **Node.js**, **MongoDB**, **Spotify**, **MusicBrainz** y **OpenAI** para ofrecer una experiencia musical interactiva y divertida, con una interfaz inspirada en Spotify.

[![CI](![License](https://img.shields.io/badge/license-MIT-lightgrey)branch=main)](https://github.com/martacanirome4/MusicHub/actions)
[![Last commit](https://img.shields.io/github/last-commit/martacanirome4/MusicHub)](https://github.com/martacanirome4/MusicHub/commits/main)

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

## 🛠️ Tecnologías Utilizadas

| Tecnología     | Uso                               |
|----------------|-----------------------------------|
| Node.js        | Backend (API REST)                |
| Express        | Servidor web                      |
| MongoDB        | Base de datos                     |
| Spotify API    | Datos musicales                   |
| MusicBrainz    | Metadatos musicales               |
| OpenAI API     | ChatBot musical                   |
| React/Vite     | Interfaz de usuario               |
| YAML/OpenAPI   | Documentación de la API           |

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

## 👥 Miembros del Equipo

- Dulibeth Medina
[@Dulibeth](https://github.com/Dulibeth) – GitHub 2023
- Xavier Alexander Mora
[@XMoraP](https://github.com/XMoraP) – GitHub 2023
- Guillermo Woivre
[@GWoivre](https://github.com/GWoivre) – GitHub 2023
- Marta Canino Romero  
[@martacanirome4](https://github.com/martacanirome4) – GitHub 2023
