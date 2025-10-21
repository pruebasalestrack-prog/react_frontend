"use client"
import { motion } from "framer-motion"
import { useAuth } from "../../../shared/context/AuthContext"
import { Users, FolderKanban, DollarSign, CheckCircle, TrendingUp, Activity } from "lucide-react"
import "./DashboardHome.css"

const DashboardHome = () => {
  const { user } = useAuth()
  const dbData = user?.databaseData

  // Datos de estadísticas
  const stats = [
    {
      icon: Users,
      label: "Total Usuarios",
      value: dbData?.stats?.total_users || 0,
      change: "+12%",
      color: "#8bc34a",
    },
    {
      icon: FolderKanban,
      label: "Proyectos Activos",
      value: dbData?.stats?.active_projects || 0,
      change: "+8%",
      color: "#00bcd4",
    },
    {
      icon: DollarSign,
      label: "Ingresos Totales",
      value: `$${(dbData?.stats?.total_revenue || 0).toLocaleString()}`,
      change: "+15%",
      color: "#ffc107",
    },
    {
      icon: CheckCircle,
      label: "Tareas Pendientes",
      value: dbData?.stats?.pending_tasks || 0,
      change: "-5%",
      color: "#ff5252",
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
            Aquí está el resumen de tu base de datos: <strong>{dbData?.database_name}</strong>
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
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
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

      {/* Database info */}
      <motion.div
        className="database-info-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3>Información de la Base de Datos</h3>
        <p className="db-description">{dbData?.description}</p>

        <div className="db-modules">
          <h4>Módulos Disponibles:</h4>
          <div className="modules-grid">
            {dbData?.modules?.map((module, index) => (
              <motion.div
                key={index}
                className="module-tag"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
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
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h3>Actividades Recientes</h3>
        <div className="activities-list">
          {dbData?.recent_activities?.map((activity) => (
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
