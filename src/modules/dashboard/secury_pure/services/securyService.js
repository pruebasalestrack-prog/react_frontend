const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Helper para obtener el token
const getAuthToken = () => {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('No hay token de autenticación')
  }
  return token
}

// Helper para headers
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`,
  'Accept': 'application/json'
})

// Helper para manejar respuestas
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `Error: ${response.status}`)
  }
  return response.json()
}

/**
 * ============================================
 * 🔐 OPCIONES (SECM_0001)
 * ============================================
 */
export const opcionesService = {
  // Obtener todas las opciones
  getAll: async (conexion) => {
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
  },

  // Obtener una opción por ID
  getById: async (id, conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/opciones/${id}?conexion=${conexion}`, {
        method: 'GET',
        headers: getHeaders()
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error obteniendo opción:', error)
      throw error
    }
  },

  // Crear nueva opción
  create: async (data, conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/opciones?conexion=${conexion}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error creando opción:', error)
      throw error
    }
  },

  // Actualizar opción
  update: async (id, data, conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/opciones/${id}?conexion=${conexion}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error actualizando opción:', error)
      throw error
    }
  },

  // Eliminar opción
  delete: async (id, conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/opciones/${id}?conexion=${conexion}`, {
        method: 'DELETE',
        headers: getHeaders()
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error eliminando opción:', error)
      throw error
    }
  }
}

/**
 * ============================================
 * 📋 GRUPOS/MENÚS (SECM_0002)
 * ============================================
 */
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

/**
 * ============================================
 * 👤 ROLES (SECM_0003)
 * ============================================
 */
export const rolesService = {
  getAll: async (conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/roles?conexion=${conexion}`, {
        method: 'GET',
        headers: getHeaders()
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error obteniendo roles:', error)
      throw error
    }
  },

  getById: async (id, conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/roles/${id}?conexion=${conexion}`, {
        method: 'GET',
        headers: getHeaders()
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error obteniendo rol:', error)
      throw error
    }
  },

  create: async (data, conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/roles?conexion=${conexion}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error creando rol:', error)
      throw error
    }
  },

  update: async (id, data, conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/roles/${id}?conexion=${conexion}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error actualizando rol:', error)
      throw error
    }
  },

  delete: async (id, conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/roles/${id}?conexion=${conexion}`, {
        method: 'DELETE',
        headers: getHeaders()
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error eliminando rol:', error)
      throw error
    }
  }
}

/**
 * ============================================
 * 🏢 COMPAÑÍAS (SECM_0004)
 * ============================================
 */
export const companiasService = {
  getAll: async (conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/companias?conexion=${conexion}`, {
        method: 'GET',
        headers: getHeaders()
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error obteniendo compañías:', error)
      throw error
    }
  },

  getById: async (id, conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/companias/${id}?conexion=${conexion}`, {
        method: 'GET',
        headers: getHeaders()
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error obteniendo compañía:', error)
      throw error
    }
  },

  create: async (data, conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/companias?conexion=${conexion}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error creando compañía:', error)
      throw error
    }
  },

  update: async (id, data, conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/companias/${id}?conexion=${conexion}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error actualizando compañía:', error)
      throw error
    }
  },

  delete: async (id, conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/companias/${id}?conexion=${conexion}`, {
        method: 'DELETE',
        headers: getHeaders()
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error eliminando compañía:', error)
      throw error
    }
  }
}

/**
 * ============================================
 * 👥 USUARIOS (SECM_0005)
 * ============================================
 */
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
  }
}

/**
 * ============================================
 * 🔗 USUARIOS X COMPAÑÍAS (SECM_0006)
 * ============================================
 */
export const usuariosCompaniasService = {
  getAll: async (conexion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios-companias?conexion=${conexion}`, {
        method: 'GET',
        headers: getHeaders()
      })
      return handleResponse(response)
    } catch (error) {
      console.error('❌ Error obteniendo usuarios x compañías:', error)
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

/**
 * ============================================
 * 📊 PERFIL DE USUARIO (SECM_0007)
 * ============================================
 */
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
  }
}

/**
 * ============================================
 * ⚙️ PARÁMETROS (SECM_0008)
 * ============================================
 */
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
  }
}

export default {
  opciones: opcionesService,
  grupos: gruposService,
  roles: rolesService,
  companias: companiasService,
  usuarios: usuariosService,
  usuariosCompanias: usuariosCompaniasService,
  perfilUsuario: perfilUsuarioService,
  parametros: parametrosService
}