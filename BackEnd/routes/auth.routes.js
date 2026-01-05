// routes/auth.routes.js
// Rutas de autenticación

const express = require('express');
const router = express.Router();
const { registro, login, obtenerPerfil } = require('../controllers/authController');
const { verificarToken } = require('../middlewares/auth');

// POST /api/auth/registro - Registrar nuevo usuario
router.post('/registro', registro);

// POST /api/auth/login - Iniciar sesión
router.post('/login', login);

// GET /api/auth/perfil - Obtener perfil del usuario autenticado
router.get('/perfil', verificarToken, obtenerPerfil);

module.exports = router;