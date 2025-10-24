"use client"

import { useState } from "react"
import LoadingScreen from "@/components/loading-screen"

export default function Home() {
  const [activeDemo, setActiveDemo] = useState(null)

  const demos = [
    { id: "loading", message: "Cargando", destination: "" },
    { id: "logout", message: "Cerrando sesión", destination: "Login" },
    { id: "login", message: "Iniciando sesión", destination: "Dashboard" },
    { id: "saving", message: "Guardando cambios", destination: "" },
    { id: "processing", message: "Procesando datos", destination: "" },
    { id: "uploading", message: "Subiendo archivos", destination: "" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">Demo de Loading Screen</h1>
        <p className="text-gray-300 text-center mb-8">
          Haz clic en cualquier botón para ver la pantalla de carga con diferentes mensajes
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {demos.map((demo) => (
            <button
              key={demo.id}
              onClick={() => {
                setActiveDemo(demo)
                setTimeout(() => setActiveDemo(null), 5000)
              }}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="text-lg mb-1">{demo.message}</div>
              {demo.destination && <div className="text-sm opacity-80">→ {demo.destination}</div>}
            </button>
          ))}
        </div>

        <div className="mt-12 bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">Cómo usar:</h2>
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-2">Uso básico:</h3>
              <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                <code>{`import LoadingScreen from '@/components/loading-screen'

// Solo con mensaje
<LoadingScreen message="Cargando" />

// Con mensaje y destino
<LoadingScreen 
  message="Cerrando sesión" 
  destination="Login" 
/>`}</code>
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-2">Props:</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <code className="bg-gray-900 px-2 py-1 rounded">message</code> - El mensaje a mostrar (por defecto:
                  "Cargando")
                </li>
                <li>
                  <code className="bg-gray-900 px-2 py-1 rounded">destination</code> - Destino opcional para mostrar
                  redirección
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {activeDemo && <LoadingScreen message={activeDemo.message} destination={activeDemo.destination} />}
    </main>
  )
}
