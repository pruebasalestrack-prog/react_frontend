// src/modules/login/api/authApi.js

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://192.168.100.254:8000/api"

/**
 * Obtener token del localStorage
 */
const getToken = () => {
  const authData = localStorage.getItem("auth")
  if (authData) {
    const parsed = JSON.parse(authData)
    return parsed.token
  }
  return null
}

/**
 * Login de usuario con API real
 */
export const loginUser = async (email, password) => {
  try {
    console.log("📡 Iniciando login con:", email)
    console.log("🔗 URL de API:", `${API_BASE_URL}/login`)
    
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ 
        email, 
        password,
        flag_inicio_sesion: 1  // ⚠️ Campo requerido por tu backend
      }),
    })

    console.log("📥 Respuesta del servidor - Status:", response.status)

    // Si el servidor responde con error
    if (!response.ok) {
      let errorMessage = "Error desconocido"
      
      try {
        const errorData = await response.json()
        console.error("❌ Error del servidor:", errorData)
        errorMessage = errorData.message || errorData.error || `Error ${response.status}`
      } catch (e) {
        // Si no puede parsear JSON, mostrar el texto plano
        const errorText = await response.text()
        console.error("❌ Respuesta de error (texto):", errorText)
        errorMessage = `Error ${response.status}: ${response.statusText}`
      }
      
      throw new Error(errorMessage)
    }

    // Respuesta exitosa
    const data = await response.json()
    console.log("✅ Login exitoso - Datos recibidos:", {
      hasToken: !!data.token,
      hasUser: !!data.user,
      userEmail: data.user?.email,
      companiesCount: data.user?.companies?.length || 0
    })

    // 🔒 Guardar contraseña temporalmente para session lock (solo para desbloqueo)
    localStorage.setItem('userPassword', password)

    // Retornar el user completo con companies
    return {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      tipo_usuario: data.user.tipo_usuario,
      companies: data.user.companies || [], // ⚠️ IMPORTANTE: Las companies vienen aquí
      token: data.token, // ⚠️ IMPORTANTE: El token
      token_type: data.token_type,
      expires_in: data.expires_in,
    }
  } catch (error) {
    console.error("❌ Error en loginUser:", error.message)
    throw error
  }
}

/**
 * Validar contraseña para desbloqueo
 */
export const validateUnlock = async (email, password) => {
  try {
    console.log("🔑 Validando contraseña para:", email)
    
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ 
        email, 
        password,
        flag_inicio_sesion: 1  // ⚠️ Campo requerido
      }),
    })

    if (response.ok) {
      console.log("✅ Contraseña válida")
      return true
    }
    
    console.log("❌ Contraseña inválida")
    return false
  } catch (error) {
    console.error("❌ Error validando contraseña:", error)
    return false
  }
}

/**
 * Cerrar sesión en el backend
 */
export const logoutApi = async () => {
  try {
    const token = getToken()
    
    if (!token) {
      console.log("⚠️ No hay token para logout")
      return { success: true, message: "No había sesión activa" }
    }

    console.log("📤 Enviando logout al servidor...")
    console.log("🔗 URL:", `${API_BASE_URL}/logout`)
    
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ token }),
    })

    const data = await response.json()

    if (response.ok) {
      console.log("✅ Logout exitoso en servidor:", data.message)
      return { success: true, message: data.message }
    } else {
      console.error("❌ Error en logout:", data)
      return { success: false, message: data.message || "Error al cerrar sesión" }
    }
  } catch (error) {
    console.error("❌ Error en logout API:", error)
    return { success: false, message: error.message }
  }
}

/**
 * Recuperar contraseña
 */
export const recoverPassword = async (email) => {
  try {
    console.log("📧 Enviando correo de recuperación a:", email)
    
    const response = await fetch(`${API_BASE_URL}/password/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Error al enviar correo de recuperación")
    }

    const data = await response.json()
    console.log("✅ Correo de recuperación enviado")
    return data
  } catch (error) {
    console.error("❌ Error en recoverPassword:", error)
    throw error
  }
}