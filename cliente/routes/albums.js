// routes/api.js
var express = require('express');
var router = express.Router();
var apiClient = require('../services/musicHub');

const MAX_RESULTS = 10; // Define el número máximo de resultados por página

router.get('/', async (req, res) => {
  // Obtener el valor de `next` de la consulta
  let next = req.query.next;
  let query = {};
  
  // Si `next` está presente, añadirlo como parámetro en la consulta a la API
  let url = '/albums';
  if (next) {
      url += `?next=${next}`;
  }

  try {
    // Realizar la llamada a la API para obtener los álbumes
    const response = await apiClient.llamarAPI(url);
    const albums = response.albums;
    
    // Calcular el valor de `next` para el siguiente conjunto de álbumes
    next = response.next;

    // Renderizar la plantilla EJS con los resultados de la consulta y el valor de `next`
    res.render('albums', { albums, next });
  } catch (error) {
    // Manejar errores
    console.error('Error al obtener álbumes de la API:', error);
    res.status(500).send('Error al obtener álbumes de la API');
  }
});


module.exports = router;
