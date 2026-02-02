// ==========================================
// ADMIN.JS - HOSTAL LOS GIRASOLES
// Gestión administrativa del hostal
// ==========================================

const API_URL = (typeof CONFIG !== 'undefined' && CONFIG.getApiUrl) 
    ? CONFIG.getApiUrl() 
    : 'http://localhost:3000/api';

function obtenerToken() {
    return sessionStorage.getItem('token');
}

// CARGAR ESTADÍSTICAS
async function cargarEstadisticas() {
    try {
        const response = await fetch(`${API_URL}/reservas/estadisticas`, {
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
        console.error('Error estadísticas:', error);
    }
}

// CARGAR RESERVAS ADMIN
async function cargarReservasAdmin() {
    const tabla = document.getElementById('tablaReservasAdmin');
    if (!tabla) return;

    try {
        const response = await fetch(`${API_URL}/reservas/todas`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + obtenerToken()
            }
        });

        const data = await response.json();

        if (response.ok && data.reservas && data.reservas.length > 0) {
            tabla.innerHTML = data.reservas.map(r => {
                const botones = r.estado === 'pendiente'
                    ? `<button class="btn btn-sm btn-success" onclick="aprobarReserva(${r.id})">Aprobar</button>
                       <button class="btn btn-sm btn-danger" onclick="rechazarReserva(${r.id})">Rechazar</button>`
                    : '-';

                return `
                    <tr>
                        <td>${r.id}</td>
                        <td>${r.nombreCliente}</td>
                        <td>${r.tipoHabitacion}</td>
                        <td>${r.fechaEntrada}</td>
                        <td>${r.fechaSalida}</td>
                        <td>$${r.total}</td>
                        <td><button class="btn btn-sm btn-info" onclick="verComprobante(${r.id})">Ver</button></td>
                        <td><span class="estado-${r.estado}">${r.estado}</span></td>
                        <td>${botones}</td>
                    </tr>
                `;
            }).join('');
        } else {
            tabla.innerHTML = '<tr><td colspan="9" class="text-center">No hay reservas</td></tr>';
        }
    } catch (error) {
        console.error('Error reservas:', error);
        tabla.innerHTML = '<tr><td colspan="9" class="text-center text-danger">Error al cargar</td></tr>';
    }
}

