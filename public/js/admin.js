// ==========================================
// ADMIN.JS - HOSTAL EL REFUGIO
// Gestión administrativa del hostal
// ==========================================

const API_URL = 'http://localhost:3000/api'; // Cambiar por la URL real del backend

// ==========================================
// CARGAR ESTADÍSTICAS DEL DASHBOARD
// ==========================================

async function cargarEstadisticas() {
    try {
        const response = await fetch(`${API_URL}/estadisticas`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const stats = await response.json();

        if (response.ok) {
            document.getElementById('totalReservas').textContent = stats.totalReservas || 0;
            document.getElementById('reservasAprobadas').textContent = stats.aprobadas || 0;
            document.getElementById('reservasPendientes').textContent = stats.pendientes || 0;
            document.getElementById('habitacionesDisponibles').textContent = stats.disponibles || 0;
        }
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
    }
}

// ==========================================
// CARGAR TODAS LAS RESERVAS
// ==========================================

async function cargarReservasAdmin() {
    const tablaReservas = document.getElementById('tablaReservasAdmin');
    
    if (!tablaReservas) return;

    try {
        const response = await fetch(`${API_URL}/reservas/todas`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const reservas = await response.json();

        if (response.ok && reservas.length > 0) {
            tablaReservas.innerHTML = '';
            
            reservas.forEach(reserva => {
                const fila = document.createElement('tr');
                
                // Determinar clase del estado
                let estadoClase = 'estado-pendiente';
                if (reserva.estado === 'aprobado') {
                    estadoClase = 'estado-aprobado';
                } else if (reserva.estado === 'rechazado') {
                    estadoClase = 'estado-rechazado';
                }

                // Mostrar botones solo si está pendiente
                const botones = reserva.estado === 'pendiente'
                    ? `<button class="btn btn-sm btn-success" onclick="aprobarReserva('${reserva.id}')">Aprobar</button>
                       <button class="btn btn-sm btn-danger" onclick="rechazarReserva('${reserva.id}')">Rechazar</button>`
                    : '-';

                fila.innerHTML = `
                    <td>${reserva.id}</td>
                    <td>${reserva.nombreCliente}</td>
                    <td>${reserva.tipoHabitacion}</td>
                    <td>${reserva.fechaEntrada}</td>
                    <td>${reserva.fechaSalida}</td>
                    <td>$${reserva.total}</td>
                    <td><button class="btn btn-sm btn-info" onclick="verComprobante('${reserva.id}')">Ver</button></td>
                    <td><span class="${estadoClase}">${reserva.estado}</span></td>
                    <td>${botones}</td>
                `;
                
                tablaReservas.appendChild(fila);
            });
        } else {
            tablaReservas.innerHTML = '<tr><td colspan="9" class="text-center text-muted">No hay reservas registradas</td></tr>';
        }
    } catch (error) {
        console.error('Error al cargar reservas:', error);
        tablaReservas.innerHTML = '<tr><td colspan="9" class="text-center text-danger">Error al cargar reservas</td></tr>';
    }
}

// ==========================================
// APROBAR RESERVA
// ==========================================

async function aprobarReserva(idReserva) {
    const confirmar = confirm('¿Está seguro que desea aprobar esta reserva?');
    
    if (!confirmar) return;

    try {
        const response = await fetch(`${API_URL}/reservas/${idReserva}/aprobar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const resultado = await response.json();

        if (response.ok) {
            mostrarExito('alertaAdmin', 'Reserva aprobada exitosamente.');
            document.getElementById('alertaAdmin').classList.remove('d-none');
            
            // Recargar tablas y estadísticas
            setTimeout(() => {
                cargarReservasAdmin();
                cargarEstadisticas();
                ocultarAlerta('alertaAdmin');
            }, 2000);
        } else {
            mostrarError('alertaAdmin', resultado.mensaje || 'Error al aprobar la reserva.');
            document.getElementById('alertaAdmin').classList.remove('d-none');
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        mostrarError('alertaAdmin', 'Error de conexión. Inténtelo de nuevo en unos segundos.');
        document.getElementById('alertaAdmin').classList.remove('d-none');
    }
}

// ==========================================
// RECHAZAR RESERVA
// ==========================================

async function rechazarReserva(idReserva) {
    const motivo = prompt('Ingrese el motivo del rechazo (opcional):');
    
    if (motivo === null) return; // Usuario canceló

    try {
        const response = await fetch(`${API_URL}/reservas/${idReserva}/rechazar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ motivo })
        });

        const resultado = await response.json();

        if (response.ok) {
            mostrarExito('alertaAdmin', 'Reserva rechazada.');
            document.getElementById('alertaAdmin').classList.remove('d-none');
            
            // Recargar tablas y estadísticas
            setTimeout(() => {
                cargarReservasAdmin();
                cargarEstadisticas();
                ocultarAlerta('alertaAdmin');
            }, 2000);
        } else {
            mostrarError('alertaAdmin', resultado.mensaje || 'Error al rechazar la reserva.');
            document.getElementById('alertaAdmin').classList.remove('d-none');
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        mostrarError('alertaAdmin', 'Error de conexión. Inténtelo de nuevo en unos segundos.');
        document.getElementById('alertaAdmin').classList.remove('d-none');
    }
}

