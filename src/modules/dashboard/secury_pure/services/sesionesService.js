

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const sesionesService = {
  // Obtener todas las sesiones activas
  getAll: async (conexion) => {
    try {
      const response = await axios.get(`${API_URL}/sesiones-activas`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'X-Connection': conexion
        }
      })
      return response.data
    } catch (error) {
      console.error('Error obteniendo sesiones:', error)
      throw new Error(error.response?.data?.message || 'Error al obtener sesiones activas')
    }
  },

  // Cerrar una sesión específica
  cerrarSesion: async (sessionId, conexion) => {
    try {
      const response = await axios.delete(`${API_URL}/sesiones-activas/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'X-Connection': conexion
        }
      })
      return response.data
    } catch (error) {
      console.error('Error cerrando sesión:', error)
      throw new Error(error.response?.data?.message || 'Error al cerrar la sesión')
    }
  }
}