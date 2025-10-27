"use client"

import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../../shared/context/AuthContext'
import usersData from '../../shared/data/users.json'

const SessionLockContext = createContext()

export const useSessionLock = () => {
  const context = useContext(SessionLockContext)
  if (!context) {
    throw new Error('useSessionLock must be used within SessionLockProvider')
  }
  return context
}

// 🔒 CLAVES PARA LOCALSTORAGE (fuera del componente para acceso global)
const LOCK_STORAGE_KEY = 'session_lock_state'
const ACTIVITY_STORAGE_KEY = 'last_activity_time'
const USER_EMAIL_KEY = 'session_lock_user'

// 🔥 FUNCIÓN PARA VERIFICAR BLOQUEO INMEDIATAMENTE (antes de renderizar)
const checkInitialLockState = () => {
  const savedLockState = localStorage.getItem(LOCK_STORAGE_KEY)
  const savedLastActivity = localStorage.getItem(ACTIVITY_STORAGE_KEY)
  const INACTIVITY_TIMEOUT = 30 * 1000 // 30 segundos
  
  console.log('🚀 Verificando estado inicial de bloqueo...')
  console.log('Estado guardado:', savedLockState)
  
  if (savedLockState === 'locked') {
    console.log('🔒 ENCONTRADO BLOQUEO GUARDADO - Iniciando bloqueado')
    return true
  }
  
  if (savedLastActivity) {
    const timeSinceLastActivity = Date.now() - parseInt(savedLastActivity)
    console.log('Tiempo desde última actividad:', timeSinceLastActivity, 'ms')
    
    if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
      console.log('🔒 TIEMPO EXCEDIDO - Iniciando bloqueado')
      localStorage.setItem(LOCK_STORAGE_KEY, 'locked')
      return true
    }
  }
  
  console.log('✅ Sin bloqueo inicial')
  return false
}

export const SessionLockProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth()
  
  // 🔥 IMPORTANTE: Inicializar con el estado de localStorage INMEDIATAMENTE
  const [isLocked, setIsLocked] = useState(() => {
    // Esta función se ejecuta solo una vez al montar
    if (typeof window !== 'undefined') {
      return checkInitialLockState()
    }
    return false
  })
  
  const [lastActivity, setLastActivity] = useState(Date.now())
  const timerRef = useRef(null)

  // Configuración: 5 minutos = 300000 ms
  // const INACTIVITY_TIMEOUT = 5 * 60 * 1000 // 5 minutos
  const INACTIVITY_TIMEOUT = 30 * 1000 // 30 segundos para pruebas

  // 🔥 Sincronizar con localStorage cuando cambia isAuthenticated
  useEffect(() => {
    if (!isAuthenticated) return
    
    const savedLockState = localStorage.getItem(LOCK_STORAGE_KEY)
    if (savedLockState === 'locked' && !isLocked) {
      console.log('🔄 Sincronizando bloqueo con localStorage')
      setIsLocked(true)
    }
  }, [isAuthenticated, isLocked])

  // Guardar email del usuario cuando se autentica
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      const savedEmail = localStorage.getItem(USER_EMAIL_KEY)
      
      if (savedEmail && savedEmail !== user.email) {
        console.log('⚠️ Usuario diferente, limpiando estado')
        localStorage.removeItem(LOCK_STORAGE_KEY)
        localStorage.removeItem(ACTIVITY_STORAGE_KEY)
        setIsLocked(false)
      }
      
      localStorage.setItem(USER_EMAIL_KEY, user.email)
      console.log('💾 Email guardado:', user.email)
    }
  }, [isAuthenticated, user])

  // Resetear el timer de actividad
  const resetActivityTimer = useCallback(() => {
    if (!isAuthenticated || isLocked) return
    const now = Date.now()
    setLastActivity(now)
    localStorage.setItem(ACTIVITY_STORAGE_KEY, now.toString())
  }, [isAuthenticated, isLocked])

  // Bloquear la sesión
  const lockSession = useCallback(() => {
    if (isAuthenticated && !isLocked) {
      console.log('═══════════════════════════════════')
      console.log('🔒 BLOQUEANDO SESIÓN')
      console.log('═══════════════════════════════════')
      setIsLocked(true)
      localStorage.setItem(LOCK_STORAGE_KEY, 'locked')
      console.log('💾 Estado guardado: locked')
    }
  }, [isAuthenticated, isLocked])

  // Desbloquear la sesión validando contra el JSON de usuarios
  const unlockSession = useCallback((password) => {
    console.log('═══════════════════════════════════')
    console.log('🔓 INTENTANDO DESBLOQUEAR')
    console.log('═══════════════════════════════════')
    console.log('👤 Usuario:', user?.email)
    console.log('🔑 Password:', `"${password}"`)
    
    if (!user || !user.email) {
      console.log('❌ No hay usuario')
      return false
    }
    
    // Buscar usuario en JSON
    const foundUser = usersData.users.find(u => u.email === user.email)
    
    if (!foundUser) {
      console.log('❌ Usuario no encontrado en JSON')
      return false
    }
    
    console.log('📋 Password en JSON:', `"${foundUser.password}"`)
    
    // Comparar contraseñas
    const cleanPassword = password?.trim()
    const cleanStoredPassword = foundUser.password.trim()
    
    if (cleanPassword === cleanStoredPassword) {
      console.log('✅✅✅ CONTRASEÑA CORRECTA ✅✅✅')
      console.log('🔓 Desbloqueando...')
      
      setIsLocked(false)
      const now = Date.now()
      setLastActivity(now)
      
      localStorage.setItem(LOCK_STORAGE_KEY, 'unlocked')
      localStorage.setItem(ACTIVITY_STORAGE_KEY, now.toString())
      
      console.log('💾 Estado: unlocked')
      console.log('═══════════════════════════════════\n')
      return true
    }
    
    console.log('❌ CONTRASEÑA INCORRECTA')
    console.log('Correcta:', foundUser.password)
    console.log('═══════════════════════════════════\n')
    return false
  }, [user])

  // Detectar actividad del usuario
  useEffect(() => {
    if (!isAuthenticated) return

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    const handleActivity = () => resetActivityTimer()

    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true })
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity)
      })
    }
  }, [isAuthenticated, resetActivityTimer])

  // Timer de inactividad
  useEffect(() => {
    if (!isAuthenticated || isLocked) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      return
    }

    timerRef.current = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivity

      if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
        lockSession()
      }
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isAuthenticated, isLocked, lastActivity, lockSession, INACTIVITY_TIMEOUT])

  // Limpiar al hacer logout
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('🗑️ Logout - Limpiando todo')
      setIsLocked(false)
      setLastActivity(Date.now())
      localStorage.removeItem(LOCK_STORAGE_KEY)
      localStorage.removeItem(ACTIVITY_STORAGE_KEY)
      localStorage.removeItem(USER_EMAIL_KEY)
    }
  }, [isAuthenticated])

  // Guardar estado antes de cerrar
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isAuthenticated) {
        if (isLocked) {
          localStorage.setItem(LOCK_STORAGE_KEY, 'locked')
          console.log('💾 Guardando "locked"')
        } else {
          localStorage.setItem(ACTIVITY_STORAGE_KEY, lastActivity.toString())
          console.log('💾 Guardando actividad')
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isAuthenticated, isLocked, lastActivity])

  const value = {
    isLocked,
    lockSession,
    unlockSession,
    lastActivity,
    inactivityTimeout: INACTIVITY_TIMEOUT,
  }

  return (
    <SessionLockContext.Provider value={value}>
      {children}
    </SessionLockContext.Provider>
  )
}