// ==========================================
// VER COMPROBANTE
// ==========================================

async function verComprobante(idReserva) {
    try {
        const response = await fetch(`${API_URL}/reservas/${idReserva}/comprobante`, {
            method: 'GET'
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            
            // Mostrar en modal
            document.getElementById('imagenComprobante').src = url;
            const modal = new bootstrap.Modal(document.getElementById('modalComprobante'));
            modal.show();
        } else {
            alert('No se pudo cargar el comprobante.');
        }
    } catch (error) {
        console.error('Error al cargar comprobante:', error);
        alert('Error al cargar el comprobante.');
    }
}

// ==========================================
// CARGAR HABITACIONES
// ==========================================

async function cargarHabitaciones() {
    const tablaHabitaciones = document.getElementById('tablaHabitaciones');
    
    if (!tablaHabitaciones) return;

    try {
        const response = await fetch(`${API_URL}/habitaciones`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const habitaciones = await response.json();

        if (response.ok && habitaciones.length > 0) {
            tablaHabitaciones.innerHTML = '';
            
            habitaciones.forEach(habitacion => {
                const fila = document.createElement('tr');
                
                const estadoBadge = habitacion.disponible 
                    ? '<span class="badge bg-success">Disponible</span>'
                    : '<span class="badge bg-danger">Ocupada</span>';

                fila.innerHTML = `
                    <td>${habitacion.id}</td>
                    <td>${habitacion.tipo}</td>
                    <td>${habitacion.capacidad} persona(s)</td>
                    <td>$${habitacion.precio}</td>
                    <td>${estadoBadge}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="editarHabitacion('${habitacion.id}')">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarHabitacion('${habitacion.id}')">Eliminar</button>
                    </td>
                `;
                
                tablaHabitaciones.appendChild(fila);
            });
        }
    } catch (error) {
        console.error('Error al cargar habitaciones:', error);
    }
}

// ==========================================
// EDITAR HABITACIÓN
// ==========================================

async function editarHabitacion(idHabitacion) {
    // Esta función requeriría un formulario modal más complejo
    alert('Función de edición: Implementar según necesidades del backend');
}

// ==========================================
// ELIMINAR HABITACIÓN
// ==========================================

async function eliminarHabitacion(idHabitacion) {
    const confirmar = confirm('¿Está seguro que desea eliminar esta habitación?');
    
    if (!confirmar) return;

    try {
        const response = await fetch(`${API_URL}/habitaciones/${idHabitacion}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert('Habitación eliminada exitosamente.');
            cargarHabitaciones();
        } else {
            const resultado = await response.json();
            alert(resultado.mensaje || 'Error al eliminar la habitación.');
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        alert('Error de conexión. Inténtelo de nuevo en unos segundos.');
    }
}

// ==========================================
// INICIALIZACIÓN
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Verificar que estamos en el panel de admin
    if (window.location.pathname.includes('panel_admin.html')) {
        cargarEstadisticas();
        cargarReservasAdmin();
        cargarHabitaciones();
        
        // Actualizar cada 30 segundos
        setInterval(() => {
            cargarEstadisticas();
            cargarReservasAdmin();
        }, 30000);
    }
});

// Hacer funciones globales
window.aprobarReserva = aprobarReserva;
window.rechazarReserva = rechazarReserva;
window.verComprobante = verComprobante;
window.editarHabitacion = editarHabitacion;
window.eliminarHabitacion = eliminarHabitacion;