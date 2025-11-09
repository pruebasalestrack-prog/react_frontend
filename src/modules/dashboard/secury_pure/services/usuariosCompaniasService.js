// src/dashboard/modules/secury-pure/services/usuariosCompaniasService.js

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

export const usuariosCompaniasService = {
  getAll: async (conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios-companias?conexion=${conexion}`, {
        method: 'GET',
        headers: getHeaders()
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error obteniendo asignaciones:', error)
      throw error
    }
  },

  getByUserId: async (userId, conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios-companias/usuario/${userId}?conexion=${conexion}`, {
        method: 'GET',
        headers: getHeaders()
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error obteniendo compañías del usuario:', error)
      throw error
    }
  },

  create: async (data, conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios-companias?conexion=${conexion}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error asignando usuario a compañía:', error)
      throw error
    }
  },

  delete: async (id, conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios-companias/${id}?conexion=${conexion}`, {
        method: 'DELETE',
        headers: getHeaders()
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error eliminando asignación:', error)
      throw error
    }
  }
}