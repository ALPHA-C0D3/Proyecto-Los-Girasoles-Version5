// ==========================================
// AUTH.JS - HOSTAL EL REFUGIO
// Autenticación optimizada para Node.js Backend
// ==========================================

// URL del backend Node.js
const API_URL = 'http://localhost:3000/api';

// ==========================================
// UTILIDADES DE SESIÓN
// ==========================================

// Guardar usuario en sessionStorage
function guardarSesion(usuario, token) {
    sessionStorage.setItem('usuario', JSON.stringify(usuario));
    sessionStorage.setItem('token', token);
}

// Obtener usuario actual
function obtenerUsuarioActual() {
    const usuario = sessionStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
}

// Obtener token
function obtenerToken() {
    return sessionStorage.getItem('token');
}

// Limpiar sesión
function limpiarSesion() {
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('token');
}

// Verificar si está autenticado
function estaAutenticado() {
    return obtenerToken() !== null && obtenerUsuarioActual() !== null;
}

// Verificar si es administrador
function esAdministrador() {
    const usuario = obtenerUsuarioActual();
    return usuario && usuario.tipoUsuario === 'admin';
}

// ==========================================
// PROTECCIÓN DE RUTAS
// ==========================================

function verificarAccesoPagina() {
    const paginaActual = window.location.pathname;
    
    // Páginas que requieren autenticación
    const paginasProtegidas = ['panel_cliente.html', 'panel_admin.html'];
    const requiereAuth = paginasProtegidas.some(pagina => paginaActual.includes(pagina));
    
    if (requiereAuth && !estaAutenticado()) {
        alert('Debe iniciar sesión para acceder a esta página.');
        window.location.href = 'login.html';
        return false;
    }
    
    // Panel admin solo para administradores
    if (paginaActual.includes('panel_admin.html') && !esAdministrador()) {
        alert('No tiene permisos de administrador.');
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

// Ejecutar verificación al cargar páginas protegidas
document.addEventListener('DOMContentLoaded', function() {
    verificarAccesoPagina();
});

// ==========================================
// REGISTRO DE USUARIO
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const formRegistro = document.getElementById('formRegistro');
    
    if (formRegistro) {
        formRegistro.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const btnSubmit = this.querySelector('button[type="submit"]');
            const textoOriginal = btnSubmit.innerHTML;
            
            // Deshabilitar botón
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Registrando...';
            
            // Limpiar alertas
            ocultarAlerta('alertaRegistro');

            // Obtener datos
            const datos = {
                nombre: document.getElementById('nombre').value.trim(),
                apellido: document.getElementById('apellido').value.trim(),
                telefono: document.getElementById('telefono').value.trim(),
                correo: document.getElementById('correo').value.trim(),
                password: document.getElementById('password').value,
                tipoUsuario: document.getElementById('tipoUsuario').value
            };

            const confirmarPass = document.getElementById('confirmarPassword').value;
            const terminos = document.getElementById('terminos').checked;

            // Validaciones
            if (!validarCamposVacios(formRegistro)) {
                mostrarError('mensajeError', 'Todos los campos son obligatorios.');
                document.getElementById('alertaRegistro').classList.remove('d-none');
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = textoOriginal;
                return;
            }

            if (!validarEmail(datos.correo)) {
                mostrarError('mensajeError', 'Ingrese un correo electrónico válido.');
                document.getElementById('alertaRegistro').classList.remove('d-none');
                document.getElementById('correo').classList.add('is-invalid');
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = textoOriginal;
                return;
            }

            if (!validarTelefono(datos.telefono)) {
                mostrarError('mensajeError', 'Ingrese un número de teléfono válido (solo números, 7-15 dígitos).');
                document.getElementById('alertaRegistro').classList.remove('d-none');
                document.getElementById('telefono').classList.add('is-invalid');
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = textoOriginal;
                return;
            }

            if (!validarLongitudMinima(datos.password, 6)) {
                mostrarError('mensajeError', 'La contraseña debe tener al menos 6 caracteres.');
                document.getElementById('alertaRegistro').classList.remove('d-none');
                document.getElementById('password').classList.add('is-invalid');
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = textoOriginal;
                return;
            }

            if (!validarPasswordsIguales(datos.password, confirmarPass)) {
                mostrarError('mensajeError', 'Las contraseñas no coinciden.');
                document.getElementById('alertaRegistro').classList.remove('d-none');
                document.getElementById('confirmarPassword').classList.add('is-invalid');
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = textoOriginal;
                return;
            }

            if (!terminos) {
                mostrarError('mensajeError', 'Debe aceptar los términos y condiciones.');
                document.getElementById('alertaRegistro').classList.remove('d-none');
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = textoOriginal;
                return;
            }

            // Enviar al backend
            try {
                const response = await fetch(`${API_URL}/auth/registro`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datos)
                });

                const resultado = await response.json();

                if (response.ok) {
                    // Registro exitoso
                    alert('¡Registro exitoso! Será redirigido al login.');
                    window.location.href = 'login.html?registro=exitoso';
                } else {
                    // Error del servidor
                    mostrarError('mensajeError', resultado.mensaje || 'Error en el registro. Intente nuevamente.');
                    document.getElementById('alertaRegistro').classList.remove('d-none');
                    btnSubmit.disabled = false;
                    btnSubmit.innerHTML = textoOriginal;
                }
            } catch (error) {
                console.error('Error de conexión:', error);
                mostrarError('mensajeError', 'Error de conexión con el servidor. Verifique que el backend esté ejecutándose.');
                document.getElementById('alertaRegistro').classList.remove('d-none');
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = textoOriginal;
            }
        });
    }
});

