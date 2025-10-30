"use client"

import { useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import Sidebar from "../../dashboard/components/Sidebar"
import Header from "../../dashboard/components/Header"
import Footer from "../../dashboard/components/Footer"
import "./DashboardLayout.css"

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const location = useLocation()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      <motion.div
        className="dashboard-main"
        initial={false}
        animate={{
          x: isSidebarOpen ? 280 : 80,
        }}
        transition={{ 
          duration: 0.25,
          ease: [0.4, 0, 0.2, 1] // cubic-bezier más suave
        }}
      >
        <Header onToggleSidebar={toggleSidebar} />

        <main className="dashboard-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />
      </motion.div>
    </div>
  )
}

export default DashboardLayout