// controllers/reservasController.js
// Lógica de reservas: crear, obtener, aprobar, rechazar

const { runQuery, getOne, getAll } = require('../config/database');
const { eliminarArchivo } = require('../middlewares/upload');
const path = require('path');

// Crear nueva reserva
const crearReserva = async (req, res) => {
    try {
        const { tipoHabitacion, numPersonas, fechaEntrada, fechaSalida, total } = req.body;
        const usuarioId = req.usuario.id;

        // Validar campos obligatorios
        if (!tipoHabitacion || !numPersonas || !fechaEntrada || !fechaSalida || !total) {
            return res.status(400).json({
                success: false,
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        // Validar que se haya subido un comprobante
        if (!req.file) {
            return res.status(400).json({
                success: false,
                mensaje: 'Debe adjuntar el comprobante de pago'
            });
        }

        // Validar fechas
        const entrada = new Date(fechaEntrada);
        const salida = new Date(fechaSalida);

        if (salida <= entrada) {
            // Eliminar archivo subido si la validación falla
            eliminarArchivo(req.file.filename);
            
            return res.status(400).json({
                success: false,
                mensaje: 'La fecha de salida debe ser posterior a la fecha de entrada'
            });
        }

        // Insertar reserva en la base de datos
        const resultado = await runQuery(
            `INSERT INTO reservas (usuarioId, tipoHabitacion, numPersonas, fechaEntrada, fechaSalida, total, comprobante, estado)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'pendiente')`,
            [usuarioId, tipoHabitacion, numPersonas, fechaEntrada, fechaSalida, total, req.file.filename]
        );

        res.status(201).json({
            success: true,
            mensaje: 'Reserva creada exitosamente. Pendiente de aprobación.',
            reserva: {
                id: resultado.id,
                tipoHabitacion,
                fechaEntrada,
                fechaSalida,
                total,
                estado: 'pendiente'
            }
        });

    } catch (error) {
        console.error('Error al crear reserva:', error);
        
        // Eliminar archivo si hubo error
        if (req.file) {
            eliminarArchivo(req.file.filename);
        }
        
        res.status(500).json({
            success: false,
            mensaje: 'Error al crear reserva',
            error: error.message
        });
    }
};

// Obtener reservas del cliente autenticado
const obtenerReservasCliente = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;

        const reservas = await getAll(
            `SELECT id, tipoHabitacion, numPersonas, fechaEntrada, fechaSalida, total, estado, createdAt
             FROM reservas
             WHERE usuarioId = ?
             ORDER BY createdAt DESC`,
            [usuarioId]
        );

        res.json({
            success: true,
            reservas: reservas
        });

    } catch (error) {
        console.error('Error al obtener reservas:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener reservas',
            error: error.message
        });
    }
};

// Obtener todas las reservas (solo admin)
const obtenerTodasReservas = async (req, res) => {
    try {
        const reservas = await getAll(
            `SELECT r.*, u.nombre, u.apellido, u.correo, u.telefono
             FROM reservas r
             INNER JOIN usuarios u ON r.usuarioId = u.id
             ORDER BY r.createdAt DESC`
        );

        // Formatear respuesta con nombre completo del cliente
        const reservasFormateadas = reservas.map(r => ({
            id: r.id,
            nombreCliente: `${r.nombre} ${r.apellido}`,
            correoCliente: r.correo,
            telefonoCliente: r.telefono,
            tipoHabitacion: r.tipoHabitacion,
            numPersonas: r.numPersonas,
            fechaEntrada: r.fechaEntrada,
            fechaSalida: r.fechaSalida,
            total: r.total,
            comprobante: r.comprobante,
            estado: r.estado,
            motivoRechazo: r.motivoRechazo,
            createdAt: r.createdAt
        }));

        res.json({
            success: true,
            reservas: reservasFormateadas
        });

    } catch (error) {
        console.error('Error al obtener reservas:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener reservas',
            error: error.message
        });
    }
};

// Aprobar reserva (solo admin)
const aprobarReserva = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar que la reserva existe
        const reserva = await getOne(
            'SELECT * FROM reservas WHERE id = ?',
            [id]
        );

        if (!reserva) {
            return res.status(404).json({
                success: false,
                mensaje: 'Reserva no encontrada'
            });
        }

        if (reserva.estado !== 'pendiente') {
            return res.status(400).json({
                success: false,
                mensaje: `La reserva ya fue ${reserva.estado}`
            });
        }

        // Actualizar estado a aprobado
        await runQuery(
            'UPDATE reservas SET estado = ? WHERE id = ?',
            ['aprobado', id]
        );

        res.json({
            success: true,
            mensaje: 'Reserva aprobada exitosamente'
        });

    } catch (error) {
        console.error('Error al aprobar reserva:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al aprobar reserva',
            error: error.message
        });
    }
};

