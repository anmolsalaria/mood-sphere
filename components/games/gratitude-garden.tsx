"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface Flower {
  id: string
  text: string
  type: number
  position: { x: number; y: number }
  timestamp: number
}

const flowerTypes = [
  { color: "#FF6B9D", petals: 5 }, // Pink
  { color: "#4ECDC4", petals: 6 }, // Teal
  { color: "#45B7D1", petals: 8 }, // Blue
  { color: "#96CEB4", petals: 5 }, // Green
  { color: "#FFEAA7", petals: 6 }, // Yellow
  { color: "#DDA0DD", petals: 7 }, // Plum
]

interface GratitudeGardenProps {
  onClose: () => void
}

export function GratitudeGarden({ onClose }: GratitudeGardenProps) {
  const [flowers, setFlowers] = useState<Flower[]>([])
  const [gratitudeText, setGratitudeText] = useState("")

  useEffect(() => {
    const savedFlowers = localStorage.getItem("gratitudeFlowers")
    if (savedFlowers) {
      setFlowers(JSON.parse(savedFlowers))
    }
  }, [])

  const saveFlowers = (newFlowers: Flower[]) => {
    localStorage.setItem("gratitudeFlowers", JSON.stringify(newFlowers))
  }

  const addFlower = () => {
    if (!gratitudeText.trim()) return

    const newFlower: Flower = {
      id: Date.now().toString(),
      text: gratitudeText,
      type: Math.floor(Math.random() * flowerTypes.length),
      position: {
        x: Math.random() * 80 + 10, // 10% to 90% of container width
        y: Math.random() * 50 + 20, // 20% to 70% of container height
      },
      timestamp: Date.now(),
    }

    const updatedFlowers = [...flowers, newFlower]
    setFlowers(updatedFlowers)
    saveFlowers(updatedFlowers)
    setGratitudeText("")
  }

  const FlowerSVG = ({ flower }: { flower: Flower }) => {
    const flowerType = flowerTypes[flower.type]
    const petalCount = flowerType.petals
    const color = flowerType.color

    return (
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute cursor-pointer group"
        style={{
          left: `${flower.position.x}%`,
          top: `${flower.position.y}%`,
        }}
        title={flower.text}
      >
        <svg width="48" height="48" viewBox="0 0 60 60" className="drop-shadow-lg">
          {/* Petals */}
          {Array.from({ length: petalCount }).map((_, i) => (
            <ellipse
              key={i}
              cx="30"
              cy="22"
              rx="9"
              ry="18"
              fill={color}
              transform={`rotate(${(360 / petalCount) * i} 30 30)`}
              opacity="0.8"
            />
          ))}
          {/* Center */}
          <circle cx="30" cy="30" r="6" fill="#FFD93D" />
          {/* Stem */}
          <line x1="30" y1="36" x2="30" y2="52" stroke="#4CAF50" strokeWidth="3" />
        </svg>

        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
          {flower.text}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
    >
      <div className="w-full max-w-6xl mx-4 h-[90vh] bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 rounded-lg shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Gratitude Garden</h2>
            <p className="text-gray-600">{flowers.length} flowers grown</p>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm" className="text-gray-800 hover:bg-white/20">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Garden Area */}
        <div className="relative w-full h-full">
          {/* Sky */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-green-200" />

          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-green-300 to-green-200" />

          {/* Flowers */}
          <AnimatePresence>
            {flowers.map((flower) => (
              <FlowerSVG key={flower.id} flower={flower} />
            ))}
          </AnimatePresence>

          {/* Sun */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute top-8 right-8"
          >
            <div className="w-20 h-20 bg-yellow-400 rounded-full shadow-lg flex items-center justify-center">
              <span className="text-4xl">☀️</span>
            </div>
          </motion.div>

          {/* Input Area */}
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <Card className="bg-white/90 backdrop-blur-lg max-w-2xl mx-auto">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Input
                    value={gratitudeText}
                    onChange={(e) => setGratitudeText(e.target.value)}
                    placeholder="What are you grateful for today?"
                    className="flex-1"
                    onKeyPress={(e) => e.key === "Enter" && addFlower()}
                  />
                  <Button
                    onClick={addFlower}
                    disabled={!gratitudeText.trim()}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  >
                    Plant Flower 🌸
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-2 text-center">
                  Each gratitude entry grows a unique flower in your garden
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
