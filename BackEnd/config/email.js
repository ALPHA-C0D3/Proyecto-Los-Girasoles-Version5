// config/email.js
const { Resend } = require('resend');

// Inicializa Resend con la clave de Railway
const resend = new Resend(process.env.RESEND_API_KEY);

const enviarEmailRecuperacionConLink = async (correo, nombre, link) => {
    try {
        const { data, error } = await resend.emails.send({
            // IMPORTANTE: Si no tienes dominio verificado en Resend, 
            // DEBES usar 'onboarding@resend.dev' como remitente.
            from: 'Hostal Girasoles <onboarding@resend.dev>',
            to: correo,
            subject: 'Restablecer Contraseña - Hostal Los Girasoles',
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2>Hola ${nombre},</h2>
                    <p>Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo para continuar:</p>
                    <a href="${link}" style="background: #ffc107; color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                        Restablecer Contraseña
                    </a>
                    <p>Si no puedes ver el botón, copia y pega este enlace: <br> ${link}</p>
                    <p>Este enlace expirará en 30 minutos.</p>
                </div>
            `
        });

        if (error) {
            console.error('[Resend Error]:', error);
            return { success: false, error };
        }
        return { success: true, data };
    } catch (err) {
        console.error('[Fatal Email Error]:', err);
        return { success: false, error: err.message };
    }
};

// Estas funciones se exportan vacías para que el controlador no de error al importarlas
const enviarCodigoRecuperacion = async () => { console.log("Función legacy llamada"); };
const enviarCodigoVerificacion = async () => { console.log("Función legacy llamada"); };

module.exports = { 
    enviarEmailRecuperacionConLink,
    enviarCodigoRecuperacion,
    enviarCodigoVerificacion
};