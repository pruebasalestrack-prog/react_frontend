"use client"
import { useState, useEffect } from "react"
import { X, Save, Tag } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import "./OptionModal.css"

const OptionModal = ({ isOpen, onClose, onSave, editData }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    url: "",
    acciones: []
  })

  const accionesDisponibles = [
    { id: "crear", label: "Crear", color: "#10b981" },
    { id: "consultar", label: "Consultar", color: "#3b82f6" },
    { id: "editar", label: "Editar", color: "#f59e0b" },
    { id: "eliminar", label: "Eliminar", color: "#ef4444" },
    { id: "imprimir", label: "Imprimir", color: "#8b5cf6" },
    { id: "exportar", label: "Exportar", color: "#06b6d4" }
  ]

  useEffect(() => {
    if (editData) {
      setFormData({
        nombre: editData.nombre || "",
        url: editData.url || "",
        acciones: ["crear", "consultar", "editar", "eliminar", "imprimir", "exportar"]
      })
    } else {
      setFormData({ nombre: "", url: "", acciones: [] })
    }
  }, [editData, isOpen])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const toggleAccion = (accionId) => {
    if (formData.acciones.includes(accionId)) {
      setFormData({
        ...formData,
        acciones: formData.acciones.filter(a => a !== accionId)
      })
    } else {
      setFormData({
        ...formData,
        acciones: [...formData.acciones, accionId]
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay-elegant"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-box-elegant"
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          transition={{ type: "spring", duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header elegante */}
          <div className="modal-header-elegant">
            <div className="modal-header-content">
              <div className="modal-icon-wrapper">
                <Tag size={24} />
              </div>
              <div>
                <h2 className="modal-title-elegant">
                  {editData ? "Editar Opción" : "Nueva Opción"}
                </h2>
                <p className="modal-subtitle-elegant">
                  {editData ? "Actualiza la información de la opción" : "Completa los campos para crear una nueva opción"}
                </p>
              </div>
            </div>
            <button className="btn-close-elegant" onClick={onClose}>
              <X size={22} />
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="modal-form-elegant">
            <div className="form-grid">
              <div className="form-group-elegant">
                <label className="label-elegant">
                  Nombre <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Gestión de Usuarios"
                  className="input-elegant"
                  required
                />
              </div>

              <div className="form-group-elegant">
                <label className="label-elegant">
                  URL <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  placeholder="Ej: SECM_0001"
                  className="input-elegant"
                  required
                />
              </div>
            </div>

            <div className="form-group-elegant">
              <label className="label-elegant">
                Permisos y Acciones
              </label>
              <div className="acciones-grid-elegant">
                {accionesDisponibles.map((accion) => (
                  <motion.button
                    key={accion.id}
                    type="button"
                    className={`accion-chip-elegant ${formData.acciones.includes(accion.id) ? 'active' : ''}`}
                    onClick={() => toggleAccion(accion.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      '--chip-color': accion.color,
                      background: formData.acciones.includes(accion.id) 
                        ? accion.color 
                        : 'transparent',
                      borderColor: accion.color,
                      color: formData.acciones.includes(accion.id) 
                        ? 'white' 
                        : accion.color
                    }}
                  >
                    {accion.label}
                    {formData.acciones.includes(accion.id) && (
                      <span className="check-mark">✓</span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Footer con botones */}
            <div className="modal-footer-elegant">
              <button 
                type="button" 
                className="btn-cancel-elegant" 
                onClick={onClose}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn-save-elegant"
              >
                <Save size={18} />
                {editData ? "Guardar Cambios" : "Crear Opción"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default OptionModal