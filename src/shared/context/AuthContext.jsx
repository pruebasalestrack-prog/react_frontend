"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}

const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

const INACTIVITY_TIMEOUT = 5 * 60 * 1000 // 5 minutes in milliseconds

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sessionId, setSessionId] = useState(null)
  const [showLoadingScreen, setShowLoadingScreen] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Cargando")
  const [loadingDestination, setLoadingDestination] = useState("")

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    const savedSessionId = localStorage.getItem("sessionId")

    if (savedUser && savedSessionId) {
      const userData = JSON.parse(savedUser)

      // Check if there's a newer session for this user
      const allSessions = JSON.parse(localStorage.getItem("allSessions") || "{}")
      const userSessions = allSessions[userData.email] || []

      // If there's a newer session, force logout
      if (userSessions.length > 0 && userSessions[userSessions.length - 1] !== savedSessionId) {
        // Another session detected
        localStorage.removeItem("user")
        localStorage.removeItem("sessionId")
        setUser(null)
        setIsAuthenticated(false)
        setLoading(false)

        // Show alert about multiple sessions
        setTimeout(() => {
          alert(
            "⚠️ Sesión Cerrada\n\nSe ha detectado un inicio de sesión desde otro dispositivo.\n\nSi no fuiste tú, por favor contacta con el administrador inmediatamente.",
          )
        }, 500)
        return
      }

      setUser(userData)
      setIsAuthenticated(true)
      setSessionId(savedSessionId)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return

    let inactivityTimer

    const resetTimer = () => {
      clearTimeout(inactivityTimer)
      inactivityTimer = setTimeout(() => {
        // Show loading screen before logout
        showLoading("Sesión expirada por inactividad", "Inicio de Sesión")

        setTimeout(() => {
          logout()
          hideLoading()
          alert("⏱️ Sesión Expirada\n\nTu sesión ha expirado por inactividad.\n\nPor favor, inicia sesión nuevamente.")
        }, 2000)
      }, INACTIVITY_TIMEOUT)
    }

    // Events that reset the inactivity timer
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"]

    events.forEach((event) => {
      document.addEventListener(event, resetTimer)
    })

    // Initialize timer
    resetTimer()

    // Cleanup
    return () => {
      clearTimeout(inactivityTimer)
      events.forEach((event) => {
        document.removeEventListener(event, resetTimer)
      })
    }
  }, [isAuthenticated])

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "allSessions" && user) {
        const allSessions = JSON.parse(e.newValue || "{}")
        const userSessions = allSessions[user.email] || []
        const currentSessionId = localStorage.getItem("sessionId")

        // If current session is not the latest, force logout
        if (userSessions.length > 0 && userSessions[userSessions.length - 1] !== currentSessionId) {
          showLoading("Sesión cerrada", "Inicio de Sesión")

          setTimeout(() => {
            logout()
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
  }, [user])

  const login = (userData) => {
    const newSessionId = generateSessionId()

    // Store session info
    const allSessions = JSON.parse(localStorage.getItem("allSessions") || "{}")
    allSessions[userData.email] = [newSessionId] // Only keep the latest session

    localStorage.setItem("allSessions", JSON.stringify(allSessions))
    localStorage.setItem("sessionId", newSessionId)
    localStorage.setItem("user", JSON.stringify(userData))

    setUser(userData)
    setIsAuthenticated(true)
    setSessionId(newSessionId)
  }

  const logout = () => {
    if (user && sessionId) {
      const allSessions = JSON.parse(localStorage.getItem("allSessions") || "{}")
      if (allSessions[user.email]) {
        allSessions[user.email] = allSessions[user.email].filter((id) => id !== sessionId)
        localStorage.setItem("allSessions", JSON.stringify(allSessions))
      }
    }

    setUser(null)
    setIsAuthenticated(false)
    setSessionId(null)
    localStorage.removeItem("user")
    localStorage.removeItem("sessionId")
  }

  const showLoading = (message = "Cargando", destination = "") => {
    setLoadingMessage(message)
    setLoadingDestination(destination)
    setShowLoadingScreen(true)
  }

  const hideLoading = () => {
    setShowLoadingScreen(false)
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    sessionId,
    login,
    logout,
    showLoadingScreen,
    loadingMessage,
    loadingDestination,
    showLoading,
    hideLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
