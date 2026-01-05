// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { inicializarTablas } = require('./config/database');

const authRoutes = require('./routes/auth.routes');
const reservasRoutes = require('./routes/reservas.routes');
const habitacionesRoutes = require('./routes/habitaciones.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
    origin: [
        'http://localhost:5500',
        'http://127.0.0.1:5500'
    ],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});

// Rutas
app.get('/', (req, res) => {
    res.json({
        mensaje: 'API del Hostal - Backend funcionando correctamente',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            reservas: '/api/reservas',
            habitaciones: '/api/habitaciones'
        }
    });
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
    console.log(`   - GET  /api/habitaciones`);
    console.log(`   - POST /api/reservas`);
    console.log(`   - GET  /api/reservas/cliente`);
    console.log(`   - GET  /api/reservas/todas (admin)`);
    console.log('');
    console.log('⏳ Presiona Ctrl+C para detener el servidor');
    console.log('');
});

process.on('SIGINT', () => {
    console.log('\n\n Cerrando servidor...');
    process.exit(0);
});

module.exports = app;