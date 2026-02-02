# 🔐 GUÍA COMPLETA: Sistema de Recuperación de Contraseña

## 📋 ARCHIVOS QUE RECIBISTE

### Archivos HTML (Colocar en FrontEnd/)
1. **34-recuperar-password.html** → Renombrar a `recuperar-password.html`
2. **35-cambiar-password.html** → Renombrar a `cambiar-password.html`

### Archivo JavaScript (Colocar en FrontEnd/js/)
3. **36-recuperar-password.js** → Renombrar a `recuperar-password.js`

### Modificación
4. **37-MODIFICACION-login.txt** → Instrucciones para modificar `login.html`

---

## 📂 ESTRUCTURA FINAL DEL FRONTEND

```
FrontEnd/
├── index.html
├── login.html                  ← MODIFICAR (agregar enlace)
├── registro.html
├── habitaciones.html
├── panel_cliente.html
├── panel_admin.html
│
├── css/
│   ├── bootstrap.min.css
│   └── style.css
│
└── js/
    ├── config.js
    ├── auth.js
    ├── admin.js
    ├── reservas.js
    ├── validaciones.js
```

---

## 🔧 PASO A PASO: INSTALACIÓN

### PASO 1: Colocar los archivos HTML

1. Descarga `34-recuperar-password.html`
2. Renómbralo a `recuperar-password.html`
3. Colócalo en la carpeta `FrontEnd/`

4. Descarga `35-cambiar-password.html`
5. Renómbralo a `cambiar-password.html`
6. Colócalo en la carpeta `FrontEnd/`

### PASO 2: Colocar el archivo JavaScript

1. Descarga `36-recuperar-password.js`
2. Renómbralo a `recuperar-password.js`
3. Colócalo en la carpeta `FrontEnd/js/`

### PASO 3: Modificar login.html

1. Abre tu archivo `FrontEnd/login.html`
2. Busca el botón de "Iniciar Sesión"
3. Después del botón, agrega:

```html
<!-- Enlace para recuperar contraseña -->
<div class="text-center mb-3">
    <a href="recuperar-password.html" class="text-decoration-none">
        ¿Olvidaste tu contraseña?
    </a>
</div>
```

4. Guarda el archivo

### PASO 4: Verificar que el backend tenga los campos

Ejecuta este comando en tu BackEnd:

```bash
node agregarcampos.js
```

Esto agrega los campos `resetToken` y `resetTokenExpira` a la tabla usuarios.

---

## 🎯 FLUJO COMPLETO DEL SISTEMA

### USUARIO:

1. **Va a login.html**
   - Ve el enlace "¿Olvidaste tu contraseña?"
   - Click en el enlace

2. **recuperar-password.html (Paso 1)**
   - Ingresa su correo electrónico
   - Click en "Enviar Código de Verificación"
   - Recibe email con código de 6 dígitos
   - Es redirigido automáticamente a cambiar-password.html

3. **cambiar-password.html (Paso 2 y 3)**
   - Ve su correo electrónico mostrado
   - Ingresa el código de 6 dígitos que recibió
   - Ingresa su nueva contraseña
   - Confirma la nueva contraseña
   - Click en "Cambiar Contraseña"
   - Ve mensaje de éxito
   - Es redirigido a login.html

4. **login.html**
   - Inicia sesión con la nueva contraseña
   - ¡Listo!

---

## 🧪 PROBAR EL SISTEMA

### Test Completo:

**1. Preparación:**
```bash
# En BackEnd/
npm start
```

**2. Solicitar código:**
- Abre: `http://127.0.0.1:5500/recuperar-password.html`
- Ingresa tu email de prueba
- Click en "Enviar Código"
- ✅ Verifica que llegue el email

**3. Revisar logs del servidor:**
```bash
[RECUPERACIÓN] Código generado para test@example.com: 123456
[EMAIL] Código de recuperación enviado a test@example.com
✅ Email enviado a test@example.com
```

**4. Cambiar contraseña:**
- Serás redirigido a `cambiar-password.html`
- Verás tu email mostrado
- Ingresa el código que recibiste (6 dígitos)
- Ingresa tu nueva contraseña
- Confirma la contraseña
- Click en "Cambiar Contraseña"
- ✅ Mensaje de éxito

**5. Verificar:**
- Serás redirigido a login.html
- Inicia sesión con tu nueva contraseña
- ✅ Debe funcionar

---

## 🎨 CARACTERÍSTICAS DEL DISEÑO

### recuperar-password.html:
- ✅ Diseño limpio y profesional
- ✅ Colores del hostal (amarillo/naranja)
- ✅ Indicador de pasos (1-2-3)
- ✅ Información clara sobre el proceso
- ✅ Validación de email
- ✅ Mensajes de error y éxito
- ✅ Responsive (funciona en móviles)

