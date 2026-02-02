# ✅ CHECKLIST COMPLETO - De Desarrollo a Producción

## 📋 FASE 1: PREPARACIÓN LOCAL (30 minutos)

### Paso 1.1: Instalar Dependencias
- [ ] Navegar a la carpeta BackEnd
- [ ] Ejecutar \`npm install\`
- [ ] Verificar que todas las dependencias se instalaron correctamente

### Paso 1.2: Obtener API Key de Resend
- [ ] Crear cuenta en https://resend.com
- [ ] Ir a "API Keys"
- [ ] Crear nueva API key: "Hostal Development"
- [ ] Copiar la API key (empieza con \`re_\`)
- [ ] Guardar en un lugar seguro

**Guía detallada:** Ver \`RESEND_SETUP.md\`

### Paso 1.3: Configurar Variables de Entorno
- [ ] Copiar \`.env.example\` a \`.env\`
- [ ] Editar \`.env\` con los siguientes valores:

\`\`\`env
PORT=3000
NODE_ENV=development
JWT_SECRET=<GENERAR_UNO_NUEVO>
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://127.0.0.1:5500
DB_PATH=./hostal.db
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
RESEND_API_KEY=<TU_API_KEY>
EMAIL_FROM=onboarding@resend.dev
EMAIL_FROM_NAME=Hostal El Refugio
\`\`\`

**Para generar JWT_SECRET:**
\`\`\`bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
\`\`\`

### Paso 1.4: Inicializar Base de Datos
- [ ] Ejecutar \`node agregarcampos.js\` (agregar campos de recuperación)
- [ ] Ejecutar \`node crearAdmin.js\` (crear usuario admin)
- [ ] Verificar que se creó \`hostal.db\`

**Credenciales del Admin:**
- Email: admin@hostal.com
- Password: admin1234

### Paso 1.5: Probar Backend en Local
- [ ] Iniciar servidor: \`npm start\`
- [ ] Abrir navegador: http://localhost:3000
- [ ] Ver mensaje de bienvenida del API
- [ ] Verificar en consola: "Servidor corriendo..."

---

## 🌐 FASE 2: CONFIGURAR FRONTEND (15 minutos)

### Paso 2.1: Verificar config.js
- [ ] Abrir \`public/js/config.js\`
- [ ] Verificar que existe el objeto CONFIG
- [ ] Modo debe estar en 'development'

### Paso 2.2: Agregar config.js a HTMLs
Agregar ANTES de auth.js en estos archivos:

- [ ] \`login.html\`
\`\`\`html
<script src="js/config.js"></script>
<script src="js/auth.js"></script>
\`\`\`

- [ ] \`registro.html\`
- [ ] \`panel_cliente.html\`
- [ ] \`panel_admin.html\`
- [ ] \`habitaciones.html\`

### Paso 2.3: Probar Frontend en Local
- [ ] Abrir con Live Server (puerto 5500)
- [ ] Ir a http://127.0.0.1:5500/login.html
- [ ] Verificar que puede conectarse al backend

---

## 🧪 FASE 3: PRUEBAS LOCALES (20 minutos)

### Test 1: Registro de Usuario
- [ ] Ir a \`registro.html\`
- [ ] Llenar formulario con datos de prueba
- [ ] Email: tu_email_real@gmail.com
- [ ] Enviar formulario
- [ ] Verificar redirección a login
- [ ] **IMPORTANTE:** Revisar bandeja de entrada (y spam)
- [ ] ¿Llegó el email? (debería tener código de 6 dígitos)

**Si no llega el email:**
- Revisar consola del servidor
- Verificar API key de Resend
- Ver logs en Resend Dashboard

### Test 2: Login
- [ ] Ir a \`login.html\`
- [ ] Intentar login con credenciales incorrectas
- [ ] Verificar mensaje de error
- [ ] Intentar con credenciales correctas
- [ ] Verificar redirección a panel

### Test 3: Recuperación de Contraseña
- [ ] Click en "Olvidé mi contraseña"
- [ ] Ingresar email registrado
- [ ] Verificar mensaje de éxito
- [ ] Revisar email (código de 6 dígitos)
- [ ] Ingresar código y nueva contraseña
- [ ] Verificar cambio exitoso

### Test 4: Reserva (Cliente)
- [ ] Login como usuario normal
- [ ] Ir a habitaciones
- [ ] Seleccionar una habitación
- [ ] Llenar formulario de reserva
- [ ] Subir comprobante (imagen PNG/JPG)
- [ ] Enviar reserva
- [ ] Verificar mensaje de éxito

### Test 5: Panel Admin
- [ ] Logout del usuario normal
- [ ] Login como admin
  - Email: admin@hostal.com
  - Password: admin123
- [ ] Verificar acceso a panel admin
- [ ] Ver lista de reservas
- [ ] Aprobar/Rechazar una reserva
- [ ] Verificar cambio de estado

---

## 🚂 FASE 4: PREPARAR PARA RAILWAY (10 minutos)

### Paso 4.1: Verificar Archivos
- [ ] Existe \`railway.json\`
- [ ] Existe \`.gitignore\`
- [ ] Existe \`package.json\` con scripts correctos
- [ ] Existe \`README.md\`

### Paso 4.2: Preparar Repositorio GitHub
- [ ] Crear repositorio en GitHub
- [ ] Nombre: "hostal-backend" (o el que prefieras)
- [ ] Público o Privado (cualquiera funciona)

### Paso 4.3: Subir Código
\`\`\`bash
cd BackEnd
git init
git add .
git commit -m "Initial commit: Backend completo con emails"
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main
\`\`\`

- [ ] Código subido a GitHub
- [ ] Verificar que se ve en GitHub.com

### Paso 4.4: Generar Nuevas Credenciales para Producción

**JWT_SECRET para producción:**
\`\`\`bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
\`\`\`
- [ ] Copiar y guardar

**API Key de Resend para producción:**
- [ ] Ir a Resend → API Keys
- [ ] Crear nueva: "Hostal Production"
- [ ] Copiar y guardar

---

## 🚀 FASE 5: DEPLOY EN RAILWAY (20 minutos)

### Paso 5.1: Crear Proyecto en Railway
- [ ] Ir a https://railway.app
- [ ] Login con GitHub
- [ ] Click "New Project"
- [ ] Seleccionar "Deploy from GitHub repo"
- [ ] Autorizar Railway
- [ ] Seleccionar tu repositorio

### Paso 5.2: Configurar Variables de Entorno
En Railway → Tu Proyecto → Variables, agregar:

- [ ] \`NODE_ENV\` = \`production\`
- [ ] \`JWT_SECRET\` = \`<el_nuevo_que_generaste>\`
- [ ] \`JWT_EXPIRES_IN\` = \`24h\`
- [ ] \`RESEND_API_KEY\` = \`<api_key_de_produccion>\`
- [ ] \`EMAIL_FROM\` = \`onboarding@resend.dev\`
- [ ] \`EMAIL_FROM_NAME\` = \`Hostal Los Girasoles\`
- [ ] \`FRONTEND_URL\` = \`http://localhost:5500\` (temporal)

**NO agregar PORT** - Railway lo asigna automáticamente

### Paso 5.3: Esperar Deploy
- [ ] Ver progreso en "Deployments"
- [ ] Esperar logs:
  - Building...
  - Installing dependencies...
  - Starting server...
- [ ] Ver mensaje: ✅ Deployed

### Paso 5.4: Obtener URL
- [ ] Ir a Settings → Domains
- [ ] Click "Generate Domain"
- [ ] Copiar URL: \`https://hostal-production-xxxx.up.railway.app\`

### Paso 5.5: Probar Backend en Producción
- [ ] Abrir URL en navegador
- [ ] Ver mensaje de bienvenida del API
- [ ] Probar endpoint: \`/api/auth/login\` (con Postman o curl)

---

## 🌍 FASE 6: CONECTAR FRONTEND A PRODUCCIÓN (15 minutos)

### Paso 6.1: Actualizar config.js
En \`public/js/config.js\`:

\`\`\`javascript
const CONFIG = {
    ENVIRONMENT: 'production', // ⬅️ CAMBIAR A PRODUCTION
    
    API_URL: {
        development: 'http://localhost:3000/api',
        production: 'https://tu-proyecto.up.railway.app/api' // ⬅️ TU URL
    },
    
    getApiUrl() {
        return this.API_URL[this.ENVIRONMENT];
    }
};
\`\`\`

- [ ] Cambiar ENVIRONMENT a 'production'
- [ ] Poner tu URL de Railway

### Paso 6.2: Deploy Frontend en Netlify

**Opción A: Drag & Drop**
- [ ] Ir a https://netlify.com
- [ ] Arrastrar carpeta \`public\` al área de deploy
- [ ] Esperar deploy
- [ ] Copiar URL: \`https://hostal-xxx.netlify.app\`

**Opción B: GitHub**
- [ ] Subir carpeta \`public\` a GitHub (repo separado)
- [ ] En Netlify, conectar con GitHub
- [ ] Seleccionar repositorio
- [ ] Deploy automático

### Paso 6.3: Actualizar CORS en Railway
- [ ] En Railway → Variables
- [ ] Editar \`FRONTEND_URL\`
- [ ] Poner URL de Netlify: \`https://hostal-xxx.netlify.app\`
- [ ] Railway redesplegará automáticamente

### Paso 6.4: Probar Integración Completa
- [ ] Abrir frontend en Netlify
- [ ] Ir a login
- [ ] Intentar iniciar sesión
- [ ] Verificar que funciona
- [ ] Si hay error de CORS, revisar FRONTEND_URL

---

## 👤 FASE 7: CREAR ADMIN EN PRODUCCIÓN (10 minutos)

### Opción 1: Railway CLI (Recomendado)
\`\`\`bash
npm install -g @railway/cli
railway login
railway link
railway run node crearAdmin.js
\`\`\`

- [ ] Instalar CLI
- [ ] Login y link
- [ ] Ejecutar script
- [ ] Verificar en logs

### Opción 2: Via API (con Postman)
\`\`\`bash
POST https://tu-proyecto.up.railway.app/api/auth/registro
Content-Type: application/json

{
  "nombre": "Admin",
  "apellido": "Sistema",
  "telefono": "0000000000",
  "correo": "admin@hostal.com",
  "password": "admin123"
}
\`\`\`

- [ ] Enviar request
- [ ] Recibirás success
- [ ] Contactar para cambiar tipoUsuario a 'admin'

---

## ✅ FASE 8: VERIFICACIÓN FINAL (15 minutos)

### Test Completo en Producción:

1. **Registro**
   - [ ] Usuario nuevo puede registrarse
   - [ ] Email llega correctamente
   - [ ] Código funciona

2. **Login**
   - [ ] Login funciona
   - [ ] Redirección correcta
   - [ ] Token se guarda

3. **Recuperación**
   - [ ] Solicitar recuperación
   - [ ] Email llega
   - [ ] Cambio de contraseña funciona

4. **Reserva**
   - [ ] Cliente puede hacer reserva
   - [ ] Upload de comprobante funciona
   - [ ] Admin ve la reserva

5. **Panel Admin**
   - [ ] Admin puede login
   - [ ] Ve todas las reservas
   - [ ] Puede aprobar/rechazar
   - [ ] Cambios se guardan

### Verificar Emails:
- [ ] Emails tienen buen diseño
- [ ] Códigos llegan correctamente
- [ ] No van a spam (si van, revisar SPF/DKIM)

---

## 🎉 ¡COMPLETADO!

Si llegaste aquí, tu aplicación está 100% funcional en producción.

### Próximos Pasos Opcionales:

- [ ] Configurar dominio personalizado
- [ ] Verificar dominio en Resend
- [ ] Configurar analytics
- [ ] Configurar monitoreo (Sentry)
- [ ] Backup automático de BD
- [ ] Documentación de usuario final

---

## 📊 Resumen de URLs

**Backend (Railway):**
\`\`\`
https://tu-proyecto.up.railway.app
\`\`\`

**Frontend (Netlify):**
\`\`\`
https://hostal-xxx.netlify.app
\`\`\`

**Admin Login:**
\`\`\`
Email: admin@hostal.com
Password: admin1234
\`\`\`

---

## 🐛 Si Algo Falla

### Backend no inicia en Railway:
1. Ver logs en Railway
2. Verificar variables de entorno
3. Revisar que PORT no está definida

### Frontend no conecta:
1. Verificar config.js (ENVIRONMENT y URL)
2. Verificar FRONTEND_URL en Railway
3. Esperar 1-2 minutos después de cambios

### Emails no llegan:
1. Verificar API key de Resend
2. Revisar logs del servidor
3. Ver dashboard de Resend
4. Revisar carpeta de spam

### Error de CORS:
1. Verificar FRONTEND_URL exacta
2. Sin "/" al final
3. Protocolo correcto (https/http)

---

## 📞 Recursos de Ayuda

- **Railway Docs:** https://docs.railway.app
- **Resend Docs:** https://resend.com/docs
- **Netlify Docs:** https://docs.netlify.com

**Archivos de referencia en este proyecto:**
- \`README.md\` - Documentación técnica
- \`RAILWAY_DEPLOY.md\` - Guía detallada de deploy
- \`RESEND_SETUP.md\` - Guía de configuración de emails

---

**¡Felicidades! 🎊 Tu aplicación está en producción y lista para usar.**
