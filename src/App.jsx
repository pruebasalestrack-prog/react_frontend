"use client"
import { useEffect } from "react"
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
  
  const sessionExpired = typeof window !== "undefined" && localStorage.getItem('session_expired') === 'true'

  if (loading) {
    console.log("⏳ ProtectedRoute: Verificando autenticación...")
    return <div>Cargando...</div>
  }

  if (!isAuthenticated || !user) {
    console.log("❌ ProtectedRoute: Usuario no autenticado - Redirigiendo a login")
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (showExpireModal) {
    console.log("⏰ ProtectedRoute: Sesión expirada - Redirigiendo a login")
    return <Navigate to="/login" replace />
  }

  if (sessionExpired) {
    console.log("⏰ ProtectedRoute: Flag de sesión expirada - Redirigiendo a login")
    return <Navigate to="/login" replace />
  }

  console.log("✅ ProtectedRoute: Acceso permitido a", location.pathname)
  return children
}

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) {
    console.log("⏳ PublicRoute: Verificando autenticación...")
    return <div>Cargando...</div>
  }

  if (isAuthenticated && user) {
    console.log("✅ PublicRoute: Usuario autenticado - Redirigiendo a dashboard")
    return <Navigate to="/dashboard" replace />
  }

  console.log("✅ PublicRoute: Acceso a ruta pública permitido")
  return children
}

function SessionExpiredHandler() {
  const navigate = useNavigate()
  
  useEffect(() => {
    const sessionExpired = localStorage.getItem('session_expired')
    if (sessionExpired === 'true') {
      console.log("🧹 Limpiando flag de sesión expirada")
      localStorage.removeItem('session_expired')
      navigate('/login', { replace: true })
    }
  }, [navigate])
  
  return null
}

function AppContent() {
  const { showLoadingScreen, loadingMessage, loadingDestination, isAuthenticated, user } = useAuth()
  
  useEffect(() => {
    console.log("📊 Estado de autenticación actual:", {
      isAuthenticated,
      hasUser: !!user,
      userEmail: user?.email
    })
  }, [isAuthenticated, user])
  
  return (
    <>
      <SessionAlerts />
      <SessionExpiredHandler />
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