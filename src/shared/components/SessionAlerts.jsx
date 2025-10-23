import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, Monitor, Clock, Shield } from "lucide-react"
import { useSession } from "../context/SessionContext"
import "../styles/SessionAlerts.css"

const SessionAlerts = () => {
  const { sessionAlert, closeSessionAlert } = useSession()

  if (!sessionAlert) return null

  const { type, message, onConfirm } = sessionAlert

  const handleConfirm = () => {
    if (onConfirm) onConfirm(true)
    closeSessionAlert()
  }

  const handleCancel = () => {
    if (onConfirm) onConfirm(false)
    closeSessionAlert()
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Si es una alerta de logout forzado, solo mostrar botón de aceptar
  const isForcedLogout = type === "forced-logout" || type === "remote-login"

  return (
    <AnimatePresence>
      <motion.div
        className="session-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={isForcedLogout ? handleConfirm : handleCancel}
      />
      <motion.div
        className="session-modal"
        initial={{ opacity: 0, scale: 0.8, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -50 }}
        transition={{ duration: 0.3, type: "spring" }}
      >
        <div className={`session-modal-icon ${isForcedLogout ? "error" : "warning"}`}>
          {isForcedLogout ? <AlertTriangle size={48} /> : <Monitor size={48} />}
        </div>
        <h2>{message.title}</h2>
        <p className="session-modal-message">{message.message}</p>

        {message.device && (
          <div className="session-details">
            <div className="session-detail-item">
              <Monitor size={18} />
              <span>Dispositivo: {message.device.substring(0, 50)}...</span>
            </div>
            <div className="session-detail-item">
              <Clock size={18} />
              <span>Último acceso: {formatDate(message.loginTime)}</span>
            </div>
          </div>
        )}

        {isForcedLogout ? (
          <div className="session-modal-actions">
            <button className="session-modal-button confirm full-width" onClick={handleConfirm}>
              Aceptar
            </button>
          </div>
        ) : (
          <>
            <div className="session-modal-actions">
              <button className="session-modal-button cancel" onClick={handleCancel}>
                Cancelar
              </button>
              <button className="session-modal-button confirm" onClick={handleConfirm}>
                Cerrar Sesión Remota
              </button>
            </div>

            <div className="session-warning">
              <Shield size={16} />
              <span>Si no fuiste tú, reporta al administrador</span>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default SessionAlerts