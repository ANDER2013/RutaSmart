const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // Permitir todas las conexiones (ajustar en producción)
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.static(path.join(__dirname, "public"))); // Servir archivos estáticos (HTML, CSS, JS)

let requests = []; // Lista de solicitudes de taxis

io.on("connection", (socket) => {
    console.log("Nuevo usuario conectado:", socket.id);

    // Enviar solicitudes activas al nuevo taxista o cliente
    socket.emit("updateRequests", requests);

    // Cliente solicita un taxi
    socket.on("requestTaxi", (data) => {
        requests.push(data);
        io.emit("updateRequests", requests);
    });

    // Taxista acepta una solicitud
    socket.on("acceptRequest", (index) => {
        if (requests[index]) {
            const acceptedRequest = requests.splice(index, 1)[0];
            io.emit("requestAccepted", acceptedRequest); // Notificar al cliente
            io.emit("updateRequests", requests); // Actualizar la lista de solicitudes
        }
    });

    // Taxista rechaza una solicitud
    socket.on("rejectRequest", (index) => {
        if (requests[index]) {
            requests.splice(index, 1);
            io.emit("updateRequests", requests);
        }
    });

    socket.on("disconnect", () => {
        console.log("Usuario desconectado:", socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
