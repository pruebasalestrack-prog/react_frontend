"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../shared/context/AuthContext"
import { loginUser } from "../api/authApi"

/**
 * Hook controlador para la lógica de login
 * Maneja el estado y las acciones del formulario de login
 */
export const useLoginController = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  // Manejar submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Llamar a la API de login (simulada con JSON)
      const userData = await loginUser(formData.email, formData.password)

      // Guardar usuario en el contexto
      login(userData)

      // Redirigir al dashboard
      navigate("/dashboard")
    } catch (error) {
      setErrors({
        general: error.message || "Error al iniciar sesión. Por favor, intenta de nuevo.",
      })
    } finally {
      setLoading(false)
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
    handleChange,
    handleSubmit,
    togglePasswordVisibility,
  }
}
