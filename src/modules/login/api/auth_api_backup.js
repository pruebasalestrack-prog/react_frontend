/**
 * ⚠️ ARCHIVO DE RESPALDO - IMPLEMENTACIÓN CON JSON LOCAL
 * 
 * Este es el código original que usaba datos de JSON local.
 * Se mantiene como referencia por si necesitas volver a la versión anterior.
 * 
 * Para usar este archivo en lugar del nuevo authApi.js:
 * 1. Renombra authApi.js a authApi_real.js
 * 2. Renombra este archivo a authApi.js
 */

import usersData from "../../../shared/data/users.json"

/**
 * Función para simular delay de red
 */
const simulateNetworkDelay = () => {
  return new Promise((resolve) => setTimeout(resolve, 800))
}

/**
 * Función de login con JSON local
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise} - Promesa con los datos del usuario o error
 */
export const loginUser_JSON = async (email, password) => {
  await simulateNetworkDelay()

  // Buscar usuario en el JSON
  const user = usersData.users.find((u) => u.email === email && u.password === password)

  if (!user) {
    throw new Error("Credenciales inválidas")
  }

  // Cargar datos de la base de datos asignada al usuario
  const databaseData = await loadUserDatabase(user.database)

  // Cargar configuración de sidebar del usuario
  const sidebarConfig = await loadUserSidebar(user.database)

  // Retornar usuario sin la contraseña
  const { password: _, ...userWithoutPassword } = user

  return {
    ...userWithoutPassword,
    databaseData,
    sidebarConfig,
  }
}

/**
 * Función para cargar la base de datos del usuario desde JSON
 * @param {string} databaseName - Nombre de la base de datos
 * @returns {Promise} - Datos de la base de datos
 */
export const loadUserDatabase_JSON = async (databaseName) => {
  try {
    const dbModule = await import(`../../../shared/data/databases/${databaseName}.json`)
    return dbModule.default
  } catch (error) {
    console.error(`Error cargando base de datos ${databaseName}:`, error)
    return null
  }
}

/**
 * Cargar configuración de sidebar del usuario desde JSON
 * @param {string} databaseName - Nombre de la base de datos
 * @returns {Promise} - Configuración del sidebar o null si no existe
 */
export const loadUserSidebar_JSON = async (databaseName) => {
  try {
    const sidebarModule = await import(`../../../shared/data/sidebars/${databaseName}_sidebar.json`)
    console.log(`✅ Sidebar personalizado cargado para: ${databaseName}`)
    return sidebarModule.default
  } catch (error) {
    console.log(`ℹ️ No existe sidebar personalizado para ${databaseName}, usando el por defecto`)
    return null
  }
}