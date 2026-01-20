# 🏨 Sistema Full Stack - Hostal Los Girasoles

Sistema integral de gestión para hostal con temática visual amarilla/naranja. Esta solución combina un **Frontend** responsivo basado en Bootstrap con un **Backend** robusto en Node.js, incluyendo persistencia en base de datos SQLite y gestión de archivos.

---

## 📁 Estructura del Proyecto

Según la disposición actual de archivos y carpetas:

HOSTAL-APP/
├── BackEnd/                        # --- NÚCLEO DEL SERVIDOR ---
│   ├── config/                     # Configuraciones de conexión y globales
│   ├── controllers/                # Lógica de procesamiento de datos
│   │   ├── authController.js       # Registro y login de usuarios
│   │   ├── habitacionesController.js # CRUD y catálogo de habitaciones
│   │   └── reservasController.js   # Gestión de solicitudes y pagos
│   ├── middlewares/                # Filtros de seguridad y procesos intermedios
│   │   ├── auth.js                 # Verificación de JWT y roles (Admin/Cliente)
│   │   └── upload.js               # Configuración de Multer para imágenes/PDFs
│   ├── routes/                     # Definición de Endpoints API
│   │   ├── auth.routes.js          # Rutas de autenticación
│   │   ├── habitaciones.routes.js  # Rutas de inventario
│   │   └── reservas.routes.js      # Rutas de transacciones
│   ├── uploads/                    # Almacenamiento de comprobantes subidos
│   ├── .env                        # Variables de entorno (Privado)
│   ├── crearAdmin.js               # Script para inicializar el administrador
│   ├── hostal.db                   # Base de datos SQLite (Archivo local)
│   ├── package.json                # Dependencias del servidor
│   ├── resetAdmin.js               # Script para resetear credenciales
│   ├── server.js                   # Punto de entrada principal (Express)
│   └── verDatos.js                 # Script para auditar la DB por consola
│
├── public/                         # --- INTERFAZ DE USUARIO ---
│   ├── assets/                     # Imágenes del hostal y habitaciones
│   ├── css/                        
│   │   ├── bootstrap.min.css       # Estilos base de Bootstrap
│   │   └── style.css               # Estilos personalizados (Amarillo/Naranja)
│   ├── js/                         
│   │   ├── auth.js                 # Comunicación con API de identidad
│   │   ├── reservas.js             # Lógica de envío de reservas y totales
│   │   ├── admin.js                # Lógica de gestión para el administrador
│   │   └── validaciones.js         # Validaciones generales de formularios
│   ├── habitaciones.html           # Catálogo de cuartos
│   ├── index.html                  # Página principal (Landing)
│   ├── login.html                  # Acceso de usuarios
│   ├── panel_admin.html            # Dashboard administrativo
│   ├── panel_cliente.html          # Dashboard de cliente
│   ├── registro.html               # Creación de cuentas
│   └── package.json                # Dependencias del lado cliente
│
└── README.md                       # Documentación técnica

```

---

## 🚀 Instalación y Puesta en Marcha

### 1. Requisitos

* Node.js instalado (v16 o superior).
* Un navegador moderno.

### 2. Configuración del Backend

Accede a la carpeta `BackEnd/` e instala las dependencias:

```bash
cd BackEnd
npm install

```

### 3. Preparación de la Base de Datos

Para configurar el sistema por primera vez, utiliza los scripts incluidos:

* **Crear Administrador**: `node BackEnd/crearAdmin.js` (Crea el usuario raíz).
* **Resetear Datos**: `node BackEnd/resetAdmin.js` (En caso de pérdida de acceso).

### 4. Lanzamiento del Servidor

Desde la raíz o la carpeta BackEnd, ejecuta:

```bash
node server.js

```

El sistema estará disponible por defecto en `http://localhost:3000`.

---

## 🎨 Características del Diseño

### Paleta de Colores

