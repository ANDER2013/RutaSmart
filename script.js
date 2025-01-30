document.getElementById('showRegisterForm').addEventListener('click', function() {
    // Ocultar el formulario de inicio de sesión y mostrar el formulario de registro
    document.getElementById('registerSection').style.display = 'block';
    document.querySelector('.login-section form').style.display = 'none';
});

document.getElementById('backToLogin').addEventListener('click', function() {
    // Volver al formulario de inicio de sesión
    document.getElementById('registerSection').style.display = 'none';
    document.querySelector('.login-section form').style.display = 'block';
});

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Obtener los datos del formulario de registro
    const name = document.getElementById('registerName').value;
    const phone = document.getElementById('registerPhone').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    // Validar si los campos están llenos
    if (name === '' || phone === '' || email === '' || password === '') {
        alert('Por favor, completa todos los campos.');
    } else {
        // Almacenar los datos del usuario en localStorage (o en una base de datos si lo prefieres)
        localStorage.setItem('userName', name);
        localStorage.setItem('userPhone', phone);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userPassword', password);

        alert('Cuenta creada exitosamente. Ahora puedes iniciar sesión.');

        // Regresar al formulario de inicio de sesión
        document.getElementById('registerSection').style.display = 'none';
        document.querySelector('.login-section form').style.display = 'block';
    }
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const phone = document.getElementById('phoneNumber').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validar si los campos están llenos
    if (phone === '' || email === '' || password === '') {
        alert('Por favor, completa todos los campos.');
    } else {
        const storedEmail = localStorage.getItem('userEmail');
        const storedPassword = localStorage.getItem('userPassword');

        // Validar el inicio de sesión
        if (email === storedEmail && password === storedPassword) {
            alert('Inicio de sesión exitoso. Redirigiendo...');
            window.location.href = "dashboard.html";  // Redirigir al dashboard
        } else {
            alert('Credenciales incorrectas.');
        }
    }
});

// Función para calcular la distancia entre dos puntos usando la fórmula de Haversine
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distancia en kilómetros
    return distance * 1000; // Convertir a metros
}

function toRad(degrees) {
    return degrees * Math.PI / 180;
}

// Ubicación simulada del taxi (normalmente esto vendría del servidor o de una app)
var taxiLat = -3.9910; // Latitud del taxi
var taxiLon = -79.2040; // Longitud del taxi

// Función que ejecuta la comprobación de la distancia
function checkTaxiProximity() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var userLat = position.coords.latitude;
            var userLon = position.coords.longitude;
            
            // Calcular la distancia entre el taxi y el cliente
            var distance = haversine(userLat, userLon, taxiLat, taxiLon);

            // Si la distancia es menor que 100 metros
            if (distance < 100) {
                sendNotification(); // Enviar notificación
            }
        });
    } else {
        alert("La geolocalización no está soportada por tu navegador.");
    }
}

setInterval(checkTaxiProximity, 10000);

if (Notification.permission !== 'granted') {
    Notification.requestPermission();
}

function sendNotification() {
    if (Notification.permission === 'granted') {
        var notification = new Notification('¡Tu taxi está cerca!', {
            body: 'Tu taxi está a menos de 100 metros de tu ubicación.',
            icon: 'resources/taxis.jpg'
        });

        notification.onclick = function() {
            window.location.href = 'dashboard.html'; 
        };
    }
}

const socket = io(); // Conexión con el servidor

document.getElementById("taxiRequestForm").addEventListener("submit", (event) => {
    event.preventDefault();
    
    const name = document.getElementById("name").value;
    const pickup = document.getElementById("pickup").value;
    
    if (name && pickup) {
        socket.emit("requestTaxi", { name, pickup });
        alert("Solicitud enviada.");
        document.getElementById("taxiRequestForm").reset();
    } else {
        alert("Por favor, completa todos los campos.");
    }
});

// Escuchar actualizaciones en la lista de solicitudes
socket.on("updateRequests", (requests) => {
    const requestsList = document.getElementById("requestsList");
    requestsList.innerHTML = "";

    requests.forEach((request, index) => {
        const div = document.createElement("div");
        div.classList.add("request-item");
        div.innerHTML = `
            <p><strong>Nombre:</strong> ${request.name}</p>
            <p><strong>Ubicación:</strong> ${request.pickup}</p>
            <button onclick="acceptRequest(${index})">Aceptar</button>
            <button onclick="rejectRequest(${index})">Rechazar</button>
        `;
        requestsList.appendChild(div);
    });

    if (requests.length > 0) {
        document.getElementById("newRequestNotification").style.display = "block";
        document.getElementById("notificationSound").play();
    }
});

// Aceptar una solicitud de taxi
function acceptRequest(index) {
    socket.emit("acceptRequest", index);
}

// Rechazar una solicitud de taxi
function rejectRequest(index) {
    socket.emit("rejectRequest", index);
}

// Notificar al cliente cuando su solicitud es aceptada
socket.on("requestAccepted", (request) => {
    alert(`Tu solicitud ha sido aceptada por un taxista. Recogida en: ${request.pickup}`);
});
