import { useState, useEffect } from "react"
import { Activity, RefreshCw, Search, XCircle, Monitor, Smartphone, Clock, MapPin, User } from "lucide-react"
import SecuryPageLayout from "../components/SecuryPageLayout"
import { useAuth } from "../../../../shared/context/AuthContext"
import { useConnections } from "../../../dashboard/components/header/useConnections"
import { hasPermission } from "../../../dashboard/components/sidebar_personalizado/sidebarService"
import { sesionesService } from "../services/sesionesService"
import "./SesionesActivas.css"

const SesionesActivas = () => {
  const { user } = useAuth()
  const { selectedConnection } = useConnections()
  
  const [sesiones, setSesiones] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState(null)

  const permissions = user?.sidebarConfig?.menuGroups
    ?.flatMap(g => g.items)
    ?.find(item => item.path?.includes('secm-0009'))
    ?.permissions

  useEffect(() => {
    loadSesiones()
    // Auto-refresh cada 30 segundos
    const interval = setInterval(loadSesiones, 30000)
    return () => clearInterval(interval)
  }, [selectedConnection])

  const loadSesiones = async () => {
    if (!selectedConnection?.conexion) {
      setError('No hay conexión seleccionada')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await sesionesService.getAll(selectedConnection.conexion)
      setSesiones(data)
    } catch (error) {
      console.error('❌ Error cargando sesiones:', error)
      setError(error.message || 'Error al cargar las sesiones activas')
    } finally {
      setLoading(false)
    }
  }

  const filteredSesiones = sesiones.filter(s =>
    s.usuario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.ip?.includes(searchTerm)
  )

  const handleCerrarSesion = async (sesion) => {
    if (!hasPermission(permissions, 'delete')) {
      alert("⚠️ No tienes permiso para cerrar sesiones")
      return
    }
    
    if (!confirm(`¿Estás seguro de cerrar la sesión de "${sesion.usuario}"?\n\nEsta acción desconectará al usuario inmediatamente.`)) {
      return
    }

    try {
      await sesionesService.cerrarSesion(sesion.id, selectedConnection.conexion)
      alert("✅ Sesión cerrada correctamente")
      loadSesiones()
    } catch (error) {
      alert(`❌ Error: ${error.message}`)
    }
  }

  const getDeviceIcon = (device) => {
    if (!device) return <Monitor size={16} />
    const deviceLower = device.toLowerCase()
    if (deviceLower.includes('mobile') || deviceLower.includes('android') || deviceLower.includes('iphone')) {
      return <Smartphone size={16} />
    }
    return <Monitor size={16} />
  }

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return '-'
    const now = new Date()
    const sessionTime = new Date(timestamp)
    const diffMs = now - sessionTime
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Ahora'
    if (diffMins < 60) return `Hace ${diffMins} min`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `Hace ${diffHours}h`
    const diffDays = Math.floor(diffHours / 24)
    return `Hace ${diffDays}d`
  }

  return (
    <SecuryPageLayout
      title="Sesiones Activas"
      icon={Activity}
      optionCode="SECM_0009"
      actions={
        <button className="btn-secondary" onClick={loadSesiones} disabled={loading}>
          <RefreshCw size={18} className={loading ? 'spinning' : ''} />
          Actualizar
        </button>
      }
    >
      <div className="sesiones-container">
        <div className="sesiones-header">
          <div className="sesiones-search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Buscar por usuario, email o IP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="sesiones-stats">
            <div className="stat-card">
              <Activity size={20} />
              <div>
                <span className="stat-value">{sesiones.length}</span>
                <span className="stat-label">Sesiones Activas</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="sesiones-error">
            <p>❌ {error}</p>
            <button onClick={loadSesiones} className="btn-retry">Reintentar</button>
          </div>
        )}

        {loading ? (
          <div className="sesiones-loading">
            <div className="spinner"></div>
            <p>Cargando sesiones activas...</p>
          </div>
        ) : (
          <div className="sesiones-grid">
            {filteredSesiones.map(sesion => (
              <div key={sesion.id} className="sesion-card">
                <div className="sesion-header">
                  <div className="sesion-user">
                    <div className="user-avatar">
                      <User size={20} />
                    </div>
                    <div className="user-info">
                      <h3>{sesion.usuario || sesion.email}</h3>
                      <span className="user-email">{sesion.email}</span>
                    </div>
                  </div>
                  {hasPermission(permissions, 'delete') && (
                    <button 
                      className="btn-icon btn-close-session" 
                      onClick={() => handleCerrarSesion(sesion)}
                      title="Cerrar sesión"
                    >
                      <XCircle size={18} />
                    </button>
                  )}
                </div>

                <div className="sesion-details">
                  <div className="detail-item">
                    {getDeviceIcon(sesion.dispositivo)}
                    <span>{sesion.dispositivo || 'Navegador Web'}</span>
                  </div>
                  
                  <div className="detail-item">
                    <MapPin size={16} />
                    <span>{sesion.ip || 'IP no disponible'}</span>
                  </div>
                  
                  <div className="detail-item">
                    <Clock size={16} />
                    <span>{getTimeAgo(sesion.ultima_actividad)}</span>
                  </div>
                </div>

                <div className="sesion-footer">
                  <span className="session-time">
                    Conectado desde: {new Date(sesion.inicio_sesion).toLocaleString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <span className={`status-badge ${sesion.activa ? 'activo' : 'inactivo'}`}>
                    {sesion.activa ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredSesiones.length === 0 && !error && !loading && (
          <div className="sesiones-empty">
            <Activity size={48} strokeWidth={1} />
            <p>No hay sesiones activas</p>
            {searchTerm && (
              <button className="btn-link" onClick={() => setSearchTerm('')}>
                Limpiar búsqueda
              </button>
            )}
          </div>
        )}
      </div>
    </SecuryPageLayout>
  )
}

export default SesionesActivas