// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { 
    registro, 
    login, 
    obtenerPerfil, 
    cambiarPassword,
    solicitarRecuperacion,
    verificarCodigoRecuperacion,
    resetearPassword,
    resetearPasswordConToken  // ← AGREGAR ESTA
} = require('../controllers/authController');
const { verificarToken } = require('../middlewares/auth');

// Rutas públicas
router.post('/registro', registro);
router.post('/login', login);

// Recuperación de contraseña
router.post('/solicitar-recuperacion', solicitarRecuperacion);
router.post('/verificar-codigo', verificarCodigoRecuperacion);
router.post('/resetear-password', resetearPassword);
router.post('/resetear-password-token', resetearPasswordConToken);  // ← NUEVA RUTA

// Rutas protegidas
router.get('/perfil', verificarToken, obtenerPerfil);
router.put('/cambiar-password', verificarToken, cambiarPassword);

module.exports = router;
