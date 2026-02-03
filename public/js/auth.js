// ==========================================
// AUTH.JS - HOSTAL LOS GIRASOLES
// Sistema de autenticación completo
// ==========================================


const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : window.location.origin + '/api';

console.log('🔧 AUTH.JS cargado. API_URL:', API_URL);

// ==========================================
// UTILIDADES DE SESIÓN
// ==========================================

function guardarSesion(usuario, token) {
    sessionStorage.setItem('usuario', JSON.stringify(usuario));
    sessionStorage.setItem('token', token);
}

function obtenerUsuarioActual() {
    const usuario = sessionStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
}

function obtenerToken() {
    return sessionStorage.getItem('token');
}

function limpiarSesion() {
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('token');
}

function estaAutenticado() {
    return obtenerToken() !== null && obtenerUsuarioActual() !== null;
}

function esAdministrador() {
    const usuario = obtenerUsuarioActual();
    return usuario && usuario.tipoUsuario === 'admin';
}

// ==========================================
// PROTECCIÓN DE RUTAS
// ==========================================

function protegerRuta(requiereAdmin = false) {
    if (!estaAutenticado()) {
        window.location.href = 'login.html';
        return false;
    }
    
    if (requiereAdmin && !esAdministrador()) {
        alert('No tienes permisos para acceder a esta página');
        window.location.href = 'panel_cliente.html';
        return false;
    }
    
    return true;
}

function redirigirSiAutenticado() {
    if (estaAutenticado()) {
        const usuario = obtenerUsuarioActual();
        window.location.href = usuario.tipoUsuario === 'admin' 
            ? 'panel_admin.html' 
            : 'panel_cliente.html';
    }
}

// ==========================================
// FUNCIONES DE AUTENTICACIÓN
// ==========================================

async function registrarUsuario(datos) {
    try {
        const response = await fetch(`${API_URL}/auth/registro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        
        const data = await response.json();
        return { success: response.ok, data, status: response.status };
    } catch (error) {
        console.error('Error en registro:', error);
        return { success: false, data: { mensaje: 'Error de conexión' } };
    }
}

async function iniciarSesion(correo, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ correo, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            guardarSesion(data.usuario, data.token);
        }
        
        return { success: response.ok, data, status: response.status };
    } catch (error) {
        console.error('Error en login:', error);
        return { success: false, data: { mensaje: 'Error de conexión' } };
    }
}

function cerrarSesion() {
    limpiarSesion();
    window.location.href = 'login.html';
}

// ==========================================
// RECUPERACIÓN DE CONTRASEÑA
// ==========================================

// Variable para guardar el correo entre pasos
let correoRecuperacionGlobal = '';

/**
 * PASO 1: Solicitar código de recuperación
 * Envía un email con código de 6 dígitos
 */
async function solicitarCodigoRecuperacion(correo) {
    console.log('📧 [AUTH.JS] Solicitando código para:', correo);
    
    try {
        const response = await fetch(`${API_URL}/auth/recuperar-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ correo })
        });
        
        const data = await response.json();
        
        console.log('📥 [AUTH.JS] Respuesta del servidor:', data);
        
        if (response.ok) {
            // Guardar correo para los siguientes pasos
            correoRecuperacionGlobal = correo;
            console.log('✅ [AUTH.JS] Código solicitado exitosamente');
        }
        
        return { 
            success: response.ok, 
            data, 
            status: response.status 
        };
    } catch (error) {
        console.error('❌ [AUTH.JS] Error en solicitud:', error);
        return { 
            success: false, 
            data: { mensaje: 'Error de conexión con el servidor' },
            status: 0
        };
    }
}

/**
 * PASO 2: Verificar código recibido
 * Valida que el código sea correcto y no haya expirado
 */
