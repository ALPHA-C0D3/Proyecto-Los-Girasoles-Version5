#!/usr/bin/env node

// setup.js - Script de configuración automática

const readline = require('readline');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('\n╔═══════════════════════════════════════════╗');
console.log('║   🏨  CONFIGURACIÓN HOSTAL EL REFUGIO    ║');
console.log('╚═══════════════════════════════════════════╝\n');

const preguntas = [
    {
        key: 'RESEND_API_KEY',
        pregunta: '🔑 Ingresa tu API key de Resend (o deja vacío para usar demo): ',
        default: 're_demo_key'
    },
    {
        key: 'EMAIL_FROM',
        pregunta: '📧 Email remitente (o deja vacío para usar onboarding@resend.dev): ',
        default: 'onboarding@resend.dev'
    },
    {
        key: 'EMAIL_FROM_NAME',
        pregunta: '📝 Nombre del remitente (o deja vacío para "Hostal El Refugio"): ',
        default: 'Hostal El Refugio'
    },
    {
        key: 'FRONTEND_URL',
        pregunta: '🌐 URL del frontend en desarrollo (o deja vacío para http://127.0.0.1:5500): ',
        default: 'http://127.0.0.1:5500'
    }
];

const respuestas = {};

function preguntarUno(index) {
    if (index >= preguntas.length) {
        generarEnv();
        return;
    }

    const p = preguntas[index];
    rl.question(p.pregunta, (respuesta) => {
        respuestas[p.key] = respuesta.trim() || p.default;
        preguntarUno(index + 1);
    });
}

function generarEnv() {
    // Generar JWT_SECRET seguro
    const jwtSecret = crypto.randomBytes(64).toString('hex');

    const envContent = `# Configuración generada automáticamente
PORT=3000
NODE_ENV=development
JWT_SECRET=${jwtSecret}
JWT_EXPIRES_IN=24h
FRONTEND_URL=${respuestas.FRONTEND_URL}
DB_PATH=./hostal.db
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# Sistema de Emails (Resend)
RESEND_API_KEY=${respuestas.RESEND_API_KEY}
EMAIL_FROM=${respuestas.EMAIL_FROM}
EMAIL_FROM_NAME=${respuestas.EMAIL_FROM_NAME}
`;

    fs.writeFileSync('.env', envContent);

    console.log('\n✅ Archivo .env creado exitosamente!\n');
    console.log('📋 Configuración:');
    console.log(`   - JWT_SECRET: ${jwtSecret.substring(0, 20)}...`);
    console.log(`   - Email: ${respuestas.EMAIL_FROM}`);
    console.log(`   - Frontend: ${respuestas.FRONTEND_URL}`);
    console.log('\n🚀 Próximos pasos:');
    console.log('   1. npm install');
    console.log('   2. npm run init-admin (crear usuario admin)');
    console.log('   3. npm start (iniciar servidor)\n');

    rl.close();
}

preguntarUno(0);
