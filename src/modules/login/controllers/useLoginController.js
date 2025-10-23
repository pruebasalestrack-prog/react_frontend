"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../shared/context/AuthContext"
import { useSession } from "../../../shared/context/SessionContext"
import { loginUser } from "../api/authApi"

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
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
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
      const databaseId = userData.databaseData?.id || "default_db"

      // Si es forzado, cerrar sesión remota
      if (forceLogin) {
        forceCloseRemoteSession(userId, databaseId)
      }

      // Crear nueva sesión
      createSession(userId, databaseId, userData)

      // Guardar usuario en el contexto
      login(userData)

      setTimeout(() => {
        navigate("/dashboard")
        setTimeout(() => {
          hideLoading()
          setLoading(false)
        }, 800)
      }, 500)
    } catch (error) {
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
    showLoading("Verificando sesión", "")

    try {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Llamar a la API de login
      const userData = await loginUser(formData.email, formData.password)
      const userId = userData.id
      const databaseId = userData.databaseData?.id || "default_db"

      // Verificar si hay sesión activa
      const sessionCheck = await checkActiveSession(userId, databaseId)

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
      await new Promise((resolve) => setTimeout(resolve, 1500))

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