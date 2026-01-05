// ==========================================
// VALIDACIONES.JS - HOSTAL EL REFUGIO
// Validaciones del lado del cliente
// ==========================================

// Función para validar campos vacíos
function validarCamposVacios(formulario) {
    const campos = formulario.querySelectorAll('[required]');
    let valido = true;
    let primerCampoInvalido = null;

    campos.forEach(campo => {
        if (!campo.value.trim()) {
            campo.classList.add('is-invalid');
            valido = false;
            if (!primerCampoInvalido) {
                primerCampoInvalido = campo;
            }
        } else {
            campo.classList.remove('is-invalid');
        }
    });

    // Enfocar el primer campo inválido
    if (primerCampoInvalido) {
        primerCampoInvalido.focus();
    }

    return valido;
}

// Función para validar formato de email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Función para validar teléfono (solo números)
function validarTelefono(telefono) {
    const regex = /^[0-9]{7,15}$/;
    return regex.test(telefono);
}

// Función para validar que las contraseñas coincidan
function validarPasswordsIguales(password1, password2) {
    return password1 === password2;
}

// Función para validar fechas de reserva
function validarFechasReserva(fechaEntrada, fechaSalida) {
    const entrada = new Date(fechaEntrada);
    const salida = new Date(fechaSalida);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // La fecha de entrada no puede ser anterior a hoy
    if (entrada < hoy) {
        return {
            valido: false,
            mensaje: 'La fecha de entrada no puede ser anterior a hoy.'
        };
    }

    // La fecha de salida debe ser posterior a la entrada
    if (salida <= entrada) {
        return {
            valido: false,
            mensaje: 'La fecha de salida debe ser posterior a la fecha de entrada.'
        };
    }

    return { valido: true };
}

// Función para validar archivo de comprobante
function validarComprobante(archivo) {
    if (!archivo) {
        return {
            valido: false,
            mensaje: 'Debe subir su comprobante para procesar la reserva.'
        };
    }

    // Validar tipo de archivo
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!tiposPermitidos.includes(archivo.type)) {
        return {
            valido: false,
            mensaje: 'Formato no permitido. Use JPG, PNG o PDF.'
        };
    }

    // Validar tamaño (máximo 5MB)
    const tamañoMaximo = 5 * 1024 * 1024; // 5MB en bytes
    if (archivo.size > tamañoMaximo) {
        return {
            valido: false,
            mensaje: 'El archivo no debe superar los 5MB.'
        };
    }

    return { valido: true };
}

// Función para mostrar mensajes de error
function mostrarError(elementoAlerta, mensaje) {
    const alerta = document.getElementById(elementoAlerta);
    const mensajeSpan = alerta.querySelector('span') || alerta;
    
    if (alerta) {
        mensajeSpan.textContent = mensaje;
        alerta.classList.remove('d-none', 'alert-success');
        alerta.classList.add('alert-danger');
        
        // Scroll hacia la alerta
        alerta.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Función para mostrar mensajes de éxito
function mostrarExito(elementoAlerta, mensaje) {
    const alerta = document.getElementById(elementoAlerta);
    const mensajeSpan = alerta.querySelector('span') || alerta;
    
    if (alerta) {
        mensajeSpan.textContent = mensaje;
        alerta.classList.remove('d-none', 'alert-danger');
        alerta.classList.add('alert-success');
        
        // Scroll hacia la alerta
        alerta.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Función para ocultar alertas
function ocultarAlerta(elementoAlerta) {
    const alerta = document.getElementById(elementoAlerta);
    if (alerta) {
        alerta.classList.add('d-none');
    }
}

// Función para limpiar validaciones de un formulario
function limpiarValidaciones(formulario) {
    const campos = formulario.querySelectorAll('.is-invalid');
    campos.forEach(campo => {
        campo.classList.remove('is-invalid');
    });
}

// Función para sanitizar entrada de texto
function sanitizarTexto(texto) {
    const elementoTemporal = document.createElement('div');
    elementoTemporal.textContent = texto;
    return elementoTemporal.innerHTML;
}

// Función para validar longitud mínima
function validarLongitudMinima(texto, minimo) {
    return texto.length >= minimo;
}

// Event listeners para validación en tiempo real
document.addEventListener('DOMContentLoaded', function() {
    // Validar email en tiempo real
    const camposEmail = document.querySelectorAll('input[type="email"]');
    camposEmail.forEach(campo => {
        campo.addEventListener('blur', function() {
            if (this.value && !validarEmail(this.value)) {
                this.classList.add('is-invalid');
                const feedback = this.nextElementSibling;
                if (feedback && feedback.classList.contains('invalid-feedback')) {
                    feedback.textContent = 'Ingrese un correo electrónico válido.';
                }
            } else {
                this.classList.remove('is-invalid');
            }
        });
    });

    // Validar teléfono en tiempo real
    const camposTelefono = document.querySelectorAll('input[type="tel"]');
    camposTelefono.forEach(campo => {
        campo.addEventListener('input', function() {
            // Permitir solo números
            this.value = this.value.replace(/[^0-9]/g, '');
        });

        campo.addEventListener('blur', function() {
            if (this.value && !validarTelefono(this.value)) {
                this.classList.add('is-invalid');
            } else {
                this.classList.remove('is-invalid');
            }
        });
    });

    // Validar confirmación de contraseña en tiempo real
    const confirmarPassword = document.getElementById('confirmarPassword');
    const password = document.getElementById('password');
    
    if (confirmarPassword && password) {
        confirmarPassword.addEventListener('input', function() {
            if (this.value && !validarPasswordsIguales(password.value, this.value)) {
                this.classList.add('is-invalid');
            } else {
                this.classList.remove('is-invalid');
            }
        });
    }
});

// Exportar funciones para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validarCamposVacios,
        validarEmail,
        validarTelefono,
        validarPasswordsIguales,
        validarFechasReserva,
        validarComprobante,
        mostrarError,
        mostrarExito,
        ocultarAlerta,
        limpiarValidaciones,
        sanitizarTexto,
        validarLongitudMinima
    };
}