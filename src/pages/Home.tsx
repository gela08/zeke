import { motion } from "framer-motion"
import "../styles/pages/Home.css"

export default function Home() {
  return (
    <section className="home">
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Happy Birthday, My Love 🎂
      </motion.h1>
      <p>This website is for you.</p>
    </section>
  )
}
