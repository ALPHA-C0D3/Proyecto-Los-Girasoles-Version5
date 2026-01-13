// controllers/reservasController.js
const { runQuery, getOne, getAll, registrarAuditoria } = require('../config/database');
const { eliminarArchivo } = require('../middlewares/upload');
const path = require('path');

// Crear nueva reserva
const crearReserva = async (req, res) => {
    try {
        const { tipoHabitacion, numPersonas, fechaEntrada, fechaSalida, total } = req.body;
        const usuarioId = req.usuario.id;

        if (!tipoHabitacion || !numPersonas || !fechaEntrada || !fechaSalida || !total) {
            return res.status(400).json({
                success: false,
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                mensaje: 'Debe adjuntar el comprobante de pago'
            });
        }

        const entrada = new Date(fechaEntrada);
        const salida = new Date(fechaSalida);

        if (salida <= entrada) {
            eliminarArchivo(req.file.filename);
            return res.status(400).json({
                success: false,
                mensaje: 'La fecha de salida debe ser posterior a la fecha de entrada'
            });
        }

        // Insertar reserva
        const resultado = await runQuery(
            `INSERT INTO reservas (usuarioId, tipoHabitacion, numPersonas, fechaEntrada, fechaSalida, total, comprobante, estado)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'pendiente')`,
            [usuarioId, tipoHabitacion, numPersonas, fechaEntrada, fechaSalida, total, req.file.filename]
        );

        // Obtener datos del usuario
        const usuario = await getOne('SELECT nombre, apellido, tipoUsuario FROM usuarios WHERE id = ?', [usuarioId]);

        // REGISTRAR EN AUDITORÍA
        await registrarAuditoria({
            reservaId: resultado.id,
            accion: 'CREAR_RESERVA',
            estadoAnterior: null,
            estadoNuevo: 'pendiente',
            usuarioId: usuarioId,
            usuarioNombre: `${usuario.nombre} ${usuario.apellido}`,
            usuarioTipo: usuario.tipoUsuario,
            datosReserva: {
                tipoHabitacion,
                numPersonas,
                fechaEntrada,
                fechaSalida,
                total
            },
            comprobanteRespaldo: req.file.filename,
            observaciones: 'Reserva creada por el cliente',
            ipAddress: req.ip || req.connection.remoteAddress
        });

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

// Obtener reservas del cliente
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

// Obtener todas las reservas (admin)
const obtenerTodasReservas = async (req, res) => {
    try {
        const reservas = await getAll(
            `SELECT r.*, u.nombre, u.apellido, u.correo, u.telefono
             FROM reservas r
             INNER JOIN usuarios u ON r.usuarioId = u.id
             ORDER BY r.createdAt DESC`
        );

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

// Aprobar reserva
const aprobarReserva = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.usuario.id;

        const reserva = await getOne('SELECT * FROM reservas WHERE id = ?', [id]);

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

        // Actualizar estado
        await runQuery('UPDATE reservas SET estado = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?', ['aprobado', id]);

        // Obtener datos del admin
        const admin = await getOne('SELECT nombre, apellido FROM usuarios WHERE id = ?', [adminId]);

        // REGISTRAR EN AUDITORÍA
        await registrarAuditoria({
            reservaId: parseInt(id),
            accion: 'APROBAR_RESERVA',
            estadoAnterior: 'pendiente',
            estadoNuevo: 'aprobado',
            usuarioId: adminId,
            usuarioNombre: `${admin.nombre} ${admin.apellido}`,
            usuarioTipo: 'admin',
            datosReserva: {
                tipoHabitacion: reserva.tipoHabitacion,
                numPersonas: reserva.numPersonas,
                fechaEntrada: reserva.fechaEntrada,
                fechaSalida: reserva.fechaSalida,
                total: reserva.total
            },
            comprobanteRespaldo: reserva.comprobante,
            observaciones: 'Reserva aprobada por el administrador',
            ipAddress: req.ip || req.connection.remoteAddress
        });

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

// Rechazar reserva
const rechazarReserva = async (req, res) => {
    try {
        const { id } = req.params;
        const { motivo } = req.body;
        const adminId = req.usuario.id;

        const reserva = await getOne('SELECT * FROM reservas WHERE id = ?', [id]);

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

        // Actualizar estado
        await runQuery(
            'UPDATE reservas SET estado = ?, motivoRechazo = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
            ['rechazado', motivo || 'No especificado', id]
        );

        // Obtener datos del admin
        const admin = await getOne('SELECT nombre, apellido FROM usuarios WHERE id = ?', [adminId]);

        // REGISTRAR EN AUDITORÍA
        await registrarAuditoria({
            reservaId: parseInt(id),
            accion: 'RECHAZAR_RESERVA',
            estadoAnterior: 'pendiente',
            estadoNuevo: 'rechazado',
            usuarioId: adminId,
            usuarioNombre: `${admin.nombre} ${admin.apellido}`,
            usuarioTipo: 'admin',
            datosReserva: {
                tipoHabitacion: reserva.tipoHabitacion,
                numPersonas: reserva.numPersonas,
                fechaEntrada: reserva.fechaEntrada,
                fechaSalida: reserva.fechaSalida,
                total: reserva.total
            },
            comprobanteRespaldo: reserva.comprobante,
            observaciones: `Rechazado. Motivo: ${motivo || 'No especificado'}`,
            ipAddress: req.ip || req.connection.remoteAddress
        });

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

        if (reserva.estado !== 'pendiente') {
            return res.status(400).json({
                success: false,
                mensaje: 'Solo se pueden cancelar reservas pendientes'
            });
        }

        // Obtener datos del usuario
        const usuario = await getOne('SELECT nombre, apellido FROM usuarios WHERE id = ?', [usuarioId]);

        // REGISTRAR EN AUDITORÍA ANTES DE ELIMINAR
        await registrarAuditoria({
            reservaId: parseInt(id),
            accion: 'CANCELAR_RESERVA',
            estadoAnterior: 'pendiente',
            estadoNuevo: 'cancelado',
            usuarioId: usuarioId,
            usuarioNombre: `${usuario.nombre} ${usuario.apellido}`,
            usuarioTipo: 'cliente',
            datosReserva: {
                tipoHabitacion: reserva.tipoHabitacion,
                numPersonas: reserva.numPersonas,
                fechaEntrada: reserva.fechaEntrada,
                fechaSalida: reserva.fechaSalida,
                total: reserva.total
            },
            comprobanteRespaldo: reserva.comprobante,
            observaciones: 'Reserva cancelada por el cliente',
            ipAddress: req.ip || req.connection.remoteAddress
        });

        // Eliminar comprobante y reserva
        if (reserva.comprobante) {
            eliminarArchivo(reserva.comprobante);
        }

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

// Obtener comprobante
const obtenerComprobante = async (req, res) => {
    try {
        const { id } = req.params;

        const reserva = await getOne('SELECT comprobante FROM reservas WHERE id = ?', [id]);

        if (!reserva || !reserva.comprobante) {
            return res.status(404).json({
                success: false,
                mensaje: 'Comprobante no encontrado'
            });
        }

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

// Obtener estadísticas
const obtenerEstadisticas = async (req, res) => {
    try {
        const totalReservas = await getOne('SELECT COUNT(*) as count FROM reservas');
        const aprobadas = await getOne("SELECT COUNT(*) as count FROM reservas WHERE estado = 'aprobado'");
        const pendientes = await getOne("SELECT COUNT(*) as count FROM reservas WHERE estado = 'pendiente'");
        const disponibles = await getOne('SELECT COUNT(*) as count FROM habitaciones WHERE disponible = 1');

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

// NUEVA FUNCIÓN: Obtener auditoría de una reserva
const obtenerAuditoriaReserva = async (req, res) => {
    try {
        const { id } = req.params;

        const auditoria = await getAll(
            `SELECT * FROM auditoria_reservas WHERE reservaId = ? ORDER BY createdAt DESC`,
            [id]
        );

        res.json({
            success: true,
            auditoria: auditoria.map(a => ({
                ...a,
                datosReserva: JSON.parse(a.datosReserva)
            }))
        });

    } catch (error) {
        console.error('Error al obtener auditoría:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener auditoría',
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
    obtenerEstadisticas,
    obtenerAuditoriaReserva
};