# 🚀 PRIMEROS PASOS - GUÍA RÁPIDA

## ✨ ¡Bienvenido a tu Sistema de Reservas!

Este es un sistema **completo y listo para producción** con:
- ✅ Autenticación segura
- ✅ Recuperación de contraseña por email
- ✅ Sistema de reservas
- ✅ Panel de administración
- ✅ Listo para Railway

---

## 📂 ARCHIVOS QUE TIENES

```
HOSTAL-COMPLETO/
├── README.md              ⬅️ Estás aquí
├── PRIMEROS_PASOS.md      ⬅️ Esta guía
│
├── BackEnd/               Sistema del servidor
│   ├── START_HERE.md      📖 Punto de entrada
│   ├── CHECKLIST.md       ⭐ GUÍA PRINCIPAL (Usar esta)
│   ├── RESEND_SETUP.md    📧 Configurar emails
│   ├── RAILWAY_DEPLOY.md  🚂 Deploy en producción
│   └── (código fuente)
│
└── FrontEnd/              Interfaz de usuario
    ├── css/
    ├── js/
    └── (archivos HTML)
```

---

## 🎯 ¿QUÉ HACER AHORA?

### Opción 1: RÁPIDO (Solo probar localmente - 15 min)

1. Abre la terminal en la carpeta `BackEnd/`
2. Ejecuta:
   ```bash
   npm install
   node setup.js
   node crearAdmin.js
   npm start
   ```
3. Abre http://localhost:3000
4. ¡Funciona! Ahora prueba el frontend

### Opción 2: COMPLETO (Local + Producción - 2-3 horas)

1. Abre: **BackEnd/START_HERE.md**
2. Lee la visión general
3. Luego abre: **BackEnd/CHECKLIST.md** ⭐
4. Sigue la lista paso a paso
5. ¡Terminarás con todo funcionando en Railway!

---

## 📧 IMPORTANTE: EMAILS

Para que los emails funcionen necesitas una API key de **Resend** (gratis):

### ¿Qué es Resend?
- Servicio de emails transaccionales
- 3,000 emails/mes GRATIS
- No requiere tarjeta de crédito
- Setup en 2 minutos

### ¿Cómo obtengo la API key?
1. Ve a: https://resend.com
2. Regístrate (con GitHub es más rápido)
3. Ve a "API Keys"
4. Crea una nueva: "Hostal Development"
5. Copia la clave que empieza con `re_`

**Guía completa con capturas:** `BackEnd/RESEND_SETUP.md`

---

## 🚂 IMPORTANTE: PRODUCCIÓN

El sistema está listo para **Railway** (hosting gratuito):

### ¿Qué es Railway?
- Plataforma de hosting moderna
- $5/mes de créditos GRATIS
- Este proyecto cuesta ~$3-4/mes
- Deploy automático desde GitHub

### ¿Cómo subo mi proyecto?
**Guía completa paso a paso:** `BackEnd/RAILWAY_DEPLOY.md`

1. Sube tu código a GitHub
2. Conecta Railway con GitHub
3. Configura variables de entorno
4. ¡Deploy automático!

---

## 📋 ORDEN RECOMENDADO DE LECTURA

Si es tu primera vez, lee en este orden:

1. **README.md** (raíz) ← Estás aquí
2. **PRIMEROS_PASOS.md** (raíz) ← Esta guía
3. **BackEnd/START_HERE.md** ← Visión general
4. **BackEnd/CHECKLIST.md** ⭐ ← GUÍA PRINCIPAL
5. **BackEnd/RESEND_SETUP.md** ← Si tienes dudas con emails
6. **BackEnd/RAILWAY_DEPLOY.md** ← Para ir a producción

---

## 🎓 RUTAS DE APRENDIZAJE

### 🟢 PRINCIPIANTE
**Objetivo:** Solo quiero probarlo en mi computadora

**Tiempo:** 30 minutos

**Pasos:**
1. `BackEnd/START_HERE.md` → Sección "Inicio Rápido"
2. Ejecutar los 4 comandos
3. Abrir http://localhost:3000
4. Probar el sistema

---

### 🟡 INTERMEDIO
**Objetivo:** Quiero entender cómo funciona todo

**Tiempo:** 2 horas

**Pasos:**
1. `BackEnd/START_HERE.md` → Leer completo
2. `BackEnd/CHECKLIST.md` → Fases 1-3
3. Probar todas las funcionalidades
4. Revisar el código

