const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let requests = [];  // Lista de solicitudes de taxis (en memoria)

app.use(express.static('public'));  // Carpeta donde estará tu código HTML, JS, etc.

io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado');

    // Enviar todas las solicitudes existentes al nuevo cliente (taxista o cliente)
    socket.emit('initialRequests', requests);

    // Escuchar por nuevas solicitudes de taxi
    socket.on('newRequest', (request) => {
        requests.push(request);
        io.emit('newRequest', request);  // Notificar a todos los taxistas
    });

    // Aceptar solicitud
    socket.on('acceptRequest', (requestIndex) => {
        const acceptedRequest = requests.splice(requestIndex, 1)[0];
        io.emit('acceptRequest', acceptedRequest);
    });

    // Rechazar solicitud
    socket.on('rejectRequest', (requestIndex) => {
        requests.splice(requestIndex, 1);
        io.emit('rejectRequest', requestIndex);
    });

    socket.on('disconnect', () => {
        console.log('Un usuario se ha desconectado');
    });
});

server.listen(3000, () => {
    console.log('Servidor en el puerto 3000');
});
