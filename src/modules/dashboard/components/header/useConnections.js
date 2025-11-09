import { useState, useEffect, useCallback } from "react"
import { useAuth } from "../../../../shared/context/AuthContext"
import connectionService from "../../../dashboard/components/header/connectionService"

export const useConnections = () => {
  const { user, selectedConnection, selectConnection } = useAuth()
  
  const [connections, setConnections] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // 🔄 Inicializar conexiones cuando user.companies esté disponible
  useEffect(() => {
    console.log("🔄 useConnections: Inicializando...")
    
    const companies = user?.companies
    
    if (!companies || !Array.isArray(companies) || companies.length === 0) {
      console.log("⚠️ No hay compañías disponibles")
      setConnections([])
      return
    }

    console.log("🏢 Procesando", companies.length, "compañías")
    const processedConnections = connectionService.processUserCompanies(companies)
    
    // Marcar la conexión activa según AuthContext
    const updatedConnections = processedConnections.map(conn => ({
      ...conn,
      status: conn.connection === selectedConnection ? "active" : "inactive"
    }))

    setConnections(updatedConnections)
    console.log("✅ Conexiones inicializadas:", updatedConnections.length)

  }, [user?.companies, selectedConnection])

  // 🔄 Auto-seleccionar primera conexión si no hay ninguna seleccionada
  useEffect(() => {
    if (!selectedConnection && connections.length > 0 && user?.companies) {
      console.log("🔌 Auto-seleccionando primera conexión...")
      const firstConnection = connections[0]
      
      // Llamar a selectConnection del AuthContext para generar sidebar
      selectConnection(firstConnection.connection)
      connectionService.saveLastConnection(firstConnection)
      
      console.log("✅ Primera conexión seleccionada:", firstConnection.name)
    }
  }, [selectedConnection, connections, user?.companies, selectConnection])

  // 🔄 Cambiar de conexión
  const changeConnection = useCallback(async (connection) => {
    if (!connection || loading) {
      console.log("⚠️ Conexión inválida o ya cargando")
      return { success: false }
    }

    // Si es la misma conexión, no hacer nada
    if (selectedConnection === connection.connection) {
      console.log("⚠️ Ya está en esta conexión")
      return { success: false, message: "Ya está en esta conexión" }
    }

    setLoading(true)
    setError(null)

    try {
      console.log("🔄 Cambiando a conexión:", connection.name, connection.connection)
      
      // Actualizar estado visual de conexiones
      setConnections(prev => prev.map(conn => ({
        ...conn,
        status: conn.id === connection.id ? "active" : "inactive"
      })))

      // 🎨 IMPORTANTE: Llamar a selectConnection del AuthContext
      // Esto generará automáticamente el nuevo sidebar
      selectConnection(connection.connection)
      
      // Guardar última conexión
      connectionService.saveLastConnection(connection)

      // Disparar evento para otros componentes
      window.dispatchEvent(new CustomEvent("connectionChanged", { 
        detail: connection 
      }))

      console.log("✅ Conexión cambiada exitosamente:", connection.name)
      return { success: true, connection }

    } catch (err) {
      console.error("❌ Error cambiando conexión:", err)
      setError(err.message)
      return { success: false, error: err }
    } finally {
      setLoading(false)
    }
  }, [loading, selectedConnection, selectConnection])

  // 🔍 Obtener conexión activa actual
  const getActiveConnection = useCallback(() => {
    return connections.find(conn => conn.status === "active") || null
  }, [connections])

  return {
    connections,
    selectedConnection: getActiveConnection(), // Objeto completo de la conexión activa
    selectedConnectionString: selectedConnection, // Solo el string (conexion1, conexion2, etc)
    loading,
    error,
    changeConnection,
    hasConnections: connections.length > 0,
    connectionName: getActiveConnection()?.name,
  }
}

export default useConnections