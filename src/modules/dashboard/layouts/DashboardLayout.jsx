"use client"

import { useState } from "react"
import { Outlet } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import Sidebar from "../../dashboard/components/Sidebar"
import Header from "../../dashboard/components/Header"
import Footer from "../../dashboard/components/Footer"
import "./DashboardLayout.css"

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      <motion.div
        className="dashboard-main"
        animate={{
          marginLeft: isSidebarOpen ? 280 : 80,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Header onToggleSidebar={toggleSidebar} />

        <main className="dashboard-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
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
