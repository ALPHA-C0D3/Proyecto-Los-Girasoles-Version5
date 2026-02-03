// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { runQuery, getOne, getAll } = require('../config/database');
const { enviarCodigoRecuperacion, enviarCodigoVerificacion, enviarEmailRecuperacionConLink } = require('../config/email');

// ============================================
// SISTEMA DE RATE LIMITING Y BLOQUEOS
// ============================================
const intentosFallidos = new Map(); // IP -> { intentos, bloqueadoHasta }
const MAX_INTENTOS = 5;
const TIEMPO_BLOQUEO = 15 * 60 * 1000; // 15 minutos

// Verificar si una IP está bloqueada
const verificarBloqueo = (ip) => {
    const datos = intentosFallidos.get(ip);
    
    if (!datos) return { bloqueado: false, intentos: 0 };
    
    // Si está bloqueado y el tiempo expiró, resetear
    if (datos.bloqueadoHasta && Date.now() > datos.bloqueadoHasta) {
        intentosFallidos.delete(ip);
        return { bloqueado: false, intentos: 0 };
    }
    
    // Si está bloqueado y el tiempo NO ha expirado
    if (datos.bloqueadoHasta && Date.now() <= datos.bloqueadoHasta) {
        const minutosRestantes = Math.ceil((datos.bloqueadoHasta - Date.now()) / 60000);
        return { 
            bloqueado: true, 
            intentos: datos.intentos,
            minutosRestantes 
        };
    }
    
    return { bloqueado: false, intentos: datos.intentos };
};

// Registrar intento fallido
const registrarIntentoFallido = (ip) => {
    const datos = intentosFallidos.get(ip) || { intentos: 0 };
    datos.intentos += 1;
    
    // Si alcanzó el máximo, bloquear
    if (datos.intentos >= MAX_INTENTOS) {
        datos.bloqueadoHasta = Date.now() + TIEMPO_BLOQUEO;
    }
    
    intentosFallidos.set(ip, datos);
    return datos.intentos;
};

// Limpiar intentos al login exitoso
const limpiarIntentos = (ip) => {
    intentosFallidos.delete(ip);
};