// APROBAR RESERVA
async function aprobarReserva(id) {
    if (!confirm('¿Aprobar esta reserva?')) return;

    try {
        const response = await fetch(`${API_URL}/reservas/${id}/aprobar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + obtenerToken()
            }
        });

        const data = await response.json();

        if (response.ok) {
            alert('Reserva aprobada exitosamente');
            cargarReservasAdmin();
            cargarEstadisticas();
        } else {
            alert(data.mensaje || 'Error al aprobar');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}

// RECHAZAR RESERVA
async function rechazarReserva(id) {
    const motivo = prompt('Motivo del rechazo (opcional):');
    if (motivo === null) return;

    try {
        const response = await fetch(`${API_URL}/reservas/${id}/rechazar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + obtenerToken()
            },
            body: JSON.stringify({ motivo: motivo || 'No especificado' })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Reserva rechazada');
            cargarReservasAdmin();
            cargarEstadisticas();
        } else {
            alert(data.mensaje || 'Error al rechazar');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}

// VER COMPROBANTE
async function verComprobante(id) {
    try {
        const response = await fetch(`${API_URL}/reservas/${id}/comprobante`, {
            headers: { 'Authorization': 'Bearer ' + obtenerToken() }
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            document.getElementById('imagenComprobante').src = url;
            new bootstrap.Modal(document.getElementById('modalComprobante')).show();
        } else {
            alert('No se pudo cargar el comprobante');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar comprobante');
    }
}

// CARGAR HABITACIONES
async function cargarHabitaciones() {
    const tabla = document.getElementById('tablaHabitaciones');
    if (!tabla) return;

    try {
        const response = await fetch(`${API_URL}/habitaciones`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + obtenerToken()
            }
        });

        const data = await response.json();

        if (response.ok && data.success && data.habitaciones && data.habitaciones.length > 0) {
            tabla.innerHTML = data.habitaciones.map(h => `
                <tr>
                    <td>${h.id}</td>
                    <td>${h.tipo}</td>
                    <td>${h.capacidad}</td>
                    <td>$${h.precio}</td>
                    <td>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="toggle${h.id}" 
                                   ${h.disponible ? 'checked' : ''} 
                                   onchange="toggleDisponibilidad(${h.id}, this.checked)">
                            <label class="form-check-label fw-bold" for="toggle${h.id}">
                                ${h.disponible ? '<span class="text-success">Disponible</span>' : '<span class="text-danger">Ocupada</span>'}
                            </label>
                        </div>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="abrirModalEditar(${h.id})">✏️</button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarHabitacion(${h.id})">🗑️</button>
                    </td>
                </tr>
            `).join('');
        } else {
            tabla.innerHTML = '<tr><td colspan="6" class="text-center">No hay habitaciones</td></tr>';
        }
    } catch (error) {
        console.error('Error habitaciones:', error);
        tabla.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Error al cargar</td></tr>';
    }
}

// TOGGLE DISPONIBILIDAD
async function toggleDisponibilidad(id, disponible) {
    try {
        const response = await fetch(`${API_URL}/habitaciones/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + obtenerToken()
            },
            body: JSON.stringify({ disponible })
        });

        if (response.ok) {
            const label = document.querySelector(`label[for="toggle${id}"]`);
            label.innerHTML = disponible
                ? '<span class="text-success">Disponible</span>'
                : '<span class="text-danger">Ocupada</span>';
            cargarEstadisticas();
        } else {
            alert('Error al cambiar disponibilidad');
            document.getElementById(`toggle${id}`).checked = !disponible;
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
        document.getElementById(`toggle${id}`).checked = !disponible;
    }
}

// CREAR HABITACIÓN
async function crearHabitacion() {
    const tipo = document.getElementById('nuevoTipo').value.trim();
    const capacidad = document.getElementById('nuevaCapacidad').value;
    const precio = document.getElementById('nuevoPrecio').value;
    const descripcion = document.getElementById('nuevaDescripcion').value.trim();
    const disponible = document.getElementById('nuevaDisponible').checked;
    const alerta = document.getElementById('alertaNuevaHabitacion');

    if (!tipo || !capacidad || !precio) {
        alerta.textContent = 'Complete todos los campos obligatorios';
        alerta.className = 'alert alert-danger';
        alerta.classList.remove('d-none');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/habitaciones`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + obtenerToken()
            },
            body: JSON.stringify({
                tipo,
                capacidad: parseInt(capacidad),
                precio: parseFloat(precio),
                descripcion,
                disponible
            })
        });

        const data = await response.json();

        if (response.ok) {
            alerta.textContent = '✅ Habitación creada exitosamente';
            alerta.className = 'alert alert-success';
            alerta.classList.remove('d-none');

            document.getElementById('formNuevaHabitacion').reset();

            setTimeout(() => {
                bootstrap.Modal.getInstance(document.getElementById('modalNuevaHabitacion')).hide();
                alerta.classList.add('d-none');
                cargarHabitaciones();
                cargarEstadisticas();
            }, 1500);
        } else {
            alerta.textContent = data.mensaje || 'Error al crear habitación';
            alerta.className = 'alert alert-danger';
            alerta.classList.remove('d-none');
        }
    } catch (error) {
        console.error('Error:', error);
        alerta.textContent = 'Error de conexión';
        alerta.className = 'alert alert-danger';
        alerta.classList.remove('d-none');
    }
}

