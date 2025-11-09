import { useState, useEffect } from "react"
import { Settings, RefreshCw, Search, Save } from "lucide-react"
import SecuryPageLayout from "../components/SecuryPageLayout"
import { useAuth } from "../../../../shared/context/AuthContext"
import { useConnections } from "../../../dashboard/components/header/useConnections"
import { hasPermission } from "../../../dashboard/components/sidebar_personalizado/sidebarService"
import { parametrosService } from "../services/parametrosService"
import "./Parametros.css"

const Parametros = () => {
  const { user } = useAuth()
  const { selectedConnection } = useConnections()
  
  const [parametros, setParametros] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState(null)
  const [editingParam, setEditingParam] = useState(null)

  const permissions = user?.sidebarConfig?.menuGroups
    ?.flatMap(g => g.items)
    ?.find(item => item.path?.includes('secm-0008'))
    ?.permissions

  useEffect(() => {
    loadParametros()
  }, [selectedConnection])

  const loadParametros = async () => {
    if (!selectedConnection?.conexion) {
      setError('No hay conexión seleccionada')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await parametrosService.getAll(selectedConnection.conexion)
      setParametros(data)
    } catch (error) {
      console.error('❌ Error cargando parámetros:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredParametros = parametros.filter(p =>
    p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (parametro) => {
    if (!hasPermission(permissions, 'update')) {
      alert("⚠️ No tienes permiso para editar")
      return
    }
    setEditingParam({ ...parametro })
  }

  const handleSave = async () => {
    try {
      await parametrosService.update(
        editingParam.id,
        { valor: editingParam.valor },
        selectedConnection.conexion
      )
      alert("✅ Parámetro actualizado correctamente")
      setEditingParam(null)
      loadParametros()
    } catch (error) {
      alert(`❌ Error: ${error.message}`)
    }
  }

  const groupedParametros = filteredParametros.reduce((acc, param) => {
    const categoria = param.categoria || 'Sin categoría'
    if (!acc[categoria]) {
      acc[categoria] = []
    }
    acc[categoria].push(param)
    return acc
  }, {})

  return (
    <SecuryPageLayout
      title="Parámetros"
      icon={Settings}
      optionCode="SECM_0008"
      actions={
        <button className="btn-secondary" onClick={loadParametros} disabled={loading}>
          <RefreshCw size={18} className={loading ? 'spinning' : ''} />
          Actualizar
        </button>
      }
    >
      <div className="parametros-container">
        <div className="parametros-search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar parámetros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {error && (
          <div className="parametros-error">
            <p>❌ {error}</p>
            <button onClick={loadParametros} className="btn-retry">Reintentar</button>
          </div>
        )}

        {loading ? (
          <div className="parametros-loading">
            <div className="spinner"></div>
            <p>Cargando parámetros...</p>
          </div>
        ) : (
          <div className="parametros-categories">
            {Object.keys(groupedParametros).map(categoria => (
              <div key={categoria} className="param-category">
                <h3 className="category-title">
                  <Settings size={18} />
                  {categoria}
                </h3>
                
                <div className="params-grid">
                  {groupedParametros[categoria].map(param => (
                    <div key={param.id} className="param-card">
                      <div className="param-header">
                        <h4>{param.nombre}</h4>
                        {hasPermission(permissions, 'update') && (
                          <button 
                            className="btn-edit-small"
                            onClick={() => handleEdit(param)}
                          >
                            Editar
                          </button>
                        )}
                      </div>
                      
                      {param.descripcion && (
                        <p className="param-description">{param.descripcion}</p>
                      )}
                      
                      <div className="param-value-container">
                        <span className="param-label">Valor:</span>
                        <code className="param-value">{param.valor}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {Object.keys(groupedParametros).length === 0 && !error && (
              <div className="parametros-empty">
                <Settings size={48} strokeWidth={1} />
                <p>No se encontraron parámetros</p>
              </div>
            )}
          </div>
        )}

        {/* Modal de edición */}
        {editingParam && (
          <div className="modal-overlay" onClick={() => setEditingParam(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Editar Parámetro</h3>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label>Nombre</label>
                  <input
                    type="text"
                    value={editingParam.nombre}
                    disabled
                    className="form-input disabled"
                  />
                </div>

                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    value={editingParam.descripcion || ''}
                    disabled
                    className="form-textarea disabled"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Valor *</label>
                  <input
                    type="text"
                    value={editingParam.valor}
                    onChange={(e) => setEditingParam({ ...editingParam, valor: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setEditingParam(null)}>
                  Cancelar
                </button>
                <button className="btn-save" onClick={handleSave}>
                  <Save size={16} />
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SecuryPageLayout>
  )
}

export default Parametros