require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { inicializarTablas } = require('./config/database');

const authRoutes = require('./routes/auth.routes');
const reservasRoutes = require('./routes/reservas.routes');
const habitacionesRoutes = require('./routes/habitaciones.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
const allowedOrigins = process.env.FRONTEND_URL 
    ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
    : ['http://localhost:5500', 'http://127.0.0.1:5500'];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || 
            (origin && origin.includes('railway.app')) || 
            process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================
// 🛠️ BLOQUE DE CORRECCIÓN FINAL PARA LAS IMÁGENES
// ============================================================
// Usamos process.cwd() para asegurar que encuentre la carpeta en la raíz de Railway
const uploadDir = path.join(process.cwd(), 'uploads'); 

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('✅ Carpeta uploads verificada en:', uploadDir);
}

// Servir imágenes con Log para debug
app.use('/uploads', (req, res, next) => {
    console.log(`📸 Solicitud de imagen: ${req.url}`);
    next();
}, express.static(uploadDir));
// ============================================================

// Servir los archivos del frontend
app.use(express.static(path.join(__dirname, '../public')));

// Log de peticiones
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});

// Rutas API
app.get('/', (req, res) => {
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({ mensaje: 'API del Hostal funcionando' });
    }
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use('/api/auth', authRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/habitaciones', habitacionesRoutes);

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({ success: false, mensaje: 'Ruta no encontrada' });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        mensaje: err.message || 'Error interno del servidor'
    });
});

// Inicializar tablas y servidor
inicializarTablas();

app.listen(PORT, () => {
    console.log(`🚀 Servidor en puerto: ${PORT}`);
    console.log(`📁 Directorio uploads: ${uploadDir}`);
});

process.on('SIGINT', () => {
    process.exit(0);
});

module.exports = app;