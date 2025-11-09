import { useState } from 'react'

export const useForgotPasswordController = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const sendRecoveryEmail = async (email) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      
      const response = await fetch(`${apiUrl}/api/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (data.status) {
        setSuccess(true)
        return { success: true, message: data.mensaje }
      } else {
        setError(data.mensaje || data.error || 'Error al enviar correo')
        return { success: false, error: data.mensaje }
      }
    } catch (err) {
      const errorMessage = err.message || 'Error al procesar la solicitud'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    success,
    sendRecoveryEmail
  }
}