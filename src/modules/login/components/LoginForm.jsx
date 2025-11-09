"use client"
import { useState, useEffect } from "react"
import { Mail, Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import "./LoginForm.css"

const STORAGE_KEY = "savedEmail"

const LoginForm = ({ formData, errors, loading, showPassword, onSubmit, onChange, onTogglePassword }) => {
  const [activeTab, setActiveTab] = useState("login")
  const [recoverLoading, setRecoverLoading] = useState(false)
  const [recoverError, setRecoverError] = useState(null)
  const [recoverSuccess, setRecoverSuccess] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved && (!formData?.email || formData.email.trim() === "")) {
        if (typeof onChange === "function") {
          onChange({ target: { name: "email", value: saved } })
        }
      }
    } catch (e) {
      // Silenciar errores
    }
  }, [])

  useEffect(() => {
    if (!formData) return
    try {
      if (formData.remember) {
        if (formData.email && formData.email.trim() !== "") {
          localStorage.setItem(STORAGE_KEY, formData.email)
        }
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (e) {
      // Silenciar errores
    }
  }, [formData?.remember, formData?.email])

  const handleRecoverSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.email) {
      setRecoverError('Por favor ingresa tu correo electrónico')
      return
    }

    setRecoverLoading(true)
    setRecoverError(null)
    setRecoverSuccess(false)

    try {
      // ✅ FIX: Quitar el /api/ duplicado
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const endpoint = `${apiUrl}/api/forgot-password`
      
      console.log('🔍 Enviando solicitud a:', endpoint)
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email
        })
      })

      const data = await response.json()
      
      console.log('📨 Respuesta del servidor:', data)

      if (data.status) {
        setRecoverSuccess(true)
        setRecoverError(null)
      } else {
        setRecoverError(data.mensaje || data.error || 'Error al enviar correo de recuperación')
      }
    } catch (err) {
      console.error('❌ Error en recover:', err)
      setRecoverError('Error al procesar la solicitud. Intenta nuevamente.')
    } finally {
      setRecoverLoading(false)
    }
  }

  return (
    <motion.div
      className="login-form-container"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="login-form-card">
        {/* Pestañas */}
        <div className="tabs-container">
          <button
            className={`tab ${activeTab === "login" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("login")
              setRecoverError(null)
              setRecoverSuccess(false)
            }}
          >
            INICIAR SESIÓN
          </button>
          <button
            className={`tab ${activeTab === "recover" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("recover")
              setRecoverError(null)
              setRecoverSuccess(false)
            }}
          >
            RECUPERAR CLAVE
          </button>
        </div>

        {/* Contenido de Iniciar Sesión */}
        {activeTab === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="login-form-header"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2>Bienvenido</h2>
              <p>Ingresa tus credenciales para continuar</p>
            </motion.div>

            <form onSubmit={onSubmit} className="login-form">
              {errors?.general && (
                <motion.div
                  className="error-message general"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {errors.general}
                </motion.div>
              )}

              <motion.div
                className="form-group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <label htmlFor="email">Correo Electrónico</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={20} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    placeholder="usuario@dominio.com"
                    className={errors?.email ? "error" : ""}
                    disabled={loading}
                  />
                </div>
                {errors?.email && <span className="error-message">{errors.email}</span>}
              </motion.div>

              <motion.div
                className="form-group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <label htmlFor="password">Contraseña</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={onChange}
                    placeholder="••••••••"
                    className={errors?.password ? "error" : ""}
                    disabled={loading}
                  />
                </div>
                {errors?.password && <span className="error-message">{errors.password}</span>}
              </motion.div>

              <motion.div
                className="form-options"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={!!formData.remember}
                    onChange={onChange}
                    disabled={loading}
                  />
                  <span>RECORDAR USUARIO</span>
                </label>
              </motion.div>

              <motion.button
                type="submit"
                className="submit-button"
                disabled={loading}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <>
                    <Loader2 className="spinner" size={20} />
                    Ingresando...
                  </>
                ) : (
                  "iniciar sesión"
                )}
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* Contenido de Recuperar Clave */}
        {activeTab === "recover" && (
          <motion.div
            key="recover"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="login-form-header"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2>Recuperar Contraseña</h2>
              <p>Ingresa tu correo para recuperar tu contraseña</p>
            </motion.div>

            <form onSubmit={handleRecoverSubmit} className="login-form">
              {recoverError && (
                <motion.div
                  className="alert alert-error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <AlertCircle size={20} />
                  <span>{recoverError}</span>
                </motion.div>
              )}

              {recoverSuccess && (
                <motion.div
                  className="alert alert-success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <CheckCircle size={20} />
                  <span>
                    ¡Correo enviado exitosamente! Revisa tu bandeja de entrada en arcee1060@gmail.com
                  </span>
                </motion.div>
              )}

              <motion.div
                className="form-group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <label htmlFor="recover-email">Correo Electrónico</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={20} />
                  <input
                    type="email"
                    id="recover-email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    placeholder="usuario@dominio.com"
                    disabled={recoverLoading}
                  />
                </div>
              </motion.div>

              <motion.button
                type="submit"
                className="submit-button"
                disabled={recoverLoading}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                whileHover={{ scale: recoverLoading ? 1 : 1.02 }}
                whileTap={{ scale: recoverLoading ? 1 : 0.98 }}
              >
                {recoverLoading ? (
                  <>
                    <Loader2 className="spinner" size={20} />
                    Enviando...
                  </>
                ) : (
                  "RECUPERAR"
                )}
              </motion.button>
            </form>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default LoginForm