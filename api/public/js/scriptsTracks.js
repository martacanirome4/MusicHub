document.getElementById('searchForm').onsubmit = function(event) {
    event.preventDefault(); // Prevenir el envío del formulario
    const query = document.getElementById('search_query').value; // Obtener el valor de búsqueda
    // Redirigir a la URL correcta con el URI de la canción
    window.location.href = `/api/v1/tracks/${encodeURIComponent(query)}`;
};

const sidebar = document.getElementById('sidebar');
const navbarToggle = document.getElementById('navbar-toggle');
        
navbarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('show');
});

const sidebar = document.getElementById('sidebar');
const navbarToggle = document.getElementById('navbar-toggle');
        
navbarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('show');
});


document.getElementById('deleteForm').onsubmit = async function(event) {
    event.preventDefault(); // Prevenir el envío del formulario
    const trackId = document.getElementById('track_id').value; // Obtener el ID del álbum
    // Enviar la solicitud DELETE
    try {
        const response = await fetch(`/api/v1/tracks/${trackId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ track_id: trackId })
        });
        console.log(trackId)
        // Redirigir a la página de álbumes después de eliminar
        window.location.href = '/api/v1/tracks';
    } catch (error) {
        console.error('Error:', error);
        // Manejar el error si la solicitud falla
    }
};
