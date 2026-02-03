// config.js - Configuración del Frontend Inteligente
const CONFIG = {
    // Detecta automáticamente si estás en Local (PC) o en Railway (Nube)
    getApiUrl() {
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        if (isLocal) {
            return 'http://localhost:3000/api';
        } else {
            // En Railway, usa la dirección actual del navegador
            return window.location.origin + '/api';
        }
    }
};
// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}