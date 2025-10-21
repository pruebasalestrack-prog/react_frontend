"use client"
import { motion } from "framer-motion"
import "./Header.css"

const Header = () => {
  return (
    <motion.header
      className="app-header"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="header-content">
        <div className="logo-section">
          <img src="/log.png" alt="Pure Innovación Móvil" className="header-logo" />
        </div>
        <nav className="header-nav">
          <a href="#inicio" className="nav-link">Inicio</a>
          <a href="#servicios" className="nav-link">Servicios</a>
          <a href="#contacto" className="nav-link">Contacto</a>
        </nav>
        <div className="header-actions">
          <span className="header-title">Sistema de Gestión</span>
        </div>
      </div>
    </motion.header>
  )
}

export default Header