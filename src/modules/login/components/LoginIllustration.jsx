"use client"
import { motion } from "framer-motion"
import "./LoginIllustration.css"

const LoginIllustration = () => {
  return (
    <motion.div
      className="login-illustration"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Logo animado con movimiento flotante */}
      <motion.div
        className="logo-container"
        animate={{
          y: [0, -15, 0],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <img 
          src="/public/log.png" 
          alt="Pure Innovación Móvil" 
          className="logo-image"
          style={{ display: 'block', margin: '0 auto' }}
        />
      </motion.div>

      {/* Ilustración principal con movimiento flotante */}
      <motion.div
        className="main-illustration"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          y: [0, -12, 0],
        }}
        transition={{
          scale: { duration: 0.8, delay: 0.2 },
          opacity: { duration: 0.8, delay: 0.2 },
          y: {
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0.5,
          },
        }}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <img
          src="/public/portada.png"
          alt="Innovación Móvil"
          className="illustration-image"
          style={{ width: '300px', height: 'auto', display: 'block', margin: '0 auto' }} 
        />
      </motion.div>

      {/* Elementos decorativos animados */}
      <div className="decorative-elements">
        <motion.div
          className="circle circle-1"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="circle circle-2"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="circle circle-3"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.25, 0.55, 0.25],
          }}
          transition={{
            duration: 4.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Texto descriptivo con animación */}
      <motion.div
        className="illustration-text"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        {/* <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          ILCA - Pure Innovación Móvil
        </motion.h3> */}
        {/* <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          Transformando ideas en soluciones móviles innovadoras
        </motion.p> */}
      </motion.div>
    </motion.div>
  )
}

export default LoginIllustration