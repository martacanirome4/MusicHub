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


