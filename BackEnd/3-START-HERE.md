# 🏨 HOSTAL Los Girasoles - Sistema de Reservas

## 🎯 EMPEZAR AQUÍ

Bienvenido al sistema completo de reservas con autenticación, recuperación de contraseña por email y listo para deploy en Railway.

---

## 📚 DOCUMENTACIÓN DISPONIBLE

Este proyecto incluye **5 guías completas**:

### 1️⃣ **CHECKLIST.md** ⭐ EMPEZAR AQUÍ
- Lista paso a paso de todo el proceso
- Desde instalación local hasta producción
- Incluye tests y verificaciones
- **Tiempo estimado: 2-3 horas**

### 2️⃣ **RESEND_SETUP.md** 📧
- Cómo obtener API key de Resend
- Configuración de emails
- Dominio de prueba vs dominio propio
- Solución de problemas de emails

### 3️⃣ **RAILWAY_DEPLOY.md** 🚂
- Guía detallada de deploy en Railway
- Configuración de variables de entorno
- Conexión con frontend
- Troubleshooting

### 4️⃣ **README.md** 📖
- Documentación técnica completa
- Estructura del proyecto
- API endpoints
- Scripts disponibles

### 5️⃣ **Este archivo** 🎯
- Guía rápida para empezar

---

## ⚡ INICIO RÁPIDO (15 minutos)

Si quieres probar rápidamente en local:

