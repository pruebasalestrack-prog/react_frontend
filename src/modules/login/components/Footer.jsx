"use client"
import { motion } from "framer-motion"
import "./Footer.css"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <motion.footer
      className="app-footer"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="footer-content">
        <div className="footer-section">
          <p className="footer-text">
            © {currentYear} Pure Innovación Móvil
          </p>
        </div>
        <div className="footer-section footer-links">
          <a href="#privacidad" className="footer-link">Privacidad</a>
          <span className="footer-separator">•</span>
          <a href="#terminos" className="footer-link">Términos</a>
          <span className="footer-separator">•</span>
          <a href="#soporte" className="footer-link">Soporte</a>
        </div>
        <div className="footer-section">
          <p className="footer-text footer-rights">
            Todos los derechos reservados
          </p>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer