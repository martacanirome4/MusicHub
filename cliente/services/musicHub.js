const axios = require('axios');

// URL base de tu API
const baseURL = 'http://localhost:3000/api/v1';

// Crear una instancia de Axios con la URL base
const apiClient = axios.create({
  baseURL,
});

// Función para llamar a la API
async function llamarAPI(url = '/') {
  try {
    // Realizar una petición GET a una ruta específica de la API
    const response = await apiClient.get(url);
    return response.data;
    // Manejar la respuesta de la API
    console.log('Respuesta de la API:', response.data);
  } catch (error) {
    // Manejar errores de la petición
    console.error('Error al llamar a la API:', error);
    throw error; // Re-lanzar el error para que el cliente pueda manejarlo
  }
}

module.exports = {
  llamarAPI,
};
