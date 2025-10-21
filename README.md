# ILCA - Pure Innovación Móvil

Sistema de autenticación y dashboard con gestión de múltiples bases de datos por usuario.
en base al tiempo se ira agg funcionalidades, este solo es un resumen de como se inicio..

## 📋 Descripción

Aplicación web moderna desarrollada con React + Vite que implementa un sistema de login, recuperación de contraseña y dashboard con las siguientes características:

- **Autenticación por usuario**: Cada usuario tiene asignada una base de datos específica
- **Simulación de BD con JSON**: Sistema completo de datos simulados para desarrollo
- **Diseño moderno y animado**: Interfaz elegante con colores verde eléctrico
- **Totalmente responsive**: Funciona perfectamente en móvil, tablet y desktop
- **Arquitectura modular**: Código organizado por módulos con separación de responsabilidades

## 🚀 Tecnologías Utilizadas

### Core
- **React**: ^18.3.1 - Librería principal para la UI
- **React DOM**: ^18.3.1 - Renderizado de componentes
- **Vite**: ^5.4.10 - Build tool y dev server ultrarrápido

### Routing y Navegación
- **React Router DOM**: ^6.26.2 - Manejo de rutas y navegación

### UI y Animaciones
- **Framer Motion**: ^11.11.17 - Animaciones fluidas y profesionales
- **Lucide React**: ^0.454.0 - Iconos modernos y consistentes

### Desarrollo
- **@vitejs/plugin-react**: ^4.3.3 - Plugin de Vite para React
- **@types/react**: ^18.3.12 - Tipos de TypeScript para React
- **@types/react-dom**: ^18.3.1 - Tipos de TypeScript para React DOM

## 📁 Estructura del Proyecto

\`\`\`
ilca-pure-innovacion-movil/
├── public/
│   └── logo-pure.png                    # Logo de la empresa
├── src/
│   ├── modules/                         # Módulos de la aplicación
│   │   ├── login/                       # Módulo de Login
│   │   │   ├── api/
│   │   │   │   └── authApi.js          # API de autenticación
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.jsx       # Formulario de login
│   │   │   │   ├── LoginForm.css
│   │   │   │   ├── LoginIllustration.jsx  # Ilustración animada
│   │   │   │   └── LoginIllustration.css
│   │   │   ├── controllers/
│   │   │   │   └── useLoginController.js   # Lógica del login
│   │   │   └── pages/
│   │   │       ├── LoginPage.jsx       # Página principal de login
│   │   │       └── LoginPage.css
│   │   │
│   │   ├── forgot-password/             # Módulo de Recuperación de Contraseña
│   │   │   ├── api/
│   │   │   │   └── forgotPasswordApi.js
│   │   │   ├── components/
│   │   │   │   ├── ForgotPasswordForm.jsx
│   │   │   │   └── ForgotPasswordForm.css
│   │   │   ├── controllers/
│   │   │   │   └── useForgotPasswordController.js
│   │   │   └── pages/
│   │   │       ├── ForgotPasswordPage.jsx
│   │   │       └── ForgotPasswordPage.css
│   │   │
│   │   └── dashboard/                   # Módulo de Dashboard
│   │       ├── components/
│   │       │   ├── Sidebar.jsx         # Barra lateral de navegación
│   │       │   ├── Sidebar.css
│   │       │   ├── Header.jsx          # Encabezado del dashboard
│   │       │   └── Header.css
│   │       ├── layouts/
│   │       │   ├── DashboardLayout.jsx # Layout principal
│   │       │   └── DashboardLayout.css
│   │       └── pages/
│   │           ├── DashboardHome.jsx   # Página principal del dashboard
│   │           └── DashboardHome.css
│   │
│   ├── shared/                          # Recursos compartidos
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # Contexto de autenticación
│   │   └── data/                        # Datos simulados (JSON)
│   │       ├── users.json              # Base de datos de usuarios
│   │       └── databases/              # Bases de datos por usuario
│   │           ├── db_ilca_principal.json
│   │           ├── db_pure_clientes.json
│   │           ├── db_innovacion_movil.json
│   │           └── db_pure_ecuador.json
│   │
│   ├── App.jsx                          # Componente principal
│   ├── main.jsx                         # Punto de entrada
│   └── index.css                        # Estilos globales
│
├── index.html                           # HTML principal
├── package.json                         # Dependencias y scripts
├── vite.config.js                       # Configuración de Vite
└── README.md                            # Este archivo
\`\`\`

## 🔧 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
   \`\`\`bash
   # Si tienes el proyecto en GitHub
   git clone [URL_DEL_REPOSITORIO]
   cd ilca-pure-innovacion-movil
   \`\`\`

2. **Instalar dependencias**
   \`\`\`bash
   npm install
   \`\`\`

3. **Iniciar el servidor de desarrollo**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Abrir en el navegador**
   - El proyecto se abrirá automáticamente en `http://localhost:5173`
   - Si no se abre automáticamente, copia la URL de la terminal

