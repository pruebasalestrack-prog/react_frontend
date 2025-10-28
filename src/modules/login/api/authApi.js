/**
 * API de autenticación conectada al backend real
 * Base URL: http://192.168.100.251:8000/api
 */

const API_BASE_URL = "http://192.168.100.251:8000/api"

/**
 * Función de login con API real
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise} - Promesa con los datos del usuario o error
 */
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, flag_inicio_sesion: 0 }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Credenciales inválidas")
    }

    const data = await response.json()

    // Guarda la contraseña para session lock (opcional, puedes no guardarla)
    localStorage.setItem("userPassword", password)

    // Retorna el objeto user tal como viene del backend (trae companies)
    // Además agrega el token y otros datos útiles a ese objeto
    return {
      ...data.user,            // <-- usuario completo, con companies
      token: data.token,       // token de autenticación
      token_type: data.token_type,
      expires_in: data.expires_in
    }
  } catch (error) {
    console.error("❌ Error en loginUser:", error)
    if (error.message === "Failed to fetch") {
      throw new Error("No se pudo conectar con el servidor. Verifica tu conexión.")
    }
    throw error
  }
}

/**
 * VALIDAR DESBLOQUEO: con email y password, usando el endpoint del backend
 */
export const validateUnlock = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, flag_inicio_sesion: 1 }), // flag para solo validar
    });
    return response.ok
  } catch (error) {
    console.error("❌ Error en validateUnlock:", error)
    return false
  }
}

/**
 * Función para cargar la base de datos del usuario desde la API
 * @param {string} databaseId - ID de la base de datos
 * @param {string} token - Token de autenticación (opcional)
 * @returns {Promise} - Datos de la base de datos
 */
export const loadUserDatabase = async (databaseId, token = null) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    }

    // Si hay token, agregarlo a los headers
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/database/${databaseId}`, {
      method: "GET",
      headers,
    })

    if (!response.ok) {
      throw new Error("Error al cargar la base de datos")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`❌ Error cargando base de datos ${databaseId}:`, error)
    return null
  }
}

/**
 * Cargar configuración de sidebar del usuario desde la API
 * @param {string} databaseId - ID de la base de datos
 * @param {string} token - Token de autenticación (opcional)
 * @returns {Promise} - Configuración del sidebar o null si no existe
 */
export const loadUserSidebar = async (databaseId, token = null) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/sidebar/${databaseId}`, {
      method: "GET",
      headers,
    })

    if (!response.ok) {
      console.log(`ℹ️ No existe sidebar personalizado para ${databaseId}`)
      return null
    }

    const data = await response.json()
    console.log(`✅ Sidebar personalizado cargado para: ${databaseId}`)
    return data
  } catch (error) {
    console.log(`ℹ️ No existe sidebar personalizado, usando el por defecto`)
    return null
  }
}

/**
 * Función para verificar token de autenticación
 * @param {string} token - Token JWT
 * @returns {Promise} - Datos del usuario si el token es válido
 */
export const verifyToken = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/verify-token`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Token inválido")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("❌ Error en verifyToken:", error)
    throw error
  }
}

/**
 * Función para validar contraseña en el desbloqueo de sesión
 * @param {string} userId - ID del usuario
 * @param {string} password - Contraseña a validar
 * @returns {Promise<boolean>} - true si la contraseña es correcta
 */


/**
 * Función para cerrar sesión
 * @param {string} token - Token de autenticación (opcional)
 * @returns {Promise} - Resultado del logout
 */
export const logoutUser = async (token = null) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers,
    })

    // Limpiar localStorage
    localStorage.removeItem("userPassword")
    localStorage.removeItem("authToken")

    return response.ok
  } catch (error) {
    console.error("❌ Error en logout:", error)
    // Aún así limpiamos el localStorage
    localStorage.removeItem("userPassword")
    localStorage.removeItem("authToken")
    return false
  }
}

/**
 * Función para recuperar contraseña
 * @param {string} email - Email del usuario
 * @returns {Promise} - Resultado de la solicitud
 */
export const recoverPassword = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      throw new Error("Error al enviar el correo de recuperación")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("❌ Error en recoverPassword:", error)
    throw error
  }
}

// Exportar la URL base para uso en otros módulos si es necesario
export { API_BASE_URL }