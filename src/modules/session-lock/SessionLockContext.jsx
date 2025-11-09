import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../../shared/context/AuthContext'
import { validateUnlock, logoutApi } from '../login/api/authApi'

const SessionLockContext = createContext()
export const useSessionLock = () => useContext(SessionLockContext)

// Storage Keys
const LOCK_STORAGE_KEY = 'session_lock_state'
const ACTIVITY_STORAGE_KEY = 'last_activity_time'
const USER_EMAIL_KEY = 'session_lock_user'
const LOCKED_AT_KEY = 'locked_at'
const EXPIRE_AT_KEY = 'expire_at'

// Configuración de tiempos (en milisegundos)
const INACTIVITY_TIMEOUT = 190 * 1000 // 15 segundos para bloquear
const LOCK_EXPIRATION = 120 * 1000 // 15 segundos después de bloqueo para forzar logout

export const SessionLockProvider = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth()
  const [isLocked, setIsLocked] = useState(false)
  const [lastActivity, setLastActivity] = useState(Date.now())
  const [showExpireModal, setShowExpireModal] = useState(false)
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [timeUntilExpire, setTimeUntilExpire] = useState(0)
  
  const inactivityTimerRef = useRef(null)
  const expireCheckTimerRef = useRef(null)
  const hasCheckedExpiration = useRef(false)

  // 🚪 Forzar logout (cuando expira o recarga durante bloqueo)
  const handleForceLogout = useCallback(async () => {
    console.log('🚪 Forzando cierre de sesión completo')
    
    // 🔔 Guardar la razón ANTES de hacer cualquier cosa
    const currentLogoutReason = localStorage.getItem('logout_reason')
    console.log('💾 Razón de logout actual:', currentLogoutReason)
    
    setShowExpireModal(true)
    
    // Llamar a la API de logout para invalidar el token en el servidor
    try {
      await logoutApi()
      console.log('✅ Token invalidado en el servidor')
    } catch (error) {
      console.error('⚠️ Error al invalidar token en servidor:', error)
    }
    
    // Esperar 1 segundo para mostrar el modal, luego logout local
    setTimeout(() => {
      setIsLocked(false)
      setShowExpireModal(false)
      setTimeUntilExpire(0)
      
      // Limpiar TODO el localStorage
      localStorage.clear()
      
      // 🔔 Restaurar SOLO la razón que teníamos guardada
      if (currentLogoutReason) {
        localStorage.setItem('logout_reason', currentLogoutReason)
        console.log('✅ Razón de logout restaurada:', currentLogoutReason)
      }
      
      console.log('✅ localStorage limpiado completamente')
      
      // Ejecutar logout del contexto (limpia estado y redirige)
      // ⚠️ NO pasar razón aquí, ya está guardada en localStorage
      logout()  
    }, 1000)
  }, [logout])

  // 🚫 Detectar F5/recarga cuando está bloqueado → logout inmediato
  useEffect(() => {
    if (!isLocked) return

    const handleBeforeUnload = (e) => {
      console.log('🔄 Detectada recarga durante bloqueo')
      
      // 🔔 Guardar razón: RECARGA DURANTE BLOQUEO
      localStorage.setItem('logout_reason', 'page_refresh')
      
      // Guardar flag para detectar la recarga
      localStorage.setItem('force_logout_on_reload', 'true')
      
      e.preventDefault()
      e.returnValue = '¿Estás seguro de actualizar? Tu sesión será cerrada.'
      return '¿Estás seguro de actualizar? Tu sesión será cerrada.'
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isLocked])

  // 🔍 Verificar estado al cargar (detectar F5)
  useEffect(() => {
    if (hasCheckedExpiration.current) return
    
    hasCheckedExpiration.current = true
    
    // ⚠️ IMPORTANTE: Detectar si se recargó durante bloqueo
    const forceLogoutFlag = localStorage.getItem('force_logout_on_reload')
    
    if (forceLogoutFlag === 'true') {
      console.log('🔄 Recarga detectada durante bloqueo - Forzando logout inmediato')
      localStorage.removeItem('force_logout_on_reload')
      
      // 🔔 La razón ya está guardada como 'page_refresh' en beforeunload
      console.log('📋 Razón ya guardada: page_refresh')
      
      handleForceLogout()
      return
    }
    
    if (!isAuthenticated) return
    
    const lockedAt = parseInt(localStorage.getItem(LOCKED_AT_KEY) || '0', 10)
    const expireAt = parseInt(localStorage.getItem(EXPIRE_AT_KEY) || '0', 10)
    const lockState = localStorage.getItem(LOCK_STORAGE_KEY)
    
    const now = Date.now()
    
    console.log('🔍 Verificando estado de sesión al cargar:', {
      lockState,
      lockedAt: lockedAt ? new Date(lockedAt).toLocaleTimeString() : 'N/A',
      expireAt: expireAt ? new Date(expireAt).toLocaleTimeString() : 'N/A',
      now: new Date(now).toLocaleTimeString(),
      timeSinceLock: lockedAt ? (now - lockedAt) / 1000 : 0,
    })

    // Si hay una expiración programada y ya pasó el tiempo
    if (expireAt && now >= expireAt) {
      console.log('⏰ Sesión expirada detectada - Forzando logout inmediato')
      
      // 🔔 Guardar razón: TIEMPO EXPIRADO
      localStorage.setItem('logout_reason', 'session_lock_expired')
      
      handleForceLogout()
      return
    }

    // Si está bloqueado pero aún no expiró
    if (lockState === 'locked' && lockedAt) {
      const timeSinceLock = now - lockedAt
      
      if (timeSinceLock >= LOCK_EXPIRATION) {
        console.log('⏰ Tiempo de bloqueo expirado - Forzando logout')
        
        // 🔔 Guardar razón: TIEMPO EXPIRADO
        localStorage.setItem('logout_reason', 'session_lock_expired')
        
        handleForceLogout()
      } else {
        console.log('🔒 Restaurando estado de bloqueo')
        setIsLocked(true)
        const remaining = LOCK_EXPIRATION - timeSinceLock
        setTimeUntilExpire(Math.ceil(remaining / 1000))
      }
    }
  }, [isAuthenticated, handleForceLogout])

  // 💾 Guardar email cuando se autentica Y LIMPIAR estados de bloqueo previos
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      console.log('🔄 Usuario autenticado - Reiniciando timers y limpiando estados previos')
      
      // Guardar email
      localStorage.setItem(USER_EMAIL_KEY, user.email)
      
      // ⚠️ IMPORTANTE: Limpiar TODOS los estados de bloqueo previos
      localStorage.removeItem(LOCK_STORAGE_KEY)
      localStorage.removeItem(LOCKED_AT_KEY)
      localStorage.removeItem(EXPIRE_AT_KEY)
      localStorage.removeItem('force_logout_on_reload')
      // 🔔 NO limpiar logout_reason aquí - se limpia después de mostrar notificación
      
      // Reiniciar estados
      setIsLocked(false)
      setShowExpireModal(false)
      setTimeUntilExpire(0)
      setLastActivity(Date.now())
      
      // Guardar nueva actividad
      localStorage.setItem(ACTIVITY_STORAGE_KEY, Date.now().toString())
      localStorage.setItem(LOCK_STORAGE_KEY, 'unlocked')
      
      console.log('✅ Estados de sesión reiniciados correctamente')
    }
  }, [isAuthenticated, user?.email])

  // 🔄 Resetear timer de actividad
  const resetActivityTimer = useCallback(() => {
    if (!isAuthenticated || isLocked) return
    const now = Date.now()
    setLastActivity(now)
    localStorage.setItem(ACTIVITY_STORAGE_KEY, now.toString())
  }, [isAuthenticated, isLocked])

  // 🔒 Bloquear la sesión
  const lockSession = useCallback(() => {
    if (!isAuthenticated || isLocked) return
    
    const now = Date.now()
    const expireTime = now + LOCK_EXPIRATION
    
    console.log('🔒 Bloqueando sesión:', {
      lockedAt: new Date(now).toLocaleTimeString(),
      expireAt: new Date(expireTime).toLocaleTimeString(),
    })
    
    setIsLocked(true)
    localStorage.setItem(LOCK_STORAGE_KEY, 'locked')
    localStorage.setItem(LOCKED_AT_KEY, now.toString())
    localStorage.setItem(EXPIRE_AT_KEY, expireTime.toString())
    setTimeUntilExpire(LOCK_EXPIRATION / 1000)
  }, [isAuthenticated, isLocked])

  // 🔓 Desbloquear la sesión
  const unlockSession = useCallback(async (password) => {
    if (!user?.email) {
      console.error('❌ No hay usuario para desbloquear')
      return false
    }
    
    setIsUnlocking(true)
    
    try {
      console.log('🔑 Validando contraseña...')
      const isValid = await validateUnlock(user.email, password)
      
      if (isValid) {
        console.log('✅ Contraseña correcta - Desbloqueando')
        const now = Date.now()
        
        setIsLocked(false)
        setLastActivity(now)
        setTimeUntilExpire(0)
        
        localStorage.setItem(LOCK_STORAGE_KEY, 'unlocked')
        localStorage.setItem(ACTIVITY_STORAGE_KEY, now.toString())
        localStorage.removeItem(LOCKED_AT_KEY)
        localStorage.removeItem(EXPIRE_AT_KEY)
        localStorage.removeItem('force_logout_on_reload')
        
        // ✅ CRÍTICO: Limpiar logout_reason para NO enviar notificación
        localStorage.removeItem('logout_reason')
        
        console.log('✅ Sesión desbloqueada exitosamente - SIN notificación')
        
        setIsUnlocking(false)
        return true
      } else {
        console.log('❌ Contraseña incorrecta')
        setIsUnlocking(false)
        return false
      }
    } catch (error) {
      console.error('❌ Error al desbloquear:', error)
      setIsUnlocking(false)
      return false
    }
  }, [user])

  // ⏱️ Timer de inactividad (15s)
  useEffect(() => {
    if (!isAuthenticated || isLocked) {
      if (inactivityTimerRef.current) {
        clearInterval(inactivityTimerRef.current)
        inactivityTimerRef.current = null
      }
      return
    }

    inactivityTimerRef.current = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivity
      
      if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
        console.log('⏱️ Inactividad detectada - Bloqueando sesión')
        lockSession()
      }
    }, 1000)

    return () => {
      if (inactivityTimerRef.current) {
        clearInterval(inactivityTimerRef.current)
      }
    }
  }, [isAuthenticated, isLocked, lastActivity, lockSession])

  // ⏰ Timer de expiración (15s después de bloqueo)
  useEffect(() => {
    if (!isLocked) {
      if (expireCheckTimerRef.current) {
        clearInterval(expireCheckTimerRef.current)
        expireCheckTimerRef.current = null
      }
      return
    }

    expireCheckTimerRef.current = setInterval(() => {
      const expireAt = parseInt(localStorage.getItem(EXPIRE_AT_KEY) || '0', 10)
      const now = Date.now()
      
      if (expireAt && now >= expireAt) {
        console.log('⏰ Tiempo de desbloqueo expirado')
        clearInterval(expireCheckTimerRef.current)
        
        // 🔔 Guardar razón: TIEMPO EXPIRADO
        localStorage.setItem('logout_reason', 'session_lock_expired')
        console.log('💾 Guardada razón: session_lock_expired')
        
        handleForceLogout()
      } else if (expireAt) {
        const remaining = Math.ceil((expireAt - now) / 1000)
        setTimeUntilExpire(remaining)
      }
    }, 1000)

    return () => {
      if (expireCheckTimerRef.current) {
        clearInterval(expireCheckTimerRef.current)
      }
    }
  }, [isLocked, handleForceLogout])

  // 🧹 Limpiar al hacer logout real
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('🧹 Usuario desautenticado - Limpiando todos los estados')
      
      setIsLocked(false)
      setLastActivity(Date.now())
      setShowExpireModal(false)
      setTimeUntilExpire(0)
      hasCheckedExpiration.current = false
      
      localStorage.removeItem(LOCK_STORAGE_KEY)
      localStorage.removeItem(ACTIVITY_STORAGE_KEY)
      localStorage.removeItem(USER_EMAIL_KEY)
      localStorage.removeItem(LOCKED_AT_KEY)
      localStorage.removeItem(EXPIRE_AT_KEY)
      localStorage.removeItem('force_logout_on_reload')
      // 🔔 NO limpiar logout_reason aquí - se necesita para la notificación
    }
  }, [isAuthenticated])

  // 👆 Detectar actividad del usuario
  useEffect(() => {
    if (!isAuthenticated) return

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    const handleActivity = () => resetActivityTimer()
    
    events.forEach(event => 
      document.addEventListener(event, handleActivity, { passive: true })
    )

    return () => {
      events.forEach(event => 
        document.removeEventListener(event, handleActivity)
      )
    }
  }, [isAuthenticated, resetActivityTimer])

  const value = {
    isLocked,
    isUnlocking,
    lockSession,
    unlockSession,
    lastActivity,
    inactivityTimeout: INACTIVITY_TIMEOUT,
    lockExpiration: LOCK_EXPIRATION,
    showExpireModal,
    timeUntilExpire,
    handleForceLogout,
  }

  return (
    <SessionLockContext.Provider value={value}>
      {children}
    </SessionLockContext.Provider>
  )
}