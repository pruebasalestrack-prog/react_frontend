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

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth()
  const { showExpireModal } = useSessionLock()
  const location = useLocation()
  const navigate = useNavigate()
  const hasRedirectedRef = useRef(false)
  
  const sessionExpired = typeof window !== "undefined" && localStorage.getItem('session_expired') === 'true'

  useEffect(() => {
    // 🔒 Resetear flag al cambiar de ruta
    if (location.pathname === '/login') {
      hasRedirectedRef.current = false
    }
  }, [location.pathname])

  if (loading) {
    console.log("⏳ ProtectedRoute: Verificando autenticación...")
    return <div>Cargando...</div>
  }

  // 🚫 Prevenir múltiples redirecciones
  if (!isAuthenticated || !user || showExpireModal || sessionExpired) {
    if (!hasRedirectedRef.current) {
      hasRedirectedRef.current = true
      console.log("❌ ProtectedRoute: Redirigiendo a login")
      
      // Limpiar flags problemáticos
      if (sessionExpired) {
        localStorage.removeItem('session_expired')
      }
      
      // Usar setTimeout para evitar el bucle
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 0)
    }
    
    return <div>Redirigiendo...</div>
  }

  console.log("✅ ProtectedRoute: Acceso permitido a", location.pathname)
  return children
}

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const hasRedirectedRef = useRef(false)

  useEffect(() => {
    // 🔒 Resetear flag al cambiar de ruta
    if (location.pathname === '/dashboard') {
      hasRedirectedRef.current = false
    }
  }, [location.pathname])

  if (loading) {
    console.log("⏳ PublicRoute: Verificando autenticación...")
    return <div>Cargando...</div>
  }

  // ✅ Si está autenticado, redirigir al dashboard
  if (isAuthenticated && user) {
    if (!hasRedirectedRef.current) {
      hasRedirectedRef.current = true
      console.log("✅ PublicRoute: Usuario autenticado - Redirigiendo a dashboard")
      
      // Usar setTimeout para evitar el bucle
      setTimeout(() => {
        navigate('/dashboard', { replace: true })
      }, 0)
    }
    
    return <div>Redirigiendo al dashboard...</div>
  }

  console.log("✅ PublicRoute: Acceso a ruta pública permitido")
  return children
}

function NavigationBlocker() {
  const navigate = useNavigate()
  const location = useLocation()
  const isBlockingRef = useRef(false)

  useEffect(() => {
    const handlePopState = (e) => {
      if (isBlockingRef.current) return
      
      const auth = localStorage.getItem('auth')
      const logoutReason = localStorage.getItem('logout_reason')
      
      if (!auth && logoutReason && location.pathname !== '/login') {
        console.log('🚫 Bloqueando navegación - Sesión cerrada')
        e.preventDefault()
        
        isBlockingRef.current = true
        window.history.pushState(null, '', '/login')
        
        setTimeout(() => {
          navigate('/login', { replace: true })
          isBlockingRef.current = false
        }, 100)
      }
    }

    window.addEventListener('popstate', handlePopState)

    const auth = localStorage.getItem('auth')
    const logoutReason = localStorage.getItem('logout_reason')
    
    if (!auth && logoutReason && location.pathname !== '/login' && !isBlockingRef.current) {
      console.log('🚫 Sesión cerrada detectada - Redirigiendo a login')
      isBlockingRef.current = true
      
      setTimeout(() => {
        navigate('/login', { replace: true })
        isBlockingRef.current = false
      }, 100)
    }

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [navigate, location.pathname])

  return null
}

function SessionExpiredHandler() {
  const navigate = useNavigate()
  const location = useLocation()
  const hasHandledRef = useRef(false)
  
  useEffect(() => {
    if (hasHandledRef.current) return
    
    const sessionExpired = localStorage.getItem('session_expired')
    const logoutReason = localStorage.getItem('logout_reason')
    
    if (sessionExpired === 'true' && location.pathname !== '/login') {
      console.log("🧹 Limpiando flag de sesión expirada")
      localStorage.removeItem('session_expired')
      
      hasHandledRef.current = true
      window.history.replaceState(null, '', '/login')
      
      setTimeout(() => {
        navigate('/login', { replace: true })
        hasHandledRef.current = false
      }, 100)
    }
    else if (logoutReason && location.pathname !== '/login' && !hasHandledRef.current) {
      console.log("🔒 Logout detectado - Forzando a login")
      
      hasHandledRef.current = true
      window.history.replaceState(null, '', '/login')
      
      setTimeout(() => {
        navigate('/login', { replace: true })
        hasHandledRef.current = false
      }, 100)
    }
  }, [navigate, location.pathname])
  
  return null
}

function PageReloadProtection() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!isAuthenticated) {
        console.log('🔄 Recarga detectada sin sesión activa')
        localStorage.removeItem('logout_reason')
        localStorage.removeItem('session_expired')
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isAuthenticated])

  useEffect(() => {
    const auth = localStorage.getItem('auth')
    const logoutReason = localStorage.getItem('logout_reason')
    
    if (!auth && logoutReason) {
      console.log('🚫 Sesión inválida al cargar - Limpiando historial')
      window.history.replaceState(null, '', '/login')
      
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 100)
    }
  }, [navigate])

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
      if (!auth && window.location.pathname !== '/login' && window.location.pathname !== '/forgot-password') {
        window.history.pushState(null, '', '/login')
      }
    }

    blockNavigation()
    window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', blockNavigation)

    return () => {
      window.removeEventListener('popstate', blockNavigation)
    }
  }, [isAuthenticated])
  
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
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />

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