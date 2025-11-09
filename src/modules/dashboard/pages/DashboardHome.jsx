"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "../../../shared/context/AuthContext"
import { useSession } from "../../../shared/context/SessionContext"
import { useTheme } from "../../../shared/context/ThemeContext"
import { useConnections } from "../../dashboard/components/header/useConnections"
import { Users, FolderKanban, DollarSign, CheckCircle, TrendingUp, Activity, Database } from "lucide-react"
import SalesChart from "../../dashboard/components/charts/SalesChart"
import "./DashboardHome.css"

const DashboardHome = () => {
  const { user } = useAuth()
  const { showSessionAlert } = useSession()
  const { theme } = useTheme()
  const { selectedConnection, selectedConnectionString } = useConnections() // ✅ Sin pasar user
  
  // Estado para datos dinámicos por conexión
  const [dbData, setDbData] = useState(null)
  const [loading, setLoading] = useState(false)

  // 🔍 Debug al montar
  useEffect(() => {
    console.log("🏠 DashboardHome montado")
    console.log("👤 Usuario:", user?.email)
    console.log("🔌 Conexión seleccionada:", selectedConnectionString)
    console.log("⚙️ Sidebar Config:", user?.sidebarConfig)
  }, [user, selectedConnectionString])

  // Función para cargar datos según la conexión activa
  const loadConnectionData = async (connectionString) => {
    if (!connectionString) {
      console.log("⚠️ No hay conexión para cargar datos")
      return
    }

    setLoading(true)
    console.log("📊 Cargando datos para conexión:", connectionString)

    try {
      // Simulación de carga de datos (aquí harías tu llamada a la API)
      await new Promise(resolve => setTimeout(resolve, 500))

      // Datos simulados según la conexión
      const mockData = {
        conexion1: {
          database_name: "Secury PURE",
          description: "Base de datos principal - PURE TECHNOLOGY S.A.",
          modules: ["Usuarios", "Seguridad", "Reportes", "Configuración", "Auditoría"],
          stats: {
            total_users: 150,
            active_projects: 23,
            total_revenue: 450000,
            pending_tasks: 12,
          },
          recent_activities: [
            {
              id: 1,
              title: "Nuevo usuario registrado",
              description: "Juan Pérez se ha unido al sistema",
              date: "Hace 2 horas",
              status: "active",
              type: "user",
            },
            {
              id: 2,
              title: "Proyecto completado",
              description: "Sistema de seguridad finalizado",
              date: "Hace 5 horas",
              status: "completed",
              type: "project",
            },
          ]
        },
        conexion2: {
          database_name: "Módulo Ventas",
          description: "Base de datos de ventas - RESGASA",
          modules: ["Ventas", "Clientes", "Productos", "Inventario", "Facturación"],
          stats: {
            total_users: 85,
            active_projects: 15,
            total_revenue: 320000,
            pending_tasks: 8,
          },
          recent_activities: [
            {
              id: 1,
              title: "Venta registrada",
              description: "Nueva venta por $5,000",
              date: "Hace 1 hora",
              status: "active",
              type: "project",
            },
            {
              id: 2,
              title: "Cliente agregado",
              description: "Nuevo cliente: Empresa XYZ",
              date: "Hace 3 horas",
              status: "completed",
              type: "user",
            },
          ]
        },
        conexion3: {
          database_name: "Módulo Vigilancia",
          description: "Base de datos de vigilancia - RESGASA",
          modules: ["Monitoreo", "Cámaras", "Alertas", "Reportes", "Personal"],
          stats: {
            total_users: 45,
            active_projects: 8,
            total_revenue: 180000,
            pending_tasks: 5,
          },
          recent_activities: [
            {
              id: 1,
              title: "Alerta de seguridad",
              description: "Movimiento detectado en zona A",
              date: "Hace 30 minutos",
              status: "active",
              type: "project",
            },
            {
              id: 2,
              title: "Cámara instalada",
              description: "Nueva cámara en el sector 5",
              date: "Hace 4 horas",
              status: "completed",
              type: "project",
            },
          ]
        }
      }

      // Obtener datos según el connection string
      const connectionData = mockData[connectionString] || mockData.conexion1

      setDbData(connectionData)
      console.log("✅ Datos cargados para:", connectionString)

    } catch (error) {
      console.error("❌ Error cargando datos:", error)
      setDbData({
        database_name: "Sin conexión",
        description: "No hay descripción disponible",
        modules: ["Sin módulos"],
        stats: {
          total_users: 0,
          active_projects: 0,
          total_revenue: 0,
          pending_tasks: 0,
        },
        recent_activities: []
      })
    } finally {
      setLoading(false)
    }
  }

  // Cargar datos cuando cambia la conexión
  useEffect(() => {
    if (selectedConnectionString) {
      console.log("🔄 DashboardHome: Conexión cambió a:", selectedConnectionString)
      loadConnectionData(selectedConnectionString)
    }
  }, [selectedConnectionString])

  // Escuchar cambios de conexión desde el Header
  useEffect(() => {
    const handleConnectionChange = (event) => {
      const newConnection = event.detail
      console.log("🔄 DashboardHome: Evento de cambio de conexión recibido:", newConnection.connection)
      loadConnectionData(newConnection.connection)
    }

    window.addEventListener("connectionChanged", handleConnectionChange)
    
    return () => {
      window.removeEventListener("connectionChanged", handleConnectionChange)
    }
  }, [])

  // Mostrar loading
  if (loading) {
    return (
      <div className="dashboard-home">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Cargando datos de {selectedConnection?.name || 'conexión'}...
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Si no hay datos
  if (!dbData) {
    return (
      <div className="dashboard-home">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No hay datos disponibles
            </p>
          </div>
        </div>
      </div>
    )
  }

  const stats = [
    {
      icon: Users,
      label: "Total Usuarios",
      value: dbData?.stats?.total_users || 0,
      change: "+12%",
      color: "users",
    },
    {
      icon: FolderKanban,
      label: "Proyectos Activos",
      value: dbData?.stats?.active_projects || 0,
      change: "+8%",
      color: "projects",
    },
    {
      icon: DollarSign,
      label: "Ingresos Totales",
      value: `$${(dbData?.stats?.total_revenue || 0).toLocaleString()}`,
      change: "+15%",
      color: "revenue",
    },
    {
      icon: CheckCircle,
      label: "Tareas Pendientes",
      value: dbData?.stats?.pending_tasks || 0,
      change: "-5%",
      color: "tasks",
    },
  ]

  return (
    <div className="dashboard-home">
      {/* Welcome section */}
      <motion.div
        className="welcome-section"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        key={`welcome-${selectedConnectionString}`}
      >
        <div>
          <h2>Bienvenido, {user?.name}! 👋</h2>
          <p>
            Aquí está el resumen de tu compañía: <strong>{dbData?.database_name}</strong>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Conexión activa: <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">
              {selectedConnectionString || "No disponible"}
            </span>
          </p>
          
          {/* 🔍 Debug Info (solo desarrollo)
          {process.env.NODE_ENV === 'development' && (
            <div style={{
              marginTop: '10px',
              padding: '10px',
              background: '#f0f4ff',
              borderRadius: '6px',
              fontSize: '12px',
              border: '1px solid #e0e7ff'
            }}>
              <strong>🔍 Debug:</strong>
              <div>Sidebar generado: {user?.sidebarConfig ? '✅ Sí' : '❌ No'}</div>
              {user?.sidebarConfig && (
                <div>Grupos: {user.sidebarConfig.menuGroups?.length || 0}</div>
              )}
            </div>
          )} */}
        </div>
        <div className="welcome-badge">
          <Activity size={20} />
          <span>Sistema Activo</span>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={`${selectedConnectionString}-stat-${index}`}
              className={`stat-card stat-card-${stat.color}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className={`stat-icon stat-icon-${stat.color}`}>
                <Icon size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">{stat.label}</p>
                <h3 className="stat-value">{stat.value}</h3>
                <div className="stat-change">
                  <TrendingUp size={14} />
                  <span>{stat.change}</span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Chart */}
      <div key={`chart-${selectedConnectionString}`}>
        <SalesChart connectionString={selectedConnectionString} />
      </div>

      {/* Database info */}
      <motion.div
        className="database-info-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        key={`db-info-${selectedConnectionString}`}
      >
        <h3>Información de la Base de Datos</h3>
        <p className="db-description">{dbData?.description}</p>

        <div className="db-modules">
          <h4>Módulos Disponibles:</h4>
          <div className="modules-grid">
            {(dbData?.modules || []).map((module, index) => (
              <motion.div
                key={`${selectedConnectionString}-module-${index}`}
                className="module-tag"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
              >
                {module}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Recent activities */}
      <motion.div
        className="activities-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        key={`activities-${selectedConnectionString}`}
      >
        <h3>Actividades Recientes</h3>
        <div className="activities-list">
          {(dbData?.recent_activities || []).map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className={`activity-indicator ${activity.status}`} />
              <div className="activity-content">
                <h4>{activity.title}</h4>
                <p>{activity.description}</p>
                <span className="activity-date">{activity.date}</span>
              </div>
              <div className={`activity-badge ${activity.type}`}>{activity.type}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default DashboardHome