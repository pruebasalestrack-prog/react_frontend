// src/dashboard/modules/secury-pure/services/gruposService.js

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

export const gruposService = {
  getAll: async (conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/grupos?conexion=${conexion}`, {
        method: 'GET',
        headers: getHeaders()
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error obteniendo grupos:', error)
      throw error
    }
  },

  getById: async (id, conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/grupos/${id}?conexion=${conexion}`, {
        method: 'GET',
        headers: getHeaders()
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error obteniendo grupo:', error)
      throw error
    }
  },

  create: async (data, conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/grupos?conexion=${conexion}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error creando grupo:', error)
      throw error
    }
  },

  update: async (id, data, conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/grupos/${id}?conexion=${conexion}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error actualizando grupo:', error)
      throw error
    }
  },

  delete: async (id, conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/grupos/${id}?conexion=${conexion}`, {
        method: 'DELETE',
        headers: getHeaders()
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error eliminando grupo:', error)
      throw error
    }
  }
}