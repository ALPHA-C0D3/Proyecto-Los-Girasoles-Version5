// routes/habitaciones.routes.js
// Rutas de habitaciones

const express = require('express');
const router = express.Router();
const {
    obtenerHabitaciones,
    obtenerHabitacionPorId,
    crearHabitacion,
    actualizarHabitacion,
    eliminarHabitacion,
    cambiarDisponibilidad
} = require('../controllers/habitacionesController');
const { verificarToken, esAdmin } = require('../middlewares/auth');

// GET /api/habitaciones - Obtener todas las habitaciones (público)
router.get('/', obtenerHabitaciones);

// GET /api/habitaciones/:id - Obtener una habitación por ID (público)
router.get('/:id', obtenerHabitacionPorId);

// POST /api/habitaciones - Crear nueva habitación (solo admin)
router.post('/', verificarToken, esAdmin, crearHabitacion);

// PUT /api/habitaciones/:id - Actualizar habitación (solo admin)
router.put('/:id', verificarToken, esAdmin, actualizarHabitacion);

// DELETE /api/habitaciones/:id - Eliminar habitación (solo admin)
router.delete('/:id', verificarToken, esAdmin, eliminarHabitacion);

// PATCH /api/habitaciones/:id/disponibilidad - Cambiar disponibilidad (solo admin)
router.patch('/:id/disponibilidad', verificarToken, esAdmin, cambiarDisponibilidad);

module.exports = router;