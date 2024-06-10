 // Añadir un evento para manejar la búsqueda al enviar el formulario
 document.getElementById('searchForm').onsubmit = function(event) {
    event.preventDefault(); // Prevenir el envío del formulario
    const query = document.getElementById('search_query').value; // Obtener el valor de búsqueda
    // Redirigir a la URL correcta con el URI del álbum
    window.location.href = `/api/v1/albums/${encodeURIComponent(query)}`;
};

document.getElementById('putForm').onsubmit = async function(event) {
    event.preventDefault(); // Prevenir el envío del formulario

    const albumUri = document.getElementById('album_put').value; // URI actual del álbum
    const albumName = document.getElementById('album_name_put').value;
    const newAlbumUri = document.getElementById('album_uri_put').value; // Nueva URI del álbum
    const artistNames = document.getElementById('artist_names_put').value;
    const albumReleaseDate = document.getElementById('album_release_date_put').value;
    const albumImageUrl = document.getElementById('album_image_url_put').value;

    const formData = {
        album_uri: newAlbumUri,
        album_name: albumName,
        artist_names: artistNames.split(',').map(name => name.trim()),
        album_release_date: albumReleaseDate,
        album_image_url: albumImageUrl
    };

    try {
        const response = await fetch(`/api/v1/albums/${albumUri}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        console.log(albumUri)
        // Redirigir a la página de álbumes después de eliminar
        window.location.href = '/api/v1/albums';
    } catch (error) {
        console.error('Error:', error);
        // Manejar el error si la solicitud falla
    }
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
        console.log(albumId)
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
