# 🏨 Hostal El Refugio - Backend

Sistema de reservas para hostal con autenticación JWT, recuperación de contraseña por email y gestión de reservas.

## 🚀 Características

- ✅ Autenticación con JWT
- ✅ Sistema de recuperación de contraseña por email
- ✅ Rate limiting y protección contra fuerza bruta
- ✅ Gestión de habitaciones y reservas
- ✅ Upload de comprobantes de pago
- ✅ Auditoría de reservas
- ✅ Panel de administración
- ✅ Base de datos SQLite

## 📦 Instalación Local

### Prerrequisitos
- Node.js >= 18.0.0
- npm >= 9.0.0

### Pasos

1. **Clonar el repositorio**
\`\`\`bash
git clone <tu-repositorio>
cd BackEnd
\`\`\`

2. **Instalar dependencias**
\`\`\`bash
npm install
\`\`\`

3. **Configurar variables de entorno**
\`\`\`bash
cp .env.example .env
\`\`\`

Edita el archivo \`.env\` con tus valores:
- \`JWT_SECRET\`: Genera uno con \`node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"\`
- \`RESEND_API_KEY\`: Obtén tu API key en https://resend.com/api-keys
- \`EMAIL_FROM\`: Tu email verificado en Resend
- \`FRONTEND_URL\`: URL de tu frontend

4. **Crear usuario administrador**
\`\`\`bash
npm run init-admin
\`\`\`

5. **Iniciar servidor**
\`\`\`bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
\`\`\`

El servidor estará disponible en http://localhost:3000

## 📧 Configuración de Emails (Resend)

### 1. Crear cuenta en Resend
1. Ve a https://resend.com y crea una cuenta gratuita
2. Verifica tu dominio (o usa el dominio de prueba)
3. Ve a https://resend.com/api-keys
4. Crea una nueva API key
5. Copia la clave y agrégala a tu \`.env\`:

\`\`\`env
RESEND_API_KEY=re_tu_api_key_aqui
EMAIL_FROM=noreply@tudominio.com
EMAIL_FROM_NAME=Hostal El Refugio
\`\`\`

### 2. Límites de Resend (Plan Gratuito)
- 3,000 emails/mes
- 100 emails/día
- No requiere tarjeta de crédito

### 3. Dominio Personalizado (Opcional)
Para usar tu propio dominio:
1. Agrega tu dominio en Resend
2. Configura los registros DNS (MX, SPF, DKIM)
3. Verifica el dominio
4. Actualiza \`EMAIL_FROM\` en tu \`.env\`

Si solo necesitas testing, usa el dominio de prueba de Resend: \`onboarding@resend.dev\`

## 🚂 Deploy en Railway

### Opción 1: Deploy desde GitHub (Recomendado)

1. **Sube tu código a GitHub**
\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <tu-repositorio>
git push -u origin main
\`\`\`

2. **Conecta con Railway**
   - Ve a https://railway.app
   - Crea una cuenta o inicia sesión
   - Click en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Autoriza a Railway a acceder a tu repositorio
   - Selecciona tu repositorio

3. **Configurar Variables de Entorno**
   
   En Railway, ve a tu proyecto → Settings → Variables y agrega:

\`\`\`env
NODE_ENV=production
JWT_SECRET=<genera-uno-nuevo-seguro>
JWT_EXPIRES_IN=24h
RESEND_API_KEY=<tu-api-key-de-resend>
EMAIL_FROM=noreply@tudominio.com
EMAIL_FROM_NAME=Hostal El Refugio
FRONTEND_URL=<url-de-tu-frontend>
\`\`\`

**IMPORTANTE:** Railway asigna automáticamente \`PORT\`, no la agregues manualmente.

4. **Deploy Automático**
   - Railway detectará automáticamente que es Node.js
   - Instalará dependencias con \`npm install\`
   - Iniciará con \`npm start\`
   - Te dará una URL pública: \`https://tu-proyecto.up.railway.app\`

### Opción 2: Deploy con Railway CLI

1. **Instalar Railway CLI**
\`\`\`bash
npm install -g @railway/cli
\`\`\`

2. **Login**
\`\`\`bash
railway login
\`\`\`

3. **Iniciar proyecto**
\`\`\`bash
railway init
\`\`\`

4. **Agregar variables de entorno**
\`\`\`bash
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=<tu-secret>
railway variables set RESEND_API_KEY=<tu-api-key>
railway variables set EMAIL_FROM=noreply@tudominio.com
railway variables set FRONTEND_URL=<url-frontend>
\`\`\`

5. **Deploy**
\`\`\`bash
railway up
\`\`\`

### Verificar el Deploy

1. Railway te dará una URL pública
2. Visita \`https://tu-proyecto.up.railway.app\`
3. Deberías ver el mensaje de bienvenida del API
4. Prueba los endpoints:
   - GET \`/\` → Info del API
   - POST \`/api/auth/registro\` → Crear usuario
   - POST \`/api/auth/login\` → Login

## 🔧 Scripts Disponibles

\`\`\`bash
npm start          # Iniciar servidor en producción
npm run dev        # Iniciar con nodemon (desarrollo)
npm run init-admin # Crear usuario administrador
npm run reset-admin # Resetear contraseña del admin
npm run view-data  # Ver datos de la base de datos
npm run migrate    # Ejecutar migraciones
\`\`\`

## 📚 Estructura del Proyecto

\`\`\`
BackEnd/
├── config/
│   ├── database.js       # Configuración SQLite
│   └── email.js          # Configuración Nodemailer/Resend
├── controllers/
│   ├── authController.js          # Autenticación
│   ├── habitacionesController.js  # Habitaciones
│   └── reservasController.js      # Reservas
├── middlewares/
│   ├── auth.js           # Verificación JWT
│   └── upload.js         # Upload de archivos
├── routes/
│   ├── auth.routes.js
│   ├── habitaciones.routes.js
│   └── reservas.routes.js
├── uploads/              # Comprobantes de pago
├── .env                  # Variables de entorno (no subir a git)
├── .env.example          # Template de variables
├── .gitignore
├── railway.json          # Configuración Railway
├── package.json
├── server.js             # Punto de entrada
└── README.md
\`\`\`

## 🔐 Seguridad

- Contraseñas hasheadas con bcryptjs
- JWT con expiración configurable
- Rate limiting (5 intentos fallidos = 15 min de bloqueo)
- CORS configurado dinámicamente
- Variables sensibles en .env
- Validación de inputs

## 📞 Endpoints API

### Autenticación
- \`POST /api/auth/registro\` - Registrar usuario
- \`POST /api/auth/login\` - Iniciar sesión
- \`GET /api/auth/perfil\` - Obtener perfil (requiere token)
- \`PUT /api/auth/cambiar-password\` - Cambiar contraseña (requiere token)
- \`POST /api/auth/recuperar-password\` - Solicitar recuperación
- \`POST /api/auth/verificar-codigo\` - Verificar código de recuperación
- \`POST /api/auth/resetear-password\` - Resetear contraseña

### Habitaciones
- \`GET /api/habitaciones\` - Listar habitaciones
- \`POST /api/habitaciones\` - Crear habitación (admin)
- \`PUT /api/habitaciones/:id\` - Actualizar habitación (admin)
- \`DELETE /api/habitaciones/:id\` - Eliminar habitación (admin)

### Reservas
- \`GET /api/reservas\` - Listar reservas del usuario (requiere token)
- \`POST /api/reservas\` - Crear reserva (requiere token)
- \`GET /api/reservas/admin/todas\` - Listar todas (admin)
- \`PUT /api/reservas/:id/estado\` - Cambiar estado (admin)

## 🐛 Troubleshooting

### El servidor no inicia
- Verifica que el puerto 3000 esté libre
- Revisa que todas las dependencias estén instaladas
- Verifica el archivo \`.env\`

### Los emails no se envían
- Verifica tu API key de Resend
- Confirma que el email FROM esté verificado
- Revisa los logs del servidor
- En desarrollo, el código se muestra en consola

### Errores de CORS
- Verifica que \`FRONTEND_URL\` esté correctamente configurado
- En desarrollo, asegúrate que el frontend esté en \`http://localhost:5500\`
- En producción, agrega la URL exacta de tu frontend

### Error de base de datos
- La base de datos se crea automáticamente
- Si tienes problemas, elimina \`hostal.db\` y reinicia el servidor
- Ejecuta \`npm run init-admin\` para crear el usuario admin

## 📝 Notas Adicionales

### Dominio Personalizado en Railway
1. Ve a tu proyecto en Railway
2. Settings → Domains
3. Click en "Generate Domain" o "Custom Domain"
4. Para dominio personalizado, agrega un registro CNAME en tu DNS

### Persistencia de la Base de Datos
Railway usa almacenamiento efímero por defecto. Para persistir la BD:
1. Usa Railway Volumes (beta)
2. O migra a Railway PostgreSQL
3. O usa un servicio externo como PlanetScale

### Monitoreo
- Railway muestra logs en tiempo real
- Ve a tu proyecto → Deployments → Logs
- Configura alertas en Settings → Alerts

## 🤝 Soporte

Si necesitas ayuda:
1. Revisa los logs en Railway
2. Verifica las variables de entorno
3. Consulta la documentación de Railway: https://docs.railway.app
4. Documentación de Resend: https://resend.com/docs

---

**Desarrollado para Hostal El Refugio** 🏨