\`\`\`bash
# 1. Instalar dependencias
npm install

# 2. Configurar entorno (interactivo)
node setup.js

# 3. Crear usuario admin
node crearAdmin.js

# 4. Iniciar servidor
npm start
\`\`\`

Abre http://localhost:3000 y deberías ver el API funcionando.

---

## 📋 LO QUE YA ESTÁ IMPLEMENTADO

✅ **Sistema de Autenticación Completo:**
- Registro de usuarios con validación
- Login con JWT
- Protección contra fuerza bruta (5 intentos)
- Cambio de contraseña

✅ **Recuperación de Contraseña por Email:**
- Código de 6 dígitos
- Expira en 30 minutos
- Plantillas HTML profesionales
- Integrado con Resend

✅ **Sistema de Emails:**
- Configuración con Resend (nodemailer)
- Plantillas HTML bonitas
- Email de verificación (opcional)
- Email de recuperación

✅ **Gestión de Reservas:**
- Catálogo de habitaciones
- Sistema de reservas
- Upload de comprobantes
- Panel de administración
- Auditoría de cambios

✅ **Seguridad:**
- Contraseñas hasheadas (bcryptjs)
- JWT con expiración
- CORS configurado dinámicamente
- Rate limiting
- Validaciones de entrada

✅ **Base de Datos:**
- SQLite (perfecto para Railway)
- Migración automática de campos
- Scripts de inicialización

✅ **Listo para Railway:**
- railway.json configurado
- Variables de entorno preparadas
- CORS dinámico (dev/prod)
- Scripts de deploy

✅ **Frontend Optimizado:**
- config.js para cambiar entre dev/prod
- Integración con backend
- Validaciones del lado cliente

---

## 🎯 PLAN RECOMENDADO

### Día 1: Local (2-3 horas)
1. Seguir **CHECKLIST.md** - Fases 1-3
2. Configurar Resend (ver **RESEND_SETUP.md**)
3. Probar todo en local
4. Asegurarse que emails funcionan

### Día 2: Producción (2 horas)
1. Seguir **CHECKLIST.md** - Fases 4-8
2. Deploy en Railway (ver **RAILWAY_DEPLOY.md**)
3. Conectar frontend
4. Pruebas finales

---

## 🔑 CREDENCIALES INICIALES

Después de ejecutar \`node crearAdmin.js\`:

**Usuario Administrador:**
- Email: \`admin@hostal.com\`
- Password: \`admin123\`

⚠️ **IMPORTANTE:** Cambiar la contraseña después del primer login.

---

## 📦 ESTRUCTURA DEL PROYECTO

\`\`\`
BackEnd/
├── 📚 DOCUMENTACIÓN
│   ├── START_HERE.md          ⬅️ Estás aquí
│   ├── CHECKLIST.md           ⭐ Guía paso a paso
│   ├── RESEND_SETUP.md        📧 Config de emails
│   ├── RAILWAY_DEPLOY.md      🚂 Deploy en Railway
│   └── README.md              📖 Documentación técnica
│
├── ⚙️ CONFIGURACIÓN
│   ├── .env                   (Crear desde .env.example)
│   ├── .env.example           Template de variables
│   ├── .gitignore             Archivos a ignorar en git
│   ├── railway.json           Config de Railway
│   └── package.json           Dependencias
│
├── 🗂️ CÓDIGO
│   ├── config/
│   │   ├── database.js        Conexión SQLite
│   │   └── email.js           Configuración Resend
│   ├── controllers/           Lógica de negocio
│   ├── middlewares/           JWT, uploads, etc
│   ├── routes/                Endpoints del API
│   └── server.js              Punto de entrada
│
└── 🛠️ UTILIDADES
    ├── setup.js               Configuración interactiva
    ├── crearAdmin.js          Crear usuario admin
    ├── resetAdmin.js          Resetear admin
    ├── agregarcampos.js       Migraciones DB
    └── verDatos.js            Ver datos de la DB
\`\`\`

---

## 🚀 COMANDOS ÚTILES

\`\`\`bash
# Desarrollo
npm run dev              # Iniciar con nodemon (auto-reload)
npm start                # Iniciar en producción

# Utilidades
npm run init-admin       # Crear usuario administrador
npm run reset-admin      # Resetear contraseña admin
npm run view-data        # Ver datos de la base de datos
npm run migrate          # Ejecutar migraciones

# Configuración
node setup.js            # Configuración interactiva
\`\`\`

---

## 🌐 URLS EN DESARROLLO

- **Backend:** http://localhost:3000
- **Frontend:** http://127.0.0.1:5500 (Live Server)

---

## 📧 CONFIGURACIÓN DE RESEND

Necesitas una API key de Resend (gratuita):

1. Ve a https://resend.com
2. Crea cuenta (con GitHub)
3. Obtén API key en "API Keys"
4. Agrega a tu \`.env\`

**Plan Gratuito:**
- 3,000 emails/mes
- 100 emails/día
- No requiere tarjeta

**Ver guía completa en:** \`RESEND_SETUP.md\`

---

## 🐛 SOLUCIÓN RÁPIDA DE PROBLEMAS

### Servidor no inicia
\`\`\`bash
# Verificar puerto
lsof -i :3000
# Matar proceso si es necesario
kill -9 <PID>
\`\`\`

### Emails no llegan
1. Revisar API key de Resend
2. Ver logs del servidor
3. Usar \`onboarding@resend.dev\` para testing
4. Revisar carpeta de spam

### Error de módulos
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Base de datos corrupta
\`\`\`bash
rm hostal.db
npm start
node crearAdmin.js
\`\`\`

---

## 📊 SIGUIENTES PASOS

### Antes de Producción:
- [ ] Cambiar \`JWT_SECRET\` por uno seguro
- [ ] Configurar dominio en Resend (opcional)
- [ ] Probar todos los flujos en local
- [ ] Leer **CHECKLIST.md** completo

### En Producción:
- [ ] Seguir **RAILWAY_DEPLOY.md**
- [ ] Configurar variables de entorno
- [ ] Deploy de frontend en Netlify/Vercel
- [ ] Probar flujo completo

### Post-Producción:
- [ ] Cambiar contraseña del admin
- [ ] Configurar dominio personalizado
- [ ] Configurar monitoreo
- [ ] Documentar para usuarios finales

---

## 🆘 ¿NECESITAS AYUDA?

1. **Primero:** Revisa el archivo correspondiente:
   - Emails → \`RESEND_SETUP.md\`
   - Deploy → \`RAILWAY_DEPLOY.md\`
   - General → \`README.md\`

2. **Logs:** Siempre revisa los logs:
   - Local: Consola del servidor
   - Railway: Dashboard → Deployments → Logs

3. **Recursos:**
   - Railway Docs: https://docs.railway.app
   - Resend Docs: https://resend.com/docs
   - Discord Railway: https://discord.gg/railway
   - Discord Resend: https://discord.gg/resend

---

## ✅ VERIFICACIÓN INICIAL

Antes de continuar, verifica que tienes:

- [ ] Node.js >= 18.0.0 instalado
- [ ] npm >= 9.0.0 instalado
- [ ] Cuenta de Resend creada
- [ ] Cuenta de Railway creada (para deploy)
- [ ] Cuenta de GitHub (para deploy)
- [ ] Editor de código (VS Code recomendado)
- [ ] Git instalado

---

## 🎉 ¡LISTO PARA EMPEZAR!

**Siguiente paso:** Abre **CHECKLIST.md** y sigue las instrucciones paso a paso.

**Tiempo estimado total:** 4-5 horas (incluyendo pruebas)

---

**Desarrollado con ❤️ para Hostal Los Girasoles**

¿Preguntas? Revisa la documentación o los recursos de ayuda.
