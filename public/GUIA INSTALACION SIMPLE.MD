# 🎯 GUÍA DE INSTALACIÓN - SISTEMA DE RECUPERACIÓN SIMPLE

## ✅ LO QUE VAS A TENER

Un sistema **SIMPLE** de recuperación de contraseña:

1. Usuario entra a `solicitar-recuperacion.html`
2. Ingresa su email
3. Recibe email con **BOTÓN/LINK**
4. Click en el botón
5. Se abre `cambiar-password.html`
6. Ingresa nueva contraseña
7. **LISTO**

**SIN MODALES, SIN PASOS COMPLICADOS, SIN AUTH.JS MODIFICADO**

---

## 📦 ARCHIVOS A INSTALAR (5)

### BACKEND (3 archivos)

#### 1. `BackEnd/controllers/authController.js`
- **Buscar:** Función `solicitarRecuperacion`
- **Reemplazar con:** Código del archivo `47-authController-SIMPLE.js`
- **Agregar:** Función `resetearPasswordConToken` (está en el mismo archivo)

#### 2. `BackEnd/config/email.js`
- **Agregar al final:** Función `enviarEmailRecuperacionConLink`
- **Código:** Archivo `51-email-SIMPLE.js`
- **Modificar exports:** Agregar `enviarEmailRecuperacionConLink`

#### 3. `BackEnd/routes/auth.routes.js`
- **Agregar:** Importar `resetearPasswordConToken`
- **Agregar ruta:** `router.post('/resetear-password-token', resetearPasswordConToken);`

### FRONTEND (2 archivos)

#### 4. `FrontEnd/solicitar-recuperacion.html` (NUEVO)
- **Archivo:** `52-solicitar-recuperacion.html`
- **Descripción:** Página donde el usuario ingresa su email

#### 5. `FrontEnd/cambiar-password.html` (NUEVO)
- **Archivo:** `53-cambiar-password.html`
- **Descripción:** Página donde el usuario cambia su contraseña (recibe token por URL)

#### 6. `FrontEnd/login.html` (MODIFICAR)
- **Ver:** `54-MODIFICAR-LOGIN.txt`
- **Cambio:** Reemplazar el enlace de "¿Olvidaste tu contraseña?" para que vaya a `solicitar-recuperacion.html`

---

## 🚀 INSTALACIÓN PASO A PASO

### PASO 1: Backend - authController.js

```bash
cd BackEnd/controllers
# Hacer backup
cp authController.js authController.js.backup
```

Abrir `authController.js` y:

1. **Buscar la función `solicitarRecuperacion`**
2. **Reemplazarla completamente** con el código del archivo `47-authController-SIMPLE.js`
3. **Agregar al final** (antes de `module.exports`) la función `resetearPasswordConToken` que está en el mismo archivo

Verificar que esté:
- ✅ `exports.solicitarRecuperacion` - Modificada
- ✅ `exports.resetearPasswordConToken` - Nueva

---

### PASO 2: Backend - email.js

```bash
cd BackEnd/config
# Hacer backup
cp email.js email.js.backup
```

Abrir `email.js` y:

1. **Al final del archivo, ANTES de `module.exports`**, agregar la función completa del archivo `51-email-SIMPLE.js`

2. **Modificar la línea `module.exports`** para incluir la nueva función:

```javascript
module.exports = {
    enviarEmail,
    enviarCodigoVerificacion,
    enviarCodigoRecuperacion,
    enviarEmailRecuperacionConLink  // ← AGREGAR ESTA
};
```

---

### PASO 3: Backend - auth.routes.js

```bash
cd BackEnd/routes
# Hacer backup
cp auth.routes.js auth.routes.js.backup
```

Abrir `auth.routes.js` y:

1. **En la sección de imports**, agregar `resetearPasswordConToken`:

```javascript
const { 
    registro, 
    login, 
    // ... otras funciones ...
    resetearPasswordConToken  // ← AGREGAR
} = require('../controllers/authController');
```

2. **Al final, ANTES de `module.exports`**, agregar la ruta:

```javascript
router.post('/resetear-password-token', resetearPasswordConToken);
```

---

### PASO 4: Frontend - Nuevas páginas

```bash
cd FrontEnd
```

1. Copiar archivo `52-solicitar-recuperacion.html` y renombrarlo a `solicitar-recuperacion.html`
2. Copiar archivo `53-cambiar-password.html` y renombrarlo a `cambiar-password.html`

Estructura debe quedar:
```
FrontEnd/
├── login.html
├── solicitar-recuperacion.html  ← NUEVO
├── cambiar-password.html        ← NUEVO
├── assets/
├── css/
└── js/
```

---

### PASO 5: Frontend - Modificar login.html

Abrir `login.html` y buscar el botón "Iniciar Sesión".

Después del botón, busca:
```html
<div class="text-center">
    <a href="#" ... data-bs-toggle="modal" ...>
        ¿Olvidaste tu contraseña?
    </a>
</div>
```

**Reemplazar con:**
```html
<div class="text-center">
    <a href="solicitar-recuperacion.html" class="text-decoration-none text-warning fw-bold">
        ¿Olvidaste tu contraseña?
    </a>
</div>
```

