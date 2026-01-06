// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { registro, login, obtenerPerfil, cambiarPassword } = require('../controllers/authController');
const { verificarToken } = require('../middlewares/auth');

router.post('/registro', registro);
router.post('/login', login);
router.get('/perfil', verificarToken, obtenerPerfil);
router.put('/cambiar-password', verificarToken, cambiarPassword);

module.exports = router;