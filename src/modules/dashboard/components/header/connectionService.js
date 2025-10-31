// Usar la variable de entorno VITE_API_URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://192.168.100.254:8000/api"

/**
 * Servicio para manejar conexiones de base de datos
 */
class ConnectionService {
  /**
   * Obtener token del localStorage
   */
  getToken() {
    const authData = localStorage.getItem("auth")
    if (authData) {
      const parsed = JSON.parse(authData)
      return parsed.token
    }
    return null
  }

  /**
   * Headers comunes para todas las peticiones
   */
  getHeaders() {
    const token = this.getToken()
    return {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  /**
   * Procesar companies del usuario en formato para el Header
   */
  processUserCompanies(companies) {
    if (!Array.isArray(companies)) return []

    return companies.map(company => ({
      id: company.id,
      name: company.nick,
      description: company.razonsocial,
      connection: company.conexion, // "conexion1", "conexion2", etc.
      status: "inactive", // Por defecto inactivo, se activa después
      rol_id: company.rol_id,
      identificacion: company.identificacion,
      direccion: company.direccion,
      telefono: company.telefono,
      notifica: company.notifica,
      vigencia: company.vigencia,
      entorno: company.entorno,
      comentario: company.comentario,
      acceso: company.acceso, // "0" o "1"
    }))
  }

  /**
   * Guardar última conexión seleccionada en localStorage
   */
  saveLastConnection(connection) {
    try {
      const connectionData = {
        id: connection.id,
        name: connection.name,
        connection: connection.connection, // "conexion1", "conexion2", etc.
        timestamp: new Date().toISOString()
      }
      localStorage.setItem("lastSelectedConnection", JSON.stringify(connectionData))
      console.log("💾 Última conexión guardada:", connectionData)
    } catch (error) {
      console.error("❌ Error guardando última conexión:", error)
    }
  }

  /**
   * Obtener última conexión seleccionada
   */
  getLastConnection() {
    try {
      const last = localStorage.getItem("lastSelectedConnection")
      return last ? JSON.parse(last) : null
    } catch (error) {
      console.error("❌ Error obteniendo última conexión:", error)
      return null
    }
  }

  /**
   * Limpiar última conexión (útil al cerrar sesión)
   */
  clearLastConnection() {
    try {
      localStorage.removeItem("lastSelectedConnection")
      console.log("🗑️ Última conexión eliminada")
    } catch (error) {
      console.error("❌ Error eliminando última conexión:", error)
    }
  }

  /**
   * Obtener la conexión activa actual desde localStorage
   */
  getActiveConnection() {
    return this.getLastConnection()
  }

  /**
   * Obtener la URL base de la API
   */
  getApiBaseUrl() {
    return API_BASE_URL
  }
}

export default new ConnectionService()