// src/dashboard/modules/secury-pure/pages/Opciones/Opciones.jsx
import { useState, useEffect } from "react"
import { FileEdit, Plus, Search, Edit, Trash2, RefreshCw } from "lucide-react"
import { useAuth } from "../../../../shared/context/AuthContext"
import { useConnections } from "../../../dashboard/components/header/useConnections"
import { hasPermission } from "../../../dashboard/components/sidebar_personalizado/sidebarService"
import { opcionesService } from "../services/opcionesService"
import "./Opciones.css"
import SecuryPageLayout from "../components/SecuryPageLayout";
const Opciones = () => {
  const { user } = useAuth()
  const { selectedConnection } = useConnections()
  
  const [opciones, setOpciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState(null)

  const permissions = user?.sidebarConfig?.menuGroups
    ?.flatMap(g => g.items)
    ?.find(item => item.path?.includes('secm-0001'))
    ?.permissions

  useEffect(() => {
    loadOpciones()
  }, [selectedConnection])

  const loadOpciones = async () => {
    if (!selectedConnection?.conexion) {
      setError('No hay conexión seleccionada')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await opcionesService.getAll(selectedConnection.conexion)
      setOpciones(data)
    } catch (error) {
      console.error('❌ Error cargando opciones:', error)
      setError(error.message || 'Error al cargar las opciones')
    } finally {
      setLoading(false)
    }
  }

  const filteredOpciones = opciones.filter(op =>
    op.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    op.url?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreate = () => {
    if (!hasPermission(permissions, 'create')) {
      alert("⚠️ No tienes permiso para crear")
      return
    }
    console.log("➕ Crear nueva opción")
  }

  const handleEdit = (opcion) => {
    if (!hasPermission(permissions, 'update')) {
      alert("⚠️ No tienes permiso para editar")
      return
    }
    console.log("✏️ Editar:", opcion)
  }

  const handleDelete = async (opcion) => {
    if (!hasPermission(permissions, 'delete')) {
      alert("⚠️ No tienes permiso para eliminar")
      return
    }
    
    if (!confirm(`¿Estás seguro de eliminar la opción "${opcion.nombre}"?`)) {
      return
    }

    try {
      await opcionesService.delete(opcion.id, selectedConnection.conexion)
      alert("✅ Opción eliminada correctamente")
      loadOpciones()
    } catch (error) {
      alert(`❌ Error: ${error.message}`)
    }
  }

  return (
    <SecuryPageLayout
      title="Opciones"
      icon={FileEdit}
      optionCode="SECM_0001"
      actions={
        <>
          <button className="btn-secondary" onClick={loadOpciones} disabled={loading}>
            <RefreshCw size={18} className={loading ? 'spinning' : ''} />
            Actualizar
          </button>
          {hasPermission(permissions, 'create') && (
            <button className="btn-primary" onClick={handleCreate}>
              <Plus size={20} />
              Nueva Opción
            </button>
          )}
        </>
      }
    >
      <div className="opciones-container">
        <div className="opciones-search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {error && (
          <div className="opciones-error">
            <p>❌ {error}</p>
            <button onClick={loadOpciones} className="btn-retry">Reintentar</button>
          </div>
        )}

        {loading ? (
          <div className="opciones-loading">
            <div className="spinner"></div>
            <p>Cargando opciones...</p>
          </div>
        ) : (
          <div className="opciones-table-container">
            <table className="opciones-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Grupo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOpciones.map(opcion => (
                  <tr key={opcion.id}>
                    <td><code className="code-badge">{opcion.url || opcion.codigo}</code></td>
                    <td>{opcion.nombre}</td>
                    <td>{opcion.menu || opcion.grupo || '-'}</td>
                    <td><span className="status-badge activo">Activo</span></td>
                    <td>
                      <div className="table-actions">
                        {hasPermission(permissions, 'update') && (
                          <button className="btn-icon btn-edit" onClick={() => handleEdit(opcion)} title="Editar">
                            <Edit size={16} />
                          </button>
                        )}
                        {hasPermission(permissions, 'delete') && (
                          <button className="btn-icon btn-delete" onClick={() => handleDelete(opcion)} title="Eliminar">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredOpciones.length === 0 && !error && (
              <div className="opciones-empty">
                <FileEdit size={48} strokeWidth={1} />
                <p>No se encontraron opciones</p>
                {searchTerm && (
                  <button className="btn-link" onClick={() => setSearchTerm('')}>
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </SecuryPageLayout>
  )
}

export default Opciones