# 📧 Cómo Obtener tu API Key de Resend

## 🎯 ¿Por qué Resend?

- ✅ **100% Gratuito** para comenzar (3,000 emails/mes)
- ✅ **No requiere tarjeta** de crédito
- ✅ **Setup en 2 minutos**
- ✅ **Perfecto para Railway** (se integra perfectamente)
- ✅ **Emails transaccionales profesionales**

---

## 📝 PASO 1: Crear Cuenta

1. Ve a **https://resend.com**
2. Click en **"Sign Up"** (esquina superior derecha)
3. Opciones de registro:
   - Con GitHub (recomendado) ⭐
   - Con Google
   - Con email

4. Completa el registro
5. Verifica tu email

✅ **¡Cuenta creada!**

---

## 🔑 PASO 2: Obtener API Key

### 2.1 Acceder al Dashboard

1. Una vez logueado, verás el dashboard de Resend
2. En el menú lateral izquierdo, busca **"API Keys"**
3. Click en **"API Keys"**

### 2.2 Crear Nueva API Key

1. Click en el botón **"Create API Key"**
2. Te pedirá:

   **Name (Nombre):**
   \`\`\`
   Hostal Production
   \`\`\`
   
   **Permission (Permisos):**
   \`\`\`
   Sending access (Full access)
   \`\`\`

3. Click en **"Add"** o **"Create"**

### 2.3 Copiar la API Key

⚠️ **MUY IMPORTANTE:** La API key solo se muestra UNA VEZ.

1. Verás algo como:
   \`\`\`
   re_123abc456def789ghi012jkl345mno678
   \`\`\`

2. Click en **"Copy"** o selecciona y copia manualmente

3. **Guárdala en un lugar seguro** (notas, password manager)

4. Si la pierdes, deberás crear una nueva

---

## 📨 PASO 3: Configurar Email de Envío

### Opción A: Dominio de Prueba (Rápido, para testing)

**Email para usar:**
\`\`\`
onboarding@resend.dev
\`\`\`

**Ventajas:**
- ✅ Ya está verificado
- ✅ Funciona inmediatamente
- ✅ No requiere configuración DNS
- ✅ Perfecto para desarrollo

**Limitaciones:**
- ⚠️ Dice "via resend.dev" en el remitente
- ⚠️ Solo para pruebas (no usar en producción)

### Opción B: Tu Propio Dominio (Profesional)

Si tienes un dominio (ejemplo: midominio.com):

1. En Resend, ve a **"Domains"**
2. Click en **"Add Domain"**
3. Ingresa tu dominio: \`midominio.com\`
4. Resend te dará registros DNS para agregar:

   **Registro MX:**
   \`\`\`
   Nombre: @
   Tipo: MX
   Valor: feedback-smtp.us-east-1.amazonses.com
   Prioridad: 10
   \`\`\`

   **Registro TXT (SPF):**
   \`\`\`
   Nombre: @
   Tipo: TXT
   Valor: "v=spf1 include:amazonses.com ~all"
   \`\`\`

   **Registro CNAME (DKIM):**
   \`\`\`
   Nombre: resend._domainkey
   Tipo: CNAME
   Valor: resend._domainkey.resend.com
   \`\`\`

5. Agrega estos registros en tu proveedor de dominio:
   - GoDaddy
   - Namecheap
   - Cloudflare
   - Etc.

6. Espera 24-48 horas para verificación

7. Una vez verificado, podrás usar:
   \`\`\`
   noreply@midominio.com
   \`\`\`

---

## 🔧 PASO 4: Configurar en tu Proyecto

### 4.1 En Desarrollo (Local)

Edita tu archivo \`.env\`:

\`\`\`env
# Con dominio de prueba
RESEND_API_KEY=re_123abc456def789ghi012jkl345mno678
EMAIL_FROM=onboarding@resend.dev
EMAIL_FROM_NAME=Hostal El Refugio

# O con tu dominio verificado
RESEND_API_KEY=re_123abc456def789ghi012jkl345mno678
EMAIL_FROM=noreply@tudominio.com
EMAIL_FROM_NAME=Hostal El Refugio
\`\`\`

### 4.2 En Producción (Railway)

1. Ve a tu proyecto en Railway
2. Click en **Variables**
3. Agrega:

\`\`\`
RESEND_API_KEY = re_123abc456def789ghi012jkl345mno678
EMAIL_FROM = onboarding@resend.dev
EMAIL_FROM_NAME = Hostal El Refugio
\`\`\`

4. Railway redesplegará automáticamente

---

## ✅ PASO 5: Probar que Funciona

### 5.1 Test Rápido en Resend

1. En Resend, ve a **"Emails"**
2. Click en **"Send Test Email"**
3. Ingresa tu email personal
4. Click en **"Send"**
5. Revisa tu bandeja de entrada (y spam)

### 5.2 Test en tu Aplicación

1. Inicia tu servidor:
   \`\`\`bash
   npm start
   \`\`\`

2. Prueba recuperación de contraseña:
   - Ve a login
   - Click en "Olvidé mi contraseña"
   - Ingresa un email de prueba
   - Deberías recibir el código

3. Verifica en los logs del servidor:
   \`\`\`
   ✅ Email enviado a usuario@example.com: <mensaje-id>
   \`\`\`

---

## 🐛 Solución de Problemas

### Error: "Invalid API key"
**Causa:** API key incorrecta o expirada
**Solución:**
1. Verifica que copiaste bien la API key
2. Asegúrate que empieza con \`re_\`
3. Crea una nueva si es necesario

### Error: "Email address not verified"
**Causa:** Intentas usar un dominio no verificado
**Solución:**
1. Usa \`onboarding@resend.dev\` para testing
2. O verifica tu dominio en Resend

### Emails llegan a SPAM
**Causa:** Dominio no verificado o sin DKIM
**Solución:**
1. Verifica tu dominio en Resend
2. Configura correctamente SPF y DKIM
3. Envía desde \`onboarding@resend.dev\` mientras tanto

### Emails no llegan
**Causa 1:** API key incorrecta
- Verifica en .env

**Causa 2:** Límite alcanzado
- Revisa en Resend Dashboard → Usage
- Plan gratuito: 100 emails/día, 3,000/mes

**Causa 3:** Email bloqueado
- Algunos proveedores bloquean emails masivos
- Usa un email personal para testing

---

## 📊 Límites del Plan Gratuito

| Característica | Límite Gratuito |
|----------------|-----------------|
| Emails/día | 100 |
| Emails/mes | 3,000 |
| Dominios | 1 |
| API Keys | Ilimitadas |
| Webhooks | Sí |
| Logs | 30 días |

**Para este proyecto de hostal, el plan gratuito es más que suficiente.**

---

## 📈 Monitorear Uso

### Dashboard de Resend

1. Ve a **"Analytics"** en Resend
2. Verás:
   - Emails enviados hoy
   - Emails entregados
   - Tasa de apertura
   - Tasa de clicks
   - Rebotes

### Verificar en Logs

Cada vez que tu app envía un email, verás:

\`\`\`bash
✅ Email enviado a usuario@example.com: <mensaje-id>
\`\`\`

En Resend, puedes buscar por:
- Email del destinatario
- Fecha
- Estado (enviado, entregado, rebotado)

---

## 🎓 Recursos Adicionales

- **Documentación oficial:** https://resend.com/docs
- **API Reference:** https://resend.com/docs/api-reference
- **Discord de Resend:** https://discord.gg/resend
- **Ejemplos con Node.js:** https://resend.com/docs/send-with-nodejs

---

## 💡 Tips Pro

1. **Guarda tu API key en un password manager** (LastPass, 1Password, Bitwarden)

2. **Usa diferentes API keys para desarrollo y producción**
   - Desarrollo: "Hostal Dev"
   - Producción: "Hostal Production"

3. **Configura webhooks** para recibir eventos de tus emails
   - Email entregado
   - Email abierto
   - Link clickeado
   - Email rebotado

4. **Personaliza tus plantillas** en \`config/email.js\`
   - Logo de tu hostal
   - Colores de tu marca
   - Información de contacto

5. **Monitorea regularmente** tu uso en Resend
   - Asegúrate de no alcanzar los límites
   - Considera upgrade si creces

---

## 🎉 ¡Listo!

Ya tienes todo configurado para enviar emails desde tu aplicación.

**Siguiente paso:** Continuar con el deploy en Railway usando \`RAILWAY_DEPLOY.md\`

---

**¿Preguntas?** Revisa la documentación de Resend o contacta a su soporte.
