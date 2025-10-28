import { useState, useEffect, useCallback } from "react"
import connectionService from "./connectionService"

export const useConnections = (user) => {
  const [connections, setConnections] = useState([])
  const [selectedConnection, setSelectedConnection] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user?.companies && Array.isArray(user.companies)) {
      let processedConnections = connectionService.processUserCompanies(user.companies)

      // Si solo hay una conexión, márcala como activa
      if (processedConnections.length === 1) {
        processedConnections = processedConnections.map(conn => ({ ...conn, status: "active" }))
        setConnections(processedConnections)
        setSelectedConnection(processedConnections[0])
        connectionService.saveLastConnection(processedConnections[0])
        return
      }

      // Si hay varias conexiones, buscar última seleccionada, sino la primera
      setConnections(processedConnections)
      const lastConnection = connectionService.getLastConnection()
      if (lastConnection && processedConnections.length > 0) {
        const found = processedConnections.find(conn => conn.id === lastConnection.id)
        if (found) {
          setSelectedConnection(found)
          return
        }
      }
      if (processedConnections.length > 0 && !selectedConnection) {
        // Marcar la primera como activa
        processedConnections = processedConnections.map((conn, idx) =>
          idx === 0 ? { ...conn, status: "active" } : { ...conn, status: "inactive" }
        )
        setConnections(processedConnections)
        setSelectedConnection(processedConnections[0])
        connectionService.saveLastConnection(processedConnections[0])
      }
    }
  }, [user])

  const changeConnection = useCallback(async (connection) => {
    if (!connection || loading) return

    setLoading(true)
    setError(null)

    try {
      setConnections(prevConnections =>
        prevConnections.map(conn =>
          conn.id === connection.id
            ? { ...conn, status: "active" }
            : { ...conn, status: "inactive" }
        )
      )
      setSelectedConnection(connection)
      connectionService.saveLastConnection(connection)
      window.dispatchEvent(new CustomEvent("connectionChanged", { detail: connection }))
      return { success: true, connection }
    } catch (err) {
      setError(err.message || "Error al cambiar conexión")
      return { success: false, error: err }
    } finally {
      setLoading(false)
    }
  }, [loading])

  return {
    connections,
    selectedConnection,
    loading,
    error,
    changeConnection,
    hasConnections: connections.length > 0,
    activeConnectionsCount: connections.filter(c => c.status === "active").length,
  }
}

export default useConnections