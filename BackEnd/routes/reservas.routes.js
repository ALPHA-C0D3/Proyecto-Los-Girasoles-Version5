// routes/reservas.routes.js
const express = require('express');
const router = express.Router();
const {
    crearReserva,
    obtenerReservasCliente,
    obtenerTodasReservas,
    aprobarReserva,
    rechazarReserva,
    cancelarReserva,
    obtenerComprobante,
    obtenerEstadisticas,
    obtenerAuditoriaReserva  // ← AGREGAR ESTO
} = require('../controllers/reservasController');
const { verificarToken, esAdmin } = require('../middlewares/auth');
const { upload, manejarErrorUpload } = require('../middlewares/upload');

router.post('/', verificarToken, upload.single('comprobante'), manejarErrorUpload, crearReserva);
router.get('/cliente', verificarToken, obtenerReservasCliente);
router.get('/todas', verificarToken, esAdmin, obtenerTodasReservas);
router.get('/estadisticas', verificarToken, esAdmin, obtenerEstadisticas);
router.put('/:id/aprobar', verificarToken, esAdmin, aprobarReserva);
router.put('/:id/rechazar', verificarToken, esAdmin, rechazarReserva);
router.delete('/:id', verificarToken, cancelarReserva);
router.get('/:id/comprobante', verificarToken, obtenerComprobante);

// NUEVA RUTA: Obtener auditoría de una reserva
router.get('/:id/auditoria', verificarToken, esAdmin, obtenerAuditoriaReserva);

module.exports = router;