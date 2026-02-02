// config.js - Configuración del Frontend
// Este archivo permite cambiar fácilmente entre desarrollo y producción

const CONFIG = {
    // Cambiar según el entorno
    ENVIRONMENT: 'development', // 'development' o 'production'
    
    // URLs del Backend
    API_URL: {
        development: 'http://localhost:3000/api',
        production: 'https://TU-PROYECTO.up.railway.app/api' // Cambiar por tu URL de Railway
    },
    
    // Obtener URL según el entorno
    getApiUrl() {
        return this.API_URL[this.ENVIRONMENT];
    }
};

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
