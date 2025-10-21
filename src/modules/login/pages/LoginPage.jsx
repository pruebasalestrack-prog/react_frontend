"use client"
import { useLoginController } from "../controllers/useLoginController"
import LoginForm from "../components/LoginForm"
import LoginIllustration from "../components/LoginIllustration"
import "./LoginPage.css"

const LoginPage = () => {
  const { formData, errors, loading, showPassword, handleChange, handleSubmit, togglePasswordVisibility } =
    useLoginController()

  return (
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
  )
}

export default LoginPage
