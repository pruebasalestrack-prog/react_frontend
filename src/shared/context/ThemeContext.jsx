import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme debe ser usado dentro de ThemeProvider")
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Obtener tema guardado del localStorage, por defecto "green"
    return localStorage.getItem("app-theme") || "green"
  })

  const [secondaryTheme, setSecondaryTheme] = useState(() => {
    // Obtener tema secundario guardado del localStorage, por defecto "blue"
    return localStorage.getItem("app-secondary-theme") || "blue"
  })

  useEffect(() => {
    // Aplicar tema primario al body usando data-theme
    document.body.setAttribute("data-theme", theme)
    // Aplicar tema secundario al body usando data-secondary-theme
    document.body.setAttribute("data-secondary-theme", secondaryTheme)
    // Guardar en localStorage
    localStorage.setItem("app-theme", theme)
    localStorage.setItem("app-secondary-theme", secondaryTheme)
  }, [theme, secondaryTheme])

  const toggleTheme = () => {
    // Alterna solo entre green y dark
    setTheme((prevTheme) => (prevTheme === "green" ? "dark" : "green"))
  }

  const changeSecondaryTheme = (newSecondaryTheme) => {
    setSecondaryTheme(newSecondaryTheme)
  }

  const isGreenTheme = theme === "green"
  const isDarkTheme = theme === "dark"
  const isLightTheme = theme === "light"
  const isBlueSecondary = secondaryTheme === "blue"

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        secondaryTheme,
        toggleTheme, 
        changeSecondaryTheme,
        isGreenTheme, 
        isDarkTheme, 
        isLightTheme,
        isBlueSecondary
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}