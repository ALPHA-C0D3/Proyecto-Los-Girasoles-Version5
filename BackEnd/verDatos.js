require('dotenv').config();
const { getAll } = require('./config/database');

async function verDatos() {
    try {
        console.log('\n📊 USUARIOS:');
        const usuarios = await getAll('SELECT id, nombre, correo, tipoUsuario FROM usuarios');
        console.table(usuarios);

        console.log('\n📋 RESERVAS:');
        const reservas = await getAll('SELECT * FROM reservas');
        console.table(reservas);

        console.log('\n🏠 HABITACIONES:');
        const habitaciones = await getAll('SELECT * FROM habitaciones');
        console.table(habitaciones);

        console.log('\n📝 AUDITORÍA:');
        const auditoria = await getAll('SELECT * FROM auditoria_reservas');
        console.table(auditoria);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

verDatos();