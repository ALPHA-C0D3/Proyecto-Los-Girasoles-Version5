// BackEnd/agregarCamposRecuperacion.js
// Script para agregar campos de recuperación de contraseña a la tabla usuarios

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./hostal.db');

console.log('🔧 Agregando campos de recuperación de contraseña...\n');

db.serialize(() => {
    // Agregar columna resetToken
    db.run(`
        ALTER TABLE usuarios ADD COLUMN resetToken TEXT
    `, (err) => {
        if (err) {
            if (err.message.includes('duplicate column name')) {
                console.log('✓ Columna resetToken ya existe');
            } else {
                console.error('Error al agregar resetToken:', err.message);
            }
        } else {
            console.log('✓ Columna resetToken agregada');
        }
    });

    // Agregar columna resetTokenExpira
    db.run(`
        ALTER TABLE usuarios ADD COLUMN resetTokenExpira DATETIME
    `, (err) => {
        if (err) {
            if (err.message.includes('duplicate column name')) {
                console.log('✓ Columna resetTokenExpira ya existe');
            } else {
                console.error('Error al agregar resetTokenExpira:', err.message);
            }
        } else {
            console.log('✓ Columna resetTokenExpira agregada');
        }
        
        // Cerrar conexión al finalizar
        setTimeout(() => {
            db.close((err) => {
                if (err) {
                    console.error('\n❌ Error al cerrar la base de datos:', err.message);
                } else {
                    console.log('\n✅ Base de datos actualizada correctamente!');
                    console.log('Ya puedes iniciar el servidor con: npm start');
                }
            });
        }, 500);
    });
});