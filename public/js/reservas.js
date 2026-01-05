// ==========================================
// RESERVAS.JS - HOSTAL EL REFUGIO
// Gestión de reservas del cliente
// ==========================================

const API_URL = 'http://localhost:3000/api'; // Cambiar por la URL real del backend

// Precios de habitaciones
const PRECIOS_HABITACIONES = {
    'individual': 30,
    'doble': 50,
    'triple': 65,
    'familiar': 80,
    'suite': 120,
    'economica': 25
};

// ==========================================
// CALCULAR TOTAL DE RESERVA
// ==========================================

function calcularTotalReserva() {
    const tipoHabitacion = document.getElementById('tipoHabitacion').value;
    const fechaEntrada = document.getElementById('fechaEntrada').value;
    const fechaSalida = document.getElementById('fechaSalida').value;

    if (!tipoHabitacion || !fechaEntrada || !fechaSalida) {
        document.getElementById('totalEstimado').textContent = '0';
        return;
    }

    const entrada = new Date(fechaEntrada);
    const salida = new Date(fechaSalida);
    
    // Calcular número de noches
    const diferenciaTiempo = salida - entrada;
    const noches = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24));

    if (noches <= 0) {
        document.getElementById('totalEstimado').textContent = '0';
        return;
    }

    const precioPorNoche = PRECIOS_HABITACIONES[tipoHabitacion] || 0;
    const total = noches * precioPorNoche;

    document.getElementById('totalEstimado').textContent = total;
}

// Event listeners para actualizar el total
document.addEventListener('DOMContentLoaded', function() {
    const tipoHabitacion = document.getElementById('tipoHabitacion');
    const fechaEntrada = document.getElementById('fechaEntrada');
    const fechaSalida = document.getElementById('fechaSalida');

    if (tipoHabitacion) {
        tipoHabitacion.addEventListener('change', calcularTotalReserva);
    }

    if (fechaEntrada) {
        fechaEntrada.addEventListener('change', calcularTotalReserva);
    }

    if (fechaSalida) {
        fechaSalida.addEventListener('change', calcularTotalReserva);
    }

    // Establecer fecha mínima como hoy
    const hoy = new Date().toISOString().split('T')[0];
    if (fechaEntrada) {
        fechaEntrada.setAttribute('min', hoy);
    }
});

// ==========================================
// ENVIAR RESERVA
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const formReserva = document.getElementById('formReserva');
    
    if (formReserva) {
        formReserva.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Limpiar alertas previas
            ocultarAlerta('alertaReserva');

            // Obtener datos del formulario
            const tipoHabitacion = document.getElementById('tipoHabitacion').value;
            const numPersonas = document.getElementById('numPersonas').value;
            const fechaEntrada = document.getElementById('fechaEntrada').value;
            const fechaSalida = document.getElementById('fechaSalida').value;
            const comprobante = document.getElementById('comprobante').files[0];

            // Validar campos obligatorios
            if (!tipoHabitacion || !numPersonas || !fechaEntrada || !fechaSalida) {
                mostrarError('alertaReserva', 'Complete todos los campos obligatorios.');
                document.getElementById('alertaReserva').classList.remove('d-none');
                return;
            }

            // Validar fechas
            const validacionFechas = validarFechasReserva(fechaEntrada, fechaSalida);
            if (!validacionFechas.valido) {
                mostrarError('alertaReserva', validacionFechas.mensaje);
                document.getElementById('alertaReserva').classList.remove('d-none');
                document.getElementById('fechaSalida').classList.add('is-invalid');
                return;
            }

            // Validar comprobante
            const validacionComprobante = validarComprobante(comprobante);
            if (!validacionComprobante.valido) {
                mostrarError('alertaReserva', validacionComprobante.mensaje);
                document.getElementById('alertaReserva').classList.remove('d-none');
                document.getElementById('comprobante').classList.add('is-invalid');
                return;
            }

            // Preparar datos para enviar
            const formData = new FormData();
            formData.append('tipoHabitacion', tipoHabitacion);
            formData.append('numPersonas', numPersonas);
            formData.append('fechaEntrada', fechaEntrada);
            formData.append('fechaSalida', fechaSalida);
            formData.append('comprobante', comprobante);
            formData.append('total', document.getElementById('totalEstimado').textContent);

            // Enviar al servidor
            try {
                const response = await fetch(`${API_URL}/reservas`, {
                    method: 'POST',
                    body: formData
                });

                const resultado = await response.json();

                if (response.ok) {
                    // Mostrar mensaje de éxito
                    mostrarExito('alertaReserva', 'Reserva enviada exitosamente. Pendiente de aprobación.');
                    document.getElementById('alertaReserva').classList.remove('d-none');
                    
                    // Limpiar formulario
                    formReserva.reset();
                    document.getElementById('totalEstimado').textContent = '0';

                    // Mostrar modal de confirmación
                    const modal = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
                    document.getElementById('mensajeModal').textContent = 
                        'Su reserva ha sido registrada correctamente. El administrador revisará su pago y le notificará pronto.';
                    modal.show();

                    // Recargar lista de reservas
                    setTimeout(() => {
                        cargarReservasCliente();
                    }, 2000);
                } else {
                    mostrarError('alertaReserva', resultado.mensaje || 'Error al procesar la reserva.');
                    document.getElementById('alertaReserva').classList.remove('d-none');
                }
            } catch (error) {
                console.error('Error de conexión:', error);
                mostrarError('alertaReserva', 'Error de conexión. Inténtelo de nuevo en unos segundos.');
                document.getElementById('alertaReserva').classList.remove('d-none');
            }
        });
    }
});

// ==========================================
// CARGAR RESERVAS DEL CLIENTE
// ==========================================

async function cargarReservasCliente() {
    const tablaReservas = document.getElementById('tablaReservas');
    
    if (!tablaReservas) return;

    try {
        const response = await fetch(`${API_URL}/reservas/cliente`, {
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

                fila.innerHTML = `
                    <td>${reserva.id}</td>
                    <td>${reserva.tipoHabitacion}</td>
                    <td>${reserva.fechaEntrada}</td>
                    <td>${reserva.fechaSalida}</td>
                    <td>$${reserva.total}</td>
                    <td><span class="${estadoClase}">${reserva.estado}</span></td>
                    <td>
                        ${reserva.estado === 'pendiente' 
                            ? '<button class="btn btn-sm btn-danger" onclick="cancelarReserva(\'' + reserva.id + '\')">Cancelar</button>'
                            : '-'}
                    </td>
                `;
                
                tablaReservas.appendChild(fila);
            });
        } else {
            tablaReservas.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No tienes reservas aún</td></tr>';
        }
    } catch (error) {
        console.error('Error al cargar reservas:', error);
        tablaReservas.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Error al cargar reservas</td></tr>';
    }
}

// Cargar reservas al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('tablaReservas')) {
        cargarReservasCliente();
    }
});

// ==========================================
// CANCELAR RESERVA
// ==========================================

async function cancelarReserva(idReserva) {
    const confirmar = confirm('¿Está seguro que desea cancelar esta reserva?');
    
    if (!confirmar) return;

    try {
        const response = await fetch(`${API_URL}/reservas/${idReserva}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const resultado = await response.json();

        if (response.ok) {
            alert('Reserva cancelada exitosamente.');
            cargarReservasCliente();
        } else {
            alert(resultado.mensaje || 'Error al cancelar la reserva.');
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        alert('Error de conexión. Inténtelo de nuevo en unos segundos.');
    }
}

// Hacer la función global
window.cancelarReserva = cancelarReserva;