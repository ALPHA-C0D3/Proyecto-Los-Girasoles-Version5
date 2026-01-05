// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { runQuery, getOne } = require('../config/database');

const registro = async (req, res) => {
    try {
        const { nombre, apellido, telefono, correo, password, tipoUsuario } = req.body;

        if (!nombre || !apellido || !telefono || !correo || !password) {
            return res.status(400).json({
                success: false,
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        const usuarioExistente = await getOne(
            'SELECT * FROM usuarios WHERE correo = ?',
            [correo]
        );

        if (usuarioExistente) {
            return res.status(400).json({
                success: false,
                mensaje: 'El correo ya está registrado'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const resultado = await runQuery(
            `INSERT INTO usuarios (nombre, apellido, telefono, correo, password, tipoUsuario) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [nombre, apellido, telefono, correo, passwordHash, tipoUsuario || 'cliente']
        );

        res.status(201).json({
            success: true,
            mensaje: 'Usuario registrado exitosamente',
            usuarioId: resultado.id
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al registrar usuario',
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { correo, password } = req.body;

        if (!correo || !password) {
            return res.status(400).json({
                success: false,
                mensaje: 'Correo y contraseña son obligatorios'
            });
        }

        const usuario = await getOne(
            'SELECT * FROM usuarios WHERE correo = ?',
            [correo]
        );

        if (!usuario) {
            return res.status(401).json({
                success: false,
                mensaje: 'Credenciales incorrectas'
            });
        }

        const passwordValido = await bcrypt.compare(password, usuario.password);

        if (!passwordValido) {
            return res.status(401).json({
                success: false,
                mensaje: 'Credenciales incorrectas'
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                correo: usuario.correo,
                tipoUsuario: usuario.tipoUsuario
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.json({
            success: true,
            mensaje: 'Login exitoso',
            token: token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                correo: usuario.correo,
                telefono: usuario.telefono,
                tipoUsuario: usuario.tipoUsuario
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al iniciar sesión',
            error: error.message
        });
    }
};

const obtenerPerfil = async (req, res) => {
    try {
        const usuario = await getOne(
            'SELECT id, nombre, apellido, correo, telefono, tipoUsuario, createdAt FROM usuarios WHERE id = ?',
            [req.usuario.id]
        );

        if (!usuario) {
            return res.status(404).json({
                success: false,
                mensaje: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            usuario: usuario
        });

    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener perfil',
            error: error.message
        });
    }
};

module.exports = { registro, login, obtenerPerfil };