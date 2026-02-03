// config/email.js
const { Resend } = require('resend');

// Inicializar Resend con la API Key
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Enviar email genérico usando Resend
 */
const enviarEmail = async ({ para, asunto, html, texto }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
            to: para,
            subject: asunto,
            html: html,
            text: texto
        });

        if (error) {
            console.error('❌ Error al enviar email:', error);
            return { success: false, error };
        }

        console.log(`✅ Email enviado a ${para}`);
        return { success: true, data };
    } catch (err) {
        console.error('❌ Error fatal al enviar email:', err);
        return { success: false, error: err.message };
    }
};

/**
 * Enviar código de verificación de email
 */
const enviarCodigoVerificacion = async (correo, nombre, codigo) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                background: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #FFC107 0%, #FF9800 100%);
                padding: 40px 20px;
                text-align: center;
                color: white;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 600;
            }
            .content {
                padding: 40px 30px;
            }
            .greeting {
                font-size: 18px;
                color: #333;
                margin-bottom: 20px;
            }
            .code-box {
                background: linear-gradient(135deg, #FFC107 0%, #FF9800 100%);
                padding: 30px;
                text-align: center;
                border-radius: 10px;
                margin: 30px 0;
            }
            .code {
                font-size: 36px;
                font-weight: bold;
                color: white;
                letter-spacing: 8px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
            }
            .instructions {
                color: #666;
                line-height: 1.6;
                margin: 20px 0;
            }
            .warning {
                background: #fff3cd;
                border-left: 4px solid #FFC107;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
                color: #856404;
            }
            .footer {
                background: #f8f9fa;
                padding: 20px;
                text-align: center;
                color: #666;
                font-size: 14px;
            }
            .footer a {
                color: #FF9800;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🏨 Hostal Los Girasoles</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px;">Verificación de Correo Electrónico</p>
            </div>
            
            <div class="content">
                <div class="greeting">
                    ¡Hola, <strong>${nombre}</strong>!
                </div>
                
                <p class="instructions">
                    Gracias por registrarte en <strong>Hostal Los Girasoles</strong>. 
                    Para completar tu registro y activar tu cuenta, por favor ingresa el siguiente código de verificación:
                </p>
                
                <div class="code-box">
                    <div class="code">${codigo}</div>
                </div>
                
                <p class="instructions">
                    Ingresa este código en la página de verificación para activar tu cuenta y comenzar a realizar reservas.
                </p>
                
                <div class="warning">
                    <strong>⚠️ Importante:</strong> Este código expira en <strong>30 minutos</strong>. 
                    Si no solicitaste este código, puedes ignorar este mensaje.
                </div>
                
                <p class="instructions" style="margin-top: 30px;">
                    Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.
                </p>
            </div>
            
            <div class="footer">
                <p>Este es un mensaje automático, por favor no respondas a este correo.</p>
                <p>© ${new Date().getFullYear()} Hostal Los Girasoles. Todos los derechos reservados.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const texto = `
    Hola ${nombre},
    
    Tu código de verificación es: ${codigo}
    
    Este código expira en 30 minutos.
    
    Gracias,
    Hostal Los Girasoles
    `;

    return await enviarEmail({
        para: correo,
        asunto: '🏨 Verifica tu correo - Hostal Los Girasoles',
        html: html,
        texto: texto
    });
};

/**
 * Enviar código de recuperación de contraseña
 */
const enviarCodigoRecuperacion = async (correo, nombre, codigo) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                background: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
                padding: 40px 20px;
                text-align: center;
                color: white;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 600;
            }
            .content {
                padding: 40px 30px;
            }
            .greeting {
                font-size: 18px;
                color: #333;
                margin-bottom: 20px;
            }
            .code-box {
                background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
                padding: 30px;
                text-align: center;
                border-radius: 10px;
                margin: 30px 0;
            }
            .code {
                font-size: 36px;
                font-weight: bold;
                color: white;
                letter-spacing: 8px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
            }
            .instructions {
                color: #666;
                line-height: 1.6;
                margin: 20px 0;
            }
            .warning {
                background: #f8d7da;
                border-left: 4px solid #dc3545;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
                color: #721c24;
            }
            .footer {
                background: #f8f9fa;
                padding: 20px;
                text-align: center;
                color: #666;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔒 Recuperación de Contraseña</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px;">Hostal Los Girasoles</p>
            </div>
            
            <div class="content">
                <div class="greeting">
                    Hola, <strong>${nombre}</strong>
                </div>
                
                <p class="instructions">
                    Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>Hostal Los Girasoles</strong>.
                </p>
                
                <p class="instructions">
                    Tu código de recuperación es:
                </p>
                
                <div class="code-box">
                    <div class="code">${codigo}</div>
                </div>
                
                <p class="instructions">
                    Ingresa este código en la página de recuperación de contraseña para crear una nueva contraseña.
                </p>
                
                <div class="warning">
                    <strong>⚠️ Seguridad:</strong>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Este código expira en <strong>30 minutos</strong></li>
                        <li>Si no solicitaste este cambio, ignora este mensaje</li>
                        <li>Tu contraseña actual seguirá siendo válida</li>
                        <li>Nunca compartas este código con nadie</li>
                    </ul>
                </div>
            </div>
            
            <div class="footer">
                <p>Este es un mensaje automático, por favor no respondas a este correo.</p>
                <p>© ${new Date().getFullYear()} Hostal Los Girasoles. Todos los derechos reservados.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const texto = `
    Hola ${nombre},
    
    Tu código de recuperación de contraseña es: ${codigo}
    
    Este código expira en 30 minutos.
    
    Si no solicitaste este cambio, ignora este mensaje.
    
    Gracias,
    Hostal Los Girasoles
    `;

    return await enviarEmail({
        para: correo,
        asunto: '🔒 Recupera tu contraseña - Los Girasoles',
        html: html,
        texto: texto
    });
};

