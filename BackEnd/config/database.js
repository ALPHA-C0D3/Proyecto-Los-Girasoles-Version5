// config/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path'); // Importante para manejar rutas

// Esto hace que la DB se guarde en la carpeta de arriba de "config" (o sea, en la raíz de BackEnd)
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'hostal.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        // Imprimimos la ruta completa para estar 100% seguros de dónde se creó
        console.log('Conectado a la base de datos en:', DB_PATH);
    }
});

db.run('PRAGMA foreign_keys = ON');

const inicializarTablas = () => {
    // Tabla de usuarios
    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            apellido TEXT NOT NULL,
            telefono TEXT NOT NULL,
            correo TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            tipoUsuario TEXT DEFAULT 'cliente' CHECK(tipoUsuario IN ('cliente', 'admin')),
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('Error al crear tabla usuarios:', err.message);
        else console.log('Tabla usuarios lista');
    });

    // Tabla de habitaciones
    db.run(`
        CREATE TABLE IF NOT EXISTS habitaciones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tipo TEXT NOT NULL,
            capacidad INTEGER NOT NULL,
            precio REAL NOT NULL,
            disponible INTEGER DEFAULT 1,
            descripcion TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('Error al crear tabla habitaciones:', err.message);
        else {
            console.log('Tabla habitaciones lista');
            insertarHabitacionesIniciales();
        }
    });

    // Tabla de reservas
    db.run(`
        CREATE TABLE IF NOT EXISTS reservas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuarioId INTEGER NOT NULL,
            tipoHabitacion TEXT NOT NULL,
            numPersonas INTEGER NOT NULL,
            fechaEntrada DATE NOT NULL,
            fechaSalida DATE NOT NULL,
            total REAL NOT NULL,
            comprobante TEXT,
            estado TEXT DEFAULT 'pendiente' CHECK(estado IN ('pendiente', 'aprobado', 'rechazado')),
            motivoRechazo TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE CASCADE
        )
    `, (err) => {
        if (err) console.error('Error al crear tabla reservas:', err.message);
        else console.log('Tabla reservas lista');
    });

    // NUEVA TABLA: Auditoría de Reservas
    db.run(`
        CREATE TABLE IF NOT EXISTS auditoria_reservas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            reservaId INTEGER NOT NULL,
            accion TEXT NOT NULL,
            estadoAnterior TEXT,
            estadoNuevo TEXT,
            usuarioId INTEGER,
            usuarioNombre TEXT,
            usuarioTipo TEXT,
            datosReserva TEXT,
            comprobanteRespaldo TEXT,
            observaciones TEXT,
            ipAddress TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (reservaId) REFERENCES reservas(id) ON DELETE CASCADE,
            FOREIGN KEY (usuarioId) REFERENCES usuarios(id)
        )
    `, (err) => {
        if (err) console.error('Error al crear tabla auditoria_reservas:', err.message);
        else console.log('Tabla auditoria_reservas lista');
    });
};

const insertarHabitacionesIniciales = () => {
    db.get('SELECT COUNT(*) as count FROM habitaciones', (err, row) => {
        if (err) {
            console.error('Error al verificar habitaciones:', err.message);
            return;
        }

        if (row.count === 0) {
            console.log('Iniciando inserción de 8 habitaciones...');
            
            const habitaciones = [
                ['Sol Naciente', 2, 10, 1, 'Habitación con cama matrimonial, TV, cable, ducha, wifi, garage'],
                ['Amanecer Dorado', 2, 10, 1, 'Habitación con cama matrimonial, TV, cable, ducha, wifi, garage'],
                ['Rayos de Luz', 2, 10, 1, 'Habitación con cama matrimonial, TV, cable, ducha, wifi, garage'],
                ['Pétalos de Oro', 2, 10, 1, 'Habitación con cama matrimonial, TV, cable, ducha, wifi, garage'],
                ['Girasol Brillante', 2, 10, 1, 'Habitación con cama matrimonial, TV, cable, ducha, wifi, garage'],
                ['Luz del Día', 2, 10, 1, 'Habitación con cama matrimonial, TV, cable, ducha, wifi, garage'],
                ['Resplandor', 2, 10, 1, 'Habitación con cama matrimonial, TV, cable, ducha, wifi, garage'],
                ['Aurora', 2, 10, 1, 'Habitación con cama matrimonial, TV, cable, ducha, wifi, garage']
            ];

            const stmt = db.prepare(`
                INSERT INTO habitaciones (tipo, capacidad, precio, disponible, descripcion) 
                VALUES (?, ?, ?, ?, ?)
            `);

            let completados = 0;

            habitaciones.forEach(hab => {
                stmt.run(hab, (err) => {
                    if (err) {
                        console.error('Error al insertar habitación:', err.message);
                    }
                    completados++;
                    
                    // Solo cerramos el statement cuando terminamos el último
                    if (completados === habitaciones.length) {
                        stmt.finalize(() => {
                            console.log('✅ Éxito: Las 8 habitaciones han sido insertadas.');
                        });
                    }
                });
            });
        } else {
            console.log(`La tabla ya tiene ${row.count} habitaciones. No se insertaron duplicados.`);
        }
    });
};

const runQuery = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, changes: this.changes });
        });
    });
};

const getOne = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const getAll = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// Función para registrar en auditoría
const registrarAuditoria = async (datos) => {
    const {
        reservaId,
        accion,
        estadoAnterior,
        estadoNuevo,
        usuarioId,
        usuarioNombre,
        usuarioTipo,
        datosReserva,
        comprobanteRespaldo,
        observaciones,
        ipAddress
    } = datos;

    try {
        await runQuery(`
            INSERT INTO auditoria_reservas (
                reservaId, accion, estadoAnterior, estadoNuevo, 
                usuarioId, usuarioNombre, usuarioTipo, datosReserva,
                comprobanteRespaldo, observaciones, ipAddress
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            reservaId,
            accion,
            estadoAnterior || null,
            estadoNuevo || null,
            usuarioId || null,
            usuarioNombre || 'Sistema',
            usuarioTipo || 'sistema',
            JSON.stringify(datosReserva),
            comprobanteRespaldo || null,
            observaciones || null,
            ipAddress || 'N/A'
        ]);
    } catch (error) {
        console.error('Error al registrar auditoría:', error);
    }
};
inicializarTablas();
module.exports = { 
    db, 
    inicializarTablas, 
    runQuery, 
    getOne, 
    getAll,
    registrarAuditoria 
};