// ABRIR MODAL EDITAR
async function abrirModalEditar(id) {
    try {
        const response = await fetch(`${API_URL}/habitaciones/${id}`, {
            headers: { 'Authorization': 'Bearer ' + obtenerToken() }
        });
        const data = await response.json();

        if (response.ok && data.habitacion) {
            const h = data.habitacion;
            document.getElementById('editarId').value = h.id;
            document.getElementById('editarTipo').value = h.tipo;
            document.getElementById('editarCapacidad').value = h.capacidad;
            document.getElementById('editarPrecio').value = h.precio;
            document.getElementById('editarDescripcion').value = h.descripcion || '';
            document.getElementById('editarDisponible').checked = h.disponible == 1;

            new bootstrap.Modal(document.getElementById('modalEditarHabitacion')).show();
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}

// GUARDAR EDICIÓN
async function guardarEdicionHabitacion() {
    const id = document.getElementById('editarId').value;
    const tipo = document.getElementById('editarTipo').value.trim();
    const capacidad = document.getElementById('editarCapacidad').value;
    const precio = document.getElementById('editarPrecio').value;
    const descripcion = document.getElementById('editarDescripcion').value.trim();
    const disponible = document.getElementById('editarDisponible').checked;
    const alerta = document.getElementById('alertaEditarHabitacion');

    if (!tipo || !capacidad || !precio) {
        alerta.textContent = 'Complete todos los campos obligatorios';
        alerta.className = 'alert alert-danger';
        alerta.classList.remove('d-none');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/habitaciones/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + obtenerToken()
            },
            body: JSON.stringify({
                tipo,
                capacidad: parseInt(capacidad),
                precio: parseFloat(precio),
                descripcion,
                disponible
            })
        });

        const data = await response.json();

        if (response.ok) {
            alerta.textContent = '✅ Habitación actualizada exitosamente';
            alerta.className = 'alert alert-success';
            alerta.classList.remove('d-none');

            setTimeout(() => {
                bootstrap.Modal.getInstance(document.getElementById('modalEditarHabitacion')).hide();
                alerta.classList.add('d-none');
                cargarHabitaciones();
                cargarEstadisticas();
            }, 1500);
        } else {
            alerta.textContent = data.mensaje || 'Error al actualizar';
            alerta.className = 'alert alert-danger';
            alerta.classList.remove('d-none');
        }
    } catch (error) {
        console.error('Error:', error);
        alerta.textContent = 'Error de conexión';
        alerta.className = 'alert alert-danger';
        alerta.classList.remove('d-none');
    }
}

// ELIMINAR HABITACIÓN
async function eliminarHabitacion(id) {
    if (!confirm('¿Eliminar esta habitación? No se puede deshacer.')) return;

    try {
        const response = await fetch(`${API_URL}/habitaciones/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + obtenerToken()
            }
        });

        if (response.ok) {
            alert('Habitación eliminada');
            cargarHabitaciones();
            cargarEstadisticas();
        } else {
            const data = await response.json();
            alert(data.mensaje || 'Error al eliminar');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('panel_admin.html')) {
        cargarEstadisticas();
        cargarReservasAdmin();
        cargarHabitaciones();

        setInterval(() => {
            cargarEstadisticas();
            cargarReservasAdmin();
            cargarHabitaciones();
        }, 30000);
    }
});

// EXPORTAR AL SCOPE GLOBAL
window.aprobarReserva = aprobarReserva;
window.rechazarReserva = rechazarReserva;
window.verComprobante = verComprobante;
window.cargarReservasAdmin = cargarReservasAdmin;
window.cargarEstadisticas = cargarEstadisticas;
window.cargarHabitaciones = cargarHabitaciones;
window.toggleDisponibilidad = toggleDisponibilidad;
window.eliminarHabitacion = eliminarHabitacion;
window.crearHabitacion = crearHabitacion;
window.abrirModalEditar = abrirModalEditar;
window.guardarEdicionHabitacion = guardarEdicionHabitacion;