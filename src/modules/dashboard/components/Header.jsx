"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Bell, User, LogOut, Settings, Database, Check, 
  ChevronDown, Palette, Menu, Home, Lock, Activity
} from "lucide-react"
import { useAuth } from "../../../shared/context/AuthContext"
import { useTheme } from "../../../shared/context/ThemeContext"
import { useSessionLock } from "../../session-lock/SessionLockContext"
import { useConnections } from "./header/useConnections"
import { useNotifications } from "./header/notifications/hooks/useNotifications"
import LanguageSelector from "./header/languagedetector/LanguageSelector"
import "./Header.css"

const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { unreadCount, togglePanel } = useNotifications()
  const { lockSession } = useSessionLock()
  const navigate = useNavigate()
  const location = useLocation()
  
  const { 
    connections, 
    selectedConnection, 
    loading, 
    changeConnection,
    hasConnections 
  } = useConnections()
  
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showDatabaseMenu, setShowDatabaseMenu] = useState(false)
  
  const menuRef = useRef(null)
  const dbMenuRef = useRef(null)

  // Verificar si estamos en el dashboard (ruta exacta o index)
  const isOnDashboard = location.pathname === "/dashboard" || location.pathname === "/dashboard/"

  // 🔍 Debug al montar
  useEffect(() => {
    console.log("🎨 Header montado")
    console.log("👤 Usuario:", user?.email)
    console.log("🔌 Conexión seleccionada:", selectedConnection?.connection)
    console.log("🏢 Conexiones disponibles:", connections.length)
  }, [user, selectedConnection, connections])

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

  const handleLogout = useCallback(() => {
    logout()
    navigate("/login", { replace: true })
  }, [logout, navigate])

  const handleDatabaseChange = useCallback(async (connection) => {
    if (loading || connection.status === 'active') {
      console.log("⏳ Ya hay un cambio de conexión en proceso o conexión ya activa...")
      return
    }

    console.log("🔄 Header: Iniciando cambio de conexión a:", connection.name)
    
    const result = await changeConnection(connection)
    
    if (result.success) {
      console.log("✅ Header: Conexión cambiada exitosamente")
      setShowDatabaseMenu(false)
    } else {
      console.error("❌ Header: Error al cambiar conexión:", result.error)
    }
  }, [loading, changeConnection])

  const handleGoToDashboard = useCallback(() => {
    if (!isOnDashboard) {
      console.log("🏠 Navegando al dashboard desde:", location.pathname)
      navigate("/dashboard", { replace: true })
    } else {
      console.log("✅ Ya estamos en el dashboard")
    }
  }, [isOnDashboard, navigate, location.pathname])

  const handleLockScreen = useCallback(() => {
    console.log("🔒 Bloqueando pantalla manualmente")
    lockSession()
  }, [lockSession])

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
          {selectedConnection && (
            <p className="database-info">
              <Database size={14} style={{ display: "inline", marginRight: "4px" }} />
              <span>{selectedConnection.name}</span>
            </p>
          )}
        </div>
      </div>

      <div className="header-right">
        {/* 🌐 Selector de idiomas */}
        <LanguageSelector />

        {/* 🏠 Botón Home - Solo habilitado si NO estamos en dashboard */}
        <motion.button
          className={`icon-button home-button ${isOnDashboard ? "active" : ""}`}
          onClick={handleGoToDashboard}
          aria-label="Ir al Dashboard"
          whileHover={{ scale: isOnDashboard ? 1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={isOnDashboard ? "Ya estás en el Dashboard" : "Ir al Dashboard"}
          disabled={isOnDashboard}
        >
          <Home size={20} />
        </motion.button>

        {/* 🔒 Botón de bloqueo manual */}
        <motion.button
          className="icon-button lock-button"
          onClick={handleLockScreen}
          aria-label="Bloquear pantalla"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Bloquear pantalla"
        >
          <Lock size={20} />
        </motion.button>

        {/* 🎨 Botón de tema */}
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

        {/* 🗄️ Selector de base de datos */}
        <div className="database-selector-container" ref={dbMenuRef}>
          <motion.button
            className="icon-button database-button"
            onClick={() => setShowDatabaseMenu(!showDatabaseMenu)}
            aria-label="Seleccionar base de datos"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading || !hasConnections}
          >
            <Database size={20} />
            <ChevronDown size={16} className="chevron-icon" />
          </motion.button>

          <AnimatePresence>
            {showDatabaseMenu && (
              <motion.div
                className="database-dropdown"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="dropdown-header-title">
                  <Database size={18} />
                  <span>Conexiones Disponibles ({connections.length})</span>
                </div>
                <div className="dropdown-divider" />
                
                <div className="database-list">
                  {!hasConnections ? (
                    <div className="no-connections">
                      <Activity size={24} style={{ opacity: 0.5 }} />
                      <p>No hay conexiones disponibles</p>
                    </div>
                  ) : (
                    connections.map((db) => (
                      <motion.button
                        key={db.id}
                        className={`database-item ${db.status === 'active' ? "active" : ""}`}
                        onClick={() => handleDatabaseChange(db)}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                        disabled={loading || db.status === 'active'}
                      >
                        <div className="database-item-content">
                          <div className="database-item-header">
                            <span className="database-name">{db.name}</span>
                            {db.status === 'active' && (
                              <motion.div 
                                initial={{ scale: 0 }} 
                                animate={{ scale: 1 }} 
                                className="check-icon"
                              >
                                <Check size={16} />
                              </motion.div>
                            )}
                          </div>
                          <span className="database-description">{db.description}</span>
                          <span className="database-connection-id">{db.connection}</span>
                        </div>
                        <div className={`database-status ${db.status}`}>
                          <span className="status-dot"></span>
                          {db.status === "active" ? "Activa" : "Inactiva"}
                        </div>
                      </motion.button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 🔔 Notificaciones */}
        <motion.button
          className="icon-button"
          aria-label="Notificaciones"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={togglePanel}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </motion.button>

        {/* 👤 Menú de usuario */}
        <div className="user-menu-container" ref={menuRef}>
          <motion.button
            className="user-button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="Menú de usuario"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'default'}`}
              alt={user?.name || "Usuario"}
              className="user-avatar"
            />
            <div className="user-info">
              <span className="user-name">{user?.name || user?.email || "Usuario"}</span>
              <span className="user-role">
                {user?.tipo_usuario === "1" ? "Administrador" : "Usuario"}
              </span>
            </div>
          </motion.button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                className="user-dropdown"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="dropdown-header">
                  <img
                    src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'default'}`}
                    alt={user?.name || "Usuario"}
                  />
                  <div>
                    <p className="dropdown-name">{user?.name || user?.email || "Usuario"}</p>
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