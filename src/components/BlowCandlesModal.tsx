import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import "../styles/components/BlowCandlesModal.css"

interface Props {
    open: boolean
    onClose: () => void
    age: number
}

export default function BlowCandlesModal({ open, onClose, age }: Props) {
    /* -------------------- CANDLES -------------------- */

    const MAX_CANDLES = 22
    const candleCount = Math.min(age, MAX_CANDLES)

    const [litCandles, setLitCandles] = useState<boolean[]>(
        () => Array(candleCount).fill(true)
    )

    const [listening, setListening] = useState(false)
    const [celebrate, setCelebrate] = useState(false)

    /* -------------------- AUDIO -------------------- */

    const analyserRef = useRef<AnalyserNode | null>(null)
    const rafRef = useRef<number | null>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const audioCtxRef = useRef<AudioContext | null>(null)

    /* -------------------- 3D TILT -------------------- */

    const tiltX = useMotionValue(0)
    const tiltY = useMotionValue(0)

    const rotateX = useTransform(tiltY, [-50, 50], [12, -12])
    const rotateY = useTransform(tiltX, [-50, 50], [-12, 12])

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()

        const x =
            "touches" in e
                ? e.touches[0].clientX - rect.left
                : e.clientX - rect.left

        const y =
            "touches" in e
                ? e.touches[0].clientY - rect.top
                : e.clientY - rect.top

        tiltX.set(x - rect.width / 2)
        tiltY.set(y - rect.height / 2)
    }

    const resetTilt = () => {
        tiltX.set(0)
        tiltY.set(0)
    }

    /* -------------------- MIC -------------------- */

    const startMic = async () => {
        if (listening || celebrate) return

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        streamRef.current = stream

        const audioCtx = new AudioContext()
        audioCtxRef.current = audioCtx

        const source = audioCtx.createMediaStreamSource(stream)
        const analyser = audioCtx.createAnalyser()

        analyser.fftSize = 256
        source.connect(analyser)
        analyserRef.current = analyser

        setListening(true)
        detectBlow()
    }

    const stopMic = () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current)

        streamRef.current?.getTracks().forEach(t => t.stop())
        audioCtxRef.current?.close()

        rafRef.current = null
        streamRef.current = null
        audioCtxRef.current = null

        setListening(false)
    }

    /* -------------------- EXTINGUISH -------------------- */

    const extinguishCandlesSequentially = () => {
  const interval = setInterval(() => {
    setLitCandles(prev => {
      const next = [...prev]
      const index = next.findIndex(c => c)

      if (index === -1) {
        clearInterval(interval)
        return prev
      }

      next[index] = false

      // 🎉 LAST CANDLE JUST WENT OUT
      if (!next.includes(true)) {
        clearInterval(interval)
        setCelebrate(true)
      }

      return next
    })
  }, 100) // ⬅️ reduce from 300
}

    /* -------------------- BLOW DETECT -------------------- */

    const detectBlow = () => {
        if (!analyserRef.current) return

        const data = new Uint8Array(analyserRef.current.frequencyBinCount)
        analyserRef.current.getByteFrequencyData(data)

        const volume = data.reduce((s, v) => s + v, 0) / data.length

        if (volume > 65) {
            stopMic()
            extinguishCandlesSequentially()
            return
        }

        rafRef.current = requestAnimationFrame(detectBlow)
    }

    /* -------------------- CLEANUP -------------------- */

    useEffect(() => {
        return () => stopMic()
    }, [])

    const allOut = litCandles.every(c => !c)


    /* -------------------- RENDER -------------------- */

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="candle-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="candle-modal"
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.85, opacity: 0 }}
                    >
                        <button className="close-btn" onClick={onClose}>✕</button>

                        <h2 className="candle-title">Blow Out The Candles</h2>

                        <motion.div
                            className="cake"
                            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                            onMouseMove={handleMove}
                            onMouseLeave={resetTilt}
                            onTouchMove={handleMove}
                            onTouchEnd={resetTilt}
                        >
                            <div className="plate" />

                            <div className="layer layer-bottom" />
                            <div className="layer layer-middle" />
                            <div className="layer layer-top" />

                            <div className="icing" />
                            <div className="drip drip1" />
                            <div className="drip drip4" />
                            <div className="drip drip2" />
                            <div className="drip drip3" />

                            {/* <div className="candles upper">
                                {litCandles.slice(0, 11).map((isLit, i) => {
                                    const total = 22
                                    const arc = 200 // degrees
                                    const start = -100 // center the arc

                                    const angle = start + (arc / (total - 1)) * i
                                    const radius = i < 11 ? 230 : 170 // outer + inner row

                                    const rad = (angle * Math.PI) / 180

                                    const x = Math.cos(rad) * radius
                                    const y = Math.sin(rad) * radius * 0.55 // FLATTEN arc

                                    return (
                                        <div
                                            key={`upper-${i}`}
                                            className="candle"
                                            style={{
                                                left: "50%",
                                                top: "90%",
                                                transform: `
                                                    translate(${x}px, ${y}px)
                                                `,
                                            }}
                                        >
                                            {isLit ? <span className="flame" /> : <span className="smoke" />}
                                        </div>
                                    )
                                })}
                            </div> */}

                            <div className="candles four">
                                {litCandles.slice(0, 4).map((isLit, i) => {
                                    const total = 4
                                    const arc = 80       // half-circle arc
                                    const start = 230       // center the arc
                                    const radius = 80

                                    const angle = start + (arc / (total - 1)) * i
                                    const rad = (angle * Math.PI) / 180

                                    const x = Math.cos(rad) * radius
                                    const y = Math.sin(rad) * radius * 0.55

                                    return (
                                        <div
                                            key={i}
                                            className="candle"
                                            style={{
                                                position: "absolute",
                                                left: "10%",
                                                top: "20%",
                                                transform: `
                                                    translate(${x}px, ${y}px)
                                                `,
                                            }}
                                        >
                                            {isLit ? <span className="flame" /> : <span className="smoke" />}
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="candles three">
                                {litCandles.slice(0, 3).map((isLit, i) => {
                                    const total = 3
                                    const arc = 80          // SMALL arc
                                    const start = 220
                                    const radius = 50

                                    const angle = start + (arc / (total - 1)) * i
                                    const rad = (angle * Math.PI) / 180

                                    const x = Math.cos(rad) * radius
                                    const y = Math.sin(rad) * radius * 0.55

                                    return (
                                        <div
                                            key={i}
                                            className="candle"
                                            style={{
                                                left: "50%",
                                                top: "90%",
                                                transform: `translate(${x}px, ${y}px)`,
                                            }}
                                        >
                                            {isLit ? <span className="flame" /> : <span className="smoke" />}
                                        </div>
                                    )
                                })}
                            </div>



                        </motion.div>

                        {celebrate && (
                            <div className="confetti">
                                {Array.from({ length: 30 }).map((_, i) => (
                                    <span key={i} />
                                ))}
                            </div>
                        )}

                        {!allOut ? (
                            <button className="mic-btn" onClick={startMic}>
                                {listening ? "Blow into your mic…" : "Allow Access to Mic"}
                            </button>
                        ) : (
                            <p className="success">🎉 Happy Birthday! 🎉</p>
                        )}
                        
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