// ==========================================
// LOGIN
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const formLogin = document.getElementById('formLogin');
    
    if (formLogin) {
        // Verificar si ya está autenticado
        if (estaAutenticado()) {
            const usuario = obtenerUsuarioActual();
            if (usuario.tipoUsuario === 'admin') {
                window.location.href = 'panel_admin.html';
            } else {
                window.location.href = 'panel_cliente.html';
            }
            return;
        }

        formLogin.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const btnLogin = document.getElementById('btnLogin');
            const textoOriginal = btnLogin.innerHTML;
            
            // Deshabilitar botón
            btnLogin.disabled = true;
            btnLogin.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Iniciando...';
            
            ocultarAlerta('alertaLogin');

            const datos = {
                correo: document.getElementById('correoLogin').value.trim(),
                password: document.getElementById('passwordLogin').value
            };

            // Validaciones básicas
            if (!datos.correo || !datos.password) {
                document.getElementById('mensajeErrorLogin').textContent = 'Complete todos los campos.';
                document.getElementById('alertaLogin').classList.remove('d-none');
                btnLogin.disabled = false;
                btnLogin.innerHTML = textoOriginal;
                return;
            }

            if (!validarEmail(datos.correo)) {
                document.getElementById('mensajeErrorLogin').textContent = 'Ingrese un correo válido.';
                document.getElementById('alertaLogin').classList.remove('d-none');
                document.getElementById('correoLogin').classList.add('is-invalid');
                btnLogin.disabled = false;
                btnLogin.innerHTML = textoOriginal;
                return;
            }

            // Enviar al backend
            try {
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datos)
                });

                const resultado = await response.json();

                if (response.ok) {
                    // Login exitoso
                    guardarSesion(resultado.usuario, resultado.token);
                    
                    // Redirigir según tipo de usuario
                    if (resultado.usuario.tipoUsuario === 'admin') {
                        window.location.href = 'panel_admin.html';
                    } else {
                        window.location.href = 'panel_cliente.html';
                    }
                } else {
                    // Error en login
                    document.getElementById('mensajeErrorLogin').textContent = 
                        resultado.mensaje || 'Credenciales incorrectas. Verifique su correo y contraseña.';
                    document.getElementById('alertaLogin').classList.remove('d-none');
                    btnLogin.disabled = false;
                    btnLogin.innerHTML = textoOriginal;
                }
            } catch (error) {
                console.error('Error de conexión:', error);
                document.getElementById('mensajeErrorLogin').textContent = 
                    'Error de conexión con el servidor. Verifique que el backend esté ejecutándose en http://localhost:3000';
                document.getElementById('alertaLogin').classList.remove('d-none');
                btnLogin.disabled = false;
                btnLogin.innerHTML = textoOriginal;
            }
        });
    }
});

// ==========================================
// CERRAR SESIÓN
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const botonesLogout = ['btnCerrarSesion', 'btnCerrarSesionAdmin'];
    
    botonesLogout.forEach(idBoton => {
        const btn = document.getElementById(idBoton);
        if (btn) {
            btn.addEventListener('click', function() {
                if (confirm('¿Está seguro que desea cerrar sesión?')) {
                    limpiarSesion();
                    window.location.href = 'index.html';
                }
            });
        }
    });
});

// ==========================================
// MOSTRAR INFORMACIÓN DEL USUARIO
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const usuario = obtenerUsuarioActual();
    
    if (usuario) {
        // Nombre en navbar
        const nombreCliente = document.getElementById('nombreCliente');
        const nombreAdmin = document.getElementById('nombreAdmin');
        
        if (nombreCliente) {
            nombreCliente.textContent = usuario.nombre;
        }
        if (nombreAdmin) {
            nombreAdmin.textContent = usuario.nombre;
        }
        
        // Perfil completo
        const perfilNombre = document.getElementById('perfilNombre');
        const perfilCorreo = document.getElementById('perfilCorreo');
        const perfilTelefono = document.getElementById('perfilTelefono');
        const perfilTipo = document.getElementById('perfilTipo');
        
        if (perfilNombre) {
            perfilNombre.textContent = `${usuario.nombre} ${usuario.apellido}`;
        }
        if (perfilCorreo) {
            perfilCorreo.textContent = usuario.correo;
        }
        if (perfilTelefono) {
            perfilTelefono.textContent = usuario.telefono;
        }
        if (perfilTipo) {
            perfilTipo.textContent = usuario.tipoUsuario === 'admin' ? 'Administrador' : 'Cliente';
        }
    }
});

// ==========================================
// PETICIONES CON AUTENTICACIÓN
// ==========================================

// Función helper para hacer peticiones autenticadas
async function fetchConAuth(url, opciones = {}) {
    const token = obtenerToken();
    
    if (!token) {
        alert('Sesión expirada. Por favor inicie sesión nuevamente.');
        window.location.href = 'login.html';
        return;
    }
    
    const headers = {
        ...opciones.headers,
        'Authorization': `Bearer ${token}`
    };
    
    // Si no es FormData, agregar Content-Type
    if (!(opciones.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }
    
    try {
        const response = await fetch(url, {
            ...opciones,
            headers
        });
        
        // Si el token expiró o es inválido
        if (response.status === 401) {
            limpiarSesion();
            alert('Sesión expirada. Por favor inicie sesión nuevamente.');
            window.location.href = 'login.html';
            return null;
        }
        
        return response;
    } catch (error) {
        console.error('Error en petición:', error);
        throw error;
    }
}

// Exportar funciones para uso en otros archivos
window.authUtils = {
    guardarSesion,
    obtenerUsuarioActual,
    obtenerToken,
    limpiarSesion,
    estaAutenticado,
    esAdministrador,
    fetchConAuth,
    API_URL
};