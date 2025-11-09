"use client"
import { NavLink, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import * as Icons from "lucide-react"
import { useState, useMemo, useEffect } from "react"
import { useAuth } from "../../../shared/context/AuthContext"
import "./Sidebar.css"

const defaultMenuGroups = [
  {
    title: "Principal",
    items: [
      {
        label: "Dashboard",
        icon: "LayoutDashboard",
        path: "/dashboard"
      },
      {
        label: "Inicio",
        icon: "Home",
        path: "/"
      }
    ]
  },
  {
    title: "Menú",
    items: [
      {
        label: "Configuración",
        icon: "Settings",
        path: "/settings"
      }
    ]
  }
]

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation()
  const { user } = useAuth()
  const [expandedItems, setExpandedItems] = useState({})
  const [isMobile, setIsMobile] = useState(false)

  // 📱 Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 🔍 DEBUG: Ver qué está recibiendo el Sidebar
  useEffect(() => {
    console.log("🎨 === SIDEBAR DEBUG ===")
    console.log("👤 Usuario:", user)
    console.log("⚙️ Sidebar Config:", user?.sidebarConfig)
    console.log("📋 Menu Groups:", user?.sidebarConfig?.menuGroups)
    console.log("🔢 Cantidad de grupos:", user?.sidebarConfig?.menuGroups?.length)
    
    if (user?.sidebarConfig?.menuGroups) {
      console.log("📦 Detalle de grupos:")
      user.sidebarConfig.menuGroups.forEach((group, index) => {
        console.log(`  Grupo ${index + 1}: ${group.title} - ${group.items.length} items`)
        group.items.forEach((item, itemIndex) => {
          console.log(`    Item ${itemIndex + 1}: ${item.label}`)
          if (item.subItems) {
            console.log(`      └─ ${item.subItems.length} sub-items`)
          }
        })
      })
    }
    
    console.log("🎨 === FIN DEBUG ===")
  }, [user])

  // ✨ Determinar qué menú usar: personalizado o por defecto
  const menuGroups = useMemo(() => {
    console.log("🔄 useMemo: Calculando menuGroups...")
    
    // Si el usuario tiene una configuración personalizada de sidebar, usarla
    if (user?.sidebarConfig?.menuGroups && user.sidebarConfig.menuGroups.length > 0) {
      console.log("📋 ✅ Usando sidebar personalizado para:", user.email)
      console.log("📦 Grupos a renderizar:", user.sidebarConfig.menuGroups.length)
      return user.sidebarConfig.menuGroups
    }
    
    // Si no, usar el sidebar por defecto
    console.log("📋 ⚠️ Usando sidebar por defecto para:", user?.email || "usuario")
    console.log("⚠️ Razón: No hay sidebarConfig o está vacío")
    return defaultMenuGroups
  }, [user])

  console.log("🎯 MenuGroups final a renderizar:", menuGroups)
  console.log("🎯 Total de grupos:", menuGroups.length)

  const toggleExpand = (label) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }))
  }

  // 🔧 Función para manejar el cierre del sidebar
  const handleCloseSidebar = (e) => {
    e.stopPropagation()
    console.log("🔴 Cerrando sidebar desde botón X")
    if (onToggle) {
      onToggle()
    }
  }

  // ✨ Función para obtener el componente de icono dinámicamente
  const getIcon = (iconName) => {
    const Icon = Icons[iconName]
    if (!Icon) {
      console.warn(`⚠️ Icono no encontrado: ${iconName}, usando Circle como fallback`)
    }
    return Icon || Icons.Circle // Fallback a Circle si no existe el icono
  }

  return (
    <>
      {/* Overlay para móvil */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`sidebar ${isOpen ? "open" : "closed"}`}
        initial={false}
        animate={{
          width: isOpen ? 280 : 80,
          x: 0,
        }}
        transition={{ duration: 0.15, ease: "easeInOut" }}
      >
        {/* 📱 Botón de cerrar SOLO en móvil */}
        {isMobile && isOpen && (
          <motion.button
            className="sidebar-close-btn"
            onClick={handleCloseSidebar}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icons.X size={20} />
          </motion.button>
        )}

        <div className="sidebar-user">
          <motion.div
            className="user-avatar"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          >
            {user?.name?.charAt(0) || "U"}
          </motion.div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="user-info"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <h4>{user?.name}</h4>
                <p>{user?.email}</p>
                {/* ✨ Mostrar el nombre de la base de datos si existe */}
                {user?.sidebarConfig?.name && (
                  <span style={{ 
                    fontSize: '0.65rem', 
                    color: 'var(--accent-color)', 
                    marginTop: '2px', 
                    display: 'block',
                    fontWeight: 600 
                  }}>
                    {user.sidebarConfig.name}
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="sidebar-nav">
          {menuGroups && menuGroups.length > 0 ? (
            menuGroups.map((group, groupIndex) => {
              console.log(`🎨 Renderizando grupo ${groupIndex + 1}:`, group.title)
              
              return (
                <div key={groupIndex} className="menu-group">
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        className="group-title"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {group.title}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {group.items && group.items.length > 0 ? (
                    group.items.map((item, itemIndex) => {
                      // ✨ Obtener icono dinámicamente
                      const Icon = getIcon(item.icon)
                      const hasSubItems = item.subItems && item.subItems.length > 0
                      const isExpanded = expandedItems[item.label]

                      console.log(`  └─ Item ${itemIndex + 1}: ${item.label} (hasSubItems: ${hasSubItems})`)

                      return (
                        <div key={itemIndex}>
                          {hasSubItems ? (
                            <>
                              <div
                                className={`sidebar-item ${isExpanded ? "expanded" : ""}`}
                                onClick={() => isOpen && toggleExpand(item.label)}
                              >
                                <Icon size={22} className="sidebar-item-icon" />
                                <AnimatePresence>
                                  {isOpen && (
                                    <motion.span
                                      className="sidebar-item-label"
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0, x: -10 }}
                                    >
                                      {item.label}
                                    </motion.span>
                                  )}
                                </AnimatePresence>
                                {isOpen && (
                                  <motion.div
                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="expand-icon"
                                  >
                                    <Icons.ChevronDown size={16} />
                                  </motion.div>
                                )}
                              </div>

                              <AnimatePresence>
                                {isExpanded && isOpen && (
                                  <motion.div
                                    className="sub-items"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    {item.subItems.map((subItem, subIndex) => {
                                      // ✨ Obtener icono dinámicamente para sub-items
                                      const SubIcon = getIcon(subItem.icon)

                                      return (
                                        <NavLink
                                          key={subIndex}
                                          to={subItem.path}
                                          className={({ isActive }) => 
                                            `sidebar-sub-item ${isActive ? "active" : ""}`
                                          }
                                          onClick={isMobile ? handleCloseSidebar : undefined}
                                        >
                                          <SubIcon size={18} className="sidebar-item-icon" />
                                          <span className="sidebar-item-label">{subItem.label}</span>
                                        </NavLink>
                                      )
                                    })}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </>
                          ) : (
                            <NavLink 
                              to={item.path} 
                              className={({ isActive }) => 
                                `sidebar-item ${isActive ? "active" : ""}`
                              }
                              onClick={isMobile ? handleCloseSidebar : undefined}
                            >
                              <Icon size={22} className="sidebar-item-icon" />
                              <AnimatePresence>
                                {isOpen && (
                                  <motion.span
                                    className="sidebar-item-label"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                  >
                                    {item.label}
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </NavLink>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <div style={{ padding: '10px', fontSize: '12px', color: '#999' }}>
                      No hay items en este grupo
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
              <p>No hay menús disponibles</p>
            </div>
          )}
        </nav>
      </motion.aside>
    </>
  )
}

export default Sidebar