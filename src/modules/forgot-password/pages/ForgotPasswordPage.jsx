"use client"
import { motion } from "framer-motion"
import { useForgotPasswordController } from "../controllers/useForgotPasswordController"
import ForgotPasswordForm from "../components/ForgotPasswordForm"
import "./ForgotPasswordPage.css"

const ForgotPasswordPage = () => {
  const { email, error, loading, success, handleChange, handleSubmit, resetForm } = useForgotPasswordController()

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <motion.div
          className="page-logo"
          initial={{ opacity: 0, y: -30 }}
          animate={{
            opacity: 1,
            y: [0, -12, 0],
          }}
          transition={{
            opacity: { duration: 0.6 },
            y: {
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.3,
            },
          }}
        >
          <img src="/public/logo.png" alt="Pure Innovación Móvil" />
        </motion.div>

        <ForgotPasswordForm
          email={email}
          error={error}
          loading={loading}
          success={success}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onReset={resetForm}
        />
      </div>
    </div>
  )
}

export default ForgotPasswordPage
