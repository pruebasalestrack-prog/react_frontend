"use client"

import { useEffect, useRef } from "react"
import { createRoot } from "react-dom/client"
import App from "../src/App"
import "../src/index.css"

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<any>(null)

  useEffect(() => {
    if (containerRef.current && !rootRef.current) {
      rootRef.current = createRoot(containerRef.current)
      rootRef.current.render(<App />)
    }

    return () => {
      if (rootRef.current) {
        rootRef.current.unmount()
        rootRef.current = null
      }
    }
  }, [])

  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />
}
