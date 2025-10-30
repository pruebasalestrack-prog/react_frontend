import { useState, useEffect, useCallback } from "react"
import connectionService from "./connectionService"

export const useConnections = (user) => {
  const [connections, setConnections] = useState([])
  const [selectedConnection, setSelectedConnection] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Inicializar conexiones SOLO cuando user.companies cambia
  useEffect(() => {
    const companies = user?.companies
    
    if (!companies || !Array.isArray(companies) || companies.length === 0) {
      setConnections([])
      setSelectedConnection(null)
      return
    }

    const processedConnections = connectionService.processUserCompanies(companies)
    
    // Buscar última conexión o usar la primera
    const lastConnection = connectionService.getLastConnection()
    const initialConnection = lastConnection 
      ? processedConnections.find(conn => conn.id === lastConnection.id) || processedConnections[0]
      : processedConnections[0]

    // Marcar solo la inicial como activa
    const updatedConnections = processedConnections.map(conn => ({
      ...conn,
      status: conn.id === initialConnection.id ? "active" : "inactive"
    }))

    setConnections(updatedConnections)
    setSelectedConnection(initialConnection)
    connectionService.saveLastConnection(initialConnection)

    window.dispatchEvent(new CustomEvent("connectionChanged", { 
      detail: initialConnection 
    }))

    console.log("✅ Conexión inicial:", initialConnection.name)
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // ⚠️ Array vacío = solo ejecutar una vez al montar

  // Actualizar cuando user.companies cambie
  useEffect(() => {
    if (user?.companies && connections.length === 0) {
      const processedConnections = connectionService.processUserCompanies(user.companies)
      if (processedConnections.length > 0) {
        const initialConnection = processedConnections[0]
        const updatedConnections = processedConnections.map(conn => ({
          ...conn,
          status: conn.id === initialConnection.id ? "active" : "inactive"
        }))
        setConnections(updatedConnections)
        setSelectedConnection(initialConnection)
      }
    }
  }, [user?.companies, connections.length])

  const changeConnection = useCallback(async (connection) => {
    if (!connection || loading || selectedConnection?.id === connection.id) {
      return { success: false }
    }

    setLoading(true)
    setError(null)

    try {
      setConnections(prev => prev.map(conn => ({
        ...conn,
        status: conn.id === connection.id ? "active" : "inactive"
      })))

      setSelectedConnection(connection)
      connectionService.saveLastConnection(connection)

      window.dispatchEvent(new CustomEvent("connectionChanged", { 
        detail: connection 
      }))

      console.log("✅ Conexión cambiada:", connection.name)
      return { success: true, connection }

    } catch (err) {
      console.error("❌ Error:", err)
      setError(err.message)
      return { success: false, error: err }
    } finally {
      setLoading(false)
    }
  }, [loading, selectedConnection?.id])

  return {
    connections,
    selectedConnection,
    loading,
    error,
    changeConnection,
    hasConnections: connections.length > 0,
    connectionString: selectedConnection?.connection,
    connectionName: selectedConnection?.name,
  }
}

export default useConnections