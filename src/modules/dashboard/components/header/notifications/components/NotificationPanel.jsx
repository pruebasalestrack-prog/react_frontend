"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, CheckCheck } from 'lucide-react'
import { useNotificationContext } from '../context/NotificationContext'
import NotificationItem from './NotificationItem'

const NotificationPanel = () => {
  const { 
    notifications, 
    showPanel, 
    closePanel, 
    clearAll, 
    markAllAsRead,
    unreadCount 
  } = useNotificationContext()

  return (
    <AnimatePresence>
      {showPanel && (
        <>
          {/* Overlay */}
          <motion.div
            className="notification-panel-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closePanel}
          />

          {/* Panel - Solo animación horizontal desde la derecha */}
          <motion.div
            className="notification-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: "tween",
              duration: 0.3,
              ease: "easeInOut"
            }}
          >
            {/* Header */}
            <div className="notification-panel-header">
              <div className="notification-panel-title">
                <h3>Notificaciones</h3>
                {unreadCount > 0 && (
                  <span className="notification-panel-badge">{unreadCount}</span>
                )}
              </div>

              <div className="notification-panel-actions">
                {notifications.length > 0 && (
                  <>
                    <button
                      className="notification-panel-action-btn"
                      onClick={markAllAsRead}
                      title="Marcar todas como leídas"
                    >
                      <CheckCheck size={18} />
                    </button>
                    <button
                      className="notification-panel-action-btn"
                      onClick={clearAll}
                      title="Limpiar todas"
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
                <button
                  className="notification-panel-close-btn"
                  onClick={closePanel}
                  aria-label="Cerrar panel"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Lista de notificaciones */}
            <div className="notification-panel-list">
              {notifications.length === 0 ? (
                <div className="notification-panel-empty">
                  <div className="notification-panel-empty-icon">📭</div>
                  <p>No hay notificaciones</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <NotificationItem notification={notification} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default NotificationPanel