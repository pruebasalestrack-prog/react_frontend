// src/dashboard/modules/secury-pure/services/usuariosService.js

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

export const usuariosService = {
  getAll: async (conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios?conexion=${conexion}`, {
        method: 'GET',
        headers: getHeaders()
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error obteniendo usuarios:', error)
      throw error
    }
  },

  getById: async (id, conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}?conexion=${conexion}`, {
        method: 'GET',
        headers: getHeaders()
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error obteniendo usuario:', error)
      throw error
    }
  },

  create: async (data, conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios?conexion=${conexion}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error creando usuario:', error)
      throw error
    }
  },

  update: async (id, data, conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}?conexion=${conexion}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error actualizando usuario:', error)
      throw error
    }
  },

  delete: async (id, conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}?conexion=${conexion}`, {
        method: 'DELETE',
        headers: getHeaders()
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error eliminando usuario:', error)
      throw error
    }
  },

  resetPassword: async (id, conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}/reset-password?conexion=${conexion}`, {
        method: 'POST',
        headers: getHeaders()
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error reseteando contraseña:', error)
      throw error
    }
  }
}