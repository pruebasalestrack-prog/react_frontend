import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../../shared/context/AuthContext'
import { validateUnlock } from '../login/api/authApi'

const SessionLockContext = createContext()
export const useSessionLock = () => useContext(SessionLockContext)

// Constants
const LOCK_STORAGE_KEY = 'session_lock_state'
const ACTIVITY_STORAGE_KEY = 'last_activity_time'
const USER_EMAIL_KEY = 'session_lock_user'
const LOCKED_AT_KEY = 'locked_at'

// Configuración de tiempos
const INACTIVITY_TIMEOUT = 30 * 1000 // 30s para bloquear
const LOCK_EXPIRATION = 60 * 1000 // 60s después de bloqueo para forzar logout

export const SessionLockProvider = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth()
  const [isLocked, setIsLocked] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem(LOCK_STORAGE_KEY)
      return savedState === 'locked'
    }
    return false
  })
  const [lastActivity, setLastActivity] = useState(Date.now())
  const [showExpireModal, setShowExpireModal] = useState(false)
  const [isUnlocking, setIsUnlocking] = useState(false)
  const timerRef = useRef(null)
  const expireTimerRef = useRef(null)

  // Guardar email cuando se autentica
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      localStorage.setItem(USER_EMAIL_KEY, user.email)
    }
  }, [isAuthenticated, user])

  // Resetear timer de actividad al evento
  const resetActivityTimer = useCallback(() => {
    if (!isAuthenticated || isLocked) return
    const now = Date.now()
    setLastActivity(now)
    localStorage.setItem(ACTIVITY_STORAGE_KEY, now.toString())
  }, [isAuthenticated, isLocked])

  // Bloquear la sesión
  const lockSession = useCallback(() => {
    if (isAuthenticated && !isLocked) {
      setIsLocked(true)
      localStorage.setItem(LOCK_STORAGE_KEY, 'locked')
      // Guarda el tiempo en que se bloqueó
      localStorage.setItem(LOCKED_AT_KEY, Date.now().toString())
    }
  }, [isAuthenticated, isLocked])

  // Desbloquear la sesión validando con la API
  const unlockSession = useCallback(async (password) => {
    if (!user || !user.email) return false
    setIsUnlocking(true)
    try {
      const isValid = await validateUnlock(user.email, password)
      if (isValid) {
        setIsLocked(false)
        setLastActivity(Date.now())
        localStorage.setItem(LOCK_STORAGE_KEY, 'unlocked')
        localStorage.setItem(ACTIVITY_STORAGE_KEY, Date.now().toString())
        // localStorage.removeItem(LOCKED_AT_KEY)
        localStorage.removeItem('session_expired')
        setIsUnlocking(false)
        return true
      } else {
        setIsUnlocking(false)
        return false
      }
    } catch (e) {
      setIsUnlocking(false)
      return false
    }
  }, [user])

  // Timer para bloqueo por inactividad (30s)
  useEffect(() => {
    if (!isAuthenticated || isLocked) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    timerRef.current = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivity
      if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
        lockSession()
      }
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isAuthenticated, isLocked, lastActivity, lockSession])

  // Timer para forzar logout después de bloqueo (60s)
  useEffect(() => {
    if (!isLocked) {
      if (expireTimerRef.current) clearInterval(expireTimerRef.current)
      return
    }
    expireTimerRef.current = setInterval(() => {
      const lockedAt = parseInt(localStorage.getItem(LOCKED_AT_KEY) || "0", 10)
      if (lockedAt && Date.now() - lockedAt >= LOCK_EXPIRATION) {
        setShowExpireModal(true)
      }
    }, 1000)
    return () => { if (expireTimerRef.current) clearInterval(expireTimerRef.current) }
  }, [isLocked])

  // Limpiar al hacer logout real
  useEffect(() => {
    if (!isAuthenticated) {
      setIsLocked(false)
      setLastActivity(Date.now())
      setShowExpireModal(false)
      localStorage.removeItem(LOCK_STORAGE_KEY)
      localStorage.removeItem(ACTIVITY_STORAGE_KEY)
      localStorage.removeItem(USER_EMAIL_KEY)
      localStorage.removeItem(LOCKED_AT_KEY)
    }
  }, [isAuthenticated])

  // Detectar actividad
  useEffect(() => {
    if (!isAuthenticated) return
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    const handleActivity = () => resetActivityTimer()
    events.forEach(event => document.addEventListener(event, handleActivity, { passive: true }))
    return () => { events.forEach(event => document.removeEventListener(event, handleActivity)) }
  }, [isAuthenticated, resetActivityTimer])

  // Modal de expiración (redirige y limpia)
  const handleExpire = () => {
    setShowExpireModal(false)
    localStorage.setItem('session_expired', 'true')
    logout()
    }

  const value = {
    isLocked,
    isUnlocking,
    lockSession,
    unlockSession,
    lastActivity,
    inactivityTimeout: INACTIVITY_TIMEOUT,
    showExpireModal,
    handleExpire,
  }

  return (
    <SessionLockContext.Provider value={value}>
      {children}
    </SessionLockContext.Provider>
  )
}