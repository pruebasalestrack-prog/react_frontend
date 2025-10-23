"use client"
import { Link } from "react-router-dom"
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import "./ForgotPasswordForm.css"

const ForgotPasswordForm = ({ email, error, loading, success, onChange, onSubmit, onReset }) => {
  if (success) {
    return (
      <motion.div
        className="forgot-password-success"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="success-icon">
          <CheckCircle size={64} />
        </div>
        <h2>¡Correo Enviado!</h2>
        <p>
          Hemos enviado las instrucciones para restablecer tu contraseña a <strong>{email}</strong>
        </p>
        <p className="success-note">Por favor revisa tu bandeja de entrada y sigue las instrucciones.</p>
        <div className="success-actions">
          <Link to="/login" className="back-to-login-button">
            <ArrowLeft size={20} />
            Volver al inicio de sesión
          </Link>
          <button onClick={onReset} className="resend-button">
            Enviar nuevamente
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="forgot-password-form-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="forgot-password-card">
        <motion.div
          className="forgot-password-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2>Cambio de Clave</h2>
          <p>¿Olvidó su contraseña? No te preocupes, te enviaremos las instrucciones para restablecerla</p>
        </motion.div>

        <form onSubmit={onSubmit} className="forgot-password-form">
          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </motion.div>
          )}

          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <label htmlFor="email">Correo Electrónico</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="info@pure.ec"
                disabled={loading}
                className={error ? "error" : ""}
              />
            </div>
          </motion.div>

          <motion.button
            type="submit"
            className="submit-button"
            disabled={loading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <Loader2 className="spinner" size={20} />
                Enviando...
              </>
            ) : (
              "Enviar"
            )}
          </motion.button>

          <motion.div
            className="back-to-login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <Link to="/login" className="back-link">
              <ArrowLeft size={18} />
              Volver al inicio de sesión
            </Link>
          </motion.div>
        </form>
      </div>
    </motion.div>
  )
}

export default ForgotPasswordForm
