"use client"

import { useState } from "react"
import { requestPasswordReset } from "../api/forgotPasswordApi"

/**
 * Hook controlador para la lógica de recuperación de contraseña
 */
export const useForgotPasswordController = () => {
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

    try {
      await requestPasswordReset(email)
      setSuccess(true)
    } catch (err) {
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
