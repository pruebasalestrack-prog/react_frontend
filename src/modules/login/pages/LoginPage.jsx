"use client"
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLoginController } from '../controllers/useLoginController'
import LoginForm from "../components/LoginForm"
import LoginIllustration from "../components/LoginIllustration"
import ResetPasswordModal from "../components/ResetPasswordModal"
import SessionAlerts from "../../../shared/components/SessionAlerts"
import "./LoginPage.css"

const LoginPage = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [showResetModal, setShowResetModal] = useState(false)
  
  const { 
    formData, 
    errors, 
    loading, 
    showPassword, 
    handleChange, 
    handleSubmit, 
    togglePasswordVisibility 
  } = useLoginController()

  // Si hay token en la URL, mostrar modal de reset
  useEffect(() => {
    if (token) {
      setShowResetModal(true)
    }
  }, [token])

  const handleCloseResetModal = () => {
    setShowResetModal(false)
    navigate('/login', { replace: true })
  }

  const handleResetSuccess = () => {
    setTimeout(() => {
      setShowResetModal(false)
      navigate('/login', { replace: true })
    }, 2000)
  }

  return (
    <>
      <SessionAlerts />
      <div className="login-page">
        <div className="login-container">
          <LoginIllustration />
          <LoginForm
            formData={formData}
            errors={errors}
            loading={loading}
            showPassword={showPassword}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onTogglePassword={togglePasswordVisibility}
          />
        </div>
      </div>

      {/* Modal de Reset Password */}
      <ResetPasswordModal
        isOpen={showResetModal}
        onClose={handleCloseResetModal}
        token={token}
        onSuccess={handleResetSuccess}
      />
    </>
  )
}

export default LoginPage