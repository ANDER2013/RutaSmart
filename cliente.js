var map = L.map('map').setView([LAT_INICIAL, LON_INICIAL], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

var userMarker;

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var userLat = position.coords.latitude;
            var userLon = position.coords.longitude;

            if (!userMarker) {
                userMarker = L.marker([userLat, userLon]).addTo(map);
            } else {
                userMarker.setLatLng([userLat, userLon]);
            }

            map.setView([userLat, userLon], 12);
        });
    } else {
        alert("Geolocalización no soportada.");
    }
}

getUserLocation();

function setDestination() {
    var lat = parseFloat(document.getElementById('latitude').value);
    var lon = parseFloat(document.getElementById('longitude').value);

    if (isNaN(lat) || isNaN(lon)) {
        alert("Por favor ingresa coordenadas válidas.");
        return;
    }

    alert("Destino establecido: " + lat + ", " + lon);
}

document.addEventListener('DOMContentLoaded', async () => {
    const usuarioId = 1; // Aquí debes obtener el ID del usuario autenticado (ej. desde el localStorage o cookies)
  
    try {
      const response = await fetch(`/historial/${usuarioId}`);
      const historial = await response.json();
  
      const listaHistorial = document.getElementById('lista-historial');
      historial.forEach(viaje => {
        const item = document.createElement('li');
        item.textContent = `Origen: ${viaje.origen}, Destino: ${viaje.destino}, Fecha: ${new Date(viaje.fecha).toLocaleString()}, Costo: $${viaje.costo}`;
        listaHistorial.appendChild(item);
      });
    } catch (error) {
      console.error('Error al obtener el historial:', error);
    }
  });
  