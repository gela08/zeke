import { useEffect, useState } from "react"
import "../styles/components/Nav.css"

const sections = ["home", "letter", "memories", "gallery", "final"]

export default function Nav() {
  const [active, setActive] = useState("home")

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth"
    })
  }

  // 🔹 Handle deep-link scroll (/gallery, /final, etc)
  useEffect(() => {
    const path = window.location.pathname.replace("/", "")
    if (!path) return

    const timeout = setTimeout(() => {
      document.getElementById(path)?.scrollIntoView({
        behavior: "smooth"
      })
    }, 100)

    return () => clearTimeout(timeout)
  }, [])

  // 🔹 Track active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        })
      },
      { threshold: 0.6 }
    )

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <nav className="nav">
      {sections.map((id) => (
        <button
          key={id}
          className={active === id ? "active" : ""}
          onClick={() => scrollTo(id)}
        >
          {id.charAt(0).toUpperCase() + id.slice(1)}
        </button>
      ))}
    </nav>
  )
}
