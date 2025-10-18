"use client"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { LayoutDashboard, Users, FolderKanban, BarChart3, Settings, ChevronLeft, ChevronRight } from "lucide-react"
import "./Sidebar.css"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Usuarios", path: "/dashboard/users" },
  { icon: FolderKanban, label: "Proyectos", path: "/dashboard/projects" },
  { icon: BarChart3, label: "Reportes", path: "/dashboard/reports" },
  { icon: Settings, label: "Configuración", path: "/dashboard/settings" },
]

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation()

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
        {/* Logo */}
        <div className="sidebar-logo">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.img
                key="full-logo"
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-pure-AalqbRLxllJnvWZHMemtjzPPt3dl2C.png"
                alt="Pure Innovación Móvil"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            ) : (
              <motion.img
                key="icon-logo"
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-pure2-xU0cXXbfD0rE3U8xTmL513t9gSlMOM.png"
                alt="Pure"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Toggle button */}
        <button className="sidebar-toggle" onClick={onToggle} aria-label={isOpen ? "Cerrar sidebar" : "Abrir sidebar"}>
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>

        {/* Menu items */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <Link key={item.path} to={item.path} className={`sidebar-item ${isActive ? "active" : ""}`}>
                <Icon size={22} className="sidebar-item-icon" />
                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      className="sidebar-item-label"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )
          })}
        </nav>
      </motion.aside>
    </>
  )
}

export default Sidebar
