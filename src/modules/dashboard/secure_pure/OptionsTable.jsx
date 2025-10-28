"use client"
import { Edit2, Trash2, CheckCircle, XCircle } from "lucide-react"
import { motion } from "framer-motion"
import "./OptionsTable.css"

const OptionsTable = ({ data, onEdit, onDelete }) => {
  const renderPermission = (value) => {
    if (value === "S") {
      return <CheckCircle size={18} className="icon-yes" />
    }
    return <XCircle size={18} className="icon-no" />
  }

  return (
    <div className="table-container-modern">
      <div className="table-scroll-wrapper">
        <table className="table-modern">
          <thead className="thead-modern-sticky">
            <tr>
              <th className="th-actions">Acciones</th>
              <th className="th-id">ID</th>
              <th className="th-nombre">Nombre</th>
              <th className="th-url">URL</th>
              <th className="th-permission" title="Crear">C</th>
              <th className="th-permission" title="Leer">R</th>
              <th className="th-permission" title="Actualizar">U</th>
              <th className="th-permission" title="Eliminar">D</th>
              <th className="th-permission" title="Imprimir">P</th>
              <th className="th-permission" title="Exportar">E</th>
              <th className="th-permission">1</th>
              <th className="th-permission">2</th>
              <th className="th-permission">3</th>
              <th className="th-permission">4</th>
              <th className="th-permission">5</th>
              <th className="th-permission">6</th>
              <th className="th-permission">7</th>
              <th className="th-permission">8</th>
              <th className="th-permission">9</th>
              <th className="th-permission">10</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="20" className="no-data">
                  <div className="no-data-container">
                    <p>No se encontraron registros</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((option, index) => (
                <motion.tr
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="tr-modern"
                >
                  <td className="td-actions-modern">
                    <button 
                      className="btn-edit-modern"
                      onClick={() => onEdit(option)}
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="btn-delete-modern"
                      onClick={() => onDelete(option.id)}
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                  <td className="td-id-modern">{option.id}</td>
                  <td className="td-nombre-modern">{option.nombre}</td>
                  <td className="td-url-modern">
                    <span className="url-tag">{option.url}</span>
                  </td>
                  <td className="td-center-modern">{renderPermission(option.c)}</td>
                  <td className="td-center-modern">{renderPermission(option.r)}</td>
                  <td className="td-center-modern">{renderPermission(option.u)}</td>
                  <td className="td-center-modern">{renderPermission(option.d)}</td>
                  <td className="td-center-modern">{renderPermission(option.p)}</td>
                  <td className="td-center-modern">{renderPermission(option.e)}</td>
                  <td className="td-center-modern">{renderPermission(option.col1)}</td>
                  <td className="td-center-modern">{renderPermission(option.col2)}</td>
                  <td className="td-center-modern">{renderPermission(option.col3)}</td>
                  <td className="td-center-modern">{renderPermission(option.col4)}</td>
                  <td className="td-center-modern">{renderPermission(option.col5)}</td>
                  <td className="td-center-modern">{renderPermission(option.col6)}</td>
                  <td className="td-center-modern">{renderPermission(option.col7)}</td>
                  <td className="td-center-modern">{renderPermission(option.col8)}</td>
                  <td className="td-center-modern">{renderPermission(option.col9)}</td>
                  <td className="td-center-modern">{renderPermission(option.col10)}</td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OptionsTable