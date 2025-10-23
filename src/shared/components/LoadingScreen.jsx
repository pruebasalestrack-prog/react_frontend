"use client"

import { motion } from "framer-motion"
import "./LoadingScreen.css"

const LoadingScreen = ({ message = "Cargando", destination = "" }) => {
  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Animated background with enhanced breathing effect */}
      <div className="loading-background" />

      {/* Particle effects for premium look */}
      <div className="loading-particles">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="loading-content">
        {/* Enhanced animated logo with 3D effect */}
        <motion.div
          className="loading-logo-container"
          initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
          animate={{
            scale: [0.5, 1.1, 1],
            opacity: 1,
            rotateY: 0,
            y: [0, -15, 0],
          }}
          transition={{
            scale: { duration: 0.8 },
            rotateY: { duration: 0.8 },
            y: {
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
          }}
        >
          <motion.img
            src="/images/logo-pure.png"
            alt="ILCA Pure Innovacion Movil"
            className="loading-logo"
            animate={{
              filter: [
                "drop-shadow(0 10px 40px rgba(126, 217, 87, 0.6))",
                "drop-shadow(0 15px 60px rgba(126, 217, 87, 0.9))",
                "drop-shadow(0 10px 40px rgba(126, 217, 87, 0.6))",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Company name with enhanced animation */}
        <motion.h1
          className="loading-title"
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <motion.span
            animate={{
              textShadow: [
                "0 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(126, 217, 87, 0.5)",
                "0 4px 25px rgba(0, 0, 0, 0.4), 0 0 60px rgba(126, 217, 87, 0.8)",
                "0 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(126, 217, 87, 0.5)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            ILCA - Pure Innovación Móvil
          </motion.span>
        </motion.h1>

        {/* Loading text with enhanced dots animation */}
        <motion.div
          className="loading-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <span>{message}</span>
          <motion.span className="loading-dots">
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
            >
              .
            </motion.span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.3 }}
            >
              .
            </motion.span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.6 }}
            >
              .
            </motion.span>
          </motion.span>
        </motion.div>

        {/* Destination message with slide animation */}
        {destination && (
          <motion.p
            className="loading-destination"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
              →
            </motion.span>{" "}
            Redirigiendo a {destination}
          </motion.p>
        )}

        {/* Enhanced animated progress bar with gradient */}
        <div className="loading-progress-container">
          <motion.div
            className="loading-progress-bar"
            initial={{ width: "0%", x: "-100%" }}
            animate={{
              width: "100%",
              x: "0%",
            }}
            transition={{
              width: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
              x: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            }}
          />
          <motion.div
            className="loading-progress-glow"
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        </div>

        {/* Enhanced decorative animated circles with 3D effect */}
        <div className="loading-decorations">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className={`loading-circle loading-circle-${i}`}
              animate={{
                scale: [1, 1.2 + i * 0.1, 1],
                opacity: [0.2, 0.5 + i * 0.1, 0.2],
                rotate: [0, 360],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Spinning ring effect */}
        <motion.div
          className="loading-ring"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      </div>
    </motion.div>
  )
}

export default LoadingScreen
