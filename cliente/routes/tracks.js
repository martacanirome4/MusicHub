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
  let url = '/tracks';
  if (next) {
      url += `?next=${next}`;
  }
  
  try {
    // Realizar la llamada a la API para obtener los álbumes
    const response = await apiClient.get(url);;
    const tracks = response.data.tracks;
    
    // Calcular el valor de `next` para el siguiente conjunto de álbumes
    const next = response.data.next; // Asegúrate de definir `next` aquí
    
    // Renderizar la plantilla EJS con los resultados de la consulta y el valor de `next`
    res.render('tracks', { tracks, next });
  } catch (error) {
    // Manejar errores
    console.error('Error al obtener canciones de la API:', error);
    res.status(500).send('Error al obtener canciones de la API');
  }
});

router.post('/', async (req, res) => {
  let newTrack = req.body;
  let url = '/tracks';
  await apiClient.post(url, newTrack);
  res.redirect(req.get('referer'));
}); 


router.get('/:track_uri', async (req, res) => {
  const trackUri = encodeURIComponent(req.params.track_uri);
  let next = req.query.next ? parseInt(req.query.next, 10) : 0;

  // Construir la URL de la API correctamente
  let url = `/tracks/${trackUri}`;
  if (next) {
      url += `?next=${next}`;
  }

  try {
      const response = await apiClient.get(url);
      const tracks = response.data.tracks || [];
      next = response.data.next;

      // Si no se encontraron álbumes, pasar un mensaje
      let message = tracks.length === 0 ? 'No se encontraron canciones.' : null;

      res.render('tracks', { tracks, next, message });
  } catch (error) {
      console.error('Error al obtener canción de la API:', error);
      res.status(500).send('Error al obtener canción de la API');
  }
});


router.put('/:track_uri', async (req, res) => {
  const trackUri = decodeURIComponent(req.params.track_uri);
  const updatedTrack = req.body;
  const url = `/tracks/${trackUri}`;
  await apiClient.put(url, updatedTrack);
  res.redirect(req.get('referer'));
});

module.exports = router;
