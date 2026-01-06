require('dotenv').config();
const bcrypt = require('bcryptjs');
const { runQuery, getOne } = require('./config/database');

async function resetAdmin() {
    try {
        // Eliminar admin existente
        console.log('🗑️  Eliminando administrador existente...');
        await runQuery("DELETE FROM usuarios WHERE tipoUsuario = 'admin'");
        console.log('✅ Administrador eliminado');

        // Crear nuevo admin
        console.log('👤 Creando nuevo administrador...');
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('admin123', salt);

        await runQuery(
            `INSERT INTO usuarios (nombre, apellido, telefono, correo, password, tipoUsuario) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            ['Admin', 'Sistema', '0999999999', 'admin@hostal.com', passwordHash, 'admin']
        );

        console.log('');
        console.log('✅ Administrador creado exitosamente');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Correo:     admin@hostal.com');
        console.log('🔑 Contraseña: admin123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

resetAdmin();