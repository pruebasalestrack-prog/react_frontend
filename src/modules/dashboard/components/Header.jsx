"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, Bell, User, LogOut, Settings } from "lucide-react"
import { useAuth } from "../../../shared/context/AuthContext"
import "./Header.css"

const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = useRef(null)

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button className="menu-button" onClick={onToggleSidebar} aria-label="Toggle menu">
          <Menu size={24} />
        </button>
        <div className="header-title">
          <h1>Dashboard</h1>
          <p className="database-info">
            Base de datos: <span>{user?.database || "N/A"}</span>
          </p>
        </div>
      </div>

      <div className="header-right">
        <button className="icon-button" aria-label="Notificaciones">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>

        <div className="user-menu-container" ref={menuRef}>
          <button className="user-button" onClick={() => setShowUserMenu(!showUserMenu)} aria-label="Menú de usuario">
            <img
              src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
              alt={user?.name || "Usuario"}
              className="user-avatar"
            />
            <div className="user-info">
              <span className="user-name">{user?.name || "Usuario"}</span>
              <span className="user-role">{user?.role || "user"}</span>
            </div>
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                className="user-dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="dropdown-header">
                  <img
                    src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
                    alt={user?.name || "Usuario"}
                  />
                  <div>
                    <p className="dropdown-name">{user?.name || "Usuario"}</p>
                    <p className="dropdown-email">{user?.email || "email@example.com"}</p>
                  </div>
                </div>

                <div className="dropdown-divider" />

                <button className="dropdown-item">
                  <User size={18} />
                  <span>Mi Perfil</span>
                </button>

                <button className="dropdown-item">
                  <Settings size={18} />
                  <span>Configuración</span>
                </button>

                <div className="dropdown-divider" />

                <button className="dropdown-item logout" onClick={handleLogout}>
                  <LogOut size={18} />
                  <span>Cerrar Sesión</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}

export default Header
