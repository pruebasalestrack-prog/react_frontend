"use client"
import { lazy, Suspense, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { AuthProvider, useAuth } from "./shared/context/AuthContext"
import { ThemeProvider } from "./shared/context/ThemeContext"
import { SessionProvider } from "./shared/context/SessionContext"
import { SessionLockProvider, useSessionLock } from "./modules/session-lock/SessionLockContext"
import { NotificationProvider } from "./modules/dashboard/components/header/notifications/context/NotificationContext"
import NotificationContainer from "./modules/dashboard/components/header/notifications/components/NotificationContainer"
import NotificationPanel from "./modules/dashboard/components/header/notifications/components/NotificationPanel"
import NotificationHandler from "./modules/dashboard/components/header/notifications/components/NotificationHandler"
import SessionLockModal from "./modules/session-lock/SessionLockModal"
import LoadingScreen from "./shared/components/LoadingScreen"
import LoginPage from "./modules/login/pages/LoginPage"
import DashboardLayout from "./modules/dashboard/layouts/DashboardLayout"
import SessionAlerts from "./shared/components/SessionAlerts"
const SesionesActivas = lazy(() => import("./modules/dashboard/secury_pure/SesionesActivas/SesionesActivas"))

// 🔄 LAZY LOADING - Páginas del Dashboard
const DashboardHome = lazy(() => import("./modules/dashboard/pages/DashboardHome"))

// 🔐 LAZY LOADING - Páginas SecuryPure
const Opciones = lazy(() => import("./modules/dashboard/secury_pure/Opciones/Opciones"))
const Grupos = lazy(() => import("./modules/dashboard/secury_pure/Grupos/Grupos"))
const Roles = lazy(() => import("./modules/dashboard/secury_pure/Roles/Roles"))
const Companias = lazy(() => import("./modules/dashboard/secury_pure/Companias/Companias"))
const Usuarios = lazy(() => import("./modules/dashboard/secury_pure/Usuarios/Usuarios"))
const UsuariosCompanias = lazy(() => import("./modules/dashboard/secury_pure/UsuariosCompanias/UsuariosCompanias"))
const PerfilUsuario = lazy(() => import("./modules/dashboard/secury_pure/PerfilUsuario/PerfilUsuario"))
const Parametros = lazy(() => import("./modules/dashboard/secury_pure/Parametros/Parametros"))

// 🎨 Loader para páginas con lazy loading
const PageLoader = () => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: '400px',
    width: '100%'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '40px', 
        height: '40px', 
        border: '4px solid #f3f4f6',
        borderTop: '4px solid #3b82f6', 
        borderRadius: '50%',
        animation: 'spin 1s linear infinite', 
        margin: '0 auto 16px'
      }}></div>
      <p style={{ color: '#6b7280', fontSize: '14px' }}>Cargando página...</p>
    </div>
  </div>
)

// 🔒 TODAS LAS RUTAS REQUIEREN AUTENTICACIÓN (excepto login y reset password)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth()
  const { showExpireModal } = useSessionLock()
  const location = useLocation()
  
  const sessionExpired = typeof window !== "undefined" && localStorage.getItem('session_expired') === 'true'

  if (loading) {
    console.log("⏳ ProtectedRoute: Verificando autenticación...")
    return <div>Cargando...</div>
  }

  // 🚫 Si no está autenticado, redirigir a login
  if (!isAuthenticated || !user || showExpireModal || sessionExpired) {
    console.log("❌ ProtectedRoute: Sin autenticación - Redirigiendo a login")
    
    // Limpiar flags problemáticos
    if (sessionExpired) {
      localStorage.removeItem('session_expired')
    }
    
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  console.log("✅ ProtectedRoute: Acceso permitido a", location.pathname)
  return children
}

// 🔓 SOLO para Login y Reset Password - Si ya está autenticado, redirige al dashboard
const AuthOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth()
  const location = useLocation()

  if (loading) {
    console.log("⏳ AuthOnlyRoute: Verificando autenticación...")
    return <div>Cargando...</div>
  }

  // ✅ Si está autenticado Y NO es una ruta de reset password, redirigir al dashboard
  if (isAuthenticated && user && !location.pathname.includes('/password/reset/')) {
    console.log("✅ AuthOnlyRoute: Usuario ya autenticado - Redirigiendo a dashboard")
    return <Navigate to="/dashboard" replace />
  }

  console.log("✅ AuthOnlyRoute: Acceso a página de autenticación permitido")
  return children
}

function NavigationBlocker() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handlePopState = () => {
      const auth = localStorage.getItem('auth')
      const logoutReason = localStorage.getItem('logout_reason')
      
      // Permitir navegación en rutas públicas
      const publicRoutes = ['/login', '/password/reset']
      const isPublicRoute = publicRoutes.some(route => location.pathname.startsWith(route))
      
      if (!auth && logoutReason && !isPublicRoute) {
        console.log('🚫 Bloqueando navegación - Sesión cerrada')
        window.history.pushState(null, '', '/login')
        navigate('/login', { replace: true })
      }
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [navigate, location.pathname])

  return null
}

function SessionExpiredHandler() {
  const location = useLocation()
  
  useEffect(() => {
    const sessionExpired = localStorage.getItem('session_expired')
    
    if (sessionExpired === 'true' && location.pathname !== '/login') {
      console.log("🧹 Limpiando flag de sesión expirada")
      localStorage.removeItem('session_expired')
    }
  }, [location.pathname])
  
  return null
}

