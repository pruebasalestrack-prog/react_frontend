"use client"

import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ExternalLink } from "lucide-react"
import "./Footer.css"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: "SOBRE NOSOTROS",
      content: {
        type: "text",
        text: "Plataforma moderna de gestión de bases de datos que te permite administrar, visualizar y analizar tu información de manera eficiente y segura.",
      },
    },
    {
      title: "PRODUCTOS",
      content: {
        type: "links",
        links: [
          { label: "Dashboard Analytics", path: "/dashboard" },
          { label: "Gestión de Datos", path: "/dashboard/tables" },
          { label: "Reportes Avanzados", path: "/dashboard/reports" },
          { label: "API Integration", path: "/dashboard/api" },
        ],
      },
    },
    {
      title: "ENLACES DE INTERÉS",
      content: {
        type: "links",
        links: [
          { label: "Términos y Condiciones", path: "/terms" },
          { label: "Quiénes Somos", path: "/about" },
          { label: "Libro de Reclamaciones", path: "/complaints" },
          { label: "Ayuda", path: "/help" },
        ],
      },
    },
    {
      title: "CONTÁCTANOS",
      content: {
        type: "contact",
        contacts: [
          { icon: MapPin, text: "Av. Principal 123, Lima, Perú" },
          { icon: Mail, text: "contacto@dashboard.com" },
          { icon: Phone, text: "+51 945 862 267" },
          { icon: Phone, text: "+51 945 456 125" },
        ],
      },
    },
  ]

  const socialLinks = [
    { icon: Facebook, url: "#", label: "Facebook" },
    { icon: Twitter, url: "#", label: "Twitter" },
    { icon: Linkedin, url: "#", label: "LinkedIn" },
    { icon: Instagram, url: "#", label: "Instagram" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.footer
      className="dashboard-footer"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="footer-content">
        <div className="footer-grid">
          {footerSections.map((section, index) => (
            <motion.div key={index} className="footer-section" variants={itemVariants}>
              <motion.h3 className="footer-title" whileHover={{ x: 5 }} transition={{ duration: 0.3 }}>
                {section.title}
                <motion.div
                  className="title-underline"
                  initial={{ width: 0 }}
                  whileInView={{ width: "60px" }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                />
              </motion.h3>

              {section.content.type === "text" && (
                <motion.p className="footer-description" variants={itemVariants}>
                  {section.content.text}
                </motion.p>
              )}

              {section.content.type === "links" && (
                <ul className="footer-links">
                  {section.content.links.map((link, linkIndex) => (
                    <motion.li
                      key={linkIndex}
                      variants={itemVariants}
                      whileHover={{ x: 8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <a href={link.path} className="footer-link">
                        <ExternalLink size={14} />
                        <span>{link.label}</span>
                      </a>
                    </motion.li>
                  ))}
                </ul>
              )}

              {section.content.type === "contact" && (
                <ul className="footer-contacts">
                  {section.content.contacts.map((contact, contactIndex) => {
                    const Icon = contact.icon
                    return (
                      <motion.li
                        key={contactIndex}
                        className="footer-contact-item"
                        variants={itemVariants}
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon size={16} className="contact-icon" />
                        <span>{contact.text}</span>
                      </motion.li>
                    )
                  })}
                </ul>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div className="footer-bottom" variants={itemVariants}>
          <motion.p
            className="footer-copyright"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {currentYear} Copyright: Derechos reservados - PURE TECH
          </motion.p>

          <motion.div
            className="footer-social"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {socialLinks.map((social, index) => {
              const Icon = social.icon
              return (
                <motion.a
                  key={index}
                  href={social.url}
                  className="social-link"
                  aria-label={social.label}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon size={18} />
                </motion.a>
              )
            })}
          </motion.div>
        </motion.div>
      </div>

      {/* Animated background elements */}
      <div className="footer-bg-elements">
        <motion.div
          className="bg-circle bg-circle-1"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="bg-circle bg-circle-2"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>
    </motion.footer>
  )
}

export default Footer
