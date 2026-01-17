import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import "../styles/components/BlowCandlesModal.css"

interface Props {
    open: boolean
    onClose: () => void
}

export default function BlowCandlesModal({ open, onClose }: Props) {
    /* -------------------- CANDLES -------------------- */

    const MAX_CANDLES = 22
    // Defaulting to 22 candles to ensure the "22" shape is always complete
    const [litCandles, setLitCandles] = useState<boolean[]>(
        () => Array(MAX_CANDLES).fill(true)
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

        try {
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
        } catch (err) {
            console.error("Microphone access denied", err)
        }
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

                if (!next.includes(true)) {
                    clearInterval(interval)
                    setCelebrate(true)
                }

                return next
            })
        }, 100)
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

    /* -------------------- NUMBER 2 LOGIC -------------------- */

    // Hand-mapped coordinates for 11 candles to form a "2"
    // Grid: 3 columns (0,1,2) and 5 rows (0,1,2,3,4)
    const pointsForTwo = [
        { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, // Top bar
        { x: 2, y: 1 },                                 // Upper right side
        { x: 2, y: 2 }, { x: 1, y: 2 }, { x: 0, y: 2 }, // Middle cross bar
        { x: 0, y: 3 },                                 // Lower left side
        { x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 4 }, // Bottom bar
    ];

    const candleSpacingX = 28; // Horizontal distance between candles
    const candleSpacingY = 32; // Vertical distance between candles

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

                            {/* First '2' */}
                            <div className="candles one" style={{ position: 'absolute', left: '20%', top: '25%' }}>
                                {litCandles.slice(0, 11).map((isLit, i) => {
                                    const point = pointsForTwo[i];
                                    return (
                                        <div
                                            key={`one-${i}`}
                                            className="candle"
                                            style={{
                                                position: "absolute",
                                                left: `${point.x * candleSpacingX}px`,
                                                top: `${point.y * candleSpacingY}px`,
                                            }}
                                        >
                                            {isLit ? <span className="flame" /> : <span className="smoke" />}
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Second '2' */}
                            <div className="candles two" style={{ position: 'absolute', left: '56%', top: '25%' }}>
                                {litCandles.slice(11, 22).map((isLit, i) => {
                                    const point = pointsForTwo[i];
                                    return (
                                        <div
                                            key={`two-${i}`}
                                            className="candle"
                                            style={{
                                                position: "absolute",
                                                left: `${point.x * candleSpacingX}px`,
                                                top: `${point.y * candleSpacingY}px`,
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
                                {listening ? "Blow into your mic…" : "Ready to Blow?"}
                            </button>
                        ) : (
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="success"
                            >
                                🎉 Happy Birthday! 🎉
                            </motion.p>
                        )}

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}