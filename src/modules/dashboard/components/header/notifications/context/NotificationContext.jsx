"use client"

import { createContext, useContext, useState, useCallback } from 'react'

const NotificationContext = createContext()

export const useNotificationContext = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotificationContext debe usarse dentro de NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [showPanel, setShowPanel] = useState(false)

  // Agregar notificación (SIN auto-remover por tiempo)
  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random()
    const newNotification = {
      id,
      type: notification.type || 'info',
      title: notification.title || '',
      message: notification.message,
      createdAt: new Date(),
      read: false,
      ...notification
    }

    setNotifications(prev => [newNotification, ...prev])
    return id
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
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

  // 🔔 Notificación: Sesión expirada por inactividad
  const notifySessionExpired = useCallback(() => {
    addNotification({
      type: 'warning',
      title: '⏰ Sesión Expirada por Inactividad',
      message: 'Tu sesión ha expirado debido a inactividad. Por favor, inicia sesión nuevamente.',
      icon: '🔒'
    })
  }, [addNotification])

  // 🔔 Notificación: SessionLock expiró sin contraseña
  const notifySessionLockExpired = useCallback(() => {
    addNotification({
      type: 'error',
      title: '🔐 Sesión Bloqueada Expirada',
      message: 'Tu sesión fue bloqueada por inactividad y no ingresaste tu contraseña a tiempo. Por seguridad, tu sesión ha sido cerrada.',
      icon: '⏱️'
    })
  }, [addNotification])

  // 🔔 Notificación: Actualización de página
  const notifyPageRefresh = useCallback(() => {
    addNotification({
      type: 'info',
      title: '🔄 Sesión Cerrada por Actualización',
      message: 'Tu sesión fue cerrada porque actualizaste la página. Por favor, inicia sesión nuevamente.',
      icon: '↻'
    })
  }, [addNotification])

  const notifySuccess = useCallback((message, title = 'Éxito') => {
    addNotification({
      type: 'success',
      title,
      message,
      icon: '✅'
    })
  }, [addNotification])

  const notifyError = useCallback((message, title = 'Error') => {
    addNotification({
      type: 'error',
      title,
      message,
      icon: '❌'
    })
  }, [addNotification])

  const notifyWarning = useCallback((message, title = 'Advertencia') => {
    addNotification({
      type: 'warning',
      title,
      message,
      icon: '⚠️'
    })
  }, [addNotification])

  const notifyInfo = useCallback((message, title = 'Información') => {
    addNotification({
      type: 'info',
      title,
      message,
      icon: 'ℹ️'
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