// ============================================
// REGISTRO
// ============================================
const registro = async (req, res) => {
    try {
        const { nombre, apellido, telefono, correo, password } = req.body;

        if (!nombre || !apellido || !telefono || !correo || !password) {
            return res.status(400).json({
                success: false,
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        // Validar formato de correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            return res.status(400).json({
                success: false,
                mensaje: 'Formato de correo inválido'
            });
        }

        // Verificar si ya existe
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

        // Validar contraseña
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                mensaje: 'La contraseña debe tener al menos 6 caracteres'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const resultado = await runQuery(
            `INSERT INTO usuarios (nombre, apellido, telefono, correo, password, tipoUsuario) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [nombre, apellido, telefono, correo, passwordHash, 'cliente']
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

// ============================================
// LOGIN CON SEGURIDAD
// ============================================
const login = async (req, res) => {
    try {
        const { correo, password } = req.body;
        const ip = req.ip || req.connection.remoteAddress;

        // 1. VERIFICAR BLOQUEO
        const estadoBloqueo = verificarBloqueo(ip);
        if (estadoBloqueo.bloqueado) {
            return res.status(429).json({
                success: false,
                mensaje: `Demasiados intentos fallidos. Espere ${estadoBloqueo.minutosRestantes} minutos.`,
                bloqueado: true,
                minutosRestantes: estadoBloqueo.minutosRestantes,
                intentos: estadoBloqueo.intentos
            });
        }

        // 2. VALIDACIONES BÁSICAS
        if (!correo || !password) {
            return res.status(400).json({
                success: false,
                mensaje: 'Correo y contraseña son obligatorios',
                intentosRestantes: MAX_INTENTOS - estadoBloqueo.intentos
            });
        }

        // 3. BUSCAR USUARIO
        const usuario = await getOne(
            'SELECT * FROM usuarios WHERE correo = ?',
            [correo]
        );

        if (!usuario) {
            const intentos = registrarIntentoFallido(ip);
            const restantes = MAX_INTENTOS - intentos;
            
            console.log(`[SEGURIDAD] Login fallido para ${correo} desde IP ${ip}. Intentos: ${intentos}/${MAX_INTENTOS}`);
            
            return res.status(401).json({
                success: false,
                mensaje: 'Credenciales incorrectas',
                intentosRestantes: restantes > 0 ? restantes : 0,
                advertencia: restantes === 1 ? 'ÚLTIMO INTENTO antes del bloqueo' : null
            });
        }

        // 4. VERIFICAR CONTRASEÑA
        const passwordValido = await bcrypt.compare(password, usuario.password);

        if (!passwordValido) {
            const intentos = registrarIntentoFallido(ip);
            const restantes = MAX_INTENTOS - intentos;
            
            console.log(`[SEGURIDAD] Contraseña incorrecta para ${correo} desde IP ${ip}. Intentos: ${intentos}/${MAX_INTENTOS}`);
            
            return res.status(401).json({
                success: false,
                mensaje: 'Credenciales incorrectas',
                intentosRestantes: restantes > 0 ? restantes : 0,
                advertencia: restantes === 1 ? 'ÚLTIMO INTENTO antes del bloqueo' : null,
                sugerenciaRecuperacion: restantes <= 2 ? true : false
            });
        }

        // 5. LOGIN EXITOSO - LIMPIAR INTENTOS
        limpiarIntentos(ip);
        console.log(`[SEGURIDAD] Login exitoso para ${correo} desde IP ${ip}`);

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

// ============================================
// SOLICITAR RECUPERACIÓN CON TOKEN
// ============================================
const solicitarRecuperacion = async (req, res) => {
    const { correo } = req.body;

    try {
        const usuario = await getOne(
            'SELECT * FROM usuarios WHERE correo = ?',
            [correo]
        );

        const respuestaSegura = {
            success: true,
            mensaje: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña'
        };

        if (!usuario) return res.json(respuestaSegura);

        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiracion = new Date(Date.now() + 30 * 60 * 1000);

        await runQuery(
            `UPDATE usuarios SET resetToken = ?, resetTokenExpira = ? WHERE correo = ?`,
            [resetToken, expiracion.toISOString(), correo]
        );

        const FRONTEND_URL = process.env.FRONTEND_URL || 'http://127.0.0.1:5500';
        const resetLink = `${FRONTEND_URL}/public/cambiar-password.html?token=${resetToken}`;

        // LLAMADA SIN AWAIT (Para evitar el Timeout de Railway)
        enviarEmailRecuperacionConLink(correo, usuario.nombre, resetLink)
            .catch(err => console.error('[EMAIL ERROR]:', err));

        // Respondemos de inmediato
        return res.json(respuestaSegura);

    } catch (error) {
        console.error('[ERROR]:', error);
        return res.status(500).json({ success: false, mensaje: 'Error interno' });
    }
};

// ============================================
// RESETEAR PASSWORD CON TOKEN
// ============================================
const resetearPasswordConToken = async (req, res) => {
    const { token, nuevaPassword } = req.body;

    try {
        // Validación básica
        if (!token || !nuevaPassword) {
            return res.status(400).json({ 
                success: false, 
                mensaje: 'Token y nueva contraseña son obligatorios' 
            });
        }

        if (nuevaPassword.length < 6) {
            return res.status(400).json({ 
                success: false, 
                mensaje: 'La contraseña debe tener al menos 6 caracteres' 
            });
        }

        // Buscar usuario por token
        const usuario = await getOne(
            'SELECT * FROM usuarios WHERE resetToken = ?',
            [token]
        );

        if (!usuario) {
            return res.status(400).json({ 
                success: false, 
                mensaje: 'Token inválido o expirado' 
            });
        }

        // Verificar expiración
        const ahora = new Date();
        const expiracion = new Date(usuario.resetTokenExpira);

        if (ahora > expiracion) {
            return res.status(400).json({ 
                success: false, 
                mensaje: 'El enlace ha expirado. Solicita uno nuevo.' 
            });
        }

        // Hash de nueva password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(nuevaPassword, salt);

        // Actualizar y limpiar token
        await runQuery(
            `UPDATE usuarios 
             SET password = ?, resetToken = NULL, resetTokenExpira = NULL
             WHERE id = ?`,
            [passwordHash, usuario.id]
        );

        console.log(`[RECUPERACIÓN] Contraseña actualizada para usuario ID: ${usuario.id}`);

        res.json({ 
            success: true, 
            mensaje: 'Contraseña actualizada exitosamente' 
        });

    } catch (error) {
        console.error('[ERROR] Error al resetear password:', error);
        res.status(500).json({ 
            success: false, 
            mensaje: 'Error al procesar la solicitud' 
        });
    }
};

// ============================================
// VERIFICAR CÓDIGO (Asegúrate de que diga async)
// ============================================
const verificarCodigoRecuperacion = async (req, res) => {
    try {
        const { correo, codigo } = req.body;

        if (!correo || !codigo) {
            return res.status(400).json({
                success: false,
                mensaje: 'Correo y código son obligatorios'
            });
        }

        const usuario = await getOne(
            `SELECT * FROM usuarios 
             WHERE correo = ? 
             AND resetToken = ? 
             AND resetTokenExpira > datetime('now')`,
            [correo, codigo]
        );

        if (!usuario) {
            return res.status(400).json({
                success: false,
                mensaje: 'Código inválido o expirado'
            });
        }

        res.json({
            success: true,
            mensaje: 'Código verificado correctamente',
            usuarioId: usuario.id
        });

    } catch (error) {
        console.error('Error al verificar código:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al verificar código',
            error: error.message
        });
    }
};

// ============================================
// RESETEAR PASSWORD (LEGACY - Mantener por compatibilidad)
// ============================================
const resetearPassword = async (req, res) => {
    try {
        const { correo, codigo, nuevaPassword } = req.body;

        if (!correo || !codigo || !nuevaPassword) {
            return res.status(400).json({
                success: false,
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        const usuario = await getOne(
            `SELECT * FROM usuarios 
             WHERE correo = ? 
             AND resetToken = ? 
             AND resetTokenExpira > datetime('now')`,
            [correo, codigo]
        );

        if (!usuario) {
            return res.status(400).json({
                success: false,
                mensaje: 'Código inválido o expirado'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(nuevaPassword, salt);

        await runQuery(
            `UPDATE usuarios 
             SET password = ?, resetToken = NULL, resetTokenExpira = NULL
             WHERE id = ?`,
            [passwordHash, usuario.id]
        );

        res.json({
            success: true,
            mensaje: 'Contraseña actualizada exitosamente'
        });

    } catch (error) {
        console.error('Error al resetear password:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al resetear password',
            error: error.message
        });
    }
};

// ============================================
// OBTENER PERFIL
// ============================================
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

// ============================================
// CAMBIAR CONTRASEÑA
// ============================================
const cambiarPassword = async (req, res) => {
    try {
        const { passwordActual, passwordNueva } = req.body;
        const usuarioId = req.usuario.id;

        if (!passwordActual || !passwordNueva) {
            return res.status(400).json({
                success: false,
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        if (passwordNueva.length < 6) {
            return res.status(400).json({
                success: false,
                mensaje: 'La nueva contraseña debe tener al menos 6 caracteres'
            });
        }

        const usuario = await getOne(
            'SELECT * FROM usuarios WHERE id = ?',
            [usuarioId]
        );

        if (!usuario) {
            return res.status(404).json({
                success: false,
                mensaje: 'Usuario no encontrado'
            });
        }

        const passwordValido = await bcrypt.compare(passwordActual, usuario.password);

        if (!passwordValido) {
            return res.status(401).json({
                success: false,
                mensaje: 'La contraseña actual es incorrecta'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(passwordNueva, salt);

        await runQuery(
            'UPDATE usuarios SET password = ? WHERE id = ?',
            [passwordHash, usuarioId]
        );

        res.json({
            success: true,
            mensaje: 'Contraseña actualizada exitosamente'
        });

    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al cambiar contraseña',
            error: error.message
        });
    }
};

module.exports = { 
    registro, 
    login, 
    obtenerPerfil, 
    cambiarPassword,
    solicitarRecuperacion,
    verificarCodigoRecuperacion,
    resetearPassword,
    resetearPasswordConToken  // ← NUEVA FUNCIÓN
};