async function verificarCodigoRecuperacion(correo, codigo) {
    console.log('🔍 [AUTH.JS] Verificando código:', codigo, 'para:', correo);
    
    try {
        const response = await fetch(`${API_URL}/auth/verificar-codigo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ correo, codigo })
        });
        
        const data = await response.json();
        
        console.log('📥 [AUTH.JS] Respuesta verificación:', data);
        
        return { 
            success: response.ok, 
            data, 
            status: response.status 
        };
    } catch (error) {
        console.error('❌ [AUTH.JS] Error en verificación:', error);
        return { 
            success: false, 
            data: { mensaje: 'Error de conexión con el servidor' },
            status: 0
        };
    }
}

/**
 * PASO 3: Resetear contraseña
 * Cambia la contraseña usando el código verificado
 */
async function resetearPassword(correo, codigo, nuevaPassword) {
    console.log('🔐 [AUTH.JS] Reseteando password para:', correo);
    
    try {
        const response = await fetch(`${API_URL}/auth/resetear-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ correo, codigo, nuevaPassword })
        });
        
        const data = await response.json();
        
        console.log('📥 [AUTH.JS] Respuesta reseteo:', data);
        
        if (response.ok) {
            // Limpiar correo guardado
            correoRecuperacionGlobal = '';
            console.log('✅ [AUTH.JS] Password reseteado exitosamente');
        }
        
        return { 
            success: response.ok, 
            data, 
            status: response.status 
        };
    } catch (error) {
        console.error('❌ [AUTH.JS] Error en reseteo:', error);
        return { 
            success: false, 
            data: { mensaje: 'Error de conexión con el servidor' },
            status: 0
        };
    }
}

/**
 * Obtener el correo guardado para recuperación
 */
function obtenerCorreoRecuperacion() {
    return correoRecuperacionGlobal;
}

/**
 * Guardar correo para recuperación
 */
function guardarCorreoRecuperacion(correo) {
    correoRecuperacionGlobal = correo;
}

/**
 * Limpiar correo de recuperación
 */
function limpiarCorreoRecuperacion() {
    correoRecuperacionGlobal = '';
}

// ==========================================
// FUNCIONES AUXILIARES PARA REQUESTS
// ==========================================

async function hacerRequestAutenticado(url, metodo = 'GET', datos = null) {
    const token = obtenerToken();
    
    if (!token) {
        throw new Error('No hay token de autenticación');
    }
    
    const opciones = {
        method: metodo,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    
    if (datos && metodo !== 'GET') {
        opciones.body = JSON.stringify(datos);
    }
    
    try {
        const response = await fetch(url, opciones);
        const data = await response.json();
        
        // Si el token expiró, cerrar sesión
        if (response.status === 401 || response.status === 403) {
            alert('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
            cerrarSesion();
            return null;
        }
        
        return { success: response.ok, data, status: response.status };
    } catch (error) {
        console.error('Error en request autenticado:', error);
        return { success: false, data: { mensaje: 'Error de conexión' } };
    }
}

async function obtenerPerfil() {
    return await hacerRequestAutenticado(`${API_URL}/auth/perfil`);
}

async function cambiarPassword(passwordActual, nuevaPassword) {
    return await hacerRequestAutenticado(
        `${API_URL}/auth/cambiar-password`,
        'PUT',
        { passwordActual, nuevaPassword }
    );
}

// ==========================================
// INICIALIZACIÓN
// ==========================================

// Mostrar información de carga
console.log('✅ AUTH.JS cargado completamente');
console.log('📍 API URL configurada:', API_URL);
console.log('🔐 Usuario actual:', obtenerUsuarioActual()?.correo || 'No autenticado');

// Exportar funciones al objeto window para uso global
if (typeof window !== 'undefined') {
    window.authFunctions = {
        // Sesión
        guardarSesion,
        obtenerUsuarioActual,
        obtenerToken,
        limpiarSesion,
        estaAutenticado,
        esAdministrador,
        
        // Protección
        protegerRuta,
        redirigirSiAutenticado,
        
        // Autenticación
        registrarUsuario,
        iniciarSesion,
        cerrarSesion,
        
        // Recuperación de contraseña
        solicitarCodigoRecuperacion,
        verificarCodigoRecuperacion,
        resetearPassword,
        obtenerCorreoRecuperacion,
        guardarCorreoRecuperacion,
        limpiarCorreoRecuperacion,
        
        // Auxiliares
        hacerRequestAutenticado,
        obtenerPerfil,
        cambiarPassword
    };
    
    console.log('🌐 Funciones exportadas a window.authFunctions');
}
