import { useState, useEffect } from "react"
import { Users, Plus, Search, Edit, Trash2, RefreshCw, Mail, Shield, Key } from "lucide-react"
import SecuryPageLayout from "../components/SecuryPageLayout"
import { useAuth } from "../../../../shared/context/AuthContext"
import { useConnections } from "../../../dashboard/components/header/useConnections"
import { hasPermission } from "../../../dashboard/components/sidebar_personalizado/sidebarService"
import { usuariosService } from "../services/usuariosService"
import "./Usuarios.css"

const Usuarios = () => {
  const { user } = useAuth()
  const { selectedConnection } = useConnections()
  
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState(null)

  const permissions = user?.sidebarConfig?.menuGroups
    ?.flatMap(g => g.items)
    ?.find(item => item.path?.includes('secm-0005'))
    ?.permissions

  useEffect(() => {
    loadUsuarios()
  }, [selectedConnection])

  const loadUsuarios = async () => {
    if (!selectedConnection?.conexion) {
      setError('No hay conexión seleccionada')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await usuariosService.getAll(selectedConnection.conexion)
      setUsuarios(data)
    } catch (error) {
      console.error('❌ Error cargando usuarios:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsuarios = usuarios.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreate = () => {
    if (!hasPermission(permissions, 'create')) {
      alert("⚠️ No tienes permiso para crear")
      return
    }
    console.log("➕ Crear nuevo usuario")
  }

  const handleEdit = (usuario) => {
    if (!hasPermission(permissions, 'update')) {
      alert("⚠️ No tienes permiso para editar")
      return
    }
    console.log("✏️ Editar:", usuario)
  }

  const handleDelete = async (usuario) => {
    if (!hasPermission(permissions, 'delete')) {
      alert("⚠️ No tienes permiso para eliminar")
      return
    }
    
    if (!confirm(`¿Estás seguro de eliminar el usuario "${usuario.name}"?`)) {
      return
    }

    try {
      await usuariosService.delete(usuario.id, selectedConnection.conexion)
      alert("✅ Usuario eliminado correctamente")
      loadUsuarios()
    } catch (error) {
      alert(`❌ Error: ${error.message}`)
    }
  }

  const handleResetPassword = async (usuario) => {
    if (!hasPermission(permissions, 'comod1')) {
      alert("⚠️ No tienes permiso para resetear contraseñas")
      return
    }

    if (!confirm(`¿Estás seguro de resetear la contraseña de "${usuario.name}"?`)) {
      return
    }

    try {
      await usuariosService.resetPassword(usuario.id, selectedConnection.conexion)
      alert("✅ Contraseña reseteada correctamente")
    } catch (error) {
      alert(`❌ Error: ${error.message}`)
    }
  }

  const getTipoUsuarioLabel = (tipo) => {
    const tipos = {
      '1': 'Administrador',
      '2': 'Usuario Estándar',
      '3': 'Usuario Limitado',
      '6': 'Super Admin'
    }
    return tipos[tipo] || 'Desconocido'
  }

  return (
    <SecuryPageLayout
      title="Usuarios"
      icon={Users}
      optionCode="SECM_0005"
      actions={
        <>
          <button className="btn-secondary" onClick={loadUsuarios} disabled={loading}>
            <RefreshCw size={18} className={loading ? 'spinning' : ''} />
            Actualizar
          </button>
          {hasPermission(permissions, 'create') && (
            <button className="btn-primary" onClick={handleCreate}>
              <Plus size={20} />
              Nuevo Usuario
            </button>
          )}
        </>
      }
    >
      <div className="usuarios-container">
        <div className="usuarios-search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {error && (
          <div className="usuarios-error">
            <p>❌ {error}</p>
            <button onClick={loadUsuarios} className="btn-retry">Reintentar</button>
          </div>
        )}

        {loading ? (
          <div className="usuarios-loading">
            <div className="spinner"></div>
            <p>Cargando usuarios...</p>
          </div>
        ) : (
          <div className="usuarios-table-container">
            <table className="usuarios-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsuarios.map(usuario => (
                  <tr key={usuario.id}>
                    <td>
                      <div className="usuario-info">
                        <div className="usuario-avatar">
                          {usuario.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="usuario-name">{usuario.name}</div>
                          <div className="usuario-id">ID: {usuario.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="usuario-email">
                        <Mail size={14} />
                        <span>{usuario.email}</span>
                      </div>
                    </td>
                    <td>
                      <span className="tipo-badge">
                        <Shield size={12} />
                        {getTipoUsuarioLabel(usuario.tipo_usuario)}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge activo">Activo</span>
                    </td>
                    <td>
                      <div className="table-actions">
                        {hasPermission(permissions, 'comod1') && (
                          <button 
                            className="btn-icon btn-reset"
                            onClick={() => handleResetPassword(usuario)}
                            title="Resetear contraseña"
                          >
                            <Key size={16} />
                          </button>
                        )}
                        {hasPermission(permissions, 'update') && (
                          <button className="btn-icon btn-edit" onClick={() => handleEdit(usuario)} title="Editar">
                            <Edit size={16} />
                          </button>
                        )}
                        {hasPermission(permissions, 'delete') && (
                          <button className="btn-icon btn-delete" onClick={() => handleDelete(usuario)} title="Eliminar">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredUsuarios.length === 0 && !error && (
              <div className="usuarios-empty">
                <Users size={48} strokeWidth={1} />
                <p>No se encontraron usuarios</p>
              </div>
            )}
          </div>
        )}
      </div>
    </SecuryPageLayout>
  )
}

export default Usuarios