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

  // 🔒 Ref para guardar la última razón procesada y evitar duplicados
  const lastProcessedReasonRef = useRef(null)
  const isProcessingRef = useRef(false)

  useEffect(() => {
    // Solo procesar cuando estemos en /login
    if (location.pathname !== '/login') {
      return
    }

    // 🚫 Si ya está procesando, no ejecutar de nuevo
    if (isProcessingRef.current) {
      console.log('⏭️ Ya hay un proceso de notificación en curso, saltando')
      return
    }

    // 🚫 Si estamos en login, cerrar el panel de notificaciones
    closePanel()
    
    // Verificar razón del logout
    const logoutReason = localStorage.getItem('logout_reason')

    // Si no hay razón o ya procesamos esta misma razón, no hacer nada
    if (!logoutReason || logoutReason === lastProcessedReasonRef.current) {
      return
    }

    console.log('🔔 Procesando notificación:', logoutReason, '- Timestamp:', new Date().toISOString())
    
    // Marcar como procesando INMEDIATAMENTE
    isProcessingRef.current = true
    lastProcessedReasonRef.current = logoutReason
    
    // Eliminar la razón de localStorage INMEDIATAMENTE para evitar re-lecturas
    localStorage.removeItem('logout_reason')
    
    // Enviar notificación según el tipo
    setTimeout(() => {
      // 🔄 page_refresh: Actualización durante el PRIMER bloqueo (15 segundos)
      if (logoutReason === 'page_refresh') {
        console.log('🔔 Mostrando notificación: Sesión Interrumpida (actualización de página)')
        notifyPageRefresh()
      } 
      // 🔐 session_lock_expired: SEGUNDO bloqueo - TIEMPO EXPIRÓ COMPLETAMENTE
      else if (logoutReason === 'session_lock_expired') {
        console.log('🔔 Mostrando notificación: Sesión Cerrada por Inactividad (tiempo expirado)')
        notifySessionLockExpired()
      } 
      // ⏰ session_expired: OTROS CASOS
      else if (logoutReason === 'session_expired') {
        console.log('🔔 Mostrando notificación: Sesión Expirada (otros casos)')
        notifySessionExpired()
      }
      
      // Liberar el flag después de 1 segundo (para evitar clicks rápidos)
      setTimeout(() => {
        isProcessingRef.current = false
      }, 1000)
    }, 300)
  }, [location.pathname, notifySessionExpired, notifySessionLockExpired, notifyPageRefresh, closePanel])

  return null
}

export default NotificationHandler