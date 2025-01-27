// Obtener historial por usuario
router.get('/historial/:usuario_id', async (req, res) => {
    const { usuario_id } = req.params;
  
    try {
      const result = await pool.query(
        'SELECT * FROM historial_viajes WHERE usuario_id = ? ORDER BY fecha DESC',
        [usuario_id]
      );
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  