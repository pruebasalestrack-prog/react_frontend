"use client"

import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'
import { useNotificationContext } from '../context/NotificationContext'

const NotificationItem = ({ notification }) => {
  const { removeNotification, markAsRead } = useNotificationContext()

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    warning: <AlertTriangle size={20} />,
    info: <Info size={20} />
  }

  const handleClose = (e) => {
    e.stopPropagation()
    removeNotification(notification.id)
  }

  const handleClick = () => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    if (notification.onClick) {
      notification.onClick()
    }
  }

  return (
    <div
      className={`notification-item notification-${notification.type} ${notification.read ? 'read' : ''}`}
      onClick={handleClick}
    >
      <div className="notification-icon">
        {notification.icon ? (
          <span className="notification-emoji">{notification.icon}</span>
        ) : (
          icons[notification.type]
        )}
      </div>

      <div className="notification-content">
        {notification.title && (
          <h4 className="notification-title">{notification.title}</h4>
        )}
        <p className="notification-message">{notification.message}</p>
        
        {/* 🕐 Mostrar fecha y hora */}
        {notification.formattedDate && (
          <p className="notification-timestamp">
            {notification.formattedDate}
          </p>
        )}
      </div>

      <button 
        className="notification-close"
        onClick={handleClose}
        aria-label="Cerrar notificación"
      >
        <X size={16} />
      </button>
    </div>
  )
}

export default NotificationItem