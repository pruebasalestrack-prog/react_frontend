"use client"
import { useState } from "react"
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import "./LoginForm.css"

const LoginForm = ({ formData, errors, loading, showPassword, onSubmit, onChange, onTogglePassword }) => {
  const [activeTab, setActiveTab] = useState("login") // "login" o "recover"

  const handleRecoverSubmit = (e) => {
    e.preventDefault()
    // Aquí manejas la lógica de recuperación de contraseña
    console.log("Recuperar contraseña para:", formData.email)
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
            onClick={() => setActiveTab("login")}
          >
            INICIAR SESIÓN
          </button>
          <button
            className={`tab ${activeTab === "recover" ? "active" : ""}`}
            onClick={() => setActiveTab("recover")}
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
              {/* Error general */}
              {errors.general && (
                <motion.div
                  className="error-message general"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {errors.general}
                </motion.div>
              )}

              {/* Campo de email */}
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
                    placeholder="info@pure.ec"
                    className={errors.email ? "error" : ""}
                    disabled={loading}
                  />
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </motion.div>

              {/* Campo de contraseña */}
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
                    className={errors.password ? "error" : ""}
                    disabled={loading}
                  />
                  {/* <button
                    type="button"
                    className="toggle-password"
                    onClick={onTogglePassword}
                    disabled={loading}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button> */}
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </motion.div>

              {/* Recordar */}
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
                    checked={formData.remember}
                    onChange={onChange}
                    disabled={loading}
                  />
                  <span>RECORDAR CLAVE</span>
                </label>
              </motion.div>

              {/* Botón de submit */}
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
                  "LOGIN"
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
              {/* Campo de email */}
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
                    placeholder="info@pure.ec"
                    disabled={loading}
                  />
                </div>
              </motion.div>

              {/* Botón de recuperar */}
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