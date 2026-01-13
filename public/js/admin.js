// ==========================================
// ADMIN.JS - HOSTAL LOS GIRASOLES
// Gestión administrativa del hostal
// ==========================================

const API_URL = 'http://localhost:3000/api';

// ==========================================
// OBTENER TOKEN DE SESIÓN
// ==========================================
function obtenerToken() {
    return sessionStorage.getItem('token');
}

// ==========================================
// CARGAR ESTADÍSTICAS DEL DASHBOARD
// ==========================================
async function cargarEstadisticas() {
    try {
        const response = await fetch(`${API_URL}/reservas/estadisticas`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + obtenerToken()
            }
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('totalReservas').textContent = data.totalReservas || 0;
            document.getElementById('reservasAprobadas').textContent = data.aprobadas || 0;
            document.getElementById('reservasPendientes').textContent = data.pendientes || 0;
            document.getElementById('habitacionesDisponibles').textContent = data.disponibles || 0;
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
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + obtenerToken()
            }
        });

        const data = await response.json();

        if (response.ok && data.reservas && data.reservas.length > 0) {
            tablaReservas.innerHTML = '';
            
            data.reservas.forEach(reserva => {
                const fila = document.createElement('tr');
                
                let estadoClase = 'estado-pendiente';
                if (reserva.estado === 'aprobado') {
                    estadoClase = 'estado-aprobado';
                } else if (reserva.estado === 'rechazado') {
                    estadoClase = 'estado-rechazado';
                }

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
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + obtenerToken()
            }
        });

        const resultado = await response.json();

        if (response.ok) {
            mostrarExito('alertaAdmin', 'Reserva aprobada exitosamente.');
            document.getElementById('alertaAdmin').classList.remove('d-none');
            
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
    
    if (motivo === null) return;

    try {
        const response = await fetch(`${API_URL}/reservas/${idReserva}/rechazar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + obtenerToken()
            },
            body: JSON.stringify({ motivo })
        });

        const resultado = await response.json();

        if (response.ok) {
            mostrarExito('alertaAdmin', 'Reserva rechazada.');
            document.getElementById('alertaAdmin').classList.remove('d-none');
            
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
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + obtenerToken()
            }
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            
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
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + obtenerToken()
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
// FUNCIONES AUXILIARES PARA ALERTAS
// ==========================================
function mostrarExito(idAlerta, mensaje) {
    const alerta = document.getElementById(idAlerta);
    alerta.textContent = mensaje;
    alerta.className = 'alert alert-success';
}

function mostrarError(idAlerta, mensaje) {
    const alerta = document.getElementById(idAlerta);
    alerta.textContent = mensaje;
    alerta.className = 'alert alert-danger';
}

function ocultarAlerta(idAlerta) {
    const alerta = document.getElementById(idAlerta);
    alerta.classList.add('d-none');
}

// ==========================================
// EDITAR HABITACIÓN
// ==========================================
async function editarHabitacion(idHabitacion) {
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
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + obtenerToken()
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
    if (window.location.pathname.includes('panel_admin.html')) {
        cargarEstadisticas();
        cargarReservasAdmin();
        cargarHabitaciones();
        
        setInterval(() => {
            cargarEstadisticas();
            cargarReservasAdmin();
        }, 30000);
    }
});

window.aprobarReserva = aprobarReserva;
window.rechazarReserva = rechazarReserva;
window.verComprobante = verComprobante;
window.editarHabitacion = editarHabitacion;
window.eliminarHabitacion = eliminarHabitacion;