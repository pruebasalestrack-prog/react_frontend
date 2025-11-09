"use client"
import { useState } from "react"
import { Plus, Search, Download, FileText, Printer, Filter } from "lucide-react"
import OptionsTable from "./OptionsTable"
import OptionModal from "./OptionModal"
import "./OptionsPurePage.css"

const Options = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOption, setEditingOption] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [recordsPerPage, setRecordsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const [options, setOptions] = useState([
    { id: 1, nombre: "Opciones", url: "SECM_0001", c: "S", r: "N", u: "S", d: "S", p: "S", e: "S", col1: "N", col2: "N", col3: "N", col4: "N", col5: "N", col6: "N", col7: "N", col8: "N", col9: "N", col10: "N" },
    { id: 2, nombre: "Grupos o Menúes", url: "SECM_0002", c: "S", r: "N", u: "S", d: "S", p: "S", e: "S", col1: "N", col2: "N", col3: "N", col4: "N", col5: "N", col6: "N", col7: "N", col8: "N", col9: "N", col10: "N" },
    { id: 3, nombre: "Roles", url: "SECM_0003", c: "S", r: "S", u: "S", d: "S", p: "S", e: "S", col1: "S", col2: "N", col3: "N", col4: "N", col5: "N", col6: "N", col7: "N", col8: "N", col9: "N", col10: "N" },
    { id: 4, nombre: "Compañías", url: "SECM_0004", c: "S", r: "S", u: "S", d: "S", p: "S", e: "S", col1: "N", col2: "N", col3: "N", col4: "N", col5: "N", col6: "N", col7: "N", col8: "N", col9: "N", col10: "N" },
    { id: 5, nombre: "Usuarios", url: "SECM_0005", c: "S", r: "S", u: "S", d: "S", p: "S", e: "S", col1: "S", col2: "S", col3: "S", col4: "N", col5: "N", col6: "N", col7: "N", col8: "N", col9: "N", col10: "N" },
    { id: 6, nombre: "Usuarios x compañías", url: "SECM_0006", c: "S", r: "S", u: "S", d: "S", p: "S", e: "S", col1: "N", col2: "N", col3: "N", col4: "N", col5: "N", col6: "N", col7: "N", col8: "N", col9: "N", col10: "N" },
    { id: 7, nombre: "Perfil de Usuario x Cía.", url: "SECM_0007", c: "S", r: "S", u: "S", d: "N", p: "S", e: "S", col1: "S", col2: "N", col3: "N", col4: "N", col5: "N", col6: "N", col7: "N", col8: "N", col9: "N", col10: "N" },
    { id: 8, nombre: "Parámetros", url: "SECM_0008", c: "S", r: "S", u: "S", d: "S", p: "S", e: "S", col1: "N", col2: "N", col3: "N", col4: "N", col5: "N", col6: "N", col7: "N", col8: "N", col9: "N", col10: "N" },
    { id: 9, nombre: "Parámetros de compañía", url: "GENM_0004", c: "S", r: "S", u: "S", d: "S", p: "S", e: "S", col1: "N", col2: "N", col3: "N", col4: "N", col5: "N", col6: "N", col7: "N", col8: "N", col9: "N", col10: "N" },
    { id: 10, nombre: "Referenciales de compañía", url: "GENM_0006", c: "S", r: "S", u: "S", d: "S", p: "S", e: "S", col1: "N", col2: "N", col3: "N", col4: "N", col5: "N", col6: "N", col7: "N", col8: "N", col9: "N", col10: "N" },
    { id: 11, nombre: "Ubicación GPS", url: "RTKR_0001", c: "N", r: "N", u: "N", d: "N", p: "S", e: "S", col1: "S", col2: "N", col3: "N", col4: "N", col5: "N", col6: "N", col7: "N", col8: "N", col9: "N", col10: "N" },
    { id: 12, nombre: "Clientes GPS", url: "RTKR_0002", c: "N", r: "N", u: "N", d: "N", p: "N", e: "N", col1: "N", col2: "N", col3: "N", col4: "N", col5: "N", col6: "N", col7: "N", col8: "N", col9: "N", col10: "N" },
  ])

  const filteredData = options.filter(option =>
    option.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.url.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalRecords = filteredData.length
  const totalPages = Math.ceil(totalRecords / recordsPerPage)
  const startIndex = (currentPage - 1) * recordsPerPage
  const endIndex = startIndex + recordsPerPage
  const currentData = filteredData.slice(startIndex, endIndex)

  const handleCreate = () => {
    setEditingOption(null)
    setIsModalOpen(true)
  }

  const handleEdit = (option) => {
    setEditingOption(option)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de eliminar este registro?")) {
      setOptions(options.filter(opt => opt.id !== id))
    }
  }

  const handleSave = (optionData) => {
    if (editingOption) {
      setOptions(options.map(opt => 
        opt.id === editingOption.id ? { ...opt, ...optionData } : opt
      ))
    } else {
      const newOption = {
        id: Math.max(...options.map(o => o.id)) + 1,
        ...optionData,
        c: "S", r: "S", u: "S", d: "S", p: "S", e: "S",
        col1: "N", col2: "N", col3: "N", col4: "N", col5: "N",
        col6: "N", col7: "N", col8: "N", col9: "N", col10: "N"
      }
      setOptions([...options, newOption])
    }
    setIsModalOpen(false)
  }

  return (
    <div className="modern-options-page">
      {/* Header moderno con gradiente */}
      <div className="modern-header">
        <div className="header-content">
          <div className="header-title-section">
            <h1 className="modern-title">Gestión de Opciones</h1>
            <p className="modern-subtitle">Administra los permisos y configuraciones del sistema</p>
          </div>
          <button className="btn-create-modern" onClick={handleCreate}>
            <Plus size={20} strokeWidth={2.5} />
            <span>Nueva Opción</span>
          </button>
        </div>
      </div>

      {/* Barra de herramientas moderna */}
      <div className="toolbar-modern">
        <div className="search-container-modern">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre o URL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-modern"
          />
        </div>

        <div className="toolbar-actions">
          <button className="btn-icon-modern" title="Filtros">
            <Filter size={18} />
          </button>
          <button className="btn-icon-modern" title="Exportar PDF">
            <FileText size={18} />
          </button>
          <button className="btn-icon-modern" title="Exportar Excel">
            <Download size={18} />
          </button>
          <button className="btn-icon-modern" title="Imprimir">
            <Printer size={18} />
          </button>
        </div>
      </div>

      {/* Información y controles */}
      <div className="table-info-bar">
        <div className="info-text">
          Mostrando <strong>{startIndex + 1}</strong> a <strong>{Math.min(endIndex, totalRecords)}</strong> de <strong>{totalRecords}</strong> registros
        </div>
        <div className="records-control">
          <label>Mostrar</label>
          <select
            value={recordsPerPage}
            onChange={(e) => {
              setRecordsPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
            className="select-modern"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <label>registros</label>
        </div>
      </div>

      {/* Tabla moderna */}
      <OptionsTable 
        data={currentData}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Paginación moderna */}
      <div className="pagination-modern">
        <button
          className="pagination-btn-modern"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        
        <div className="pagination-numbers">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          className="pagination-btn-modern"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>

      {/* Modal moderno */}
      <OptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editData={editingOption}
      />
    </div>
  )
}

export default Options