// src/dashboard/modules/secury-pure/services/parametrosService.js

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

export const parametrosService = {
  getAll: async (conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/parametros?conexion=${conexion}`, {
        method: 'GET',
        headers: getHeaders()
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error obteniendo parámetros:', error)
      throw error
    }
  },

  getById: async (id, conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/parametros/${id}?conexion=${conexion}`, {
        method: 'GET',
        headers: getHeaders()
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error obteniendo parámetro:', error)
      throw error
    }
  },

  update: async (id, data, conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/parametros/${id}?conexion=${conexion}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error actualizando parámetro:', error)
      throw error
    }
  },

  getByCategoria: async (categoria, conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/parametros/categoria/${categoria}?conexion=${conexion}`, {
        method: 'GET',
        headers: getHeaders()
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error obteniendo parámetros por categoría:', error)
      throw error
    }
  }
}