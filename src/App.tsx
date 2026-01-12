import "./index.css"
import Nav from "./components/Nav"
import Footer from "./components/Footer"
import AnimatedBackground from "./components/AnimatedBackground"

import Home from "./pages/Home"
import Letter from "./pages/Letter"
import Memories from "./pages/Memories"
import Gallery from "./pages/Gallery"
import Final from "./pages/Final"

export default function App() {
  return (
    <>
      <AnimatedBackground />
      <Nav />

      <main>
        <section id="home">
          <Home />
        </section>

        {/* <section id="letter">
          <Letter />
        </section>

        <section id="memories">
          <Memories />
        </section>

        <section id="gallery">
          <Gallery />
        </section> */}

        {/* <section id="final">
          <Final />
        </section> */}

      </main>

      <Footer />
    </>
  )
}
