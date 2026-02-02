# 🚂 Guía Completa: Deploy en Railway

Esta guía te llevará paso a paso para deployar tu aplicación en Railway.

## 📋 Requisitos Previos

### 1. Cuenta de Railway
- Ve a https://railway.app
- Crea una cuenta (puedes usar GitHub)
- Plan gratuito incluye: $5/mes de créditos gratuitos

### 2. Cuenta de Resend (Para emails)
- Ve a https://resend.com
- Crea una cuenta gratuita
- Plan gratuito: 3,000 emails/mes

### 3. Repositorio en GitHub
- Sube tu código a GitHub
- Asegúrate de tener el \`.gitignore\` correcto

---

## 🎯 PASO 1: Configurar Resend

### 1.1 Obtener API Key

1. Inicia sesión en https://resend.com
2. Ve a **API Keys** en el menú lateral
3. Click en **Create API Key**
4. Dale un nombre: "Hostal Railway Production"
5. Selecciona permisos: **Full Access**
6. Click en **Create**
7. **IMPORTANTE:** Copia la API key inmediatamente (solo se muestra una vez)
   - Formato: \`re_xxxxxxxxxx\`

### 1.2 Verificar Dominio (Opcional pero recomendado)

#### Opción A: Usar dominio de prueba de Resend
- Email: \`onboarding@resend.dev\`
- No requiere configuración
- Perfecto para testing

#### Opción B: Tu propio dominio
1. Ve a **Domains** en Resend
2. Click en **Add Domain**
3. Ingresa tu dominio (ejemplo: \`midominio.com\`)
4. Agrega los registros DNS que te proporciona Resend:
   - Registro MX
   - Registro TXT (SPF)
   - Registro TXT (DKIM)
5. Espera la verificación (puede tardar hasta 48 horas)

**Para desarrollo inicial, usa el dominio de prueba.**

---

## 🚂 PASO 2: Deploy en Railway

### 2.1 Conectar GitHub

1. Ve a https://railway.app
2. Click en **New Project**
3. Selecciona **Deploy from GitHub repo**
4. Autoriza a Railway a acceder a tu GitHub
5. Selecciona el repositorio de tu hostal
6. Railway detectará automáticamente que es Node.js

### 2.2 Configurar Variables de Entorno

1. En Railway, ve a tu proyecto
2. Click en **Variables**
3. Agrega las siguientes variables una por una:

\`\`\`env
NODE_ENV=production

JWT_SECRET=<GENERA_UNO_NUEVO>

JWT_EXPIRES_IN=24h

RESEND_API_KEY=<TU_API_KEY_DE_RESEND>

EMAIL_FROM=onboarding@resend.dev

EMAIL_FROM_NAME=Hostal El Refugio

FRONTEND_URL=<URL_DE_TU_FRONTEND>
\`\`\`

#### Cómo generar JWT_SECRET seguro:

**Opción 1: Online**
- Ve a https://generate-random.org/api-token-generator
- Copia el token generado

**Opción 2: Terminal**
\`\`\`bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
\`\`\`

#### Sobre FRONTEND_URL:
- En desarrollo: \`http://localhost:5500\`
- En producción: \`https://tudominio.com\`
- Si tienes múltiples: \`https://tudominio.com,https://www.tudominio.com\`

**IMPORTANTE:** Railway asigna \`PORT\` automáticamente, NO la agregues.

### 2.3 Verificar Deploy

1. Railway comenzará a construir automáticamente
2. Ve a **Deployments** para ver el progreso
3. Verás los logs en tiempo real:
   - \`Installing dependencies...\`
   - \`Building application...\`
   - \`Starting server...\`
4. Cuando termine, verás: ✅ **Deployed**

### 2.4 Obtener URL Pública

1. Ve a **Settings**
2. Sección **Domains**
3. Click en **Generate Domain**
4. Railway te dará una URL como: \`https://hostal-production-xxxx.up.railway.app\`
5. **Copia esta URL** - es tu backend en producción

### 2.5 Probar el Backend

Visita tu URL de Railway:
\`\`\`
https://tu-proyecto.up.railway.app
\`\`\`

Deberías ver:
\`\`\`json
{
  "mensaje": "API del Hostal - Backend funcionando correctamente",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "reservas": "/api/reservas",
    "habitaciones": "/api/habitaciones"
  }
}
\`\`\`

✅ **¡Tu backend está funcionando!**

---

## 🌐 PASO 3: Conectar Frontend

### 3.1 Actualizar config.js

En tu frontend, edita \`public/js/config.js\`:

\`\`\`javascript
const CONFIG = {
    ENVIRONMENT: 'production', // Cambiar de 'development' a 'production'
    
    API_URL: {
        development: 'http://localhost:3000/api',
        production: 'https://tu-proyecto.up.railway.app/api' // ⬅️ TU URL AQUÍ
    },
    
    getApiUrl() {
        return this.API_URL[this.ENVIRONMENT];
    }
};
\`\`\`

### 3.2 Incluir config.js en tus HTMLs

Agrega ANTES de auth.js en todos tus archivos HTML:

\`\`\`html
<!-- Configuración -->
<script src="js/config.js"></script>
<!-- Scripts de autenticación -->
<script src="js/auth.js"></script>
\`\`\`

Archivos a modificar:
- \`login.html\`
- \`registro.html\`
- \`panel_cliente.html\`
- \`panel_admin.html\`
- \`habitaciones.html\`

### 3.3 Deploy del Frontend

#### Opción A: Netlify (Recomendado para frontend estático)

1. Ve a https://netlify.com
2. Arrastra tu carpeta \`public\` al área de deploy
3. O conecta con GitHub
4. Netlify te dará una URL: \`https://hostal-refugio.netlify.app\`

#### Opción B: Vercel

1. Ve a https://vercel.com
2. Conecta con GitHub
3. Selecciona tu repositorio
4. Configura el directorio raíz: \`public\`
5. Deploy

#### Opción C: Railway (Misma plataforma)

1. En Railway, crea un nuevo proyecto
2. Selecciona tu repositorio
3. Configura el directorio raíz: \`public\`
4. Railway servirá los archivos estáticos

### 3.4 Actualizar CORS en Backend

1. Ve a tu proyecto en Railway
2. Variables → Edita \`FRONTEND_URL\`
3. Agrega la URL de tu frontend:
   \`\`\`
   https://hostal-refugio.netlify.app
   \`\`\`
4. Si tienes múltiples URLs:
   \`\`\`
   https://hostal-refugio.netlify.app,https://www.tudominio.com
   \`\`\`
5. Railway redesplegará automáticamente

---

## 🔧 PASO 4: Crear Usuario Administrador

### Opción 1: Usando Railway CLI

1. Instala Railway CLI:
\`\`\`bash
npm install -g @railway/cli
\`\`\`

2. Login:
\`\`\`bash
railway login
\`\`\`

3. Conecta a tu proyecto:
\`\`\`bash
railway link
\`\`\`

4. Ejecuta el script:
\`\`\`bash
railway run node crearAdmin.js
\`\`\`

### Opción 2: Modificar temporalmente el código

1. En \`server.js\`, después de \`inicializarTablas();\`, agrega:

\`\`\`javascript
// TEMPORAL: Crear admin en producción
const { runQuery } = require('./config/database');
const bcrypt = require('bcryptjs');

setTimeout(async () => {
    try {
        const adminExiste = await getOne('SELECT * FROM usuarios WHERE correo = ?', ['admin@hostal.com']);
        if (!adminExiste) {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash('admin123', salt);
            await runQuery(
                'INSERT INTO usuarios (nombre, apellido, telefono, correo, password, tipoUsuario) VALUES (?, ?, ?, ?, ?, ?)',
                ['Admin', 'Sistema', '0000000000', 'admin@hostal.com', passwordHash, 'admin']
            );
            console.log('✅ Usuario admin creado');
        }
    } catch (error) {
        console.error('Error creando admin:', error);
    }
}, 5000);
\`\`\`

2. Push a GitHub
3. Railway redesplegará
4. Verifica logs para confirmar
5. **ELIMINA ESTE CÓDIGO** después de crear el admin

### Opción 3: Crear manualmente vía API

Usa Postman o curl:

\`\`\`bash
curl -X POST https://tu-proyecto.up.railway.app/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Admin",
    "apellido": "Sistema",
    "telefono": "0000000000",
    "correo": "admin@hostal.com",
    "password": "admin123"
  }'
\`\`\`

Luego, actualiza manualmente en la base de datos para cambiar \`tipoUsuario\` a \`admin\`.

---

## ✅ VERIFICACIÓN FINAL

### Checklist de Funcionamiento:

- [ ] Backend responde en la URL de Railway
- [ ] Variables de entorno configuradas correctamente
- [ ] Frontend puede hacer login
- [ ] Emails se envían correctamente (revisa spam)
- [ ] Usuario admin puede acceder al panel
- [ ] Reservas se pueden crear
- [ ] Comprobantes se pueden subir

### Pruebas Recomendadas:

1. **Registro de Usuario**
   - Registra un usuario nuevo
   - Verifica que llegue el email (revisa spam)

2. **Recuperación de Contraseña**
   - Solicita recuperación
   - Verifica código por email
   - Cambia contraseña exitosamente

3. **Login**
   - Inicia sesión con el usuario nuevo
   - Verifica redirección al panel cliente

4. **Crear Reserva**
   - Selecciona habitación
   - Sube comprobante
   - Verifica que llegue al admin

5. **Panel Admin**
   - Login como admin
   - Ver todas las reservas
   - Aprobar/Rechazar reserva

---

## 🐛 Solución de Problemas

### Error 502 Bad Gateway
- **Causa:** Servidor no inició correctamente
- **Solución:** Ve a Logs en Railway, revisa errores
- **Común:** Falta variable de entorno

### CORS Error
- **Causa:** Frontend no está en FRONTEND_URL
- **Solución:** Agrega la URL exacta del frontend en la variable

### Emails no llegan
- **Causa 1:** API key incorrecta
  - Verifica en Resend que esté activa
- **Causa 2:** Email FROM no verificado
  - Usa \`onboarding@resend.dev\` para testing
- **Causa 3:** Límite de Resend alcanzado
  - Verifica en dashboard de Resend

### Base de datos vacía después de redeploy
- **Causa:** Railway usa almacenamiento efímero
- **Solución 1:** Usa Railway Volumes (beta)
- **Solución 2:** Migra a Railway PostgreSQL
- **Solución 3:** Respaldo manual periódico

### Cannot find module 'nodemailer'
- **Causa:** Dependencias no instaladas
- **Solución:** Ve a Logs, verifica que \`npm install\` se ejecutó
- **Fix:** En Railway Settings, fuerza un redeploy

---

## 📊 Monitoreo

### Ver Logs en Tiempo Real

1. Railway Dashboard → Tu Proyecto
2. Click en **Deployments**
3. Selecciona el deployment activo
4. **View Logs**

### Configurar Alertas

1. Settings → Notifications
2. Conecta Discord/Slack/Email
3. Configura alertas para:
   - Deploy fallido
   - Errores 5xx
   - Alto uso de recursos

### Métricas

Railway muestra:
- CPU usage
- Memory usage
- Network (requests/segundo)
- Respuestas por código de estado

---

## 💰 Costos Estimados

### Plan Gratuito de Railway
- **Crédito:** $5/mes gratuitos
- **Uso típico de este proyecto:** ~$3-4/mes
- **Incluye:**
  - 500 horas de ejecución/mes
  - 100GB transferencia
  - Despliegues ilimitados

### Plan Hobby ($5/mes)
- $10/mes de créditos totales
- Más que suficiente para producción pequeña

### Resend Gratuito
- 3,000 emails/mes
- 100 emails/día
- Suficiente para empezar

---

## 🎓 Próximos Pasos

Una vez en producción:

1. **Dominio Personalizado**
   - Compra un dominio en Namecheap/GoDaddy
   - Configura DNS en Railway
   - Configura dominio en Resend

2. **SSL/HTTPS**
   - Railway lo proporciona automáticamente
   - Netlify/Vercel también

3. **Respaldos**
   - Configura respaldos automáticos de la BD
   - Usa Railway PostgreSQL para persistencia

4. **Monitoreo Avanzado**
   - Integra Sentry para errores
   - Google Analytics para métricas
   - UptimeRobot para disponibilidad

5. **Optimización**
   - Implementa caché
   - Optimiza imágenes
   - Minifica código

---

## 📞 Soporte

- **Railway Docs:** https://docs.railway.app
- **Resend Docs:** https://resend.com/docs
- **Railway Discord:** https://discord.gg/railway
- **Resend Discord:** https://discord.gg/resend

---

**¡Felicidades! Tu aplicación está en producción.** 🎉

Para cualquier pregunta, revisa primero los logs en Railway.
