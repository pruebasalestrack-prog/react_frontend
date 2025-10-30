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
  const [isHovering, setIsHovering] = useState(false)
  const location = useLocation()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleMouseEnter = () => {
    if (!isSidebarOpen) {
      setIsHovering(true)
    }
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  const shouldShowExpanded = isSidebarOpen || isHovering

  return (
    <div className="dashboard-layout">
      <div 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Sidebar 
          isOpen={shouldShowExpanded} 
          onToggle={toggleSidebar}
          isHoverMode={isHovering}
        />
      </div>

      <div className="dashboard-main">
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
      </div>
    </div>
  )
}

export default DashboardLayout