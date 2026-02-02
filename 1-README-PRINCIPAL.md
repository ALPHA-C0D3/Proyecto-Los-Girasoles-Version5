# 🏨 HOSTAL LOS GIRASOLES - Sistema Completo de Reservas

## 📦 CONTENIDO DEL PAQUETE

Este paquete contiene el sistema completo listo para producción:

```
HOSTAL-COMPLETO/
├── BackEnd/          Sistema de servidor con Node.js + Express + SQLite
│   ├── 📚 5 Guías completas de implementación
│   ├── ⚙️ Sistema de emails con Resend
│   ├── 🔐 Autenticación JWT completa
│   ├── 📧 Recuperación de contraseña
│   └── 🚂 Listo para Railway
│
└── FrontEnd/         Interfaz de usuario con HTML/CSS/JS
    ├── 🎨 Bootstrap 5 responsive
    ├── 📱 Compatible con móviles
    ├── 🔧 Config dinámica (dev/prod)
    └── ✨ Experiencia de usuario optimizada
```

---

## 🚀 INICIO RÁPIDO

### 1️⃣ Abre la documentación
```
BackEnd/START_HERE.md  ⬅️ EMPEZAR AQUÍ
```

Este archivo te guiará paso a paso.

### 2️⃣ O sigue el orden recomendado:
1. **BackEnd/START_HERE.md** - Visión general
2. **BackEnd/CHECKLIST.md** - Lista paso a paso (⭐ MÁS IMPORTANTE)
3. **BackEnd/RESEND_SETUP.md** - Configurar emails
4. **BackEnd/RAILWAY_DEPLOY.md** - Deploy en producción

---

## ✨ CARACTERÍSTICAS IMPLEMENTADAS

### Backend (Node.js + Express)
✅ Autenticación completa con JWT  
✅ Sistema de recuperación de contraseña por email  
✅ Protección contra fuerza bruta (rate limiting)  
✅ Sistema de emails con Resend (Nodemailer)  
✅ Gestión de habitaciones y reservas  
✅ Upload de comprobantes de pago  
✅ Panel de administración  
✅ Auditoría de reservas  
✅ Base de datos SQLite  
✅ Listo para Railway  

### Frontend (HTML + CSS + JS)
✅ Diseño responsive con Bootstrap 5  
✅ Catálogo de habitaciones  
✅ Sistema de reservas con validaciones  
✅ Panel de cliente  
✅ Panel de administración  
✅ Login y registro con validaciones  
✅ Recuperación de contraseña  
✅ Configuración dinámica (dev/prod)  

---

## 📚 DOCUMENTACIÓN INCLUIDA

### Guías Principales (BackEnd/)
- **START_HERE.md** - Punto de entrada, visión general
- **CHECKLIST.md** - Lista completa paso a paso (⭐ USAR ESTE)
- **RESEND_SETUP.md** - Cómo configurar sistema de emails
- **RAILWAY_DEPLOY.md** - Deploy completo en Railway
- **README.md** - Documentación técnica detallada

### Todo está documentado:
- ✅ Instalación local
- ✅ Configuración de variables
- ✅ Obtención de API keys
- ✅ Deploy en Railway
- ✅ Configuración de emails
- ✅ Solución de problemas
- ✅ Scripts disponibles
- ✅ API endpoints

---

## ⏱️ TIEMPO ESTIMADO

| Fase | Tiempo | Descripción |
|------|--------|-------------|
| Configuración Local | 30 min | Instalar, configurar variables, crear admin |
| Pruebas Locales | 30 min | Probar todas las funcionalidades |
| Deploy Railway | 20 min | Subir a producción |
| Deploy Frontend | 15 min | Netlify/Vercel |
| Pruebas Finales | 15 min | Verificar todo funciona |
| **TOTAL** | **~2 horas** | Tiempo estimado completo |

---

## 🎯 REQUISITOS PREVIOS

Antes de empezar, necesitas:

### Software
- [ ] Node.js >= 18.0.0
- [ ] npm >= 9.0.0
- [ ] Git
- [ ] Editor de código (VS Code recomendado)

### Cuentas (todas gratuitas)
- [ ] Resend (para emails) → https://resend.com
- [ ] Railway (para backend) → https://railway.app
- [ ] Netlify/Vercel (para frontend) → https://netlify.com
- [ ] GitHub → https://github.com

---

## 📧 SISTEMA DE EMAILS

