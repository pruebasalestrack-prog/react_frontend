import { useState, useEffect } from "react"
import { ClipboardList, RefreshCw, Search, Save, X } from "lucide-react"
import SecuryPageLayout from "../components/SecuryPageLayout"
import { useAuth } from "../../../../shared/context/AuthContext"
import { useConnections } from "../../../dashboard/components/header/useConnections"
import { hasPermission } from "../../../dashboard/components/sidebar_personalizado/sidebarService"
import { perfilUsuarioService } from "../services/perfilUsuarioService"
import "./PerfilUsuario.css"

const PerfilUsuario = () => {
  const { user } = useAuth()
  const { selectedConnection } = useConnections()
  
  const [perfiles, setPerfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState(null)
  const [editingProfile, setEditingProfile] = useState(null)

  const permissions = user?.sidebarConfig?.menuGroups
    ?.flatMap(g => g.items)
    ?.find(item => item.path?.includes('secm-0007'))
    ?.permissions

  useEffect(() => {
    loadPerfiles()
  }, [selectedConnection])

  const loadPerfiles = async () => {
    if (!selectedConnection?.conexion) {
      setError('No hay conexión seleccionada')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await perfilUsuarioService.getAll(selectedConnection.conexion)
      setPerfiles(data)
    } catch (error) {
      console.error('❌ Error cargando perfiles:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredPerfiles = perfiles.filter(p =>
    p.usuario_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.compania_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEditProfile = (perfil) => {
    if (!hasPermission(permissions, 'update')) {
      alert("⚠️ No tienes permiso para editar")
      return
    }
    setEditingProfile(perfil)
  }

  const handleSaveProfile = async () => {
    try {
      await perfilUsuarioService.updatePermisos(
        editingProfile.user_id,
        editingProfile.permisos,
        selectedConnection.conexion
      )
      alert("✅ Permisos actualizados correctamente")
      setEditingProfile(null)
      loadPerfiles()
    } catch (error) {
      alert(`❌ Error: ${error.message}`)
    }
  }

  const togglePermiso = (permiso) => {
    setEditingProfile(prev => ({
      ...prev,
      permisos: {
        ...prev.permisos,
        [permiso]: prev.permisos[permiso] === "1" ? "0" : "1"
      }
    }))
  }

  return (
    <SecuryPageLayout
      title="Perfil de Usuario x Cia"
      icon={ClipboardList}
      optionCode="SECM_0007"
      actions={
        <button className="btn-secondary" onClick={loadPerfiles} disabled={loading}>
          <RefreshCw size={18} className={loading ? 'spinning' : ''} />
          Actualizar
        </button>
      }
    >
      <div className="perfil-usuario-container">
        <div className="perfil-usuario-search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar por usuario o compañía..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {error && (
          <div className="perfil-usuario-error">
            <p>❌ {error}</p>
            <button onClick={loadPerfiles} className="btn-retry">Reintentar</button>
          </div>
        )}

        {loading ? (
          <div className="perfil-usuario-loading">
            <div className="spinner"></div>
            <p>Cargando perfiles...</p>
          </div>
        ) : (
          <div className="perfil-usuario-table-container">
            <table className="perfil-usuario-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Compañía</th>
                  <th>Rol</th>
                  <th>Permisos</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPerfiles.map(perfil => (
                  <tr key={perfil.id}>
                    <td>{perfil.usuario_nombre || 'Sin nombre'}</td>
                    <td>{perfil.compania_nombre || 'Sin nombre'}</td>
                    <td>
                      <span className="rol-badge">{perfil.rol_nombre || 'Sin rol'}</span>
                    </td>
                    <td>
                      <div className="permisos-summary">
                        {perfil.permisos?.est_create === "1" && <span className="permiso-icon create" title="Crear">C</span>}
                        {perfil.permisos?.est_read === "1" && <span className="permiso-icon read" title="Leer">R</span>}
                        {perfil.permisos?.est_update === "1" && <span className="permiso-icon update" title="Actualizar">U</span>}
                        {perfil.permisos?.est_delete === "1" && <span className="permiso-icon delete" title="Eliminar">D</span>}
                      </div>
                    </td>
                    <td>
                      {hasPermission(permissions, 'update') && (
                        <button 
                          className="btn-edit-permissions"
                          onClick={() => handleEditProfile(perfil)}
                        >
                          Editar Permisos
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredPerfiles.length === 0 && !error && (
              <div className="perfil-usuario-empty">
                <ClipboardList size={48} strokeWidth={1} />
                <p>No se encontraron perfiles</p>
              </div>
            )}
          </div>
        )}

        {/* Modal de edición */}
        {editingProfile && (
          <div className="modal-overlay" onClick={() => setEditingProfile(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Editar Permisos</h3>
                <button className="modal-close" onClick={() => setEditingProfile(null)}>
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                <div className="profile-info">
                  <p><strong>Usuario:</strong> {editingProfile.usuario_nombre}</p>
                  <p><strong>Compañía:</strong> {editingProfile.compania_nombre}</p>
                </div>

                <div className="permissions-grid">
                  {[
                    { key: 'est_create', label: 'Crear' },
                    { key: 'est_read', label: 'Leer' },
                    { key: 'est_update', label: 'Actualizar' },
                    { key: 'est_delete', label: 'Eliminar' },
                    { key: 'est_print', label: 'Imprimir' },
                    { key: 'est_export', label: 'Exportar' }
                  ].map(permiso => (
                    <label key={permiso.key} className="permission-checkbox">
                      <input
                        type="checkbox"
                        checked={editingProfile.permisos?.[permiso.key] === "1"}
                        onChange={() => togglePermiso(permiso.key)}
                      />
                      <span>{permiso.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setEditingProfile(null)}>
                  Cancelar
                </button>
                <button className="btn-save" onClick={handleSaveProfile}>
                  <Save size={16} />
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SecuryPageLayout>
  )
}

export default PerfilUsuario