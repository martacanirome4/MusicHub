document.getElementById('searchForm').onsubmit = function(event) {
    event.preventDefault(); // Prevenir el envío del formulario
    const query = document.getElementById('search_query').value; // Obtener el valor de búsqueda
    // Redirigir a la URL correcta con el URI de la canción
    window.location.href = `/api/v1/artists/${encodeURIComponent(query)}`;
};

const sidebar = document.getElementById('sidebar');
const navbarToggle = document.getElementById('navbar-toggle');
        
navbarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('show');
});

document.getElementById('putForm').onsubmit = async function(event) {
    event.preventDefault(); // Prevenir el envío del formulario

    const artistUri = document.getElementById('artist_put').value; // URI actual del álbum
    const artistName = document.getElementById('artist_name_put').value;
    const newartistUri = document.getElementById('artist_uri_put').value; // Nueva URI del álbum


    const formData = {
        artists_uri: newartistUri,
        artists_name: artistName,
    };

    try {
        const response = await fetch(`/api/v1/artists/${artistUri}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        console.log(artistUri)
        // Redirigir a la página de álbumes después de eliminar
        window.location.href = '/api/v1/artists';
    } catch (error) {
        console.error('Error:', error);
        // Manejar el error si la solicitud falla
    }
};
