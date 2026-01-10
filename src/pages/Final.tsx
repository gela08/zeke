import { motion } from "framer-motion"
import "../styles/pages/Final.css"

export default function Final() {
  return (
    <section className="final">
      <motion.h1
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        I Love You ❤️
      </motion.h1>
    </section>
  )
}
