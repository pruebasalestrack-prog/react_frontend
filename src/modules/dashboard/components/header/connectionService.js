// src/modules/dashboard/components/Header/connectionService.js

const API_BASE_URL = "http://192.168.100.251:8000/api"

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

    // Aquí NO filtras por acceso
    return companies.map(company => ({
        id: company.id,
        name: company.nick,
        description: company.razonsocial,
        connection: company.conexion,
        status: company.acceso === "1" ? "active" : "inactive", // igual lo marcas
        rol_id: company.rol_id,
        identificacion: company.identificacion,
        direccion: company.direccion,
        telefono: company.telefono,
        notifica: company.notifica,
        vigencia: company.vigencia,
        entorno: company.entorno,
        comentario: company.comentario,
    }))
    }

  /**
   * Cambiar conexión activa
   * @param {number} connectionId - ID de la conexión
   * @returns {Promise<Object>}
   */
  async switchConnection(connectionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/connections/switch`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ connection_id: connectionId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al cambiar conexión")
      }

      const data = await response.json()
      console.log("✅ Conexión cambiada exitosamente:", data)
      return data
    } catch (error) {
      console.error("❌ Error en switchConnection:", error)
      throw error
    }
  }

  /**
   * Verificar estado de conexión
   * @param {string} connectionName - Nombre de conexión (conexion1, conexion2, etc)
   * @returns {Promise<Object>}
   */
  async checkConnectionHealth(connectionName) {
    try {
      const response = await fetch(`${API_BASE_URL}/connections/${connectionName}/health`, {
        method: "GET",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error("Error al verificar salud de conexión")
      }

      return await response.json()
    } catch (error) {
      console.error("❌ Error en checkConnectionHealth:", error)
      return { status: "unknown", healthy: false }
    }
  }

  /**
   * Obtener configuración de conexión
   * @param {number} connectionId
   * @returns {Promise<Object>}
   */
  async getConnectionConfig(connectionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/connections/${connectionId}/config`, {
        method: "GET",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error("Error al obtener configuración")
      }

      return await response.json()
    } catch (error) {
      console.error("❌ Error en getConnectionConfig:", error)
      throw error
    }
  }

  /**
   * Guardar última conexión seleccionada en localStorage
   */
  saveLastConnection(connection) {
    try {
      localStorage.setItem("lastSelectedConnection", JSON.stringify({
        id: connection.id,
        name: connection.name,
        timestamp: new Date().toISOString()
      }))
    } catch (error) {
      console.error("Error guardando última conexión:", error)
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
      console.error("Error obteniendo última conexión:", error)
      return null
    }
  }
}

export default new ConnectionService()