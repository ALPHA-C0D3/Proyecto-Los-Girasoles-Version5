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
    : [
        'http://localhost:5500',
        'http://127.0.0.1:5500'
    ];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);
        
        // CORRECCIÓN: Permitir la URL de Railway explícitamente si existe
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
// 🛠️ BLOQUE DE CORRECCIÓN PARA LA EXPO (AGREGAR ESTO)
// ============================================================
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('✅ Carpeta uploads creada en:', uploadDir);
}

// Log para ver en tiempo real si Railway encuentra la imagen
app.use('/uploads', (req, res, next) => {
    console.log(`📸 Solicitando imagen: ${req.url}`);
    next();
}, express.static(uploadDir));
// ============================================================

// LÍNEA VITAL: Servir los archivos de la carpeta public (frontend)
app.use(express.static(path.join(__dirname, '../public')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});

// Rutas
app.get('/', (req, res) => {
    // CORRECCIÓN: En lugar de enviar solo JSON, enviamos el index.html
    // pero mantenemos tu lógica si es que alguien pide específicamente JSON
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({
            mensaje: 'API del Hostal - Backend funcionando correctamente',
            version: '5.0.0',
            endpoints: {
                auth: '/api/auth',
                reservas: '/api/reservas',
                habitaciones: '/api/habitaciones'
            }
        });
    }
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use('/api/auth', authRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/habitaciones', habitacionesRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        mensaje: 'Ruta no encontrada'
    });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        mensaje: err.message || 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Inicializar tablas y servidor
inicializarTablas();

app.listen(PORT, () => {
    console.log('');
    console.log('╔═══════════════════════════════════════════╗');
    console.log('║   🏨  SERVIDOR HOSTAL - BACKEND          ║');
    console.log('╚═══════════════════════════════════════════╝');
    console.log('');
    console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
    console.log(`📁 Base de datos: ${process.env.DB_PATH || './hostal.db'}`);
    console.log(`🌐 Frontend permitido: ${process.env.FRONTEND_URL || 'http://localhost:5500'}`);
    console.log('');
    console.log('📌 Endpoints disponibles:');
    console.log(`   - POST /api/auth/registro`);
    console.log(`   - POST /api/auth/login`);
    console.log(`   - GET  /api/auth/perfil`);
    console.log(`   - PUT  /api/auth/cambiar-password`);
    console.log(`   - GET  /api/habitaciones`);
    console.log(`   - POST /api/reservas`);
    console.log('');
    console.log('⏳ Presiona Ctrl+C para detener el servidor');
    console.log('');
});

process.on('SIGINT', () => {
    console.log('\n\n👋 Cerrando servidor...');
    process.exit(0);
});

module.exports = app;