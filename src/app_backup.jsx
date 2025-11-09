"use client"
import { useEffect, useRef } from "react"
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
import ForgotPasswordPage from "./modules/forgot-password/pages/ForgotPasswordPage"
import DashboardLayout from "./modules/dashboard/layouts/DashboardLayout"
import DashboardHome from "./modules/dashboard/pages/DashboardHome"
import OptionsPurePage from "./modules/dashboard/secure_pure/options"
import SessionAlerts from "./shared/components/SessionAlerts"

// Flag compartida para evitar múltiples redirecciones en bucle
const redirectState = { isRedirecting: false }

// Helper seguro para reemplazar URL y evitar retroceder
function safeReplaceToLogin() {
  if (redirectState.isRedirecting) return
  redirectState.isRedirecting = true
  try {
    window.location.replace('/login')
  } catch (e) {
    window.location.href = '/login'
  }
}

// 🔒 TODAS LAS RUTAS REQUIEREN AUTENTICACIÓN (excepto login y forgot-password)
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

    // En casos de expiración/expulsión forzamos reemplazo de historial para evitar volver con "atrás"
    if (showExpireModal || sessionExpired) {
      safeReplaceToLogin()
      return null
    }

    // Para redirecciones normales de ruteo interno hacemos Replace (no apilamos entrada)
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  console.log("✅ ProtectedRoute: Acceso permitido a", location.pathname)
  return children
}

// 🔓 SOLO para Login y Forgot Password - Si ya está autenticado, redirige al dashboard
const AuthOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) {
    console.log("⏳ AuthOnlyRoute: Verificando autenticación...")
    return <div>Cargando...</div>
  }

  // ✅ Si está autenticado, redirigir al dashboard
  if (isAuthenticated && user) {
    console.log("✅ AuthOnlyRoute: Usuario ya autenticado - Redirigiendo a dashboard")
    return <Navigate to="/dashboard" replace />
  }

  console.log("✅ AuthOnlyRoute: Acceso a página de autenticación permitido")
  return children
}

function NavigationBlocker() {
  const navigate = useNavigate()
  const location = useLocation()
  const lastHandledRef = useRef(0)

  useEffect(() => {
    const handlePopState = () => {
      const now = Date.now()
      if (now - lastHandledRef.current < 120) return // debounce para evitar ejecuciones repetidas
      lastHandledRef.current = now

      const auth = localStorage.getItem('auth')
      if (!auth && location.pathname !== '/login' && location.pathname !== '/forgot-password') {
        console.log('🚫 Bloqueando navegación - Sesión cerrada (NavigationBlocker)')
        if (!redirectState.isRedirecting) {
          redirectState.isRedirecting = true
          navigate('/login', { replace: true })
          // liberamos el flag luego de la navegación
          setTimeout(() => { redirectState.isRedirecting = false }, 400)
        }
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
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
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isAuthenticated])

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

  // Aseguramos que cuando estemos en /login se intente limpiar la entrada del historial
  useEffect(() => {
    if (location.pathname === '/login') {
      try {
        window.history.replaceState(null, '', '/login')
      } catch (e) {
        console.warn('No se pudo limpiar history state:', e)
      }
      // liberamos el flag si estaba bloqueado
      setTimeout(() => { redirectState.isRedirecting = false }, 300)
    }
  }, [location.pathname])

  return (
    <>
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
        {/* 🔓 ÚNICAS RUTAS SIN PROTECCIÓN: Login y Forgot Password */}
        <Route
          path="/login"
          element={
            <AuthOnlyRoute>
              <LoginPage />
            </AuthOnlyRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthOnlyRoute>
              <ForgotPasswordPage />
            </AuthOnlyRoute>
          }
        />

        {/* 🔒 TODAS LAS DEMÁS RUTAS REQUIEREN AUTENTICACIÓN */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="secure_pure/options" element={<OptionsPurePage />} />
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