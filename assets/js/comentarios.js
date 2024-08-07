// Archivo: /assets/js/comentarios.js

document.getElementById('comentarioForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const comentario = document.getElementById('comentario').value;
    const vista = document.querySelector('main').getAttribute('data-vista');

    fetch('https://tuguiamedicani.com/comentarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, comentario, vista })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Hubo un problema al enviar tu comentario. Por favor, inténtalo de nuevo.');
        }
        return response.text();
    })
    .then(data => {
        showMessage('Comentario Enviado', 'success');
        document.getElementById('nombre').value = ''; // Limpiar el campo nombre
        document.getElementById('comentario').value = ''; // Limpiar el campo comentario
        cargarComentarios();
    })
    .catch(error => {
        showMessage(error.message, 'error');
    });
});

function cargarComentarios() {
    const vista = document.querySelector('main').getAttribute('data-vista');
    fetch(`https://tuguiamedicani.com/comentarios?vista=${vista}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Hubo un problema al cargar los comentarios. Por favor, inténtalo de nuevo.');
        }
        return response.json();
    })
    .then(data => {
        const comentariosDiv = document.getElementById('comentarios');
        comentariosDiv.innerHTML = '';
        data.forEach(comentario => {
            const comentarioElem = document.createElement('div');
            comentarioElem.innerHTML = `
                <div class="comment-text">${comentario.nombre}: ${comentario.comentario}</div>
                <div class="comment-date">${formatFecha(comentario.fecha)}</div>
            `;
            comentariosDiv.appendChild(comentarioElem);
        });
    })
    .catch(error => {
        showMessage(error.message, 'error');
    });
}

function formatFecha(fechaString) {
    const fecha = new Date(fechaString);
    return fecha.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
}

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;

    // Añadir el mensaje al cuerpo del documento
    document.body.appendChild(messageDiv);

    // Quitar el mensaje después de 5 segundos
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

cargarComentarios();
