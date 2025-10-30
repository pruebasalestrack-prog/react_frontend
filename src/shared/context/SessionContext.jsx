import { createContext, useContext, useState, useEffect } from "react"

const SessionContext = createContext()

export const useSession = () => {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error("useSession debe ser usado dentro de SessionProvider")
  }
  return context
}

export const SessionProvider = ({ children }) => {
  const [sessionInfo, setSessionInfo] = useState(null)
  const [sessionAlert, setSessionAlert] = useState(null)

  // Generar ID único de dispositivo/pestaña
  const generateDeviceId = () => {
    const stored = sessionStorage.getItem("device_id") // Cambiado a sessionStorage
    if (stored) return stored

    const deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem("device_id", deviceId)
    return deviceId
  }

  // Verificar sesión activa en otra pestaña/dispositivo
  const checkActiveSession = async (userId, databaseId) => {
    try {
      const currentDeviceId = generateDeviceId()
      const sessionKey = `session_${userId}_${databaseId}`
      
      // Obtener sesión activa del localStorage (compartido entre pestañas)
      const activeSessionStr = localStorage.getItem(sessionKey)
      
      if (activeSessionStr) {
        const activeSession = JSON.parse(activeSessionStr)
        
        // Si hay una sesión activa y NO es de este dispositivo
        if (activeSession.deviceId !== currentDeviceId) {
          return {
            hasActiveSession: true,
            sessionData: activeSession,
          }
        }
      }

      return { hasActiveSession: false }
    } catch (error) {
      console.error("Error verificando sesión:", error)
      return { hasActiveSession: false }
    }
  }

  // Crear nueva sesión
  const createSession = (userId, databaseId, userData) => {
    const deviceId = generateDeviceId()
    const sessionData = {
      userId,
      databaseId,
      deviceId,
      loginTime: new Date().toISOString(),
      userAgent: navigator.userAgent,
      userData,
    }

    const sessionKey = `session_${userId}_${databaseId}`
    
    // Guardar en localStorage (compartido entre pestañas)
    localStorage.setItem(sessionKey, JSON.stringify(sessionData))
    
    // Guardar también en sessionStorage para esta pestaña
    sessionStorage.setItem("current_session", JSON.stringify(sessionData))
    
    setSessionInfo(sessionData)
    return sessionData
  }

  // Cerrar sesión
  const closeSession = (userId, databaseId) => {
    const sessionKey = `session_${userId}_${databaseId}`
    localStorage.removeItem(sessionKey)
    sessionStorage.removeItem("current_session")
    setSessionInfo(null)
  }

  // Forzar cierre de sesión remota
  const forceCloseRemoteSession = (userId, databaseId) => {
    const sessionKey = `session_${userId}_${databaseId}`
    
    // Marcar para cerrar la otra sesión
    localStorage.setItem(`force_logout_${userId}_${databaseId}`, Date.now().toString())
    
    // Limpiar la marca después de 1 segundo
    setTimeout(() => {
      localStorage.removeItem(`force_logout_${userId}_${databaseId}`)
    }, 1000)
  }

  // Verificar si esta sesión debe cerrarse
  const checkForceLogout = () => {
    const currentSession = sessionStorage.getItem("current_session")
    if (!currentSession) return false

    try {
      const session = JSON.parse(currentSession)
      const forceLogoutKey = `force_logout_${session.userId}_${session.databaseId}`
      const forceLogout = localStorage.getItem(forceLogoutKey)
      
      if (forceLogout) {
        return true
      }
    } catch (error) {
      console.error("Error verificando force logout:", error)
    }
    
    return false
  }

  // Detectar cambios en localStorage (otra pestaña hizo login)
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Si otra pestaña creó una sesión nueva
      if (e.key && e.key.startsWith("session_") && e.newValue) {
        const currentSession = sessionStorage.getItem("current_session")
        
        if (currentSession) {
          try {
            const current = JSON.parse(currentSession)
            const newSession = JSON.parse(e.newValue)
            
            // Si es la misma cuenta pero diferente dispositivo
            if (
              current.userId === newSession.userId &&
              current.databaseId === newSession.databaseId &&
              current.deviceId !== newSession.deviceId
            ) {
              // Mostrar alerta de que cerraron tu sesión
              showSessionAlert(
                "remote-login",
                {
                  title: "Nueva Sesión Detectada",
                  message: "Se ha iniciado sesión en otro dispositivo. Tu sesión actual será cerrada por seguridad.",
                },
                () => {
                  // Forzar logout
                  window.location.href = "/login"
                }
              )
            }
          } catch (error) {
            console.error("Error procesando cambio de sesión:", error)
          }
        }
      }
      
      // Si detectamos marca de force logout
      if (e.key && e.key.startsWith("force_logout_") && e.newValue) {
        if (checkForceLogout()) {
          showSessionAlert(
            "forced-logout",
            {
              title: "Sesión Cerrada",
              message: "Tu sesión ha sido cerrada porque iniciaste sesión en otro dispositivo.",
            },
            () => {
              closeSession(sessionInfo?.userId, sessionInfo?.databaseId)
              window.location.href = "/login"
            }
          )
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Verificar periódicamente si deben cerrar esta sesión
    const interval = setInterval(() => {
      if (checkForceLogout()) {
        showSessionAlert(
          "forced-logout",
          {
            title: "Sesión Cerrada",
            message: "Tu sesión ha sido cerrada porque iniciaste sesión en otro dispositivo.",
          },
          () => {
            const currentSession = sessionStorage.getItem("current_session")
            if (currentSession) {
              const session = JSON.parse(currentSession)
              closeSession(session.userId, session.databaseId)
            }
            window.location.href = "/login"
          }
        )
      }
    }, 2000) // Verificar cada 2 segundos

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [sessionInfo])

  // Mostrar alerta de sesión
  const showSessionAlert = (type, message, onConfirm) => {
    setSessionAlert({ type, message, onConfirm })
  }

  // Cerrar alerta
  const closeSessionAlert = () => {
    setSessionAlert(null)
  }

  return (
    <SessionContext.Provider
      value={{
        sessionInfo,
        sessionAlert,
        checkActiveSession,
        createSession,
        closeSession,
        forceCloseRemoteSession,
        showSessionAlert,
        closeSessionAlert,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}