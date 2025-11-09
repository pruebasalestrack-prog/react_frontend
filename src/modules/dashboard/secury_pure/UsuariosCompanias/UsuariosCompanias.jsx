import { useState, useEffect } from "react"
import { UserCheck, Plus, Search, Trash2, RefreshCw, Building2, User } from "lucide-react"
import SecuryPageLayout from "../components/SecuryPageLayout"
import { useAuth } from "../../../../shared/context/AuthContext"
import { useConnections } from "../../../dashboard/components/header/useConnections"
import { hasPermission } from "../../../dashboard/components/sidebar_personalizado/sidebarService"
import { usuariosCompaniasService } from "../services/usuariosCompaniasService"
import "./UsuariosCompanias.css"

const UsuariosCompanias = () => {
  const { user } = useAuth()
  const { selectedConnection } = useConnections()
  
  const [asignaciones, setAsignaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState(null)

  const permissions = user?.sidebarConfig?.menuGroups
    ?.flatMap(g => g.items)
    ?.find(item => item.path?.includes('secm-0006'))
    ?.permissions

  useEffect(() => {
    loadAsignaciones()
  }, [selectedConnection])

  const loadAsignaciones = async () => {
    if (!selectedConnection?.conexion) {
      setError('No hay conexión seleccionada')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await usuariosCompaniasService.getAll(selectedConnection.conexion)
      setAsignaciones(data)
    } catch (error) {
      console.error('❌ Error cargando asignaciones:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredAsignaciones = asignaciones.filter(a =>
    a.usuario_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.compania_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreate = () => {
    if (!hasPermission(permissions, 'create')) {
      alert("⚠️ No tienes permiso para crear")
      return
    }
    console.log("➕ Asignar usuario a compañía")
  }

  const handleDelete = async (asignacion) => {
    if (!hasPermission(permissions, 'delete')) {
      alert("⚠️ No tienes permiso para eliminar")
      return
    }
    
    if (!confirm(`¿Estás seguro de eliminar esta asignación?`)) {
      return
    }

    try {
      await usuariosCompaniasService.delete(asignacion.id, selectedConnection.conexion)
      alert("✅ Asignación eliminada correctamente")
      loadAsignaciones()
    } catch (error) {
      alert(`❌ Error: ${error.message}`)
    }
  }

  return (
    <SecuryPageLayout
      title="Usuarios x Compañías"
      icon={UserCheck}
      optionCode="SECM_0006"
      actions={
        <>
          <button className="btn-secondary" onClick={loadAsignaciones} disabled={loading}>
            <RefreshCw size={18} className={loading ? 'spinning' : ''} />
            Actualizar
          </button>
          {hasPermission(permissions, 'create') && (
            <button className="btn-primary" onClick={handleCreate}>
              <Plus size={20} />
              Nueva Asignación
            </button>
          )}
        </>
      }
    >
      <div className="usuarios-companias-container">
        <div className="usuarios-companias-search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar por usuario o compañía..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {error && (
          <div className="usuarios-companias-error">
            <p>❌ {error}</p>
            <button onClick={loadAsignaciones} className="btn-retry">Reintentar</button>
          </div>
        )}

        {loading ? (
          <div className="usuarios-companias-loading">
            <div className="spinner"></div>
            <p>Cargando asignaciones...</p>
          </div>
        ) : (
          <div className="usuarios-companias-grid">
            {filteredAsignaciones.map(asignacion => (
              <div key={asignacion.id} className="asignacion-card">
                <div className="asignacion-header">
                  <UserCheck size={20} className="header-icon" />
                  <button 
                    className="btn-delete-small"
                    onClick={() => handleDelete(asignacion)}
                    title="Eliminar asignación"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="asignacion-body">
                  <div className="asignacion-item">
                    <div className="item-icon user-icon">
                      <User size={16} />
                    </div>
                    <div className="item-content">
                      <div className="item-label">Usuario</div>
                      <div className="item-value">{asignacion.usuario_nombre || 'Sin nombre'}</div>
                    </div>
                  </div>

                  <div className="asignacion-divider"></div>

                  <div className="asignacion-item">
                    <div className="item-icon company-icon">
                      <Building2 size={16} />
                    </div>
                    <div className="item-content">
                      <div className="item-label">Compañía</div>
                      <div className="item-value">{asignacion.compania_nombre || 'Sin nombre'}</div>
                    </div>
                  </div>
                </div>

                <div className="asignacion-footer">
                  <span className="footer-label">Rol:</span>
                  <span className="footer-value">{asignacion.rol_nombre || 'Sin rol'}</span>
                </div>
              </div>
            ))}
            
            {filteredAsignaciones.length === 0 && !error && (
              <div className="usuarios-companias-empty">
                <UserCheck size={48} strokeWidth={1} />
                <p>No se encontraron asignaciones</p>
              </div>
            )}
          </div>
        )}
      </div>
    </SecuryPageLayout>
  )
}

export default UsuariosCompanias