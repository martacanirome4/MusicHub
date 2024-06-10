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
  let url = '/artists';
  if (next) {
      url += `?next=${next}`;
  }
  
  try {
    // Realizar la llamada a la API para obtener los álbumes
    const response = await apiClient.get(url);;
    const artists = response.data.artists;
    
    // Calcular el valor de `next` para el siguiente conjunto de álbumes
    const next = response.data.next; // Asegúrate de definir `next` aquí
    
    // Renderizar la plantilla EJS con los resultados de la consulta y el valor de `next`
    res.render('artists', { artists, next });
  } catch (error) {
    // Manejar errores
    console.error('Error al obtener artistas de la API:', error);
    res.status(500).send('Error al obtener artistas de la API');
  }
});

router.post('/', async (req, res) => {
  let newArtist = req.body;
  let url = '/artist';
  await apiClient.post(url, newArtist);
  res.redirect(req.get('referer'));
}); 

router.get('/:artist_uri', async (req, res) => {
  const artistUri = encodeURIComponent(req.params.artist_uri);
  let next = req.query.next ? parseInt(req.query.next, 10) : 0;

  // Construir la URL de la API correctamente
  let url = `/artists/${artistUri}`;
  if (next) {
      url += `?next=${next}`;
  }

  try {
      const response = await apiClient.get(url);
      console.log(response.data)
      const artists = response.data.artists || [];
      next = response.data.next;

      // Si no se encontraron álbumes, pasar un mensaje
      let message = artists.length === 0 ? 'No se encontraron artistas.' : null;

      res.render('artists', { artists, next, message });
  } catch (error) {
      console.error('Error al obtener artista de la API:', error);
      res.status(500).send('Error al obtener artista de la API');
  }
});

module.exports = router;