El proyecto incluye sistema completo de emails con Resend:

**Características:**
- ✅ Plantillas HTML profesionales
- ✅ Código de recuperación de 6 dígitos
- ✅ Expiración de 30 minutos
- ✅ Diseño responsive
- ✅ Colores del hostal (amarillo/naranja)

**Plan Gratuito de Resend:**
- 3,000 emails/mes
- 100 emails/día
- No requiere tarjeta de crédito

**Ver guía completa:** `BackEnd/RESEND_SETUP.md`

---

## 🚂 DEPLOY EN RAILWAY

El backend está optimizado para Railway:

**Incluye:**
- ✅ railway.json configurado
- ✅ Variables de entorno preparadas
- ✅ CORS dinámico
- ✅ Scripts de producción
- ✅ Documentación completa

**Plan Gratuito de Railway:**
- $5/mes de créditos gratuitos
- Suficiente para este proyecto
- Deploy automático desde GitHub

**Ver guía completa:** `BackEnd/RAILWAY_DEPLOY.md`

---

## 🔐 CREDENCIALES INICIALES

Después de la instalación:

**Usuario Administrador:**
```
Email: admin@hostal.com
Password: admin123
```

⚠️ **Cambiar la contraseña después del primer login.**

---

## 📞 ENDPOINTS DEL API

### Autenticación
- `POST /api/auth/registro` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/perfil` - Obtener perfil
- `PUT /api/auth/cambiar-password` - Cambiar contraseña
- `POST /api/auth/recuperar-password` - Solicitar recuperación
- `POST /api/auth/verificar-codigo` - Verificar código
- `POST /api/auth/resetear-password` - Resetear contraseña

### Habitaciones
- `GET /api/habitaciones` - Listar habitaciones
- `POST /api/habitaciones` - Crear habitación (admin)
- `PUT /api/habitaciones/:id` - Actualizar (admin)
- `DELETE /api/habitaciones/:id` - Eliminar (admin)

### Reservas
- `GET /api/reservas` - Listar mis reservas
- `POST /api/reservas` - Crear reserva
- `GET /api/reservas/admin/todas` - Todas las reservas (admin)
- `PUT /api/reservas/:id/estado` - Cambiar estado (admin)

---

## 🛠️ SCRIPTS DISPONIBLES

En la carpeta `BackEnd/`:

```bash
npm start              # Iniciar en producción
npm run dev            # Iniciar con nodemon (desarrollo)
npm run init-admin     # Crear usuario administrador
npm run reset-admin    # Resetear contraseña admin
npm run view-data      # Ver datos de la base de datos
npm run migrate        # Ejecutar migraciones
node setup.js          # Configuración interactiva
```

---

## 🎓 FLUJO DE TRABAJO RECOMENDADO

### Día 1: Ambiente Local
1. Leer `BackEnd/START_HERE.md`
2. Seguir `BackEnd/CHECKLIST.md` - Fases 1-3
3. Configurar Resend
4. Probar todas las funcionalidades localmente
5. Asegurarse que los emails funcionan

### Día 2: Producción
1. Continuar con `BackEnd/CHECKLIST.md` - Fases 4-8
2. Seguir `BackEnd/RAILWAY_DEPLOY.md` para deploy
3. Conectar frontend con backend
4. Realizar pruebas finales en producción

---

## 💰 COSTOS

### Desarrollo:
- **Todo gratis** durante desarrollo

### Producción (estimado mensual):
- **Railway:** $3-5/mes (plan gratuito cubre)
- **Resend:** $0/mes (plan gratuito suficiente)
- **Netlify/Vercel:** $0/mes (plan gratuito)
- **Dominio:** $10-15/año (opcional)

**Total mensual:** ~$0-5 con planes gratuitos

---

## ✅ VERIFICACIÓN FINAL

Tu sistema estará listo cuando puedas:

- [ ] Registrar un usuario nuevo
- [ ] Recibir email de bienvenida
- [ ] Iniciar sesión correctamente
- [ ] Solicitar recuperación de contraseña
- [ ] Recibir código por email
- [ ] Cambiar contraseña exitosamente
- [ ] Crear una reserva como cliente
- [ ] Ver la reserva como admin
- [ ] Aprobar/Rechazar la reserva

---

**Desarrollado con ❤️ para Hostal Los Girasoles**

**Versión:** 5.0.0  
**Fecha:** Enero 2026  
**Stack:** Node.js + Express + SQLite + Resend + Railway
