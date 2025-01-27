const express = require('express');
const router = express.Router();
const pool = require('./database'); // Conexión a tu base de datos

// Guardar un viaje
router.post('/historial', async (req, res) => {
  const { usuario_id, taxista_id, origen, destino, costo, estado } = req.body;
  const fecha = new Date(); // Fecha actual

  try {
    const result = await pool.query(
      'INSERT INTO historial_viajes (usuario_id, taxista_id, origen, destino, fecha, costo, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [usuario_id, taxista_id, origen, destino, fecha, costo, estado]
    );
    res.status(200).json({ message: 'Historial guardado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
