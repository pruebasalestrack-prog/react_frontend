"use client"

import { useState } from "react"
import { useAuth } from "../../../shared/context/AuthContext"
import { requestPasswordReset } from "../api/forgotPasswordApi"

/**
 * Hook controlador para la lógica de recuperación de contraseña
 */
export const useForgotPasswordController = () => {
  const { showLoading, hideLoading } = useAuth()

  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Validar email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Manejar cambio en el input
  const handleChange = (e) => {
    setEmail(e.target.value)
    if (error) {
      setError("")
    }
  }

  // Manejar submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validar email
    if (!email) {
      setError("El correo electrónico es requerido")
      return
    }

    if (!validateEmail(email)) {
      setError("Por favor ingresa un correo electrónico válido")
      return
    }

    setLoading(true)
    setError("")

    showLoading("Enviando instrucciones", "Correo electrónico")

    try {
      // Simular delay de red para mostrar la animación
      await new Promise((resolve) => setTimeout(resolve, 2000))

      await requestPasswordReset(email)

      hideLoading()
      setSuccess(true)
    } catch (err) {
      hideLoading()
      setError(err.message || "Error al enviar el correo. Por favor, intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  // Resetear formulario
  const resetForm = () => {
    setEmail("")
    setError("")
    setSuccess(false)
  }

  return {
    email,
    error,
    loading,
    success,
    handleChange,
    handleSubmit,
    resetForm,
  }
}
