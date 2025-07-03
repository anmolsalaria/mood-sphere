"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Play, Pause } from "lucide-react"

interface BreathingGameProps {
  onClose: () => void
}

export function BreathingGame({ onClose }: BreathingGameProps) {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<"inhale" | "hold1" | "exhale" | "hold2">("inhale")
  const [count, setCount] = useState(0)
  const [cycles, setCycles] = useState(0)

  const phases = [
    { name: "inhale" as const, duration: 4, label: "Breathe In" },
    { name: "hold1" as const, duration: 4, label: "Hold" },
    { name: "exhale" as const, duration: 4, label: "Breathe Out" },
    { name: "hold2" as const, duration: 4, label: "Hold" },
  ]

  useEffect(() => {
    if (!isActive) return

    const timer = setInterval(() => {
      setCount((prev) => {
        const currentPhase = phases.find((p) => p.name === phase)
        if (!currentPhase) return prev

        if (prev >= currentPhase.duration) {
          const currentIndex = phases.findIndex((p) => p.name === phase)
          const nextIndex = (currentIndex + 1) % phases.length
          setPhase(phases[nextIndex].name)

          if (nextIndex === 0) {
            setCycles((prev) => prev + 1)
          }

          return 1
        }
        return prev + 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, phase])

  const getCircleScale = () => {
    const currentPhase = phases.find((p) => p.name === phase)
    if (!currentPhase) return 0.5

    const progress = count / currentPhase.duration

    switch (phase) {
      case "inhale":
        return 0.5 + progress * 0.5
      case "hold1":
        return 1
      case "exhale":
        return 1 - progress * 0.5
      case "hold2":
        return 0.5
      default:
        return 0.5
    }
  }

  const getCurrentLabel = () => {
    return phases.find((p) => p.name === phase)?.label || "Breathe"
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
    >
      <div className="w-full max-w-6xl mx-4 h-[90vh] bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 rounded-lg shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">Breathe With Me</h2>
            <p className="text-gray-300">Find your calm through guided breathing</p>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center h-full p-4 pt-20">
          {/* Breathing Circle */}
          <div className="mb-8 flex justify-center">
            <motion.div
              className="w-48 h-48 sm:w-64 sm:h-64 rounded-full flex items-center justify-center shadow-2xl bg-gradient-to-r from-cyan-400 to-blue-500"
              animate={{
                scale: getCircleScale(),
              }}
              transition={{
                duration: 1,
                ease: "easeInOut",
              }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold mb-2 text-white">{getCurrentLabel()}</div>
                <div className="text-6xl font-light text-white">{count}</div>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-2 gap-8 max-w-sm mx-auto">
            <Card className="bg-white/10 text-white backdrop-blur-lg border-white/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{cycles}</div>
                <div className="text-sm opacity-75">Cycles</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 text-white backdrop-blur-lg border-white/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{Math.floor((cycles * 16) / 60)}</div>
                <div className="text-sm opacity-75">Minutes</div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <Button
            onClick={() => setIsActive(!isActive)}
            className="px-8 py-4 text-lg bg-white text-black hover:bg-gray-200"
          >
            {isActive ? <Pause className="w-6 h-6 mr-2" /> : <Play className="w-6 h-6 mr-2" />}
            {isActive ? "Pause" : "Start"}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