### cambiar-password.html:
- ✅ Muestra el email al que se envió el código
- ✅ Campo especial para código de 6 dígitos
- ✅ Indicador de fortaleza de contraseña
- ✅ Solo acepta números en el código
- ✅ Botón para reenviar código
- ✅ Validación de contraseñas coincidentes
- ✅ Instrucciones claras
- ✅ Responsive

---

## 🔐 SEGURIDAD IMPLEMENTADA

### En el Frontend:
- ✅ Validación de formato de email
- ✅ Validación de código (solo números, 6 dígitos)
- ✅ Validación de longitud de contraseña (mínimo 6)
- ✅ Validación de contraseñas coincidentes
- ✅ Email guardado en localStorage (solo durante el proceso)
- ✅ Limpieza de datos después de completar

### En el Backend (ya implementado):
- ✅ Código aleatorio de 6 dígitos
- ✅ Expiración de 30 minutos
- ✅ Hash de contraseña con bcrypt
- ✅ Validación de código en BD
- ✅ Rate limiting (ya implementado en authController)
- ✅ Limpieza de tokens después de usar

---

## 💡 CARACTERÍSTICAS ESPECIALES

### Indicador de Fortaleza de Contraseña:
```
Roja   → Muy débil (menos de 6 caracteres)
Amarilla → Débil (6-7 caracteres)
Azul   → Media (8+ caracteres)
Verde  → Fuerte (8+ caracteres, mayúsculas, números)
```

### Botón de Reenviar Código:
- Click en "¿No recibiste el código? Reenviar"
- Genera un nuevo código
- Envía nuevo email
- Útil si el código expiró o no llegó

### Modo Desarrollo:
- Si `NODE_ENV=development`, el código se muestra en la consola
- Útil para testing sin necesidad de revisar email
- En producción no se muestra

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Problema 1: No me llega el email
**Solución:**
1. Verifica que Resend esté configurado correctamente
2. Revisa la carpeta de spam
3. Verifica los logs del servidor
4. Asegúrate que el email sea válido

### Problema 2: El código dice "inválido o expirado"
**Solución:**
1. Solicita un nuevo código (botón Reenviar)
2. Verifica que ingresaste los 6 dígitos correctamente
3. Recuerda que expira en 30 minutos

### Problema 3: Las contraseñas no coinciden
**Solución:**
1. Escribe la misma contraseña en ambos campos
2. Ten cuidado con mayúsculas/minúsculas
3. Asegúrate de no tener espacios

### Problema 4: Error de conexión
**Solución:**
1. Verifica que el backend esté corriendo (`npm start`)
2. Verifica que config.js tenga la URL correcta
3. Revisa la consola del navegador (F12)

---

## 📊 LOGS Y DEBUGGING

### En el navegador (Consola F12):
```javascript
// Si estás en desarrollo, verás:
🔑 CÓDIGO DE DESARROLLO: 123456
```

### En el servidor (Terminal):
```bash
[RECUPERACIÓN] Código generado para user@example.com: 123456
[EMAIL] Código de recuperación enviado a user@example.com
✅ Email enviado a user@example.com: <mensaje-id>
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

Antes de considerar completa la implementación:

- [ ] Archivo `recuperar-password.html` en FrontEnd/
- [ ] Archivo `cambiar-password.html` en FrontEnd/
- [ ] Archivo `recuperar-password.js` en FrontEnd/js/
- [ ] Modificación agregada a `login.html`
- [ ] Backend tiene campos resetToken (ejecutar agregarcampos.js)
- [ ] Config.js está correctamente configurado
- [ ] Servidor corriendo y conectado
- [ ] Resend configurado con API key válida
- [ ] Email FROM configurado

### Test funcional:
- [ ] Puedo solicitar código desde recuperar-password.html
- [ ] Recibo el email con el código
- [ ] Soy redirigido a cambiar-password.html
- [ ] Puedo ingresar el código
- [ ] Puedo cambiar mi contraseña
- [ ] Soy redirigido a login.html
- [ ] Puedo iniciar sesión con la nueva contraseña

---

## 🎉 ¡SISTEMA COMPLETO!

Ahora tienes un sistema profesional de recuperación de contraseña con:
- ✅ 2 páginas HTML con diseño profesional
- ✅ JavaScript con toda la lógica
- ✅ Validaciones del lado del cliente
- ✅ Integración completa con el backend
- ✅ Envío de emails real con Resend
- ✅ Indicadores visuales de progreso
- ✅ Seguridad implementada
- ✅ Responsive para móviles

---

## 📞 SOPORTE

Si tienes problemas:
1. Revisa los logs del servidor
2. Revisa la consola del navegador (F12)
3. Verifica que todos los archivos estén en su lugar
4. Asegúrate que el backend esté corriendo
5. Verifica la configuración de Resend

---

**¡Listo para usar! 🚀**
