"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Eye, EyeOff, AlertCircle, User } from "lucide-react"
import { useSessionLock } from "./SessionLockContext"
import { useAuth } from "../../shared/context/AuthContext"
import "./SessionLockModal.css"

export default function SessionLockModal() {
  const { isLocked, showExpireModal, unlockSession, isUnlocking, timeUntilExpire } = useSessionLock()
  const { user } = useAuth()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Formatear tiempo restante
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Manejar desbloqueo
  const handleUnlock = async (e) => {
    e.preventDefault()
    
    if (!password.trim()) {
      setError("Por favor, ingresa tu contraseña")
      return
    }

    setError("")
    
    const success = await unlockSession(password)
    
    if (success) {
      console.log("✅ Sesión desbloqueada exitosamente")
      setPassword("")
      setError("")
      setShowPassword(false)
    } else {
      setError("Contraseña incorrecta. Intenta nuevamente.")
    }
  }

  // 🚨 Modal de sesión expirada
  if (showExpireModal) {
    return (
      <AnimatePresence>
        <div className="session-lock-overlay">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="session-lock-modal-compact"
            style={{ textAlign: "center", padding: "3rem 2rem" }}
          >
            <div className="lock-icon-container-compact">
              <div 
                className="lock-icon-bg-compact" 
                style={{ background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" }}
              >
                <AlertCircle className="lock-icon-compact" size={32} />
              </div>
            </div>
            
            <h2 className="lock-title-compact" style={{ color: "#dc2626", marginBottom: "0.75rem" }}>
              Sesión Expirada
            </h2>
            
            <p className="lock-subtitle-compact" style={{ marginBottom: "2rem" }}>
              Tu sesión ha expirado por inactividad.
              <br />
              Serás redirigido al inicio de sesión.
            </p>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
              <div className="spinner-lock-compact"></div>
              <span style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: 500 }}>
                Cerrando sesión...
              </span>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    )
  }

  // 🔒 Modal de bloqueo por inactividad
  if (!isLocked) return null

  return (
    <AnimatePresence>
      <div className="session-lock-overlay">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="session-lock-modal-compact"
        >
          {/* Icono de bloqueo */}
          <div className="lock-icon-container-compact">
            <div className="lock-icon-bg-compact">
              <Lock className="lock-icon-compact" size={32} />
            </div>
          </div>

          {/* Header */}
          <div className="lock-header-compact">
            <h2 className="lock-title-compact">Sesión Bloqueada</h2>
            <p className="lock-subtitle-compact">
              Tu sesión se bloqueó por inactividad
            </p>
          </div>

          {/* Timer - Contador grande */}
          <div style={{
            background: timeUntilExpire <= 10 
              ? "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)" 
              : "linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)",
            borderRadius: "16px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
            border: timeUntilExpire <= 10 ? "2px solid #fca5a5" : "2px solid #fdba74",
            textAlign: "center"
          }}>
            <p style={{ 
              fontSize: "0.75rem", 
              color: "#64748b", 
              marginBottom: "0.5rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>
              ⏰ Tiempo restante
            </p>
            <motion.p
              key={timeUntilExpire}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              style={{ 
                fontSize: "3rem", 
                fontWeight: 700,
                color: timeUntilExpire <= 10 ? "#dc2626" : "#ea580c",
                margin: 0,
                lineHeight: 1
              }}
              className={timeUntilExpire <= 10 ? "animate-pulse-slow" : ""}
            >
              {formatTime(timeUntilExpire)}
            </motion.p>
          </div>

          {/* Usuario */}
          <div className="user-info-lock-compact">
            <div className="user-avatar-lock-compact">
              <User size={20} />
            </div>
            <div className="user-details-lock-compact">
              <p className="user-name-lock-compact">
                {user?.name || "Usuario"}
              </p>
              <p className="user-email-lock-compact">
                {user?.email || "email@ejemplo.com"}
              </p>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleUnlock} className="lock-form-compact">
            <div className="password-input-wrapper-lock-compact">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError("")
                }}
                className={`password-input-lock-compact ${error ? "input-error" : ""}`}
                placeholder="Ingresa tu contraseña"
                autoFocus
                disabled={isUnlocking}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password-lock-compact"
                tabIndex={-1}
                disabled={isUnlocking}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="error-message-lock-compact"
              >
                <AlertCircle size={14} />
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isUnlocking || !password.trim()}
              className={`unlock-button-compact ${isUnlocking ? "loading" : ""}`}
            >
              {isUnlocking ? (
                <>
                  <div className="spinner-lock-compact"></div>
                  <span>Desbloqueando...</span>
                </>
              ) : (
                <>
                  <Lock size={18} />
                  <span>Desbloquear Sesión</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="lock-footer-compact">
            {timeUntilExpire <= 10 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="attempts-info-compact"
              >
                ⚠️ La sesión se cerrará en {formatTime(timeUntilExpire)}
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}