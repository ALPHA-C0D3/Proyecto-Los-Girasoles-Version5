// config/database.js
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = process.env.DB_PATH || './hostal.db';

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite: hostal.db');
    }
});

db.run('PRAGMA foreign_keys = ON');

const inicializarTablas = () => {
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
            FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE CASCADE
        )
    `, (err) => {
        if (err) console.error('Error al crear tabla reservas:', err.message);
        else console.log('Tabla reservas lista');
    });
};

const insertarHabitacionesIniciales = () => {
    db.get('SELECT COUNT(*) as count FROM habitaciones', (err, row) => {
        if (err) {
            console.error('Error al verificar habitaciones:', err.message);
            return;
        }

        if (row.count === 0) {
            const habitaciones = [
                ['Economica', 1, 25, 1, 'Habitacion sencilla con bano compartido'],
                ['Individual', 1, 30, 1, 'Habitacion individual con bano privado'],
                ['Doble', 2, 50, 1, 'Habitacion con cama matrimonial o dos individuales'],
                ['Triple', 3, 65, 1, 'Habitacion con tres camas individuales'],
                ['Familiar', 4, 80, 1, 'Habitacion amplia con dos camas matrimoniales'],
                ['Suite Premium', 2, 120, 1, 'Suite de lujo con jacuzzi y sala de estar']
            ];

            const stmt = db.prepare(`
                INSERT INTO habitaciones (tipo, capacidad, precio, disponible, descripcion)
                VALUES (?, ?, ?, ?, ?)
            `);

            habitaciones.forEach(hab => {
                stmt.run(hab, (err) => {
                    if (err) console.error('Error al insertar habitacion:', err.message);
                });
            });

            stmt.finalize(() => {
                console.log('Habitaciones iniciales insertadas');
            });
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

module.exports = { db, inicializarTablas, runQuery, getOne, getAll };