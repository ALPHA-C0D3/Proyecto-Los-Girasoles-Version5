// ==========================================
// RESERVAS.JS - HOSTAL LOS GIRASOLES
// Gestión de reservas del cliente
// ==========================================

const API_URL = (typeof CONFIG !== 'undefined' && CONFIG.getApiUrl) 
    ? CONFIG.getApiUrl() 
    : 'http://localhost:3000/api';

const PRECIO_POR_PERSONA_NOCHE = 10;

function obtenerToken() {
    return sessionStorage.getItem('token');
}

// CALCULAR TOTAL - SISTEMA POR PERSONA ($10)
function calcularTotalReserva() {
    const numPersonas = parseInt(document.getElementById('numPersonas')?.value) || 0;
    const fechaEntrada = document.getElementById('fechaEntrada')?.value;
    const fechaSalida = document.getElementById('fechaSalida')?.value;
    const totalEstimado = document.getElementById('totalEstimado');

    if (!fechaEntrada || !fechaSalida || numPersonas === 0) {
        if (totalEstimado) totalEstimado.textContent = '0';
        return;
    }

    const entrada = new Date(fechaEntrada);
    const salida = new Date(fechaSalida);

    if (salida <= entrada) {
        if (totalEstimado) totalEstimado.textContent = '0';
        return;
    }

    const noches = Math.ceil((salida - entrada) / (1000 * 60 * 60 * 24));
    const total = numPersonas * PRECIO_POR_PERSONA_NOCHE * noches;

    if (totalEstimado) {
        totalEstimado.textContent = total;
    }
}

// CARGAR RESERVAS CLIENTE
async function cargarReservasCliente() {
    const tabla = document.getElementById('tablaReservas');
    if (!tabla) return;

    try {
        const response = await fetch(`${API_URL}/reservas/cliente`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + obtenerToken()
            }
        });

        const data = await response.json();

        if (response.ok && data.reservas && data.reservas.length > 0) {
            tabla.innerHTML = data.reservas.map(r => `
                <tr>
                    <td>${r.id}</td>
                    <td>${r.tipoHabitacion}</td>
                    <td>${r.fechaEntrada}</td>
                    <td>${r.fechaSalida}</td>
                    <td>$${r.total}</td>
                    <td><span class="estado-${r.estado}">${r.estado}</span></td>
                    <td>
                        ${r.estado === 'pendiente'
                            ? `<button class="btn btn-sm btn-danger" onclick="cancelarReserva(${r.id})">Cancelar</button>`
                            : '-'}
                    </td>
                </tr>
            `).join('');
        } else {
            tabla.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No tienes reservas aún</td></tr>';
        }
    } catch (error) {
        console.error('Error al cargar reservas:', error);
        tabla.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Error al cargar reservas</td></tr>';
    }
}

// CANCELAR RESERVA
async function cancelarReserva(id) {
    if (!confirm('¿Está seguro que desea cancelar esta reserva?')) return;

    try {
        const response = await fetch(`${API_URL}/reservas/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + obtenerToken()
            }
        });

        const data = await response.json();

        if (response.ok) {
            alert('Reserva cancelada exitosamente');
            cargarReservasCliente();
        } else {
            alert(data.mensaje || 'Error al cancelar la reserva');
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        alert('Error de conexión. Inténtelo de nuevo en unos segundos');
    }
}

// ENVIAR RESERVA
async function enviarReserva(e) {
    e.preventDefault();

    const tipoHabitacion = document.getElementById('tipoHabitacion').value;
    const numPersonas = document.getElementById('numPersonas').value;
    const fechaEntrada = document.getElementById('fechaEntrada').value;
    const fechaSalida = document.getElementById('fechaSalida').value;
    const comprobante = document.getElementById('comprobante').files[0];
    const total = document.getElementById('totalEstimado').textContent;

    if (!tipoHabitacion || !numPersonas || !fechaEntrada || !fechaSalida) {
        alert('Complete todos los campos obligatorios');
        return;
    }

    if (!comprobante) {
        alert('Debe adjuntar el comprobante de pago');
        return;
    }

    const formData = new FormData();
    formData.append('tipoHabitacion', tipoHabitacion);
    formData.append('numPersonas', numPersonas);
    formData.append('fechaEntrada', fechaEntrada);
    formData.append('fechaSalida', fechaSalida);
    formData.append('comprobante', comprobante);
    formData.append('total', total);

    try {
        const response = await fetch(`${API_URL}/reservas`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + obtenerToken()
            },
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            alert('Reserva enviada exitosamente. Pendiente de aprobación.');
            document.getElementById('formReserva').reset();
            document.getElementById('totalEstimado').textContent = '0';
            setTimeout(() => cargarReservasCliente(), 1000);
        } else {
            alert(data.mensaje || 'Error al procesar la reserva');
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        alert('Error de conexión. Inténtelo de nuevo en unos segundos');
    }
}

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', function() {
    const tipoHabitacion = document.getElementById('tipoHabitacion');
    const fechaEntrada = document.getElementById('fechaEntrada');
    const fechaSalida = document.getElementById('fechaSalida');
    const formReserva = document.getElementById('formReserva');

    if (tipoHabitacion) tipoHabitacion.addEventListener('change', calcularTotalReserva);
    if (fechaEntrada) fechaEntrada.addEventListener('change', calcularTotalReserva);
    if (fechaSalida) fechaSalida.addEventListener('change', calcularTotalReserva);

    const hoy = new Date().toISOString().split('T')[0];
    if (fechaEntrada) fechaEntrada.setAttribute('min', hoy);
    if (fechaSalida) fechaSalida.setAttribute('min', hoy);

    if (formReserva) {
        formReserva.addEventListener('submit', enviarReserva);
    }

    if (document.getElementById('tablaReservas')) {
        cargarReservasCliente();
    }
});

// EXPORTAR AL SCOPE GLOBAL
window.cargarReservasCliente = cargarReservasCliente;
window.cancelarReserva = cancelarReserva;
window.calcularTotalReserva = calcularTotalReserva;