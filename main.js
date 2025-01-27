var map = L.map('map').setView([-3.9935, -79.2041], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

var userMarker;

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var userLat = position.coords.latitude;
            var userLon = position.coords.longitude;

            if (userMarker) {
                userMarker.setLatLng([userLat, userLon]);
            } else {
                userMarker = L.marker([userLat, userLon]).addTo(map);
            }

            map.setView([userLat, userLon], 15);
        }, function (error) {
            alert("No se pudo obtener tu ubicación.");
        });
    } else {
        alert("La geolocalización no está soportada por tu navegador.");
    }
}

getUserLocation();
