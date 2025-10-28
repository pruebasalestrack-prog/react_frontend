"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../shared/context/AuthContext"
import { useSession } from "../../../shared/context/SessionContext"
import { loginUser, recoverPassword } from "../api/authApi"

export const useLoginController = () => {
  const navigate = useNavigate()
  const { login, showLoading, hideLoading } = useAuth()
  const { checkActiveSession, createSession, forceCloseRemoteSession, showSessionAlert } = useSession()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("login")

  // Validar email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validar formulario
  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = "El email es requerido"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email inválido"
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    }


    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  // Proceder con el login después de confirmar
  const proceedWithLogin = async (userData, forceLogin = false) => {
    try {
      const userId = userData.id
      // IMPORTANTE: userData debe tener companies, name, email, etc.
      // El loginUser debe devolver el user completo que da tu API

      // Si es forzado, cerrar sesión remota
      if (forceLogin) {
        forceCloseRemoteSession(userId)
      }

      // Crear nueva sesión
      createSession(userId, userData.database || "default_db", userData)

      // Guardar usuario en el contexto (userData trae companies!)
      login(userData)

      // Si la API devuelve un token, guardarlo
      if (userData.token) {
        localStorage.setItem("authToken", userData.token)
        console.log("🔑 Token guardado")
      }

      setTimeout(() => {
        navigate("/dashboard")
        setTimeout(() => {
          hideLoading()
          setLoading(false)
        }, 800)
      }, 500)
    } catch (error) {
      console.error("❌ Error en proceedWithLogin:", error)
      hideLoading()
      setLoading(false)
      setErrors({
        general: error.message || "Error al iniciar sesión. Por favor, intenta de nuevo.",
      })
    }
  }

  // Manejar submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    showLoading("Conectando con el servidor", "")

    try {
      console.log("📡 Iniciando login con:", formData.email)

      // Llamar a la API de login real, que debe devolver el OBJETO user completo (con companies)
      const userData = await loginUser(formData.email, formData.password)

      console.log("✅ Login exitoso:", {
        id: userData.id,
        email: userData.email,
        database: userData.database,
        companies: userData.companies,
      })

      // Actualizar mensaje de carga
      showLoading("Verificando sesión", "")

      // Verificar si hay sesión activa
      const sessionCheck = await checkActiveSession(userData.id, userData.database || "default_db")

      if (sessionCheck.hasActiveSession) {
        hideLoading()
        setLoading(false)

        // Mostrar alerta de sesión activa
        showSessionAlert(
          "active-session",
          {
            title: "Sesión Activa Detectada",
            message: "Ya existe una sesión activa en otro dispositivo. ¿Deseas cerrar esa sesión e iniciar aquí?",
            device: sessionCheck.sessionData.userAgent,
            loginTime: sessionCheck.sessionData.loginTime,
          },
          (confirm) => {
            if (confirm) {
              setLoading(true)
              showLoading("Iniciando sesión", "Dashboard")
              proceedWithLogin(userData, true)
            }
          }
        )
      } else {
        // No hay sesión activa, proceder normalmente
        showLoading("Iniciando sesión", "Dashboard")
        await proceedWithLogin(userData, false)
      }
    } catch (error) {
      console.error("❌ Error en handleSubmit:", error)
      hideLoading()
      setLoading(false)
      setErrors({
        general: error.message || "Error al iniciar sesión. Por favor, intenta de nuevo.",
      })
    }
  }

  // Manejar recuperación de contraseña
  const handleForgotPassword = async (e) => {
    e.preventDefault()

    if (!formData.email) {
      setErrors({ email: "El email es requerido" })
      return
    }

    if (!validateEmail(formData.email)) {
      setErrors({ email: "Email inválido" })
      return
    }

    setLoading(true)
    showLoading("Enviando correo de recuperación", "")

    try {
      console.log("📧 Enviando correo de recuperación a:", formData.email)

      // Llamar a la API de recuperación de contraseña
      await recoverPassword(formData.email)

      hideLoading()
      setLoading(false)

      setErrors({
        success: "Se ha enviado un correo con instrucciones para recuperar tu contraseña",
      })

      setTimeout(() => {
        setActiveTab("login")
        setErrors({})
      }, 2000)
    } catch (error) {
      console.error("❌ Error en handleForgotPassword:", error)
      hideLoading()
      setLoading(false)
      setErrors({
        general: error.message || "Error al enviar el correo. Por favor, intenta de nuevo.",
      })
    }
  }

  // Toggle mostrar/ocultar contraseña
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return {
    formData,
    errors,
    loading,
    showPassword,
    activeTab,
    handleChange,
    handleSubmit,
    togglePasswordVisibility,
    setActiveTab,
    handleForgotPassword,
  }
}