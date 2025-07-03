"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { X, Heart, Star, Sparkles } from "lucide-react"

interface Balloon {
  id: number
  text: string
  x: number
  y: number
  color: string
}

const balloonColors = ["#FF6B9D", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"]

const affirmations = [
  "You are stronger than your worries.",
  "This too shall pass.",
  "You have the power to choose peace over worry.",
  "Every ending is a new beginning.",
  "You are worthy of happiness and peace.",
  "Trust in your ability to handle whatever comes your way.",
  "Release what no longer serves you.",
  "You are capable of amazing things.",
]

interface LetItGoGameProps {
  onClose: () => void
}

export function LetItGoGame({ onClose }: LetItGoGameProps) {
  const [worry, setWorry] = useState("")
  const [balloons, setBalloons] = useState<Balloon[]>([])
  const [nextId, setNextId] = useState(1)
  const [releasedCount, setReleasedCount] = useState(0)
  const [currentAffirmation, setCurrentAffirmation] = useState("")
  const [showStats, setShowStats] = useState(false)

  useEffect(() => {
    // Load released count from localStorage
    const savedThoughts = JSON.parse(localStorage.getItem("releasedThoughts") || "[]")
    setReleasedCount(savedThoughts.length)

    // Set initial affirmation
    setCurrentAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)])
  }, [])

  const releaseWorry = () => {
    if (!worry.trim()) return

    const newBalloon: Balloon = {
      id: nextId,
      text: worry,
      x: Math.random() * 70 + 15, // Random horizontal position
      y: Math.random() * 20 + 80, // Random starting position from bottom
      color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
    }

    setBalloons((prev) => [...prev, newBalloon])
    setNextId((prev) => prev + 1)

    // Save to localStorage
    const savedThoughts = JSON.parse(localStorage.getItem("releasedThoughts") || "[]")
    savedThoughts.push({
      text: worry,
      timestamp: new Date().toISOString(),
    })
    localStorage.setItem("releasedThoughts", JSON.stringify(savedThoughts))
    setReleasedCount(savedThoughts.length)

    setWorry("")

    // Change affirmation
    const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)]
    setCurrentAffirmation(randomAffirmation)

    // Remove balloon after animation (increased duration)
    setTimeout(() => {
      setBalloons((prev) => prev.filter((b) => b.id !== newBalloon.id))
    }, 12000)
  }

  const clearHistory = () => {
    localStorage.removeItem("releasedThoughts")
    setReleasedCount(0)
    setShowStats(false)
  }

  const getMotivationalMessage = () => {
    if (releasedCount === 0) return "Ready to let go of your first worry?"
    if (releasedCount < 5) return `You've released ${releasedCount} worries. Keep going!`
    if (releasedCount < 10) return `${releasedCount} worries released! You're building great habits.`
    return `Amazing! You've released ${releasedCount} worries. You're a master of letting go!`
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
    >
      <div className="w-full max-w-8xl mx-4 h-[98vh] bg-gradient-to-br from-sky-300 via-blue-400 to-indigo-500 rounded-lg shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
          <div>
            <h2 className="text-2xl font-bold text-white">Let It Go</h2>
            <p className="text-gray-100">Release your worries and watch them float away</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowStats(!showStats)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Star className="w-4 h-4 mr-2" />
              Stats
            </Button>
            <Button onClick={onClose} variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Static Background Clouds */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <motion.div
            className="absolute text-white/15 text-8xl"
            style={{ left: "10%", top: "15%" }}
            animate={{
              x: [0, 20, 0],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 40,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            ☁️
          </motion.div>
          <motion.div
            className="absolute text-white/15 text-7xl"
            style={{ left: "70%", top: "25%" }}
            animate={{
              x: [0, -15, 0],
              y: [0, 8, 0],
            }}
            transition={{
              duration: 35,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            ☁️
          </motion.div>
          <motion.div
            className="absolute text-white/15 text-6xl"
            style={{ left: "40%", top: "10%" }}
            animate={{
              x: [0, 25, 0],
              y: [0, -12, 0],
            }}
            transition={{
              duration: 45,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            ☁️
          </motion.div>
          <motion.div
            className="absolute text-white/15 text-5xl"
            style={{ left: "85%", top: "45%" }}
            animate={{
              x: [0, -20, 0],
              y: [0, 15, 0],
            }}
            transition={{
              duration: 38,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            ☁️
          </motion.div>
          <motion.div
            className="absolute text-white/15 text-7xl"
            style={{ left: "20%", top: "50%" }}
            animate={{
              x: [0, 18, 0],
              y: [0, -8, 0],
            }}
            transition={{
              duration: 42,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            ☁️
          </motion.div>
        </div>

        {/* Floating Balloons */}
        <AnimatePresence>
          {balloons.map((balloon) => (
            <motion.div
              key={balloon.id}
              initial={{
                y: `${balloon.y}vh`,
                x: `${balloon.x}%`,
                opacity: 0,
                scale: 0.3,
              }}
              animate={{
                y: "-25vh",
                opacity: [0, 1, 1, 0.8, 0],
                scale: [0.3, 1, 1, 0.8, 0.5],
              }}
              exit={{ opacity: 0, scale: 0.3 }}
              transition={{ duration: 12, ease: "easeOut" }}
              className="absolute pointer-events-none z-10"
            >
              <div className="relative">
                {/* Larger Balloon SVG */}
                <motion.svg
                  width="96"
                  height="120"
                  viewBox="0 0 96 120"
                  className="drop-shadow-lg"
                  animate={{
                    x: [0, 15, -15, 0],
                    rotate: [0, 3, -3, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  {/* Balloon body */}
                  <ellipse cx="48" cy="45" rx="36" ry="45" fill={balloon.color} opacity="0.9" />
                  {/* Balloon highlight */}
                  <ellipse cx="39" cy="30" rx="9" ry="12" fill="white" opacity="0.4" />
                  {/* Balloon knot */}
                  <polygon points="48,90 42,97 54,97" fill={balloon.color} />
                  {/* String */}
                  <line x1="48" y1="97" x2="48" y2="115" stroke="#666" strokeWidth="2" />
                </motion.svg>

                {/* Larger Balloon text */}
                <div className="absolute top-4 left-3 right-3 text-center">
                  <p className="text-white text-sm font-medium px-1 leading-tight">
                    {balloon.text.length > 25 ? `${balloon.text.slice(0, 25)}...` : balloon.text}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Stats Panel */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="absolute top-20 right-4 z-30"
            >
              <Card className="bg-white/95 backdrop-blur-lg shadow-xl w-64">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <h3 className="font-bold text-gray-800">Your Progress</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">
                      Total worries released: <span className="font-bold text-purple-600">{releasedCount}</span>
                    </p>
                    <p className="text-gray-600">
                      Current session: <span className="font-bold text-blue-600">{balloons.length}</span>
                    </p>
                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-500 italic">{getMotivationalMessage()}</p>
                    </div>
                    {releasedCount > 0 && (
                      <Button
                        onClick={clearHistory}
                        variant="outline"
                        size="sm"
                        className="w-full mt-3 text-xs bg-transparent"
                      >
                        Clear History
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex items-center justify-center h-full p-4 pt-20">
          <div className="w-full max-w-md space-y-4">
            <Card className="bg-white/95 backdrop-blur-lg shadow-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <div className="text-5xl mb-4">🎈</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Release Your Worries</h3>
                  <p className="text-gray-600 text-lg">
                    Write down a worry or negative thought, then watch it float away.
                  </p>
                </div>

                <Textarea
                  value={worry}
                  onChange={(e) => setWorry(e.target.value)}
                  placeholder="What's weighing on your mind today?"
                  className="min-h-28 resize-none text-base"
                  maxLength={100}
                />

                <Button
                  onClick={releaseWorry}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium py-4 text-lg"
                  disabled={!worry.trim()}
                >
                  Release It 🎈
                </Button>

                {balloons.length > 0 && (
                  <div className="text-center text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                    <p className="font-medium text-base">Watch your worries float away... 🎈</p>
                    <p className="mt-1 italic">
                      You've released {balloons.length} worry{balloons.length !== 1 ? "ies" : "y"} this session
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Affirmation Card */}
            <Card className="bg-gradient-to-r from-purple-500/90 to-pink-500/90 backdrop-blur-lg text-white">
              <CardContent className="p-5 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Heart className="w-5 h-5" />
                  <span className="text-base font-medium">Daily Affirmation</span>
                  <Heart className="w-5 h-5" />
                </div>
                <p className="text-base italic">"{currentAffirmation}"</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
