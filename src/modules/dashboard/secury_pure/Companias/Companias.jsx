import { useState, useEffect } from "react"
import { Building2, Plus, Search, Edit, Trash2, RefreshCw, MapPin, Phone, FileText } from "lucide-react"
import SecuryPageLayout from "../components/SecuryPageLayout"
import { useAuth } from "../../../../shared/context/AuthContext"
import { useConnections } from "../../../dashboard/components/header/useConnections"
import { hasPermission } from "../../../dashboard/components/sidebar_personalizado/sidebarService"
import { companiasService } from "../services/companiasService"
import "./Companias.css"

const Companias = () => {
  const { user } = useAuth()
  const { selectedConnection } = useConnections()
  
  const [companias, setCompanias] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState(null)

  const permissions = user?.sidebarConfig?.menuGroups
    ?.flatMap(g => g.items)
    ?.find(item => item.path?.includes('secm-0004'))
    ?.permissions

  useEffect(() => {
    loadCompanias()
  }, [selectedConnection])

  const loadCompanias = async () => {
    if (!selectedConnection?.conexion) {
      setError('No hay conexión seleccionada')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await companiasService.getAll(selectedConnection.conexion)
      setCompanias(data)
    } catch (error) {
      console.error('❌ Error cargando compañías:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredCompanias = companias.filter(c =>
    c.nick?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.razonsocial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.identificacion?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreate = () => {
    if (!hasPermission(permissions, 'create')) {
      alert("⚠️ No tienes permiso para crear")
      return
    }
    console.log("➕ Crear nueva compañía")
  }

  const handleEdit = (compania) => {
    if (!hasPermission(permissions, 'update')) {
      alert("⚠️ No tienes permiso para editar")
      return
    }
    console.log("✏️ Editar:", compania)
  }

  const handleDelete = async (compania) => {
    if (!hasPermission(permissions, 'delete')) {
      alert("⚠️ No tienes permiso para eliminar")
      return
    }
    
    if (!confirm(`¿Estás seguro de eliminar la compañía "${compania.nick}"?`)) {
      return
    }

    try {
      await companiasService.delete(compania.id, selectedConnection.conexion)
      alert("✅ Compañía eliminada correctamente")
      loadCompanias()
    } catch (error) {
      alert(`❌ Error: ${error.message}`)
    }
  }

  return (
    <SecuryPageLayout
      title="Compañías"
      icon={Building2}
      optionCode="SECM_0004"
      actions={
        <>
          <button className="btn-secondary" onClick={loadCompanias} disabled={loading}>
            <RefreshCw size={18} className={loading ? 'spinning' : ''} />
            Actualizar
          </button>
          {hasPermission(permissions, 'create') && (
            <button className="btn-primary" onClick={handleCreate}>
              <Plus size={20} />
              Nueva Compañía
            </button>
          )}
        </>
      }
    >
      <div className="companias-container">
        <div className="companias-search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre, razón social o identificación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {error && (
          <div className="companias-error">
            <p>❌ {error}</p>
            <button onClick={loadCompanias} className="btn-retry">Reintentar</button>
          </div>
        )}

        {loading ? (
          <div className="companias-loading">
            <div className="spinner"></div>
            <p>Cargando compañías...</p>
          </div>
        ) : (
          <div className="companias-grid">
            {filteredCompanias.map(compania => (
              <div key={compania.id} className="compania-card">
                <div className="compania-header">
                  <div className="compania-icon">
                    <Building2 size={24} />
                  </div>
                  <div className="compania-badge">
                    {compania.acceso === "1" ? (
                      <span className="badge-active">Activo</span>
                    ) : (
                      <span className="badge-inactive">Inactivo</span>
                    )}
                  </div>
                </div>

                <h3 className="compania-nick">{compania.nick}</h3>
                <p className="compania-razonsocial">{compania.razonsocial}</p>

                <div className="compania-details">
                  <div className="detail-item">
                    <FileText size={14} />
                    <span>{compania.identificacion || 'S/I'}</span>
                  </div>
                  <div className="detail-item">
                    <Phone size={14} />
                    <span>{compania.telefono || 'S/T'}</span>
                  </div>
                  <div className="detail-item">
                    <MapPin size={14} />
                    <span>{compania.direccion || 'S/D'}</span>
                  </div>
                </div>

                <div className="compania-connection">
                  <span className="connection-label">Conexión:</span>
                  <code className="connection-value">{compania.conexion}</code>
                </div>

                <div className="compania-actions">
                  {hasPermission(permissions, 'update') && (
                    <button className="btn-icon btn-edit" onClick={() => handleEdit(compania)}>
                      <Edit size={16} />
                    </button>
                  )}
                  {hasPermission(permissions, 'delete') && (
                    <button className="btn-icon btn-delete" onClick={() => handleDelete(compania)}>
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {filteredCompanias.length === 0 && !error && (
              <div className="companias-empty">
                <Building2 size={48} strokeWidth={1} />
                <p>No se encontraron compañías</p>
              </div>
            )}
          </div>
        )}
      </div>
    </SecuryPageLayout>
  )
}

export default Companias