// Rechazar reserva (solo admin)
const rechazarReserva = async (req, res) => {
    try {
        const { id } = req.params;
        const { motivo } = req.body;

        // Verificar que la reserva existe
        const reserva = await getOne(
            'SELECT * FROM reservas WHERE id = ?',
            [id]
        );

        if (!reserva) {
            return res.status(404).json({
                success: false,
                mensaje: 'Reserva no encontrada'
            });
        }

        if (reserva.estado !== 'pendiente') {
            return res.status(400).json({
                success: false,
                mensaje: `La reserva ya fue ${reserva.estado}`
            });
        }

        // Actualizar estado a rechazado
        await runQuery(
            'UPDATE reservas SET estado = ?, motivoRechazo = ? WHERE id = ?',
            ['rechazado', motivo || 'No especificado', id]
        );

        res.json({
            success: true,
            mensaje: 'Reserva rechazada'
        });

    } catch (error) {
        console.error('Error al rechazar reserva:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al rechazar reserva',
            error: error.message
        });
    }
};

// Cancelar reserva (cliente)
const cancelarReserva = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioId = req.usuario.id;

        // Verificar que la reserva existe y pertenece al usuario
        const reserva = await getOne(
            'SELECT * FROM reservas WHERE id = ? AND usuarioId = ?',
            [id, usuarioId]
        );

        if (!reserva) {
            return res.status(404).json({
                success: false,
                mensaje: 'Reserva no encontrada'
            });
        }

        // Solo se pueden cancelar reservas pendientes
        if (reserva.estado !== 'pendiente') {
            return res.status(400).json({
                success: false,
                mensaje: 'Solo se pueden cancelar reservas pendientes'
            });
        }

        // Eliminar comprobante
        if (reserva.comprobante) {
            eliminarArchivo(reserva.comprobante);
        }

        // Eliminar reserva
        await runQuery('DELETE FROM reservas WHERE id = ?', [id]);

        res.json({
            success: true,
            mensaje: 'Reserva cancelada exitosamente'
        });

    } catch (error) {
        console.error('Error al cancelar reserva:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al cancelar reserva',
            error: error.message
        });
    }
};

// Obtener comprobante (imagen/PDF)
const obtenerComprobante = async (req, res) => {
    try {
        const { id } = req.params;

        // Obtener reserva
        const reserva = await getOne(
            'SELECT comprobante FROM reservas WHERE id = ?',
            [id]
        );

        if (!reserva || !reserva.comprobante) {
            return res.status(404).json({
                success: false,
                mensaje: 'Comprobante no encontrado'
            });
        }

        // Enviar archivo
        const rutaArchivo = path.join(__dirname, '..', 'uploads', reserva.comprobante);
        res.sendFile(rutaArchivo);

    } catch (error) {
        console.error('Error al obtener comprobante:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener comprobante',
            error: error.message
        });
    }
};

// Obtener estadísticas (solo admin)
const obtenerEstadisticas = async (req, res) => {
    try {
        // Total de reservas
        const totalReservas = await getOne(
            'SELECT COUNT(*) as count FROM reservas'
        );

        // Reservas aprobadas
        const aprobadas = await getOne(
            "SELECT COUNT(*) as count FROM reservas WHERE estado = 'aprobado'"
        );

        // Reservas pendientes
        const pendientes = await getOne(
            "SELECT COUNT(*) as count FROM reservas WHERE estado = 'pendiente'"
        );

        // Habitaciones disponibles
        const disponibles = await getOne(
            'SELECT COUNT(*) as count FROM habitaciones WHERE disponible = 1'
        );

        res.json({
            success: true,
            totalReservas: totalReservas.count,
            aprobadas: aprobadas.count,
            pendientes: pendientes.count,
            disponibles: disponibles.count
        });

    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener estadísticas',
            error: error.message
        });
    }
};

module.exports = {
    crearReserva,
    obtenerReservasCliente,
    obtenerTodasReservas,
    aprobarReserva,
    rechazarReserva,
    cancelarReserva,
    obtenerComprobante,
    obtenerEstadisticas
};