# ILCA - Pure Innovación Móvil

Sistema de autenticación y dashboard con gestión de múltiples bases de datos por usuario.

## 📋 LEVANTAR ILCA V2 
crear el .env dentro de api-laravel-ilca con el siguiente contenido
APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:kmDVWBz432md9UI0AXasrJckTnjm3cEu46rQBqWZqyM=
APP_DEBUG=true
APP_URL=http://localhost

LOG_CHANNEL=stack
LOG_LEVEL=debug

# # CONEXION PRINCIPAL (SQL Server)
DB_CONNECTION=sqlsrv
DB_HOST=host.docker.internal #aqui remplazar con el host que tengan creado en su sqlserver
DB_PORT=1434
DB_DATABASE=RT_Secury_PRD
DB_USERNAME=sa
DB_PASSWORD=Password123!
DB_CHARSET=utf8
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=true



# CONEXION SECUNDARIA
# DB1_CONNECTION=sqlsrv
# DB1_HOST=192.168.100.58
# DB1_PORT=1433
# DB1_DATABASE=RT_Cia1REG
# DB1_USERNAME=regasaManager
# DB1_PASSWORD=regasa
# DB1_TRUST_SERVER_CERTIFICATE=true


# DB_CONNECTION=sqlsrv
# DB_HOST=192.168.1.116
# DB_PORT=1433
# DB_DATABASE=RT_Secury
# DB_USERNAME=RTK
# DB_PASSWORD=ROUTE

# DB1_CONNECTION=sqlsrv
# DB1_HOST=192.168.1.116
# DB1_PORT=1433
# DB1_DATABASE=RT_Cia1
# DB1_USERNAME=RTK
# DB1_PASSWORD=ROUTE

# (Opcional) Conexión PostgreSQL — puedes activarla cuando la necesites
# DB2_CONNECTION=pgsql
# DB2_HOST=192.168.100.60
# DB2_PORT=5432
# DB2_DATABASE=MiBasePG
# DB2_USERNAME=postgres
# DB2_PASSWORD=postgres

# REDIS
CACHE_DRIVER=redis
REDIS_CLIENT=phpredis
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

# SESIONES / COLAS
# SESSION_DRIVER=database
# SESSION_LIFETIME=120
# QUEUE_CONNECTION=database

SESSION_DRIVER=file
SESSION_LIFETIME=120
QUEUE_CONNECTION=sync



# CORREO (solo ejemplo)

MAIL_MAILER=smtp
#MAIL_HOST=smtp.postmarkapp.com
MAIL_HOST=email-smtp.us-east-1.amazonaws.com
MAIL_PORT=587
#MAIL_USERNAME=019e72f9-1d34-4c90-a973-a75294cefc05
MAIL_USERNAME=AKIA2L3UV3C24MMUNNWN
#MAIL_PASSWORD=019e72f9-1d34-4c90-a973-a75294cefc05
MAIL_PASSWORD=BK/dVQsqqRnScfjvyc9i5RSeAskq9TzbCTSsQYrRjcrI
MAIL_ENCRYPTION=tls


MAIL_FROM_ADDRESS=info@pure.ec
MAIL_FROM_NAME="Pure Technology"




JWT_SECRET=vCL2kJ5jTT80sDVAToUWeqHiT4ghsmESdklKn2sWZ9JYZVRECavvTc5Orrgh0uTO

CREAR EL .env DENTRO DE LA CARPETA ilca-2 CON EL SIGUIENTE CONTENIDO
# URL del backend (por ejemplo, Laravel API)
VITE_API_URL=http://localhost:8000 /SI ES PRODUCCION O DEPENDE DONDE ESTE EJECUTABDO EL BACKENN CAMBIAR LA IP(PERO EN ESTE CASO SI SE LEVANTAN LOS DOS DEJARLO EN LOCALHOST)

# Puerto donde correrá el frontend (Vite)
VITE_PORT=5173

# Modo de entorno
VITE_APP_ENV=development

# Clave para autenticación o JWT (si se usa)
VITE_JWT_SECRET=tu_clave_secreta_aqui

# Nombre de la aplicación
VITE_APP_NAME=ReactAppILCA

# Dirección del servidor (si usas Docker o despliegue remoto)
VITE_BACKEND_HOST=http://backend:8000

# Configuración de entorno
VITE_DEBUG=true

EJECUTAR EN UNA TERMINAL
- docker-compose up

EJECUTAR EN UNA SEGUNDA TERMINAL
docker compose logs -f

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
- **Pantalla de carga elegante**: Animación completa con logo flotante, fondo respirante y mensajes personalizados

### Responsive
- **Desktop**: Layout completo con sidebar expandido
- **Tablet**: Sidebar colapsable
- **Mobile**: Sidebar overlay con menú hamburguesa

## ✨ Pantalla de Carga Animada

El sistema incluye una pantalla de carga elegante y profesional que se muestra durante las transiciones:

### Características
- **Logo animado**: El logo de Pure Innovación Móvil flota suavemente de arriba a abajo
- **Fondo respirante**: Degradado verde con efecto de respiración (pulsación suave)
- **Círculos decorativos**: Tres círculos concéntricos con animaciones de escala y opacidad
- **Barra de progreso**: Indicador visual animado del progreso
- **Mensajes personalizados**: Texto dinámico según la acción (login, recuperación, etc.)
- **Destino de redirección**: Muestra hacia dónde se está redirigiendo al usuario

### Cuándo se muestra
- Durante el proceso de inicio de sesión
- Al enviar solicitud de recuperación de contraseña
- En cualquier navegación entre páginas importantes
- Durante operaciones que requieren tiempo de procesamiento

### Personalización
Para usar la pantalla de carga en otros módulos:

\`\`\`javascript
import { useAuth } from './shared/context/AuthContext'

const { showLoading, hideLoading } = useAuth()

// Mostrar pantalla de carga
showLoading("Procesando", "Página de destino")

// Ocultar pantalla de carga
hideLoading()
\`\`\`

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
- Email: info@pure.ec
- Sitio web: [Tu sitio web]

---

**Desarrollado con ❤️ por ILCA - Pure Innovación Móvil**