---

### 🔴 AVANZADO
**Objetivo:** Quiero tenerlo funcionando en internet

**Tiempo:** 3-4 horas

**Pasos:**
1. `BackEnd/CHECKLIST.md` → Fases 1-8 (completas)
2. `BackEnd/RESEND_SETUP.md` → Config de emails
3. `BackEnd/RAILWAY_DEPLOY.md` → Deploy
4. Pruebas en producción

---

## 🔧 HERRAMIENTAS QUE NECESITAS

### Mínimo (para probar localmente):
- ✅ Node.js (descargar de nodejs.org)
- ✅ Editor de código (VS Code recomendado)
- ✅ Terminal/Consola

### Completo (para producción):
- ✅ Todo lo anterior +
- ✅ Cuenta de Resend (emails)
- ✅ Cuenta de Railway (hosting)
- ✅ Cuenta de GitHub (código)
- ✅ Git instalado

---

## 📞 PREGUNTAS FRECUENTES

### ¿Cuánto cuesta?
**Desarrollo:** $0 - Todo gratis
**Producción:** $0-5/mes con planes gratuitos

### ¿Necesito saber programar?
**Para usar:** No, solo seguir las guías
**Para modificar:** Sí, conocimientos de JavaScript ayudan

### ¿Puedo cambiar el diseño?
**Sí:** Todos los archivos HTML/CSS son editables
**Ubicación:** `FrontEnd/css/style.css`

### ¿Funciona en móviles?
**Sí:** Diseño responsive con Bootstrap 5

### ¿Es seguro?
**Sí:** Implementa mejores prácticas:
- Contraseñas hasheadas
- JWT tokens
- Rate limiting
- Validaciones

### ¿Puedo agregar más habitaciones?
**Sí:** Panel de administración incluye CRUD completo

---

## 🐛 SI ALGO NO FUNCIONA

### Paso 1: Identifica el problema
- ¿El servidor no inicia?
- ¿Los emails no llegan?
- ¿Error en el frontend?
- ¿Problema con Railway?

### Paso 2: Ve a la guía específica
- Emails → `BackEnd/RESEND_SETUP.md`
- Deploy → `BackEnd/RAILWAY_DEPLOY.md`
- General → `BackEnd/README.md`

### Paso 3: Revisa logs
- **Local:** Consola del servidor
- **Railway:** Dashboard → Logs

### Paso 4: Verifica configuración
- Variables de entorno en `.env`
- API keys correctas
- URLs configuradas

---

## ✅ CHECKLIST ANTES DE EMPEZAR

- [ ] Tengo Node.js instalado
- [ ] Tengo un editor de código
- [ ] Descargué el proyecto completo
- [ ] Tengo 30 minutos disponibles
- [ ] Leí este archivo completo

**Si marcaste todo, estás listo.** 

**Siguiente paso:** Abre `BackEnd/START_HERE.md`

---

## 🎯 TU PRIMER OBJETIVO

### Meta 1: Servidor funcionando localmente (15 min)
```bash
cd BackEnd
npm install
node setup.js
node crearAdmin.js
npm start
```

Si ves "Servidor corriendo en http://localhost:3000" → ¡Éxito! ✅

### Meta 2: Login funcionando (10 min)
1. Abre `FrontEnd/login.html` con Live Server
2. Ingresa:
   - Email: admin@hostal.com
   - Password: admin123
3. Si entras al panel → ¡Éxito! ✅

### Meta 3: Email de recuperación (5 min)
1. En login, click "Olvidé mi contraseña"
2. Ingresa tu email
3. Revisa tu bandeja (y spam)
4. Si llega el código → ¡Éxito! ✅

---

## 🎉 ¡ESTÁS LISTO!

Has leído los primeros pasos. Ahora:

**Próxima lectura:** `BackEnd/START_HERE.md`

**Después:** `BackEnd/CHECKLIST.md` (la guía principal)

---

**¿Confundido?** No te preocupes, las guías te llevan paso a paso.

**¿Ansioso por empezar?** Ve directo a `BackEnd/CHECKLIST.md`

**¿Quieres entender primero?** Lee `BackEnd/START_HERE.md`

---

**¡Mucho éxito con tu proyecto!** 🚀

Si sigues las guías, en 2-3 horas tendrás todo funcionando.
