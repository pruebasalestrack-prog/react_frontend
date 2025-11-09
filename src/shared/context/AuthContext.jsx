"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { logoutApi } from "../../modules/login/api/authApi"
import { 
  transformToSidebarConfig, 
  optimizeGroups,
  analyzePermissions 
} from "../../../src/modules/dashboard/components/sidebar_personalizado/sidebarService"

// ✅ Crear el contexto
const AuthContext = createContext(null)

// Generar un ID de sesión único
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// 🔑 Verificar si existe un token válido
const getTokenFromStorage = () => {
  try {
    const authData = localStorage.getItem("auth")
    if (authData) {
      const parsed = JSON.parse(authData)
      if (parsed.token) {
        console.log("✅ Token encontrado en localStorage")
        return parsed.token
      }
    }
    console.log("⚠️ No se encontró token en localStorage")
    return null
  } catch (error) {
    console.error("❌ Error al obtener token:", error)
    return null
  }
}

// 🎨 Generar configuración de sidebar basada en la conexión seleccionada
const generateSidebarConfig = (userData, selectedConnection) => {
  if (!userData || !userData.companies || !selectedConnection) {
    console.log("⚠️ No se puede generar sidebar - Datos incompletos")
    return null
  }

  try {
    console.log("🎨 Generando sidebar para conexión:", selectedConnection)
    
    const sidebarConfig = transformToSidebarConfig(userData.companies, selectedConnection)
    
    if (sidebarConfig) {
      const optimizedConfig = {
        ...sidebarConfig,
        menuGroups: optimizeGroups(sidebarConfig.menuGroups)
      }

      // 📊 Debug en desarrollo
      if (process.env.NODE_ENV === 'development') {
        const analysis = analyzePermissions(userData.companies, selectedConnection)
        console.log("📊 Análisis de permisos:", analysis)
        console.log("🎨 Sidebar generado:", optimizedConfig)
      }

      return optimizedConfig
    }

    return null
  } catch (error) {
    console.error("❌ Error al generar sidebar:", error)
    return null
  }
}