/**
 * Enviar email de recuperación con link (NUEVO - con diseño bonito y funcionalidad Resend)
 */
const enviarEmailRecuperacionConLink = async (correo, nombre, resetLink) => {
    try {
        console.log(`📧 Enviando email de recuperación a: ${correo}`);
        console.log(`🔗 Link: ${resetLink}`);

        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #FFC107 0%, #FF9800 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
            color: #000;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            color: #333;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #FFC107 0%, #FF9800 100%);
            color: #000;
            text-decoration: none;
            padding: 15px 40px;
            border-radius: 8px;
            font-size: 18px;
            font-weight: bold;
            margin: 20px 0;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .instructions {
            color: #666;
            line-height: 1.6;
            margin: 20px 0;
            font-size: 15px;
        }
        .warning {
            background: #fff3cd;
            border-left: 4px solid #FFC107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            color: #856404;
        }
        .link-box {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            word-break: break-all;
            font-size: 12px;
            color: #007bff;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔒 Recuperar Contraseña</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; color: #333;">Hostal Los Girasoles</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hola, <strong>${nombre}</strong>
            </div>
            
            <p class="instructions">
                Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>Hostal Los Girasoles</strong>.
            </p>
            
            <p class="instructions">
                Haz clic en el siguiente botón para crear tu nueva contraseña:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" class="button">CAMBIAR MI CONTRASEÑA</a>
            </div>
            
            <p class="instructions" style="font-size: 14px; color: #888;">
                Si el botón no funciona, copia y pega este enlace en tu navegador:
            </p>
            
            <div class="link-box">
                ${resetLink}
            </div>
            
            <div class="warning">
                <strong>⚠️ Importante:</strong>
                <ul style="margin: 10px 0; padding-left: 20px; font-size: 14px;">
                    <li>Este enlace expira en <strong>30 minutos</strong></li>
                    <li>Si no solicitaste este cambio, ignora este mensaje</li>
                    <li>Tu contraseña actual seguirá siendo válida</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <p>Este es un mensaje automático, por favor no respondas a este correo.</p>
            <p>© ${new Date().getFullYear()} Hostal Los Girasoles. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
        `;

        const texto = `
Hola ${nombre},

Recibimos una solicitud para restablecer tu contraseña en Hostal Los Girasoles.

Para crear tu nueva contraseña, visita el siguiente enlace:
${resetLink}

Este enlace expira en 30 minutos.

Si no solicitaste este cambio, ignora este mensaje.

Gracias,
Hostal Los Girasoles
        `;

        const { data, error } = await resend.emails.send({
            from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
            to: correo,
            subject: '🔒 Recupera tu contraseña - Hostal Los Girasoles',
            html: html,
            text: texto
        });

        if (error) {
            console.error(`❌ Error al enviar email a ${correo}:`, error);
            return { success: false, error };
        }

        console.log(`✅ Email enviado exitosamente a ${correo}`);
        return { success: true, data };

    } catch (err) {
        console.error(`❌ Error fatal al enviar email a ${correo}:`, err);
        return { success: false, error: err.message };
    }
};

module.exports = {
    enviarEmail,
    enviarCodigoVerificacion,
    enviarCodigoRecuperacion,
    enviarEmailRecuperacionConLink
};