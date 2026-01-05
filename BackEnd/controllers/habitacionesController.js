// controllers/habitacionesController.js
// Lógica de habitaciones: CRUD completo

const { runQuery, getOne, getAll } = require('../config/database');

// Obtener todas las habitaciones
const obtenerHabitaciones = async (req, res) => {
    try {
        const habitaciones = await getAll(
            'SELECT * FROM habitaciones ORDER BY precio ASC'
        );

        res.json({
            success: true,
            habitaciones: habitaciones
        });

    } catch (error) {
        console.error('Error al obtener habitaciones:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener habitaciones',
            error: error.message
        });
    }
};

// Obtener una habitación por ID
const obtenerHabitacionPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const habitacion = await getOne(
            'SELECT * FROM habitaciones WHERE id = ?',
            [id]
        );

        if (!habitacion) {
            return res.status(404).json({
                success: false,
                mensaje: 'Habitación no encontrada'
            });
        }

        res.json({
            success: true,
            habitacion: habitacion
        });

    } catch (error) {
        console.error('Error al obtener habitación:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener habitación',
            error: error.message
        });
    }
};

// Crear nueva habitación (solo admin)
const crearHabitacion = async (req, res) => {
    try {
        const { tipo, capacidad, precio, descripcion } = req.body;

        // Validar campos obligatorios
        if (!tipo || !capacidad || !precio) {
            return res.status(400).json({
                success: false,
                mensaje: 'Tipo, capacidad y precio son obligatorios'
            });
        }

        // Validar que capacidad y precio sean números
        if (isNaN(capacidad) || isNaN(precio)) {
            return res.status(400).json({
                success: false,
                mensaje: 'Capacidad y precio deben ser números'
            });
        }

        // Insertar habitación
        const resultado = await runQuery(
            `INSERT INTO habitaciones (tipo, capacidad, precio, descripcion, disponible)
             VALUES (?, ?, ?, ?, 1)`,
            [tipo, parseInt(capacidad), parseFloat(precio), descripcion || '']
        );

        res.status(201).json({
            success: true,
            mensaje: 'Habitación creada exitosamente',
            habitacion: {
                id: resultado.id,
                tipo,
                capacidad: parseInt(capacidad),
                precio: parseFloat(precio),
                descripcion,
                disponible: true
            }
        });

    } catch (error) {
        console.error('Error al crear habitación:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al crear habitación',
            error: error.message
        });
    }
};

// Actualizar habitación (solo admin)
const actualizarHabitacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo, capacidad, precio, descripcion, disponible } = req.body;

        // Verificar que la habitación existe
        const habitacionExistente = await getOne(
            'SELECT * FROM habitaciones WHERE id = ?',
            [id]
        );

        if (!habitacionExistente) {
            return res.status(404).json({
                success: false,
                mensaje: 'Habitación no encontrada'
            });
        }

        // Preparar datos para actualizar (solo los campos que vienen en el body)
        const camposActualizar = [];
        const valores = [];

        if (tipo !== undefined) {
            camposActualizar.push('tipo = ?');
            valores.push(tipo);
        }
        if (capacidad !== undefined) {
            camposActualizar.push('capacidad = ?');
            valores.push(parseInt(capacidad));
        }
        if (precio !== undefined) {
            camposActualizar.push('precio = ?');
            valores.push(parseFloat(precio));
        }
        if (descripcion !== undefined) {
            camposActualizar.push('descripcion = ?');
            valores.push(descripcion);
        }
        if (disponible !== undefined) {
            camposActualizar.push('disponible = ?');
            valores.push(disponible ? 1 : 0);
        }

        if (camposActualizar.length === 0) {
            return res.status(400).json({
                success: false,
                mensaje: 'No hay campos para actualizar'
            });
        }

        // Agregar el ID al final
        valores.push(id);

        // Actualizar
        await runQuery(
            `UPDATE habitaciones SET ${camposActualizar.join(', ')} WHERE id = ?`,
            valores
        );

        // Obtener habitación actualizada
        const habitacionActualizada = await getOne(
            'SELECT * FROM habitaciones WHERE id = ?',
            [id]
        );

        res.json({
            success: true,
            mensaje: 'Habitación actualizada exitosamente',
            habitacion: habitacionActualizada
        });

    } catch (error) {
        console.error('Error al actualizar habitación:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al actualizar habitación',
            error: error.message
        });
    }
};

// Eliminar habitación (solo admin)
const eliminarHabitacion = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar que la habitación existe
        const habitacion = await getOne(
            'SELECT * FROM habitaciones WHERE id = ?',
            [id]
        );

        if (!habitacion) {
            return res.status(404).json({
                success: false,
                mensaje: 'Habitación no encontrada'
            });
        }

        // Verificar si hay reservas asociadas
        const reservasAsociadas = await getOne(
            'SELECT COUNT(*) as count FROM reservas WHERE tipoHabitacion = ?',
            [habitacion.tipo]
        );

        if (reservasAsociadas.count > 0) {
            return res.status(400).json({
                success: false,
                mensaje: 'No se puede eliminar. Hay reservas asociadas a esta habitación.'
            });
        }

        // Eliminar habitación
        await runQuery('DELETE FROM habitaciones WHERE id = ?', [id]);

        res.json({
            success: true,
            mensaje: 'Habitación eliminada exitosamente'
        });

    } catch (error) {
        console.error('Error al eliminar habitación:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al eliminar habitación',
            error: error.message
        });
    }
};

// Cambiar disponibilidad de habitación (solo admin)
const cambiarDisponibilidad = async (req, res) => {
    try {
        const { id } = req.params;
        const { disponible } = req.body;

        if (disponible === undefined) {
            return res.status(400).json({
                success: false,
                mensaje: 'El campo disponible es obligatorio'
            });
        }

        // Verificar que la habitación existe
        const habitacion = await getOne(
            'SELECT * FROM habitaciones WHERE id = ?',
            [id]
        );

        if (!habitacion) {
            return res.status(404).json({
                success: false,
                mensaje: 'Habitación no encontrada'
            });
        }

        // Actualizar disponibilidad
        await runQuery(
            'UPDATE habitaciones SET disponible = ? WHERE id = ?',
            [disponible ? 1 : 0, id]
        );

        res.json({
            success: true,
            mensaje: `Habitación marcada como ${disponible ? 'disponible' : 'no disponible'}`
        });

    } catch (error) {
        console.error('Error al cambiar disponibilidad:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al cambiar disponibilidad',
            error: error.message
        });
    }
};

module.exports = {
    obtenerHabitaciones,
    obtenerHabitacionPorId,
    crearHabitacion,
    actualizarHabitacion,
    eliminarHabitacion,
    cambiarDisponibilidad
};