import usersData from "../../../shared/data/users.json"

/**
 * API para recuperación de contraseña
 * Simula el envío de email para resetear contraseña
 */

const simulateNetworkDelay = () => {
  return new Promise((resolve) => setTimeout(resolve, 1000))
}

/**
 * Función para solicitar recuperación de contraseña
 * @param {string} email - Email del usuario
 * @returns {Promise} - Promesa con resultado de la operación
 */
export const requestPasswordReset = async (email) => {
  await simulateNetworkDelay()

  // Verificar si el email existe en la base de datos
  const user = usersData.users.find((u) => u.email === email)

  if (!user) {
    throw new Error("No se encontró una cuenta con ese correo electrónico")
  }

  // Simular envío de email
  console.log(`[SIMULACIÓN] Email de recuperación enviado a: ${email}`)
  console.log(`[SIMULACIÓN] Token de recuperación: ${generateResetToken()}`)

  return {
    success: true,
    message: "Se ha enviado un correo con las instrucciones para restablecer tu contraseña",
    email: email,
  }
}

/**
 * Generar token de recuperación (simulado)
 */
const generateResetToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

/**
 * FUNCIÓN PARA INTEGRACIÓN CON API REAL (COMENTADA)
 * Descomenta esta función cuando tengas tu API backend lista
 */

/*
export const requestPasswordResetAPI = async (email) => {
  try {
    const response = await fetch('https://tu-api.com/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al solicitar recuperación de contraseña')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en requestPasswordResetAPI:', error)
    throw error
  }
}
*/

/**
 * Función para resetear contraseña con token (para uso futuro)
 */
/*
export const resetPasswordWithToken = async (token, newPassword) => {
  try {
    const response = await fetch('https://tu-api.com/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al resetear contraseña')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en resetPasswordWithToken:', error)
    throw error
  }
}
*/
