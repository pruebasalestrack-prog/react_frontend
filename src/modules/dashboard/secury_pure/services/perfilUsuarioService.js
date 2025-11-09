// src/dashboard/modules/secury-pure/services/perfilUsuarioService.js

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const getAuthToken = () => {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('No hay token de autenticación')
  return token
}

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`,
  'Accept': 'application/json'
})

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `Error: ${response.status}`)
  }
  return response.json()
}

export const perfilUsuarioService = {
  getAll: async (conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/perfiles-usuario?conexion=${conexion}`, {
        method: 'GET',
        headers: getHeaders()
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error obteniendo perfiles:', error)
      throw error
    }
  },

  getByUserId: async (userId, conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/perfiles-usuario/user/${userId}?conexion=${conexion}`, {
        method: 'GET',
        headers: getHeaders()
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error obteniendo perfil de usuario:', error)
      throw error
    }
  },

  updatePermisos: async (userId, permisos, conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/perfiles-usuario/${userId}/permisos?conexion=${conexion}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(permisos)
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error actualizando permisos:', error)
      throw error
    }
  },

  getOpciones: async (conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/opciones?conexion=${conexion}`, {
        method: 'GET',
        headers: getHeaders()
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error obteniendo opciones:', error)
      throw error
    }
  }
}