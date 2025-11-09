"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { BarChart3, LineChartIcon } from "lucide-react"
import "./SalesChart.css"

const salesData = [
  { month: "Ene", v1: 4000, v2: 2400, v3: 2400, v4: 1800, v5: 3200 },
  { month: "Feb", v1: 3000, v2: 1398, v3: 2210, v4: 2200, v5: 2800 },
  { month: "Mar", v1: 2000, v2: 9800, v3: 2290, v4: 2500, v5: 3500 },
  { month: "Abr", v1: 2780, v2: 3908, v3: 2000, v4: 2100, v5: 2900 },
  { month: "May", v1: 1890, v2: 4800, v3: 2181, v4: 2800, v5: 3100 },
  { month: "Jun", v1: 2390, v2: 3800, v3: 2500, v4: 2300, v5: 3400 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="tooltip-item" style={{ color: entry.color }}>
            {entry.name}: ${entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const SalesChart = () => {
  const [chartType, setChartType] = useState("bar")

  return (
    <div className="sales-charts-container">
      <motion.div
        className="chart-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="chart-header">
          <div>
            <h3>Ventas por Vendedor</h3>
            <p>Comparación mensual de rendimiento</p>
          </div>
          <div className="chart-controls">
            <motion.button
              className={`chart-toggle ${chartType === "bar" ? "active" : ""}`}
              onClick={() => setChartType("bar")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BarChart3 size={20} />
              <span>Barras</span>
            </motion.button>
            <motion.button
              className={`chart-toggle ${chartType === "line" ? "active" : ""}`}
              onClick={() => setChartType("line")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LineChartIcon size={20} />
              <span>Líneas</span>
            </motion.button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          {chartType === "bar" ? (
            <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorV1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8bc34a" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8bc34a" stopOpacity={0.4} />
                </linearGradient>
                <linearGradient id="colorV2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00bcd4" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#00bcd4" stopOpacity={0.4} />
                </linearGradient>
                <linearGradient id="colorV3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffc107" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ffc107" stopOpacity={0.4} />
                </linearGradient>
                <linearGradient id="colorV4" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff5252" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ff5252" stopOpacity={0.4} />
                </linearGradient>
                <linearGradient id="colorV5" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9c27b0" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#9c27b0" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="v1" fill="url(#colorV1)" name="Vendedor 1" radius={[8, 8, 0, 0]} />
              <Bar dataKey="v2" fill="url(#colorV2)" name="Vendedor 2" radius={[8, 8, 0, 0]} />
              <Bar dataKey="v3" fill="url(#colorV3)" name="Vendedor 3" radius={[8, 8, 0, 0]} />
              <Bar dataKey="v4" fill="url(#colorV4)" name="Vendedor 4" radius={[8, 8, 0, 0]} />
              <Bar dataKey="v5" fill="url(#colorV5)" name="Vendedor 5" radius={[8, 8, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="v1"
                stroke="#8bc34a"
                strokeWidth={3}
                name="Vendedor 1"
                dot={{ fill: "#8bc34a", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="v2"
                stroke="#00bcd4"
                strokeWidth={3}
                name="Vendedor 2"
                dot={{ fill: "#00bcd4", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="v3"
                stroke="#ffc107"
                strokeWidth={3}
                name="Vendedor 3"
                dot={{ fill: "#ffc107", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="v4"
                stroke="#ff5252"
                strokeWidth={3}
                name="Vendedor 4"
                dot={{ fill: "#ff5252", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="v5"
                stroke="#9c27b0"
                strokeWidth={3}
                name="Vendedor 5"
                dot={{ fill: "#9c27b0", r: 4 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}

export default SalesChart
