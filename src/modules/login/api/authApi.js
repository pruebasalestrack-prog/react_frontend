import usersData from "../../../shared/data/users.json"

/**
 * API de autenticación
 * Simula llamadas a un backend real
 */

// Función para simular delay de red
const simulateNetworkDelay = () => {
  return new Promise((resolve) => setTimeout(resolve, 800))
}

/**
 * Función de login
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise} - Promesa con los datos del usuario o error
 */
export const loginUser = async (email, password) => {
  await simulateNetworkDelay()

  // Buscar usuario en el JSON
  const user = usersData.users.find((u) => u.email === email && u.password === password)

  if (!user) {
    throw new Error("Credenciales inválidas")
  }

  // Cargar datos de la base de datos asignada al usuario
  const databaseData = await loadUserDatabase(user.database)

  // Retornar usuario sin la contraseña
  const { password: _, ...userWithoutPassword } = user

  return {
    ...userWithoutPassword,
    databaseData,
  }
}

/**
 * Función para cargar la base de datos del usuario
 * @param {string} databaseName - Nombre de la base de datos
 * @returns {Promise} - Datos de la base de datos
 */
export const loadUserDatabase = async (databaseName) => {
  try {
    // Importación dinámica de la base de datos correspondiente
    const dbModule = await import(`../../../shared/data/databases/${databaseName}.json`)
    return dbModule.default
  } catch (error) {
    console.error(`Error cargando base de datos ${databaseName}:`, error)
    return null
  }
}

/**
 * FUNCIÓN PARA INTEGRACIÓN CON API REAL (COMENTADA)
 * Descomenta esta función cuando tengas tu API backend lista
 */

/*
export const loginUserAPI = async (email, password) => {
  try {
    const response = await fetch('https://tu-api.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      throw new Error('Error en la autenticación')
    }

    const data = await response.json()
    
    // La respuesta debe incluir:
    // - token: JWT token para autenticación
    // - user: datos del usuario
    // - database: nombre de la base de datos asignada
    
    return data
  } catch (error) {
    console.error('Error en loginUserAPI:', error)
    throw error
  }
}
*/

/**
 * Función para verificar token (para uso futuro con API real)
 */
/*
export const verifyToken = async (token) => {
  try {
    const response = await fetch('https://tu-api.com/api/auth/verify', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error('Token inválido')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en verifyToken:', error)
    throw error
  }
}
*/
