const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Usar body-parser para parsear las solicitudes POST
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint para recibir la solicitud de taxi
app.post('/request-taxi', (req, res) => {
    const { name, phone, pickup } = req.body;
    console.log(`Solicitud de taxi recibida:
        Nombre: ${name}
        Teléfono: ${phone}
        Ubicación: ${pickup}
    `);
    res.send('Solicitud de taxi enviada');
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor funcionando en el puerto 3000');
});
