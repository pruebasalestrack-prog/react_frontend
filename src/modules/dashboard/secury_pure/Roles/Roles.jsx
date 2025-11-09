import { useState, useEffect } from "react"
import { UserCog, Plus, Search, Edit, Trash2, RefreshCw, Shield } from "lucide-react"
import SecuryPageLayout from "../components/SecuryPageLayout"
import { useAuth } from "../../../../shared/context/AuthContext"
import { useConnections } from "../../../dashboard/components/header/useConnections"
import { hasPermission } from "../../../dashboard/components/sidebar_personalizado/sidebarService"
import { rolesService } from "../services/rolesService"
import "./Roles.css"

const Roles = () => {
  const { user } = useAuth()
  const { selectedConnection } = useConnections()
  
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState(null)

  const permissions = user?.sidebarConfig?.menuGroups
    ?.flatMap(g => g.items)
    ?.find(item => item.path?.includes('secm-0003'))
    ?.permissions

  useEffect(() => {
    loadRoles()
  }, [selectedConnection])

  const loadRoles = async () => {
    if (!selectedConnection?.conexion) {
      setError('No hay conexión seleccionada')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await rolesService.getAll(selectedConnection.conexion)
      setRoles(data)
    } catch (error) {
      console.error('❌ Error cargando roles:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredRoles = roles.filter(r =>
    r.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreate = () => {
    if (!hasPermission(permissions, 'create')) {
      alert("⚠️ No tienes permiso para crear")
      return
    }
    console.log("➕ Crear nuevo rol")
  }

  const handleEdit = (rol) => {
    if (!hasPermission(permissions, 'update')) {
      alert("⚠️ No tienes permiso para editar")
      return
    }
    console.log("✏️ Editar:", rol)
  }

  const handleDelete = async (rol) => {
    if (!hasPermission(permissions, 'delete')) {
      alert("⚠️ No tienes permiso para eliminar")
      return
    }
    
    if (!confirm(`¿Estás seguro de eliminar el rol "${rol.nombre}"?`)) {
      return
    }

    try {
      await rolesService.delete(rol.id, selectedConnection.conexion)
      alert("✅ Rol eliminado correctamente")
      loadRoles()
    } catch (error) {
      alert(`❌ Error: ${error.message}`)
    }
  }

  const handleManagePermissions = (rol) => {
    console.log("🔐 Gestionar permisos del rol:", rol)
  }

  return (
    <SecuryPageLayout
      title="Roles"
      icon={UserCog}
      optionCode="SECM_0003"
      actions={
        <>
          <button className="btn-secondary" onClick={loadRoles} disabled={loading}>
            <RefreshCw size={18} className={loading ? 'spinning' : ''} />
            Actualizar
          </button>
          {hasPermission(permissions, 'create') && (
            <button className="btn-primary" onClick={handleCreate}>
              <Plus size={20} />
              Nuevo Rol
            </button>
          )}
        </>
      }
    >
      <div className="roles-container">
        <div className="roles-search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {error && (
          <div className="roles-error">
            <p>❌ {error}</p>
            <button onClick={loadRoles} className="btn-retry">Reintentar</button>
          </div>
        )}

        {loading ? (
          <div className="roles-loading">
            <div className="spinner"></div>
            <p>Cargando roles...</p>
          </div>
        ) : (
          <div className="roles-grid">
            {filteredRoles.map(rol => (
              <div key={rol.id} className="rol-card">
                <div className="rol-header">
                  <div className="rol-icon">
                    <Shield size={24} />
                  </div>
                  <h3>{rol.nombre}</h3>
                </div>
                
                <p className="rol-description">
                  {rol.descripcion || 'Sin descripción'}
                </p>

                <div className="rol-stats">
                  <div className="stat-item">
                    <span className="stat-label">Usuarios</span>
                    <span className="stat-value">{rol.cantidad_usuarios || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Permisos</span>
                    <span className="stat-value">{rol.cantidad_permisos || 0}</span>
                  </div>
                </div>

                <div className="rol-actions">
                  {hasPermission(permissions, 'comod1') && (
                    <button 
                      className="btn-permission"
                      onClick={() => handleManagePermissions(rol)}
                    >
                      <Shield size={16} />
                      Permisos
                    </button>
                  )}
                  {hasPermission(permissions, 'update') && (
                    <button className="btn-icon btn-edit" onClick={() => handleEdit(rol)}>
                      <Edit size={16} />
                    </button>
                  )}
                  {hasPermission(permissions, 'delete') && (
                    <button className="btn-icon btn-delete" onClick={() => handleDelete(rol)}>
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {filteredRoles.length === 0 && !error && (
              <div className="roles-empty">
                <UserCog size={48} strokeWidth={1} />
                <p>No se encontraron roles</p>
              </div>
            )}
          </div>
        )}
      </div>
    </SecuryPageLayout>
  )
}

export default Roles