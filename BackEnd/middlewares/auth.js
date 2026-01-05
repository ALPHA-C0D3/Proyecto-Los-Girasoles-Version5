// middlewares/auth.js
const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            mensaje: 'No se proporcionó token de autenticación'
        });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            mensaje: 'Formato de token inválido'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        console.error('Error al verificar token:', error.message);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                mensaje: 'Token expirado. Por favor inicie sesión nuevamente'
            });
        }
        
        return res.status(401).json({
            success: false,
            mensaje: 'Token inválido'
        });
    }
};

const esAdmin = (req, res, next) => {
    if (!req.usuario) {
        return res.status(401).json({
            success: false,
            mensaje: 'No autorizado'
        });
    }

    if (req.usuario.tipoUsuario !== 'admin') {
        return res.status(403).json({
            success: false,
            mensaje: 'Acceso denegado. Se requieren permisos de administrador'
        });
    }

    next();
};

module.exports = { verificarToken, esAdmin };