// routes/api.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const baseURL = 'http://localhost:3000/api/v1';
const apiClient = axios.create({
  baseURL,
});

router.get('/', async (req, res) => {
  // Obtener el valor de `next` de la consulta
  let next = req.query.next;
  
  // Si `next` está presente, añadirlo como parámetro en la consulta a la API
  let url = '/albums';
  if (next) {
      url += `?next=${next}`;
  }
  
  try {
    // Realizar la llamada a la API para obtener los álbumes
    const response = await apiClient.get(url);
    const albums = response.data.albums;
    
    // Calcular el valor de `next` para el siguiente conjunto de álbumes
    const next = response.data.next; // Asegúrate de definir `next` aquí
    
    // Renderizar la plantilla EJS con los resultados de la consulta y el valor de `next`
    res.render('albums', { albums, next });
  } catch (error) {
    // Manejar errores
    console.error('Error al obtener álbumes de la API:', error);
    res.status(500).send('Error al obtener álbumes de la API');
  }
});

router.post('/', async (req, res) => {
    let newAlbum = req.body;
    let url = '/albums';
    await apiClient.post(url, newAlbum);
    res.redirect(req.get('referer'));
}); 

router.get('/:album_uri', async (req, res) => {
    const albumUri = encodeURIComponent(req.params.album_uri);
    let next = req.query.next ? parseInt(req.query.next, 10) : 0;

    // Construir la URL de la API correctamente
    let url = `/albums/${albumUri}`;
    if (next) {
        url += `?next=${next}`;
    }

    try {
        const response = await apiClient.get(url);
        const albums = response.data.albums || [];
        next = response.data.next;

        // Si no se encontraron álbumes, pasar un mensaje
        let message = albums.length === 0 ? 'No se encontraron álbumes.' : null;

        res.render('albums', { albums, next, message });
    } catch (error) {
        console.error('Error al obtener álbum de la API:', error);
        res.status(500).send('Error al obtener álbum de la API');
    }
});

router.put('/:album_uri', async (req, res) => {
    const albumUri = decodeURIComponent(req.params.album_uri);
    const updatedAlbum = req.body;
    const url = `/albums/${albumUri}`;
    await apiClient.put(url, updatedAlbum);
    res.redirect(req.get('referer'));
});

router.delete('/:album_uri', async (req, res) => {
    const albumUri = decodeURIComponent(req.params.album_uri);
    const url = `/albums/${albumUri}`;
    await apiClient.delete(url);
    res.redirect(req.get('referer'));
});

module.exports = router;
