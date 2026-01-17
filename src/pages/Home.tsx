import { motion } from "framer-motion"
import { useState } from "react"
import BlowCandlesModal from "../components/BlowCandlesModal"
import "../styles/pages/Home.css"

export default function Home() {
  const [open, setOpen] = useState(true)

  return (
    <section className="home">
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        whileHover={{ rotateX: -4, rotateZ: 2 }}
      >
        Happy Birthday!🎂
      </motion.h1>

      <p>This website is for you.</p>

      <BlowCandlesModal open={open} onClose={() => setOpen(false)}/>
    </section>
  )
}
