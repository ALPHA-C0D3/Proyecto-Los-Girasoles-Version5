require('dotenv').config();
const bcrypt = require('bcryptjs');
const { runQuery, getOne } = require('./config/database');

async function crearAdmin() {
    try {
        // Verificar si ya existe un admin
        const adminExistente = await getOne(
            "SELECT * FROM usuarios WHERE tipoUsuario = 'admin'"
        );

        if (adminExistente) {
            console.log('⚠️  Ya existe un usuario administrador');
            console.log('📧 Correo:', adminExistente.correo);
            console.log('');
            console.log('¿Deseas eliminar el admin existente? Ejecuta:');
            console.log('sqlite3 hostal.db "DELETE FROM usuarios WHERE tipoUsuario = \'admin\'"');
            process.exit(0);
        }

        // Crear contraseña hasheada
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('admin123', salt);

        // Insertar admin
        await runQuery(
            `INSERT INTO usuarios (nombre, apellido, telefono, correo, password, tipoUsuario) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            ['Admin', 'Sistema', '0999999999', 'admin@hostal.com', passwordHash, 'admin']
        );

        console.log('');
        console.log('✅ Usuario administrador creado exitosamente');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Correo:     admin@hostal.com');
        console.log('🔑 Contraseña: admin123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('⚠️  IMPORTANTE: Cambia esta contraseña después del primer login');
        console.log('');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error al crear admin:', error.message);
        process.exit(1);
    }
}

crearAdmin();