"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, User, LogOut, Settings, Database, Check, ChevronDown, Palette, Menu, Home } from "lucide-react"
import { useAuth } from "../../../shared/context/AuthContext"
import { useTheme } from "../../../shared/context/ThemeContext"
import "./Header.css"

const availableDatabases = [
  { id: 1, name: "Production DB", description: "Base de datos principal", status: "active" },
  { id: 2, name: "Development DB", description: "Base de datos de desarrollo", status: "active" },
  { id: 3, name: "Testing DB", description: "Base de datos de pruebas", status: "active" },
  { id: 4, name: "Analytics DB", description: "Base de datos de análisis", status: "active" },
]

const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showDatabaseMenu, setShowDatabaseMenu] = useState(false)
  const [selectedDatabase, setSelectedDatabase] = useState(availableDatabases[0])
  const [isNavigating, setIsNavigating] = useState(false)
  const menuRef = useRef(null)
  const dbMenuRef = useRef(null)

  const isOnDashboard = location.pathname === "/dashboard" || location.pathname === "/"

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
      if (dbMenuRef.current && !dbMenuRef.current.contains(event.target)) {
        setShowDatabaseMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handleDatabaseChange = (database) => {
    setSelectedDatabase(database)
    setShowDatabaseMenu(false)
  }

  const handleGoToDashboard = () => {
    if (!isOnDashboard) {
      setIsNavigating(true)
      setTimeout(() => {
        navigate("/dashboard")
        setIsNavigating(false)
      }, 300)
    }
  }

  return (
    <motion.header
      className={`dashboard-header theme-${theme}`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="header-left">
        <motion.button
          className="hamburger-button"
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Menu size={20} />
        </motion.button>
        <div className="header-title">
          <h1>Dashboard</h1>
          <p className="database-info">
            <Database size={14} style={{ display: "inline", marginRight: "4px" }} />
            <span>{selectedDatabase.name}</span>
          </p>
        </div>
      </div>

      <div className="header-right">
        {/* Botón Home/Dashboard */}
        <motion.button
          className={`icon-button home-button ${isOnDashboard ? "active" : ""} ${isNavigating ? "navigating" : ""}`}
          onClick={handleGoToDashboard}
          aria-label="Ir al Dashboard"
          whileHover={{ scale: isOnDashboard ? 1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Ir al Dashboard"
          disabled={isOnDashboard}
        >
          <motion.div
            animate={isNavigating ? { rotate: 360 } : {}}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Home size={20} />
          </motion.div>
        </motion.button>

        <motion.button
          className="icon-button theme-button"
          onClick={toggleTheme}
          aria-label="Cambiar tema"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={theme === "green" ? "Cambiar a tema claro" : "Cambiar a tema verde"}
        >
          <Palette size={20} />
        </motion.button>

        <div className="database-selector-container" ref={dbMenuRef}>
          <motion.button
            className="icon-button database-button"
            onClick={() => setShowDatabaseMenu(!showDatabaseMenu)}
            aria-label="Seleccionar base de datos"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Database size={20} />
            <ChevronDown size={16} className="chevron-icon" />
          </motion.button>

          <AnimatePresence>
            {showDatabaseMenu && (
              <motion.div
                className="database-dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="dropdown-header-title">
                  <Database size={18} />
                  <span>Bases de Datos Disponibles</span>
                </div>
                <div className="dropdown-divider" />
                <div className="database-list">
                  {availableDatabases.map((db) => (
                    <motion.button
                      key={db.id}
                      className={`database-item ${selectedDatabase.id === db.id ? "active" : ""}`}
                      onClick={() => handleDatabaseChange(db)}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="database-item-content">
                        <div className="database-item-header">
                          <span className="database-name">{db.name}</span>
                          {selectedDatabase.id === db.id && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="check-icon">
                              <Check size={16} />
                            </motion.div>
                          )}
                        </div>
                        <span className="database-description">{db.description}</span>
                      </div>
                      <div className={`database-status ${db.status}`}>
                        <span className="status-dot"></span>
                        {db.status}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          className="icon-button"
          aria-label="Notificaciones"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </motion.button>

        <div className="user-menu-container" ref={menuRef}>
          <motion.button
            className="user-button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="Menú de usuario"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img
              src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
              alt={user?.name || "Usuario"}
              className="user-avatar"
            />
            <div className="user-info">
              <span className="user-name">{user?.name || "Usuario"}</span>
              <span className="user-role">{user?.role || "Admin"}</span>
            </div>
          </motion.button>

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
    </motion.header>
  )
}

export default Header