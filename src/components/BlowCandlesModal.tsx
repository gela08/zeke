import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import "../styles/components/BlowCandlesModal.css"

interface Props {
    open: boolean
    onClose: () => void
}

// Define available flavors
type Flavor = "chocolate" | "strawberry" | "matcha" | "cookies"

export default function BlowCandlesModal({ open, onClose }: Props) {
    /* -------------------- STATE & CONFIG -------------------- */
    
    // We use exactly 22 candles: 11 for the first '2', 11 for the second '2'
    const MAX_CANDLES = 22
    const [litCandles, setLitCandles] = useState<boolean[]>(() => Array(MAX_CANDLES).fill(true))
    const [listening, setListening] = useState(false)
    const [celebrate, setCelebrate] = useState(false)
    const [flavor, setFlavor] = useState<Flavor>("chocolate")

    /* -------------------- AUDIO MICROPHONE LOGIC -------------------- */
    
    const analyserRef = useRef<AnalyserNode | null>(null)
    const rafRef = useRef<number | null>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const audioCtxRef = useRef<AudioContext | null>(null)

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
            // Fallback: If mic fails, auto-blow after 3 seconds so user isn't stuck
            setTimeout(() => extinguishCandlesSequentially(), 3000)
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

    const detectBlow = () => {
        if (!analyserRef.current) return
        const data = new Uint8Array(analyserRef.current.frequencyBinCount)
        analyserRef.current.getByteFrequencyData(data)
        
        // Calculate average volume
        const volume = data.reduce((s, v) => s + v, 0) / data.length

        // Threshold for "blowing" sound
        if (volume > 50) { 
            stopMic()
            extinguishCandlesSequentially()
            return
        }
        rafRef.current = requestAnimationFrame(detectBlow)
    }

    const extinguishCandlesSequentially = () => {
        const interval = setInterval(() => {
            setLitCandles(prev => {
                const next = [...prev]
                const index = next.findIndex(c => c) // Find first lit candle

                if (index === -1) {
                    clearInterval(interval)
                    return prev
                }

                next[index] = false // Blow it out

                if (!next.includes(true)) {
                    clearInterval(interval)
                    setCelebrate(true)
                }
                return next
            })
        }, 80) // Speed of extinguishing
    }

    useEffect(() => {
        return () => stopMic()
    }, [])

    /* -------------------- 3D INTERACTIVITY -------------------- */

    const tiltX = useMotionValue(0)
    const tiltY = useMotionValue(0)
    const rotateX = useTransform(tiltY, [-50, 50], [15, -15]) // Restricted tilt for better mobile view
    const rotateY = useTransform(tiltX, [-50, 50], [-15, 15])

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
        const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top
        tiltX.set(x - rect.width / 2)
        tiltY.set(y - rect.height / 2)
    }

    const resetTilt = () => {
        tiltX.set(0)
        tiltY.set(0)
    }

    /* -------------------- GRID LOGIC FOR "22" -------------------- */
    
    // Coordinates (x,y) to draw the number "2" on a grid
    const pointsForTwo = [
        { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, // Top Bar
        { x: 2, y: 1 },                                 // Right Down
        { x: 2, y: 2 }, { x: 1, y: 2 }, { x: 0, y: 2 }, // Middle Bar
        { x: 0, y: 3 },                                 // Left Down
        { x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 4 }, // Bottom Bar
    ];

    // Multipliers to spacing the candles out (in pixels)
    const spacingX = 22; 
    const spacingY = 28;

    const allOut = litCandles.every(c => !c)

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
                        initial={{ scale: 0.9, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 50 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                        {/* Header & Close */}
                        <div className="modal-header">
                            <h2 className="candle-title">Make a Wish!</h2>
                            <button className="close-btn" onClick={onClose} aria-label="Close">✕</button>
                        </div>

                        {/* Flavor Selector */}
                        <div className="flavor-selector">
                            {(["chocolate", "strawberry", "matcha", "cookies"] as Flavor[]).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFlavor(f)}
                                    className={`flavor-btn ${f} ${flavor === f ? 'active' : ''}`}
                                    aria-label={`Select ${f} flavor`}
                                />
                            ))}
                        </div>

                        {/* 3D Cake Container - Responsive Wrapper */}
                        <div className={`cake-container ${flavor}`}>
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
                                <div className="drip drip2" />
                                <div className="drip drip3" />

                                {/* Candle Group 1: First "2" */}
                                <div className="candles-group" style={{ left: '20%' }}>
                                    {litCandles.slice(0, 11).map((isLit, i) => {
                                        const p = pointsForTwo[i];
                                        return (
                                            <div 
                                                key={`c1-${i}`} 
                                                className="candle"
                                                style={{ 
                                                    left: p.x * spacingX, 
                                                    top: p.y * spacingY 
                                                }}
                                            >
                                                {isLit ? <span className="flame" /> : <span className="smoke" />}
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Candle Group 2: Second "2" */}
                                <div className="candles-group" style={{ left: '55%' }}>
                                    {litCandles.slice(11, 22).map((isLit, i) => {
                                        const p = pointsForTwo[i];
                                        return (
                                            <div 
                                                key={`c2-${i}`} 
                                                className="candle"
                                                style={{ 
                                                    left: p.x * spacingX, 
                                                    top: p.y * spacingY 
                                                }}
                                            >
                                                {isLit ? <span className="flame" /> : <span className="smoke" />}
                                            </div>
                                        )
                                    })}
                                </div>
                            </motion.div>
                        </div>

                        {/* Footer Controls */}
                        <div className="modal-footer">
                             {celebrate && (
                                <div className="confetti-container">
                                    {Array.from({ length: 50 }).map((_, i) => <span key={i} className="confetti-piece" />)}
                                </div>
                            )}

                            {!allOut ? (
                                <button 
                                    className={`action-btn ${listening ? 'listening' : ''}`} 
                                    onClick={startMic}
                                >
                                    {listening ? "🎤 Blow now..." : "🎤 Tap to Blow"}
                                </button>
                            ) : (
                                <motion.div 
                                    className="success-msg"
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                >
                                    🎉 Happy 22nd Birthday! 🎉
                                </motion.div>
                            )}
                        </div>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}