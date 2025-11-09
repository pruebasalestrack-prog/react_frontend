"use client"

import { AnimatePresence } from 'framer-motion'
import { useNotificationContext } from '../context/NotificationContext'
import NotificationItem from './NotificationItem'
import '../styles/Notifications.css'

const NotificationContainer = () => {
  const { notifications } = useNotificationContext()

  return (
    <div className="notification-container">
      <AnimatePresence mode="popLayout">
        {notifications.slice(0, 5).map((notification) => (
          <NotificationItem 
            key={notification.id} 
            notification={notification} 
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default NotificationContainer