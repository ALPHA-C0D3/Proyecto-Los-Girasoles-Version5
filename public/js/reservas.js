// ==========================================
// RESERVAS.JS - HOSTAL LOS GIRASOLES
// Gestión de reservas del cliente
// ==========================================

const API_URL = 'http://localhost:3000/api';

const PRECIOS_HABITACIONES = {
    'individual': 30,
    'doble': 50,
    'triple': 65,
    'familiar': 80,
    'suite': 120,
    'economica': 25
};

// ==========================================
// OBTENER TOKEN DE SESIÓN
// ==========================================
function obtenerToken() {
    return sessionStorage.getItem('token');
}

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
            
            const alertaReserva = document.getElementById('alertaReserva');
            if (alertaReserva) {
                alertaReserva.classList.add('d-none');
            }

            const tipoHabitacion = document.getElementById('tipoHabitacion').value;
            const numPersonas = document.getElementById('numPersonas').value;
            const fechaEntrada = document.getElementById('fechaEntrada').value;
            const fechaSalida = document.getElementById('fechaSalida').value;
            const comprobante = document.getElementById('comprobante').files[0];

            if (!tipoHabitacion || !numPersonas || !fechaEntrada || !fechaSalida) {
                mostrarMensaje('alertaReserva', 'Complete todos los campos obligatorios.', 'danger');
                return;
            }

            const validacionFechas = validarFechasReserva(fechaEntrada, fechaSalida);
            if (!validacionFechas.valido) {
                mostrarMensaje('alertaReserva', validacionFechas.mensaje, 'danger');
                document.getElementById('fechaSalida').classList.add('is-invalid');
                return;
            }

            const validacionComprobante = validarComprobante(comprobante);
            if (!validacionComprobante.valido) {
                mostrarMensaje('alertaReserva', validacionComprobante.mensaje, 'danger');
                document.getElementById('comprobante').classList.add('is-invalid');
                return;
            }

            const formData = new FormData();
            formData.append('tipoHabitacion', tipoHabitacion);
            formData.append('numPersonas', numPersonas);
            formData.append('fechaEntrada', fechaEntrada);
            formData.append('fechaSalida', fechaSalida);
            formData.append('comprobante', comprobante);
            formData.append('total', document.getElementById('totalEstimado').textContent);

            try {
                const response = await fetch(`${API_URL}/reservas`, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + obtenerToken()
                    },
                    body: formData
                });

                const resultado = await response.json();

                if (response.ok) {
                    mostrarMensaje('alertaReserva', 'Reserva enviada exitosamente. Pendiente de aprobación.', 'success');
                    
                    formReserva.reset();
                    document.getElementById('totalEstimado').textContent = '0';

                    const modal = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
                    document.getElementById('mensajeModal').textContent = 
                        'Su reserva ha sido registrada correctamente. El administrador revisará su pago y le notificará pronto.';
                    modal.show();

                    setTimeout(() => {
                        cargarReservasCliente();
                    }, 2000);
                } else {
                    mostrarMensaje('alertaReserva', resultado.mensaje || 'Error al procesar la reserva.', 'danger');
                }
            } catch (error) {
                console.error('Error de conexión:', error);
                mostrarMensaje('alertaReserva', 'Error de conexión. Inténtelo de nuevo en unos segundos.', 'danger');
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
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + obtenerToken()
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

// ==========================================
// FUNCIÓN AUXILIAR PARA MOSTRAR MENSAJES
// ==========================================
function mostrarMensaje(idAlerta, mensaje, tipo) {
    const alerta = document.getElementById(idAlerta);
    if (alerta) {
        alerta.textContent = mensaje;
        alerta.className = `alert alert-${tipo}`;
        alerta.classList.remove('d-none');
    }
}

window.cancelarReserva = cancelarReserva;