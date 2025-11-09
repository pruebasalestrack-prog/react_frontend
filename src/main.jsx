import React from "react"
import ReactDOM from "react-dom/client"

// ✅ Importar i18n ANTES de App
import "./i18n/config.js"

import App from "./App"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)