* **Primario**: `#ffc107` (Amarillo) - Calidez y luz.
* **Secundario**: `#ff9800` (Naranja) - Energía y acción.
* **Acento**: `#ff6f00` (Naranja oscuro) - Botones y énfasis.

### Estados de Reservas

* 🟢 **Aprobado**: El administrador ha confirmado el pago.
* 🔴 **Rechazado**: El pago no es válido o hay conflicto de fechas.
* 🟠 **Pendiente**: Esperando revisión del comprobante.

---

## 📄 Páginas y Funcionalidades

### 1. **index.html** - Página de Inicio

* Hero banner con fotos del hostal.
* Información de servicios: Wi-Fi, Desayuno, Ubicación.
* Sección "Sobre Nosotros".

### 2. **habitaciones.html** - Catálogo

* Listado dinámico de habitaciones cargadas desde la base de datos.
* Filtros por precio y capacidad.
* Tarjetas informativas con descripción detallada.

### 3. **registro.html** / **login.html**

* Creación de cuenta con validación de roles.
* Autenticación segura y persistencia de sesión.

### 4. **panel_cliente.html** - Panel del Cliente

* **Formulario de Reserva**: Cálculo automático de noches y total.
* **Subida de Comprobante**: Carga de imagen para validación administrativa.
* **Historial**: Vista clara de estancias pasadas y futuras.

### 5. **panel_admin.html** - Panel Administrativo

* **Dashboard**: Estadísticas de ocupación y ganancias.
* **Gestión**: Lista de reservas para aprobar o rechazar con un clic.
* **Inventario**: CRUD completo para añadir o quitar habitaciones.

---

## ✅ Validaciones Implementadas

### Formularios de Usuario

* ❌ **Campos vacíos**: No permite envío si faltan datos.
* ❌ **Email**: Validación de formato `@dominio.com`.
* ❌ **Seguridad**: Contraseñas con longitud mínima de 6 caracteres.

### Módulo de Reservas

* ❌ **Fechas**: La fecha de salida no puede ser menor a la de entrada.
* ❌ **Pasado**: No se pueden realizar reservas en fechas anteriores al día actual.
* ❌ **Archivos**: Filtro de subida para aceptar únicamente JPG, PNG o PDF de máximo 5MB.

---

## 🔧 Detalles del Backend y API

### **Controladores (`controllers/`)**

* `authController.js`: Procesa el hashing de contraseñas y creación de tokens.
* `habitacionesController.js`: Conecta con `hostal.db` para traer el inventario en tiempo real.
* `reservasController.js`: Gestiona los estados de las transacciones.

### **Middlewares**

* `auth.js`: Protege los endpoints del backend para que solo el admin pueda ver todas las reservas.
* `upload.js`: Maneja el almacenamiento físico de archivos en la carpeta `/uploads`.

### **Rutas Principales**

* `POST /api/auth/login`: Inicio de sesión.
* `GET /api/habitaciones`: Catálogo público.
* `POST /api/reservas`: Envío de nueva solicitud con comprobante.
* `PUT /api/reservas/:id`: Actualización de estado (Solo Admin).

---

## 🐛 Resolución de Problemas

### Error de Conexión a Base de Datos

* Asegúrate de que el archivo `hostal.db` tenga permisos de lectura y escritura.
* Verifica que el script `crearAdmin.js` se haya ejecutado correctamente.

### Las imágenes no cargan

* Revisa que las fotos estén en `public/assets/` o en `BackEnd/uploads/` según corresponda.
* Verifica las rutas en los archivos HTML (deben ser relativas al servidor).

### El servidor no inicia

* Ejecuta `npm install` en la carpeta `BackEnd` para asegurar que todas las librerías (Express, SQLite3, Multer) estén instaladas.

---

## 🎓 Créditos e Integración

Desarrollado como solución Full Stack para el **Hostal El Refugio**.

* **Frontend**: HTML5, CSS3, JS Vanilla.
* **Backend**: Node.js, Express, SQLite.
* **Estilos**: Bootstrap 5.3.

---