function PageReloadProtection() {
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!isAuthenticated) {
        console.log('🔄 Recarga detectada sin sesión activa')
        // NO eliminar logout_reason para que las notificaciones se procesen
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isAuthenticated])

  return null
}

// 🌐 Componente para ocultar elementos de Google Translate no deseados
function GoogleTranslateCleanup() {
  useEffect(() => {
    // Ocultar la barra superior de Google Translate
    const hideGoogleBar = () => {
      const iframe = document.querySelector('.goog-te-banner-frame')
      if (iframe) {
        iframe.style.display = 'none'
      }
      
      // Resetear el body top que Google Translate modifica
      document.body.style.top = '0'
      
      // Ocultar el widget flotante si aparece
      const floatWidget = document.querySelector('.goog-te-gadget')
      if (floatWidget && floatWidget.parentElement) {
        floatWidget.parentElement.style.display = 'none'
      }
    }

    // Ejecutar inmediatamente y cada segundo por 5 segundos
    hideGoogleBar()
    const interval = setInterval(hideGoogleBar, 1000)
    
    setTimeout(() => {
      clearInterval(interval)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return null
}

function AppContent() {
  const { showLoadingScreen, loadingMessage, loadingDestination, isAuthenticated, user } = useAuth()
  const location = useLocation()
  
  useEffect(() => {
    console.log("📊 Estado de autenticación actual:", {
      isAuthenticated,
      hasUser: !!user,
      userEmail: user?.email,
      currentPath: location.pathname
    })
  }, [isAuthenticated, user, location.pathname])

  useEffect(() => {
    const blockNavigation = () => {
      const auth = localStorage.getItem('auth')
      const publicRoutes = ['/login', '/password/reset']
      const isPublicRoute = publicRoutes.some(route => window.location.pathname.startsWith(route))
      
      if (!auth && !isPublicRoute) {
        window.history.pushState(null, '', '/login')
      }
    }

    window.addEventListener('popstate', blockNavigation)

    return () => {
      window.removeEventListener('popstate', blockNavigation)
    }
  }, [])
  
  return (
    <>
      {/* 🌐 Limpiador de Google Translate */}
      <GoogleTranslateCleanup />
      
      <SessionAlerts />
      <SessionExpiredHandler />
      <NavigationBlocker />
      <PageReloadProtection />
      <SessionLockModal />
      
      {/* 🔔 Sistema de Notificaciones */}
      <NotificationContainer />
      <NotificationPanel />
      <NotificationHandler />

      <AnimatePresence>
        {showLoadingScreen && (
          <LoadingScreen message={loadingMessage} destination={loadingDestination} />
        )}
      </AnimatePresence>

      <Routes>
        {/* 🔓 RUTAS SIN PROTECCIÓN: Login y Reset Password */}
        <Route
          path="/login"
          element={
            <AuthOnlyRoute>
              <LoginPage />
            </AuthOnlyRoute>
          }
        />
        
        {/* 🔓 Ruta de Reset Password con Token */}
        <Route
          path="/password/reset/:token"
          element={
            <AuthOnlyRoute>
              <LoginPage />
            </AuthOnlyRoute>
          }
        />

        {/* 🔒 TODAS LAS RUTAS DEL DASHBOARD REQUIEREN AUTENTICACIÓN */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* 🏠 Home del Dashboard */}
          <Route 
            index 
            element={
              <Suspense fallback={<PageLoader />}>
                <DashboardHome />
              </Suspense>
            } 
          />
          
          {/* 🔐 RUTAS SECURY PURE CON LAZY LOADING */}
          <Route 
            path="secm-0001" 
            element={
              <Suspense fallback={<PageLoader />}>
                <Opciones />
              </Suspense>
            } 
          />
          <Route 
            path="secm-0002" 
            element={
              <Suspense fallback={<PageLoader />}>
                <Grupos />
              </Suspense>
            } 
          />
          <Route 
            path="secm-0003" 
            element={
              <Suspense fallback={<PageLoader />}>
                <Roles />
              </Suspense>
            } 
          />
          <Route 
            path="secm-0004" 
            element={
              <Suspense fallback={<PageLoader />}>
                <Companias />
              </Suspense>
            } 
          />
          <Route 
            path="secm-0005" 
            element={
              <Suspense fallback={<PageLoader />}>
                <Usuarios />
              </Suspense>
            } 
          />
          <Route 
            path="secm-0006" 
            element={
              <Suspense fallback={<PageLoader />}>
                <UsuariosCompanias />
              </Suspense>
            } 
          />
          <Route 
            path="secm-0007" 
            element={
              <Suspense fallback={<PageLoader />}>
                <PerfilUsuario />
              </Suspense>
            } 
          />
          <Route 
            path="secm-0008" 
            element={
              <Suspense fallback={<PageLoader />}>
                <Parametros />
              </Suspense>
            } 
          />
          <Route 
            path="secm-0009" 
            element={
              <Suspense fallback={<PageLoader />}>
                <SesionesActivas />
              </Suspense>
            } 
          />

          {/* 🔙 COMPATIBILIDAD: Ruta legacy */}
          <Route 
            path="secure_pure/options" 
            element={<Navigate to="/dashboard/secm-0001" replace />} 
          />
        </Route>

        {/* 🔒 Cualquier otra ruta redirige a login si no está autenticado */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <NotificationProvider>
            <SessionProvider>
              <SessionLockProvider>
                <AppContent />
              </SessionLockProvider>
            </SessionProvider>
          </NotificationProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  )
}

export default App