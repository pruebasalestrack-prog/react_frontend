"use client"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  BarChart3,
  Settings,
  ChevronDown,
  Database,
  Table,
  FileText,
  PieChart,
  TrendingUp,
  UserCog,
  Shield,
  Bell,
  Mail,
  Calendar,
  Package,
} from "lucide-react"
import { useState } from "react"
import { useAuth } from "../../../shared/context/AuthContext"
import "./Sidebar.css"

const menuGroups = [
  {
    title: "PRINCIPAL",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
      { icon: BarChart3, label: "Reportes", path: "/dashboard/reports" },
    ],
  },
  {
    title: "BASE DE DATOS",
    items: [
      {
        icon: Database,
        label: "Gestión de Datos",
        subItems: [
          { icon: Table, label: "Tablas", path: "/dashboard/tables" },
          { icon: FileText, label: "Registros", path: "/dashboard/records" },
          { icon: PieChart, label: "Consultas", path: "/dashboard/queries" },
        ],
      },
      {
        icon: Users,
        label: "Usuarios",
        subItems: [
          { icon: Users, label: "Lista de Usuarios", path: "/dashboard/users" },
          { icon: UserCog, label: "Roles y Permisos", path: "/dashboard/roles" },
          { icon: Shield, label: "Seguridad", path: "/dashboard/security" },
        ],
      },
    ],
  },
  {
    title: "PROYECTOS",
    items: [
      { icon: FolderKanban, label: "Mis Proyectos", path: "/dashboard/projects" },
      { icon: TrendingUp, label: "Estadísticas", path: "/dashboard/project-stats" },
      { icon: Package, label: "Recursos", path: "/dashboard/resources" },
    ],
  },
  {
    title: "COMUNICACIÓN",
    items: [
      { icon: Bell, label: "Notificaciones", path: "/dashboard/notifications" },
      { icon: Mail, label: "Mensajes", path: "/dashboard/messages" },
      { icon: Calendar, label: "Calendario", path: "/dashboard/calendar" },
    ],
  },
  {
    title: "CONFIGURACIÓN",
    items: [{ icon: Settings, label: "Ajustes", path: "/dashboard/settings" }],
  },
]

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation()
  const { user } = useAuth()
  const [expandedItems, setExpandedItems] = useState({})

  const toggleExpand = (label) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }))
  }

  return (
    <>
      {/* Overlay para móvil */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
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
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="sidebar-nav">
          {menuGroups.map((group, groupIndex) => (
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

              {group.items.map((item, itemIndex) => {
                const Icon = item.icon
                const hasSubItems = item.subItems && item.subItems.length > 0
                const isExpanded = expandedItems[item.label]
                const isActive = location.pathname === item.path

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
                              <ChevronDown size={16} />
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
                                const SubIcon = subItem.icon
                                const isSubActive = location.pathname === subItem.path

                                return (
                                  <Link
                                    key={subIndex}
                                    to={subItem.path}
                                    className={`sidebar-sub-item ${isSubActive ? "active" : ""}`}
                                  >
                                    <SubIcon size={18} className="sidebar-item-icon" />
                                    <span className="sidebar-item-label">{subItem.label}</span>
                                  </Link>
                                )
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link to={item.path} className={`sidebar-item ${isActive ? "active" : ""}`}>
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
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </nav>
      </motion.aside>
    </>
  )
}

export default Sidebar