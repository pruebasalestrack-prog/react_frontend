"use client"
import { motion } from "framer-motion"
import { useAuth } from "../../../shared/context/AuthContext"
import { useSession } from "../../../shared/context/SessionContext"
import { useTheme } from "../../../shared/context/ThemeContext"
import { Users, FolderKanban, DollarSign, CheckCircle, TrendingUp, Activity } from "lucide-react"
import SalesChart from "../../dashboard/components/charts/SalesChart"
import "./DashboardHome.css"

const DashboardHome = () => {
  const { user } = useAuth()
  const { showSessionAlert } = useSession()
  const { theme } = useTheme()
  const dbData = user?.databaseData

  const stats = [
    {
      icon: Users,
      label: "Total Usuarios",
      value: dbData?.stats?.total_users || 150,
      change: "+12%",
      color: "users",
    },
    {
      icon: FolderKanban,
      label: "Proyectos Activos",
      value: dbData?.stats?.active_projects || 23,
      change: "+8%",
      color: "projects",
    },
    {
      icon: DollarSign,
      label: "Ingresos Totales",
      value: `$${(dbData?.stats?.total_revenue || 450000).toLocaleString()}`,
      change: "+15%",
      color: "revenue",
    },
    {
      icon: CheckCircle,
      label: "Tareas Pendientes",
      value: dbData?.stats?.pending_tasks || 12,
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
      >
        <div>
          <h2>Bienvenido, {user?.name}! 👋</h2>
          <p>
            Aquí está el resumen de tu base de datos: <strong>{dbData?.database_name || "db_ilca_principal"}</strong>
          </p>
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
              key={index}
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

      <SalesChart />

      {/* Database info */}
      <motion.div
        className="database-info-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h3>Información de la Base de Datos</h3>
        <p className="db-description">{dbData?.description || "Base de datos principal del sistema"}</p>

        <div className="db-modules">
          <h4>Módulos Disponibles:</h4>
          <div className="modules-grid">
            {(dbData?.modules || ["Usuarios", "Proyectos", "Reportes", "Configuración"]).map((module, index) => (
              <motion.div
                key={index}
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
      >
        <h3>Actividades Recientes</h3>
        <div className="activities-list">
          {(
            dbData?.recent_activities || [
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
                description: "Sistema de ventas finalizado",
                date: "Hace 5 horas",
                status: "completed",
                type: "project",
              },
            ]
          ).map((activity) => (
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