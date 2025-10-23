"use client"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { AuthProvider, useAuth } from "./shared/context/AuthContext"
import { ThemeProvider } from "./shared/context/ThemeContext"
import { SessionProvider } from "./shared/context/SessionContext"
import LoadingScreen from "./shared/components/LoadingScreen"
import LoginPage from "./modules/login/pages/LoginPage"
import ForgotPasswordPage from "./modules/forgot-password/pages/ForgotPasswordPage"
import DashboardLayout from "./modules/dashboard/layouts/DashboardLayout"
import DashboardHome from "./modules/dashboard/pages/DashboardHome"
import SessionAlerts from "./shared/components/SessionAlerts"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />
}

function AppContent() {
  const { showLoadingScreen, loadingMessage, loadingDestination } = useAuth()

  return (
    <>
      <SessionAlerts />
      <AnimatePresence>
        {showLoadingScreen && <LoadingScreen message={loadingMessage} destination={loadingDestination} />}
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
          <SessionProvider>
            <AppContent />
          </SessionProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  )
}

export default App