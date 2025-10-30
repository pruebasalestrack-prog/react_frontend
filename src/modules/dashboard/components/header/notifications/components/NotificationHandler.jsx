"use client"

import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useNotifications } from '../hooks/useNotifications'

const NotificationHandler = () => {
  const location = useLocation()
  const { 
    notifySessionExpired, 
    notifySessionLockExpired,
    notifyPageRefresh,
    closePanel 
  } = useNotifications()

  // 🔒 Evitar múltiples ejecuciones
  const hasNotifiedRef = useRef(false)
  const lastReasonRef = useRef(null)

  useEffect(() => {
    // 🚫 Si estamos en login, cerrar el panel de notificaciones
    if (location.pathname === '/login') {
      closePanel()
      
      // Verificar razón del logout
      const logoutReason = localStorage.getItem('logout_reason')

      // ✅ Solo ejecutar si hay una razón Y no hemos notificado esta razón antes
      if (logoutReason && (!hasNotifiedRef.current || lastReasonRef.current !== logoutReason)) {
        console.log('🔔 Procesando notificación:', logoutReason)
        
        hasNotifiedRef.current = true
        lastReasonRef.current = logoutReason

        if (logoutReason === 'session_expired') {
          console.log('🔔 Mostrando notificación: Sesión Expirada por Inactividad')
          setTimeout(() => {
            notifySessionExpired()
          }, 300)
        } else if (logoutReason === 'session_lock_expired') {
          console.log('🔔 Mostrando notificación: SessionLock Expirado')
          setTimeout(() => {
            notifySessionLockExpired()
          }, 300)
        } else if (logoutReason === 'page_refresh') {
          console.log('🔔 Mostrando notificación: Actualización de Página')
          setTimeout(() => {
            notifyPageRefresh()
          }, 300)
        }

        // Limpiar la razón después de procesar
        localStorage.removeItem('logout_reason')
      }
    } else {
      // ✅ Resetear cuando salimos del login
      hasNotifiedRef.current = false
      lastReasonRef.current = null
    }
  }, [location.pathname, notifySessionExpired, notifySessionLockExpired, notifyPageRefresh, closePanel])

  return null
}

export default NotificationHandler