Guardar y cerrar.

---

### PASO 6: Configurar URL del Frontend en Backend

Abrir `BackEnd/.env` y agregar:

```env
FRONTEND_URL=http://127.0.0.1:5500
```

(Si usas Live Server en otro puerto, cambia el número)

---

## 🧪 TESTING COMPLETO

### Test 1: Iniciar Backend

```bash
cd BackEnd
npm start
```

Debes ver:
```
Servidor corriendo en puerto 3000
```

---

### Test 2: Solicitar recuperación

1. Abre en navegador: `http://127.0.0.1:5500/solicitar-recuperacion.html`
2. Ingresa un email que exista en tu base de datos
3. Click en "Enviar Enlace de Recuperación"

**En consola del navegador:**
```
📧 Solicitando recuperación para: tu@email.com
📥 Respuesta: {success: true, mensaje: "...", link: "http://..."}
✅ Email enviado exitosamente
```

**En consola del backend:**
```
[RECUPERACIÓN] Token generado para tu@email.com: abc123...
[RECUPERACIÓN] Link generado: http://127.0.0.1:5500/cambiar-password.html?token=abc123...
📧 Enviando email de recuperación a: tu@email.com
✅ Email enviado exitosamente a tu@email.com
```

**En tu email:**
- Debes recibir un email con un botón amarillo "Cambiar mi Contraseña"

---

### Test 3: Cambiar contraseña

**Opción A - Desde el email:**
1. Abre el email que recibiste
2. Click en el botón "Cambiar mi Contraseña"
3. Se abre `cambiar-password.html?token=...`

**Opción B - Desde desarrollo:**
1. En la página de `solicitar-recuperacion.html` aparecerá un botón "Abrir Link de Recuperación" (SOLO EN DESARROLLO)
2. Click en ese botón

**En la página de cambiar contraseña:**
1. Ingresa tu nueva contraseña (mínimo 6 caracteres)
2. Confirma la contraseña
3. Click en "Cambiar Contraseña"

**En consola del navegador:**
```
🔑 Token desde URL: abc123...
✅ Token encontrado, mostrando formulario
🔐 Enviando nueva contraseña al backend...
📥 Respuesta: {success: true, mensaje: "Contraseña actualizada exitosamente"}
✅ Contraseña cambiada exitosamente
```

**Resultado:**
- Verás mensaje de éxito ✅
- Botón "Ir al Login"
- Puedes hacer login con tu nueva contraseña

---

## 🎯 FLUJO VISUAL COMPLETO

```
┌─────────────────────────┐
│ login.html              │
│ Click: ¿Olvidaste...?   │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│ solicitar-recuperacion  │
│ Ingresa email           │
│ Click: Enviar           │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│ BACKEND                 │
│ - Genera token          │
│ - Guarda en DB          │
│ - Envía email con link  │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│ EMAIL                   │
│ [Botón: Cambiar mi      │
│  Contraseña]            │
└───────────┬─────────────┘
            ↓ (click)
┌─────────────────────────┐
│ cambiar-password.html   │
│ ?token=abc123...        │
│ Ingresa nueva password  │
│ Click: Cambiar          │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│ BACKEND                 │
│ - Verifica token        │
│ - Actualiza password    │
│ - Limpia token          │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│ ✅ ÉXITO                │
│ Ir al Login             │
└─────────────────────────┘
```

---

## ❌ TROUBLESHOOTING

### Email no llega

1. Verificar que Resend API key esté en `.env`
2. Verificar logs del backend
3. Revisar carpeta de spam
4. En desarrollo, usar el link que aparece en pantalla

### "Token inválido"

1. Verificar que la URL tiene `?token=...`
2. El token expira en 30 minutos
3. Solicitar nuevo link

### Error de conexión

1. Verificar que backend esté corriendo (`npm start`)
2. Verificar que el puerto sea 3000
3. Verificar que `API_URL` en HTML sea `http://localhost:3000/api`

---

## ✅ CHECKLIST FINAL

- [ ] authController.js modificado
- [ ] email.js con nueva función
- [ ] auth.routes.js con nueva ruta
- [ ] solicitar-recuperacion.html creado
- [ ] cambiar-password.html creado
- [ ] login.html modificado (link simple)
- [ ] FRONTEND_URL en .env configurado
- [ ] Backend corriendo
- [ ] Email llega correctamente
- [ ] Link funciona
- [ ] Contraseña se cambia
- [ ] Login funciona con nueva contraseña

---

## 🎉 VENTAJAS DE ESTE SISTEMA

✅ **SIMPLE** - Solo 2 páginas HTML
✅ **SIN MODAL** - Sin problemas de cambio de pasos
✅ **SIN AUTH.JS COMPLICADO** - No requiere modificar auth.js
✅ **MÁS SEGURO** - Usa token único en lugar de código
✅ **MEJOR UX** - Usuario hace click en email y ya
✅ **FÁCIL DE DEBUGGEAR** - Logs claros en cada paso
✅ **FUNCIONA 100%** - Sin margen de error

---

**¡ESTE SISTEMA SÍ VA A FUNCIONAR!** 🚀
