"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import "./LoadingScreen.css"

const LoadingScreen = ({ message = "Cargando", destination = "" }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        return prev + 2
      })
    }, 30)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Animated background - Verde claro elegante */}
      <div className="loading-background-elegant" />

      {/* Liquid effect particles */}
      <div className="loading-particles">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="particle-liquid"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{
              scale: 0,
              opacity: 0,
            }}
            animate={{
              scale: [0, Math.random() * 1.5 + 0.5, 0],
              opacity: [0, 0.7, 0],
              y: [0, -100 - Math.random() * 100],
              x: [0, (Math.random() - 0.5) * 100],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* MODAL CENTRAL ELEGANTE CON LIQUID EFFECT */}
      <motion.div
        className="loading-modal-elegant"
        initial={{ scale: 0.85, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 20,
          delay: 0.1,
        }}
      >
        {/* Liquid shine effect - Brillo líquido */}
        <motion.div
          className="liquid-shine"
          animate={{
            x: ["-200%", "200%"],
            y: ["-200%", "200%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Liquid glow effect - Resplandor líquido */}
        <motion.div
          className="liquid-glow"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="loading-content-elegant">
          {/* Logo GRANDE y espectacular */}
          <motion.div
            className="loading-logo-big"
            initial={{ scale: 0.3, opacity: 0, rotateY: -180 }}
            animate={{
              scale: 1,
              opacity: 1,
              rotateY: 0,
            }}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
          >
            <motion.div
              className="logo-container-wrapper"
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <motion.img
                src="/images/logo-pure.png"
                alt="ILCA Pure Innovacion Movil"
                className="loading-logo"
                animate={{
                  filter: [
                    "drop-shadow(0 20px 60px rgba(168, 230, 138, 0.9)) drop-shadow(0 0 40px rgba(197, 240, 184, 0.7))",
                    "drop-shadow(0 25px 80px rgba(168, 230, 138, 1)) drop-shadow(0 0 60px rgba(197, 240, 184, 1))",
                    "drop-shadow(0 20px 60px rgba(168, 230, 138, 0.9)) drop-shadow(0 0 40px rgba(197, 240, 184, 0.7))",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* Anillo brillante alrededor del logo */}
              <motion.div
                className="logo-ring"
                animate={{
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  },
                  scale: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              />
            </motion.div>
          </motion.div>

          {/* Company name - Más elegante */}
          <motion.h1
            className="loading-title-elegant"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.span
              animate={{
                textShadow: [
                  "0 0 20px rgba(168, 230, 138, 0.6), 0 4px 20px rgba(0, 0, 0, 0.3)",
                  "0 0 40px rgba(168, 230, 138, 1), 0 4px 25px rgba(0, 0, 0, 0.4)",
                  "0 0 20px rgba(168, 230, 138, 0.6), 0 4px 20px rgba(0, 0, 0, 0.3)",
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              ILCA - Pure Innovación Móvil
            </motion.span>
          </motion.h1>

          {/* Loading text elegante */}
          <motion.div
            className="loading-message-elegant"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <span>{message}</span>
            <motion.span className="loading-dots-elegant">
              {[0, 0.2, 0.4].map((delay, i) => (
                <motion.span
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay }}
                >
                  .
                </motion.span>
              ))}
            </motion.span>
          </motion.div>

          {/* Destination message elegante */}
          {destination && (
            <motion.p
              className="loading-destination-elegant"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              Redirigiendo a <strong>{destination}</strong>
            </motion.p>
          )}

          {/* Progress bar con liquid effect */}
          <motion.div
            className="loading-progress-elegant"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="progress-track">
              <motion.div
                className="progress-fill"
                initial={{ width: "0%" }}
                animate={{
                  width: `${progress}%`,
                }}
                transition={{
                  width: { duration: 0.3, ease: "easeOut" },
                }}
              />
              
              {/* Liquid glow en la barra */}
              <motion.div
                className="progress-liquid-glow"
                animate={{
                  x: ["-150%", "250%"],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>

            {/* Porcentaje elegante */}
            <motion.div
              className="loading-percentage-elegant"
              animate={{
                textShadow: [
                  "0 0 15px rgba(168, 230, 138, 0.6)",
                  "0 0 25px rgba(168, 230, 138, 0.9)",
                  "0 0 15px rgba(168, 230, 138, 0.6)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              {progress}%
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative circles - Más suaves */}
      <div className="loading-decorations">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className={`loading-circle-elegant loading-circle-${i}`}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.15, 0.3, 0.15],
              rotate: i % 2 === 0 ? [0, 360] : [360, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Spinning ring elegante */}
      <motion.div
        className="loading-ring-elegant"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  )
}

export default LoadingScreen