// ✅ Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sessionId, setSessionId] = useState(null)
  const [showLoadingScreen, setShowLoadingScreen] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Cargando")
  const [loadingDestination, setLoadingDestination] = useState("")
  const [selectedConnection, setSelectedConnection] = useState(null)

  // 🚪 Logout mejorado con llamada a API y notificaciones
  const logout = useCallback(async (reason = 'manual') => {
    console.log('🚪 Ejecutando logout completo...', 'Razón:', reason)
    
    // 🔔 Guardar razón del logout para mostrar notificación después
    if (reason === 'session_expired') {
      localStorage.setItem('logout_reason', 'session_expired')
    } else if (reason === 'page_refresh') {
      localStorage.setItem('logout_reason', 'page_refresh')
    }
    
    // Llamar a la API de logout para invalidar token en el servidor
    try {
      await logoutApi()
      console.log('✅ Token invalidado en el servidor')
    } catch (error) {
      console.error('⚠️ Error en logout API:', error)
    }
    
    // Limpiar sesiones del usuario
    if (user && sessionId) {
      const allSessions = JSON.parse(localStorage.getItem("allSessions") || "{}")
      if (allSessions[user.email]) {
        allSessions[user.email] = allSessions[user.email].filter((id) => id !== sessionId)
        localStorage.setItem("allSessions", JSON.stringify(allSessions))
      }
    }
    
    // Limpiar estado local
    setUser(null)
    setIsAuthenticated(false)
    setSessionId(null)
    setSelectedConnection(null)
    
    // Limpiar localStorage completamente
    localStorage.removeItem('auth')
    localStorage.removeItem('user')
    localStorage.removeItem('sessionId')
    localStorage.removeItem('lastSelectedConnection')
    localStorage.removeItem('selectedConnection')
    localStorage.removeItem('session_lock_state')
    localStorage.removeItem('last_activity_time')
    localStorage.removeItem('session_lock_user')
    localStorage.removeItem('locked_at')
    localStorage.removeItem('expire_at')
    localStorage.removeItem('session_expired')
    
    console.log('✅ Logout completado - Usuario desautenticado')
  }, [user, sessionId])

  // 🔍 Verificar sesión y token al cargar
  useEffect(() => {
    console.log("🔍 Verificando autenticación al cargar...")
    
    // 🔔 Verificar si venimos de un refresh de página
    const wasRefreshed = sessionStorage.getItem('page_was_refreshed')
    if (wasRefreshed === 'true') {
      const token = getTokenFromStorage()
      if (!token) {
        console.log("🔄 Página refrescada sin token - Marcando para notificación")
        localStorage.setItem('logout_reason', 'page_refresh')
        sessionStorage.removeItem('page_was_refreshed')
      }
    }
    
    // Verificar si hay token
    const token = getTokenFromStorage()
    
    if (!token) {
      console.log("❌ No hay token - Usuario NO autenticado")
      setUser(null)
      setIsAuthenticated(false)
      setLoading(false)
      return
    }

    // Verificar si hay datos de usuario
    const savedUser = localStorage.getItem("user")
    const savedSessionId = localStorage.getItem("sessionId")
    const savedConnection = localStorage.getItem("selectedConnection")

    if (!savedUser || !savedSessionId) {
      console.log("⚠️ Falta información de usuario o sesión - Limpiando token")
      localStorage.removeItem("auth")
      setUser(null)
      setIsAuthenticated(false)
      setLoading(false)
      return
    }

    try {
      const userData = JSON.parse(savedUser)
      console.log("👤 Datos de usuario encontrados:", userData.email)

      // Verificar si hay sesiones múltiples
      const allSessions = JSON.parse(localStorage.getItem("allSessions") || "{}")
      const userSessions = allSessions[userData.email] || []

      // Si hay una sesión más nueva, forzar logout
      if (userSessions.length > 0 && userSessions[userSessions.length - 1] !== savedSessionId) {
        console.log("⚠️ Sesión duplicada detectada - Forzando logout")
        localStorage.removeItem("user")
        localStorage.removeItem("sessionId")
        localStorage.removeItem("auth")
        localStorage.removeItem("selectedConnection")
        setUser(null)
        setIsAuthenticated(false)
        setLoading(false)

        setTimeout(() => {
          alert(
            "⚠️ Sesión Cerrada\n\nSe ha detectado un inicio de sesión desde otro dispositivo.\n\nSi no fuiste tú, por favor contacta con el administrador inmediatamente.",
          )
        }, 500)
        return
      }

      // 🎨 Generar sidebar si hay conexión seleccionada
      if (savedConnection && userData.companies) {
        console.log("🔄 Restaurando sidebar para conexión:", savedConnection)
        const sidebarConfig = generateSidebarConfig(userData, savedConnection)
        if (sidebarConfig) {
          userData.sidebarConfig = sidebarConfig
        }
        setSelectedConnection(savedConnection)
      }

      // Todo OK - Usuario autenticado
      console.log("✅ Usuario autenticado correctamente")
      setUser(userData)
      setIsAuthenticated(true)
      setSessionId(savedSessionId)
    } catch (error) {
      console.error("❌ Error al parsear datos de usuario:", error)
      localStorage.removeItem("auth")
      localStorage.removeItem("user")
      localStorage.removeItem("sessionId")
      localStorage.removeItem("selectedConnection")
      setUser(null)
      setIsAuthenticated(false)
    }
    
    setLoading(false)
  }, [])

  // 🔄 Detectar cambios de sesión en otras pestañas
  useEffect(() => {
    const handleStorageChange = (e) => {
      console.log("🔄 Cambio detectado en localStorage:", e.key)
      
      // Si se elimina el token, forzar logout
      if (e.key === "auth" && !e.newValue) {
        console.log("⚠️ Token eliminado - Forzando logout")
        logout('session_expired')
        return
      }

      if (e.key === "allSessions" && user) {
        const allSessions = JSON.parse(e.newValue || "{}")
        const userSessions = allSessions[user.email] || []
        const currentSessionId = localStorage.getItem("sessionId")

        // Si la sesión actual no es la más reciente, forzar logout
        if (userSessions.length > 0 && userSessions[userSessions.length - 1] !== currentSessionId) {
          console.log("⚠️ Sesión invalidada por otra pestaña")
          showLoading("Sesión cerrada", "Inicio de Sesión")

          setTimeout(() => {
            logout('session_expired')
            hideLoading()
            alert(
              "⚠️ Sesión Cerrada\n\nSe ha detectado un inicio de sesión desde otro dispositivo.\n\nSi no fuiste tú, por favor contacta con el administrador inmediatamente.",
            )
          }, 2000)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [user, logout])

  // 🔔 Detectar refresh de página (beforeunload)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isAuthenticated) {
        sessionStorage.setItem('page_was_refreshed', 'true')
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isAuthenticated])

  // 🔐 Login
  const login = useCallback((userData) => {
    console.log("🔐 Iniciando sesión para:", userData.email)
    
    // 🔔 Limpiar cualquier flag de logout anterior
    localStorage.removeItem('logout_reason')
    sessionStorage.removeItem('page_was_refreshed')
    
    const newSessionId = generateSessionId()

    // Guardar información de sesión
    const allSessions = JSON.parse(localStorage.getItem("allSessions") || "{}")
    allSessions[userData.email] = [newSessionId] // Solo mantener la sesión más reciente

    localStorage.setItem("allSessions", JSON.stringify(allSessions))
    localStorage.setItem("sessionId", newSessionId)
    localStorage.setItem("user", JSON.stringify(userData))

    setUser(userData)
    setIsAuthenticated(true)
    setSessionId(newSessionId)
    
    console.log("✅ Login exitoso - Usuario autenticado")
  }, [])

  // 🔄 Cambiar de conexión (compañía)
  const selectConnection = useCallback((connection) => {
    if (!user || !user.companies) {
      console.error("❌ No se puede cambiar conexión - Usuario o compañías no disponibles")
      return
    }

    console.log("🔄 Cambiando a conexión:", connection)
    
    // Guardar conexión seleccionada
    localStorage.setItem("selectedConnection", connection)
    setSelectedConnection(connection)

    // 🎨 Generar nuevo sidebar para esta conexión
    const sidebarConfig = generateSidebarConfig(user, connection)
    
    if (sidebarConfig) {
      const updatedUser = {
        ...user,
        sidebarConfig: sidebarConfig
      }
      
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      
      console.log("✅ Sidebar actualizado para conexión:", connection)
    } else {
      console.warn("⚠️ No se pudo generar sidebar para conexión:", connection)
    }
  }, [user])

  // 📺 Loading helpers
  const showLoading = useCallback((message = "Cargando", destination = "") => {
    setLoadingMessage(message)
    setLoadingDestination(destination)
    setShowLoadingScreen(true)
  }, [])

  const hideLoading = useCallback(() => {
    setShowLoadingScreen(false)
  }, [])

  const value = {
    user,
    isAuthenticated,
    loading,
    sessionId,
    selectedConnection,
    login,
    logout,
    selectConnection,
    showLoadingScreen,
    loadingMessage,
    loadingDestination,
    showLoading,
    hideLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ✅ Hook personalizado - Exportado por separado
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}

// ✅ Export default del Provider
export default AuthProvider