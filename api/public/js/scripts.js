 // Añadir un evento para manejar la búsqueda al enviar el formulario
 document.getElementById('searchForm').onsubmit = function(event) {
    event.preventDefault(); // Prevenir el envío del formulario
    const query = document.getElementById('search_query').value; // Obtener el valor de búsqueda
    // Redirigir a la URL correcta con el URI del álbum
    window.location.href = `/api/v1/albums/${encodeURIComponent(query)}`;
};

document.getElementById('deleteForm').onsubmit = async function(event) {
    event.preventDefault(); // Prevenir el envío del formulario

    const albumId = document.getElementById('album_id').value; // Obtener el ID del álbum
    // Enviar la solicitud DELETE
    try {
        const response = await fetch(`/api/v1/albums/${albumId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ album_id: albumId })
        });
        
        // Redirigir a la página de álbumes después de eliminar
        window.location.href = '/api/v1/albums';
    } catch (error) {
        console.error('Error:', error);
        // Manejar el error si la solicitud falla
    }
};

const sidebar = document.getElementById('sidebar');
const navbarToggle = document.getElementById('navbar-toggle');
        
navbarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('show');
});