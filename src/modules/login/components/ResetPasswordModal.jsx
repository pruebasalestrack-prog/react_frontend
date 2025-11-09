import { useState, useEffect } from 'react'
import { X, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './ResetPasswordModal.css'

const ResetPasswordModal = ({ isOpen, onClose, token, onSuccess }) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    if (isOpen) {
      setPassword('')
      setConfirmPassword('')
      setError(null)
      setSuccess(false)
      setValidationErrors({})
      setShowPassword(false)
      setShowConfirmPassword(false)
      
      // Debug: Verificar que el token existe
      console.log('🔑 Token recibido:', token)
      console.log('🔑 Tipo de token:', typeof token)
      console.log('🔑 Longitud del token:', token?.length)
      
      if (!token || token === 'undefined' || token === 'null') {
        setError('Token inválido. Por favor, solicita un nuevo enlace de recuperación.')
      }
    }
  }, [isOpen, token])

  const validateForm = () => {
    const errors = {}

    if (!password) {
      errors.password = 'La contraseña es requerida'
    } else if (password.length < 1) {
      errors.password = 'La contraseña debe tener al menos 1 carácter'
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Debes confirmar la contraseña'
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Verificar que el token existe antes de validar
    if (!token || token === 'undefined' || token === 'null') {
      setError('Token inválido. Por favor, solicita un nuevo enlace de recuperación.')
      return
    }
    
    if (!validateForm()) return

    setLoading(true)
    setError(null)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      
      console.log('🔄 Enviando reset password a:', `${apiUrl}/api/reset-password`)
      console.log('📤 Datos enviados:', {
        token: token,
        contrasena: '***',
        contrasena_confirmation: '***'
      })
      
      const response = await fetch(`${apiUrl}/api/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          contrasena: password,
          contrasena_confirmation: confirmPassword
        })
      })

      const data = await response.json()
      
      console.log('📨 Respuesta del servidor:', data)
      console.log('📨 Status HTTP:', response.status)

      if (response.ok && data.status) {
        setSuccess(true)
        onSuccess && onSuccess()
      } else {
        // Mensajes más específicos según el error
        if (data.mensaje && data.mensaje.includes('Token inválido')) {
          setError('El enlace de recuperación ha expirado o ya fue utilizado. Por favor, solicita uno nuevo.')
        } else {
          setError(data.mensaje || data.error || 'Error al cambiar la contraseña')
        }
      }
    } catch (err) {
      console.error('❌ Error en reset password:', err)
      setError('Error al procesar la solicitud. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay-reset" onClick={loading ? undefined : onClose}>
          <motion.div
            className="modal-content-reset"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <button 
              className="modal-close-reset" 
              onClick={onClose} 
              disabled={loading}
              type="button"
            >
              <X size={24} />
            </button>

            <div className="modal-header-reset">
              <motion.div 
                className="logo-container-reset"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <img src="/log.png" alt="Logo" className="modal-logo-reset" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Restablecer Contraseña
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Ingresa tu nueva contraseña segura
              </motion.p>
            </div>

            {success ? (
              <motion.div
                className="success-state-reset"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle size={64} className="success-icon-reset" />
                </motion.div>
                <h3>¡Contraseña Actualizada!</h3>
                <p>Tu contraseña ha sido cambiada exitosamente</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="modal-form-reset">
                {error && (
                  <motion.div
                    className="alert-reset alert-error-reset"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertCircle size={20} />
                    <span>{error}</span>
                  </motion.div>
                )}

                <motion.div 
                  className="form-group-reset"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label htmlFor="new-password">Nueva Contraseña</label>
                  <div className="input-wrapper-reset">
                    <Lock className="input-icon-reset" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={validationErrors.password ? 'error' : ''}
                      disabled={loading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="toggle-password-reset"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <motion.span 
                      className="error-message-reset"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {validationErrors.password}
                    </motion.span>
                  )}
                </motion.div>

                <motion.div 
                  className="form-group-reset"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label htmlFor="confirm-password">Confirmar Contraseña</label>
                  <div className="input-wrapper-reset">
                    <Lock className="input-icon-reset" size={20} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={validationErrors.confirmPassword ? 'error' : ''}
                      disabled={loading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="toggle-password-reset"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <motion.span 
                      className="error-message-reset"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {validationErrors.confirmPassword}
                    </motion.span>
                  )}
                </motion.div>

                <motion.button
                  type="submit"
                  className="submit-button-reset"
                  disabled={loading}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="spinner-reset" size={20} />
                      Cambiando Contraseña...
                    </>
                  ) : (
                    'Cambiar Contraseña'
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ResetPasswordModal