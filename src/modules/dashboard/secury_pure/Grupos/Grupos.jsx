import { useState, useEffect } from "react"
import { LayoutGrid, Plus, Search, Edit, Trash2, RefreshCw } from "lucide-react"
import SecuryPageLayout from "../components/SecuryPageLayout"
import { useAuth } from "../../../../shared/context/AuthContext"
import { useConnections } from "../../../dashboard/components/header/useConnections"
import { hasPermission } from "../../../dashboard/components/sidebar_personalizado/sidebarService"
import { gruposService } from "../services/gruposService"
import "./Grupos.css"

const Grupos = () => {
  const { user } = useAuth()
  const { selectedConnection } = useConnections()
  
  const [grupos, setGrupos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState(null)

  const permissions = user?.sidebarConfig?.menuGroups
    ?.flatMap(g => g.items)
    ?.find(item => item.path?.includes('secm-0002'))
    ?.permissions

  useEffect(() => {
    loadGrupos()
  }, [selectedConnection])

  const loadGrupos = async () => {
    if (!selectedConnection?.conexion) {
      setError('No hay conexión seleccionada')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await gruposService.getAll(selectedConnection.conexion)
      setGrupos(data)
    } catch (error) {
      console.error('❌ Error cargando grupos:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredGrupos = grupos.filter(g =>
    g.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreate = () => {
    if (!hasPermission(permissions, 'create')) {
      alert("⚠️ No tienes permiso para crear")
      return
    }
    console.log("➕ Crear nuevo grupo")
  }

  const handleEdit = (grupo) => {
    if (!hasPermission(permissions, 'update')) {
      alert("⚠️ No tienes permiso para editar")
      return
    }
    console.log("✏️ Editar:", grupo)
  }

  const handleDelete = async (grupo) => {
    if (!hasPermission(permissions, 'delete')) {
      alert("⚠️ No tienes permiso para eliminar")
      return
    }
    
    if (!confirm(`¿Estás seguro de eliminar el grupo "${grupo.nombre}"?`)) {
      return
    }

    try {
      await gruposService.delete(grupo.id, selectedConnection.conexion)
      alert("✅ Grupo eliminado correctamente")
      loadGrupos()
    } catch (error) {
      alert(`❌ Error: ${error.message}`)
    }
  }

  return (
    <SecuryPageLayout
      title="Grupos o Menúes"
      icon={LayoutGrid}
      optionCode="SECM_0002"
      actions={
        <>
          <button className="btn-secondary" onClick={loadGrupos} disabled={loading}>
            <RefreshCw size={18} className={loading ? 'spinning' : ''} />
            Actualizar
          </button>
          {hasPermission(permissions, 'create') && (
            <button className="btn-primary" onClick={handleCreate}>
              <Plus size={20} />
              Nuevo Grupo
            </button>
          )}
        </>
      }
    >
      <div className="grupos-container">
        <div className="grupos-search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar grupos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {error && (
          <div className="grupos-error">
            <p>❌ {error}</p>
            <button onClick={loadGrupos} className="btn-retry">Reintentar</button>
          </div>
        )}

        {loading ? (
          <div className="grupos-loading">
            <div className="spinner"></div>
            <p>Cargando grupos...</p>
          </div>
        ) : (
          <div className="grupos-table-container">
            <table className="grupos-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Cantidad de Opciones</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrupos.map(grupo => (
                  <tr key={grupo.id}>
                    <td>{grupo.id}</td>
                    <td>
                      <div className="grupo-name">
                        <LayoutGrid size={16} />
                        <span>{grupo.nombre}</span>
                      </div>
                    </td>
                    <td>{grupo.descripcion || '-'}</td>
                    <td>
                      <span className="options-count">
                        {grupo.cantidad_opciones || 0} opciones
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        {hasPermission(permissions, 'update') && (
                          <button className="btn-icon btn-edit" onClick={() => handleEdit(grupo)} title="Editar">
                            <Edit size={16} />
                          </button>
                        )}
                        {hasPermission(permissions, 'delete') && (
                          <button className="btn-icon btn-delete" onClick={() => handleDelete(grupo)} title="Eliminar">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredGrupos.length === 0 && !error && (
              <div className="grupos-empty">
                <LayoutGrid size={48} strokeWidth={1} />
                <p>No se encontraron grupos</p>
              </div>
            )}
          </div>
        )}
      </div>
    </SecuryPageLayout>
  )
}

export default Grupos