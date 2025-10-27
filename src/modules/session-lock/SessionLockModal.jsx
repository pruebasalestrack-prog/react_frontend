"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Eye, EyeOff, AlertCircle, User } from 'lucide-react'
import { useSessionLock } from './SessionLockContext'
import { useAuth } from '../../shared/context/AuthContext'
import './SessionLockModal.css'

const SessionLockModal = () => {
  const { isLocked, unlockSession } = useSessionLock()
  const { user } = useAuth()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)

  // Resetear estados cuando se abre el modal
  useEffect(() => {
    if (isLocked) {
      setPassword('')
      setError('')
      setAttempts(0)
      setShowPassword(false)
      
      // 🔍 DEBUG: Mostrar información del usuario
      console.log('🔒 Modal de bloqueo abierto')
      console.log('👤 Usuario actual:', user)
      console.log('📧 Email:', user?.email)
      console.log('👤 Username:', user?.username || user?.name)
    }
  }, [isLocked, user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!password) {
      setError('Por favor, ingresa tu contraseña')
      return
    }

    console.log('🔐 Intentando desbloquear con contraseña:', password)
    
    setIsLoading(true)
    setError('')

    // Simular delay de validación
    await new Promise(resolve => setTimeout(resolve, 500))

    const isValid = unlockSession(password)

    if (isValid) {
      console.log('✅ Contraseña válida, desbloqueando...')
      setPassword('')
      setError('')
      setIsLoading(false)
    } else {
      console.log('❌ Contraseña inválida')
      setAttempts(prev => prev + 1)
      setError('Contraseña incorrecta')
      setPassword('')
      setIsLoading(false)
      
      // Vibrar si hay soporte
      if (navigator.vibrate) {
        navigator.vibrate(200)
      }
    }
  }

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    console.log('📝 Contraseña actual:', newPassword)
    if (error) {
      setError('')
    }
  }

  if (!isLocked) return null

  return (
    <AnimatePresence>
      <motion.div
        className="session-lock-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="session-lock-modal-compact"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.5 }}
        >
          {/* Icono de bloqueo */}
          <motion.div
            className="lock-icon-container-compact"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <div className="lock-icon-bg-compact">
              <Lock className="lock-icon-compact" size={32} />
            </div>
          </motion.div>

          {/* Título */}
          <motion.div
            className="lock-header-compact"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="lock-title-compact">Sesión Bloqueada</h2>
            <p className="lock-subtitle-compact">
              Ingresa tu contraseña para continuar
            </p>
          </motion.div>

          {/* Usuario */}
          <motion.div
            className="user-info-lock-compact"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="user-avatar-lock-compact">
              <User size={20} />
            </div>
            <div className="user-details-lock-compact">
              <p className="user-name-lock-compact">{user?.username || user?.name || 'Usuario'}</p>
              <p className="user-email-lock-compact">{user?.email || ''}</p>
            </div>
          </motion.div>

          {/* Formulario */}
          <motion.form
            onSubmit={handleSubmit}
            className="lock-form-compact"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="password-input-wrapper-lock-compact">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Contraseña"
                className={`password-input-lock-compact ${error ? 'input-error' : ''}`}
                disabled={isLoading}
                autoFocus
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password-lock-compact"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="error-message-lock-compact"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botón */}
            <button
              type="submit"
              className={`unlock-button-compact ${isLoading ? 'loading' : ''}`}
              disabled={isLoading || !password}
            >
              {isLoading ? (
                <>
                  <span className="spinner-lock-compact"></span>
                  Verificando...
                </>
              ) : (
                <>
                  <Lock size={18} />
                  Desbloquear
                </>
              )}
            </button>
          </motion.form>

          {/* Footer */}
          {attempts > 0 && (
            <motion.div
              className="lock-footer-compact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="attempts-info-compact">
                Intentos fallidos: {attempts}
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default SessionLockModal