### Scripts Disponibles

\`\`\`bash
# Desarrollo - Inicia el servidor de desarrollo
npm run dev

# Producción - Construye la aplicación para producción
npm run build

# Preview - Previsualiza la build de producción
npm run preview
\`\`\`

## 👤 Usuarios de Prueba

El sistema incluye 4 usuarios de prueba, cada uno con su propia base de datos:

### Usuario 1: Administrador ILCA
- **Email**: admin@ilca.com
- **Contraseña**: admin123
- **Base de datos**: db_ilca_principal
- **Rol**: admin

### Usuario 2: Usuario Pure 1
- **Email**: usuario1@pure.com
- **Contraseña**: user123
- **Base de datos**: db_pure_clientes
- **Rol**: user

### Usuario 3: Gerente Innovación
- **Email**: gerente@innovacion.com
- **Contraseña**: gerente123
- **Base de datos**: db_innovacion_movil
- **Rol**: manager

### Usuario 4: Info Pure Ecuador
- **Email**: info@pure.ec
- **Contraseña**: pure2024
- **Base de datos**: db_pure_ecuador
- **Rol**: user

## 🎨 Características del Diseño

### Colores
- **Verde Principal**: #8bc34a
- **Verde Eléctrico**: #76ff03
- **Verde Oscuro**: #689f38
- **Fondo Oscuro**: #1a1a1a
- **Tarjetas**: rgba(30, 30, 30, 0.85) con blur

### Animaciones
- Logo con movimiento flotante (arriba y abajo)
- Transiciones suaves en todos los elementos
- Efectos hover en botones y tarjetas
- Animaciones de entrada con Framer Motion

### Responsive
- **Desktop**: Layout completo con sidebar expandido
- **Tablet**: Sidebar colapsable
- **Mobile**: Sidebar overlay con menú hamburguesa

## 🔐 Funcionamiento del Sistema de Autenticación

### 1. Login
1. El usuario ingresa email y contraseña
2. El sistema valida las credenciales contra `users.json`
3. Si es válido, carga la base de datos asignada al usuario
4. Guarda la sesión en localStorage
5. Redirige al dashboard

### 2. Recuperación de Contraseña
1. El usuario ingresa su email
2. El sistema verifica si el email existe
3. Simula el envío de un correo de recuperación
4. Muestra mensaje de éxito

### 3. Dashboard
1. Muestra datos específicos de la base de datos del usuario
2. Estadísticas personalizadas
3. Actividades recientes
4. Módulos disponibles según la BD

## 🔌 Integración con API Real

El código incluye funciones comentadas para integración con API real. Para activarlas:

### En `src/modules/login/api/authApi.js`:

\`\`\`javascript
// Descomenta esta función y úsala en lugar de loginUser
export const loginUserAPI = async (email, password) => {
  try {
    const response = await fetch('https://tu-api.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      throw new Error('Error en la autenticación')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en loginUserAPI:', error)
    throw error
  }
}
\`\`\`

### Pasos para integrar tu API:

1. Reemplaza `'https://tu-api.com/api/auth/login'` con tu URL real
2. Ajusta el formato de la respuesta según tu backend
3. Actualiza el controlador para usar `loginUserAPI` en lugar de `loginUser`
4. Implementa el manejo de tokens JWT si es necesario

## 📱 Características Responsive

### Breakpoints
- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px

### Adaptaciones por Dispositivo

#### Desktop
- Sidebar siempre visible
- Layout de dos columnas en login
- Grid de 4 columnas en estadísticas

#### Tablet
- Sidebar colapsable
- Layout adaptativo
- Grid de 2 columnas

#### Mobile
- Sidebar overlay
- Layout de una columna
- Grid de 1 columna
- Menú hamburguesa

## 🎯 Próximos Pasos

Para continuar el desarrollo:

1. **Integrar API Real**
   - Implementar las funciones comentadas
   - Agregar manejo de tokens JWT
   - Implementar refresh tokens

2. **Agregar Más Páginas**
   - Gestión de usuarios
   - Gestión de proyectos
   - Reportes y analytics
   - Configuración de perfil

3. **Mejorar Seguridad**
   - Implementar 2FA
   - Agregar rate limiting
   - Validación de sesiones

4. **Optimizaciones**
   - Lazy loading de componentes
   - Code splitting
   - Optimización de imágenes

## 🐛 Solución de Problemas

### El servidor no inicia
\`\`\`bash
# Limpia node_modules y reinstala
rm -rf node_modules package-lock.json
npm install
npm run dev
\`\`\`

### Error de puerto en uso
\`\`\`bash
# Vite usa el puerto 5173 por defecto
# Si está ocupado, Vite automáticamente usará el siguiente disponible
# O puedes especificar uno manualmente en vite.config.js
\`\`\`

### Las imágenes no cargan
- Verifica que las imágenes estén en la carpeta `public/`
- Asegúrate de usar rutas absolutas: `/logo-pure.png`

## 📄 Licencia

Este proyecto es propiedad de ILCA - Pure Innovación Móvil.

## 👨‍💻 Soporte

Para soporte técnico o consultas:
- Email: arce1060@gmail.com - Tnlgo Erick Arce
- Numero De telefono: 0962621487

---
## 📂 Estructura de archivos del docker:
ilca-pure-innovacion-movil/
├── Dockerfile              # Para desarrollo
├── Dockerfile.prod         # Para producción
├── docker-compose.yml      # Docker Compose desarrollo
├── docker-compose.prod.yml # Docker Compose producción
├── nginx.conf             # Configuración de Nginx
├── .dockerignore          # Archivos a ignorar
├── package.json
├── vite.config.js
└── src/
## 🐳 Instalación de Docker en Windows 11

Este documento explica paso a paso cómo instalar **Docker Desktop** en **Windows 11**, habilitar WSL2 y verificar que la instalación funcione correctamente.

---

## 📋 Requisitos previos

Antes de comenzar, asegúrate de cumplir con lo siguiente:

- Windows 11 **Pro**, **Enterprise** o **Education**
- **Virtualización habilitada** en la BIOS
- **WSL2 (Windows Subsystem for Linux)** disponible
- Conexión a Internet

---

## ⚙️ 1. Habilitar WSL2

Docker Desktop usa WSL2 como backend para ejecutar contenedores.  
Para instalarlo, abre **PowerShell como administrador** y ejecuta:

```powershell
wsl --install


##🧩 2. Descargar Docker Desktop

##Descarga el instalador desde el sitio oficial:
🔗 https://www.docker.com/products/docker-desktop
##Ejecuta el archivo descargado y sigue los pasos del asistente:
##Acepta los términos de licencia.
##Deja marcada la opción "Use WSL 2 instead of Hyper-V".
##Haz clic en Next → Install.
##Espera a que finalice y, si es necesario, reinicia tu computadora.

## 3. Abre Docker Desktop desde el menú Inicio.

##Cuando Docker esté listo, verás en la esquina inferior:

##Docker Engine is running


##Ahora ejecutar proyecto:
--lanzar en desarrollo 
*Para desarrollo:
docker-compose up

--lanzar en produccion
*para produccion:
docker-compose -f docker-compose.prod.yml up -d


--Reconstruir:
docker-compose build --no-cache

**Desarrollado con ❤️ por ILCA - Pure Innovación Móvil**
