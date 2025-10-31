"use client"

import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const NotificationContext = createContext()

export const useNotificationContext = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotificationContext debe usarse dentro de NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  // 💾 Cargar notificaciones desde localStorage al iniciar
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('app_notifications')
      if (saved) {
        const parsed = JSON.parse(saved)
        console.log('📥 Notificaciones cargadas desde localStorage:', parsed.length)
        return parsed
      }
    } catch (error) {
      console.error('❌ Error cargando notificaciones:', error)
    }
    return []
  })

  const [showPanel, setShowPanel] = useState(false)

  // 💾 Guardar notificaciones en localStorage cada vez que cambien
  useEffect(() => {
    try {
      localStorage.setItem('app_notifications', JSON.stringify(notifications))
      console.log('💾 Notificaciones guardadas en localStorage:', notifications.length)
    } catch (error) {
      console.error('❌ Error guardando notificaciones:', error)
    }
  }, [notifications])

  // Función para formatear fecha y hora
  const formatDateTime = (date) => {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }
    return new Intl.DateTimeFormat('es-EC', options).format(date)
  }

  // 🔒 Verificar si puede agregar notificación del mismo tipo
  // COOLDOWN REDUCIDO: Solo 30 segundos para evitar spam inmediato
  const canAddSecurityNotification = useCallback((notificationType) => {
    const COOLDOWN_MS = 30 * 1000 // 30 segundos (reducido de 2 minutos)
    
    // Lista de tipos de notificaciones de seguridad que tienen cooldown
    const securityTypes = ['page_refresh', 'session_lock_expired', 'session_expired']
    
    // Si no es una notificación de seguridad, permitir siempre
    if (!securityTypes.includes(notificationType)) {
      return true
    }

    // Buscar la última notificación del MISMO TIPO
    const lastNotification = notifications
      .filter(n => n.notificationType === notificationType)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    
    if (!lastNotification) {
      console.log(`✅ No hay notificación previa de tipo: ${notificationType}`)
      return true // Si no hay notificación previa de este tipo, permitir
    }

    const timeSinceLastNotification = Date.now() - new Date(lastNotification.createdAt).getTime()
    const canAdd = timeSinceLastNotification >= COOLDOWN_MS

    if (!canAdd) {
      const timeRemaining = Math.ceil((COOLDOWN_MS - timeSinceLastNotification) / 1000)
      console.log(`⏳ Cooldown activo para ${notificationType}. Tiempo restante: ${timeRemaining}s`)
    } else {
      console.log(`✅ Cooldown superado para ${notificationType}. Permitiendo nueva notificación.`)
    }

    return canAdd
  }, [notifications])

  // Agregar notificación (SIN auto-remover por tiempo)
  const addNotification = useCallback((notification) => {
    const now = new Date()
    const id = now.getTime() + Math.random() // ID único basado en timestamp + random
    
    const newNotification = {
      id,
      type: notification.type || 'info',
      title: notification.title || '',
      message: notification.message,
      createdAt: now.toISOString(), // Guardar como string para localStorage
      formattedDate: formatDateTime(now), // Fecha y hora formateada
      read: false,
      notificationType: notification.notificationType || 'general', // Para control de cooldown
      ...notification
    }

    setNotifications(prev => {
      const updated = [newNotification, ...prev]
      console.log('🔔 Notificación agregada:', {
        id,
        type: newNotification.type,
        title: newNotification.title,
        timestamp: newNotification.formattedDate,
        notificationType: newNotification.notificationType,
        total: updated.length
      })
      return updated
    })
    
    return id
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => {
      const updated = prev.filter(notif => notif.id !== id)
      console.log('🗑️ Notificación eliminada. Total restante:', updated.length)
      return updated
    })
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
    console.log('🗑️ Todas las notificaciones eliminadas')
  }, [])

  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    )
  }, [])

  const togglePanel = useCallback(() => {
    setShowPanel(prev => !prev)
  }, [])

  const closePanel = useCallback(() => {
    setShowPanel(false)
  }, [])

  // 🔔 Notificación: Actualización de página durante bloqueo
  // ⚠️ AMARILLA - Solo cuando se actualiza la página mientras está bloqueado
  const notifyPageRefresh = useCallback(() => {
    // 🔒 Verificar cooldown de 30 segundos para evitar spam
    if (!canAddSecurityNotification('page_refresh')) {
      console.log('⏭️ Notificación de página actualizada bloqueada por cooldown (30s)')
      return
    }

    const now = new Date()
    console.log('🔔 Creando notificación: page_refresh (Sesión Interrumpida)')
    addNotification({
      type: 'warning',
      title: '🔄 Sesión Interrumpida',
      message: `Su sesión fue interrumpida el ${formatDateTime(now)} debido a la actualización de la página durante el periodo de bloqueo por inactividad. Por favor, inicie sesión nuevamente para continuar.`,
      icon: '⚠️',
      timestamp: now.getTime(),
      notificationType: 'page_refresh'
    })
  }, [addNotification, canAddSecurityNotification])

  // 🔔 Notificación: SessionLock expiró sin contraseña
  // 🔴 ROJA - Cuando pasan los 15 segundos sin poner contraseña
  const notifySessionLockExpired = useCallback(() => {
    // 🔒 Verificar cooldown de 30 segundos para evitar spam
    if (!canAddSecurityNotification('session_lock_expired')) {
      console.log('⏭️ Notificación de sesión bloqueada bloqueada por cooldown (30s)')
      return
    }

    const now = new Date()
    console.log('🔔 Creando notificación: session_lock_expired (Sesión Cerrada)')
    addNotification({
      type: 'error',
      title: '🔐 Sesión Cerrada por Inactividad',
      message: `Su sesión ha sido cerrada el ${formatDateTime(now)} debido a inactividad prolongada. No se detectó interacción durante el periodo de bloqueo. Por seguridad, deberá autenticarse nuevamente.`,
      icon: '⏱️',
      timestamp: now.getTime(),
      notificationType: 'session_lock_expired'
    })
  }, [addNotification, canAddSecurityNotification])

  // 🔔 Notificación: Sesión expirada (otros casos generales)
  // 🔴 ROJA - Para casos generales de inactividad
  const notifySessionExpired = useCallback(() => {
    // 🔒 Verificar cooldown de 30 segundos para evitar spam
    if (!canAddSecurityNotification('session_expired')) {
      console.log('⏭️ Notificación de sesión expirada bloqueada por cooldown (30s)')
      return
    }

    const now = new Date()
    console.log('🔔 Creando notificación: session_expired (Sesión Cerrada)')
    addNotification({
      type: 'error',
      title: '🔐 Sesión Cerrada por Inactividad',
      message: `Su sesión ha sido cerrada el ${formatDateTime(now)} debido a inactividad prolongada. No se detectó interacción durante el periodo de bloqueo. Por seguridad, deberá autenticarse nuevamente.`,
      icon: '⏱️',
      timestamp: now.getTime(),
      notificationType: 'session_expired'
    })
  }, [addNotification, canAddSecurityNotification])

  // 🎉 Notificaciones generales SIN cooldown (se pueden enviar siempre)
  const notifySuccess = useCallback((message, title = 'Éxito') => {
    addNotification({
      type: 'success',
      title,
      message,
      icon: '✅',
      notificationType: 'success' // No tiene cooldown
    })
  }, [addNotification])

  const notifyError = useCallback((message, title = 'Error') => {
    addNotification({
      type: 'error',
      title,
      message,
      icon: '❌',
      notificationType: 'error' // No tiene cooldown
    })
  }, [addNotification])

  const notifyWarning = useCallback((message, title = 'Advertencia') => {
    addNotification({
      type: 'warning',
      title,
      message,
      icon: '⚠️',
      notificationType: 'warning' // No tiene cooldown
    })
  }, [addNotification])

  const notifyInfo = useCallback((message, title = 'Información') => {
    addNotification({
      type: 'info',
      title,
      message,
      icon: 'ℹ️',
      notificationType: 'info' // No tiene cooldown
    })
  }, [addNotification])

  const value = {
    notifications,
    showPanel,
    addNotification,
    removeNotification,
    clearAll,
    markAsRead,
    markAllAsRead,
    togglePanel,
    closePanel,
    notifySessionExpired,
    notifySessionLockExpired,
    notifyPageRefresh,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    unreadCount: notifications.filter(n => !n.read).length,
    totalCount: notifications.length
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
export default NotificationContext