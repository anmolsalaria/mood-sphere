"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Download, RotateCcw } from "lucide-react"

interface CloudWord {
  id: string
  text: string
  x: number
  y: number
  size: number
  color: string
}

const positiveWords = [
  "Confident",
  "Loved",
  "Capable",
  "Strong",
  "Peaceful",
  "Grateful",
  "Resilient",
  "Worthy",
  "Brave",
  "Calm",
  "Joyful",
  "Wise",
  "Creative",
  "Balanced",
  "Focused",
  "Hopeful",
  "Radiant",
  "Serene",
  "Empowered",
  "Mindful",
  "Abundant",
  "Vibrant",
  "Centered",
  "Free",
]

const colors = [
  "#FF6B9D",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#FFB6C1",
  "#87CEEB",
  "#98FB98",
  "#F0E68C",
  "#DDA0DD",
  "#B0E0E6",
]

interface ThoughtCloudBuilderProps {
  onClose: () => void
}

export function ThoughtCloudBuilder({ onClose }: ThoughtCloudBuilderProps) {
  const [cloudWords, setCloudWords] = useState<CloudWord[]>([])
  const [availableWords, setAvailableWords] = useState(positiveWords)
  const [draggedWord, setDraggedWord] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const addWordToCloud = (word: string) => {
    const newWord: CloudWord = {
      id: `${word}-${Date.now()}`,
      text: word,
      x: Math.random() * 70 + 15, // 15% to 85% of container width
      y: Math.random() * 60 + 20, // 20% to 80% of container height
      size: Math.random() * 20 + 16, // 16px to 36px
      color: colors[Math.floor(Math.random() * colors.length)],
    }

    setCloudWords((prev) => [...prev, newWord])
    setAvailableWords((prev) => prev.filter((w) => w !== word))
  }

  const removeWordFromCloud = (wordId: string) => {
    const word = cloudWords.find((w) => w.id === wordId)
    if (word) {
      setCloudWords((prev) => prev.filter((w) => w.id !== wordId))
      setAvailableWords((prev) => [...prev, word.text])
    }
  }

  const handleDragStart = (word: string) => {
    setDraggedWord(word)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedWord || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    const newWord: CloudWord = {
      id: `${draggedWord}-${Date.now()}`,
      text: draggedWord,
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y)),
      size: Math.random() * 20 + 16,
      color: colors[Math.floor(Math.random() * colors.length)],
    }

    setCloudWords((prev) => [...prev, newWord])
    setAvailableWords((prev) => prev.filter((w) => w !== draggedWord))
    setDraggedWord(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const resetCloud = () => {
    setCloudWords([])
    setAvailableWords(positiveWords)
  }

  const saveCloud = () => {
    const cloudData = {
      words: cloudWords,
      timestamp: new Date().toISOString(),
    }

    const savedClouds = JSON.parse(localStorage.getItem("thoughtClouds") || "[]")
    savedClouds.push(cloudData)
    localStorage.setItem("thoughtClouds", JSON.stringify(savedClouds))

    // Create downloadable image (simplified version)
    const canvas = document.createElement("canvas")
    canvas.width = 600
    canvas.height = 450
    const ctx = canvas.getContext("2d")

    if (ctx) {
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, 600)
      gradient.addColorStop(0, "#E0F2FE")
      gradient.addColorStop(1, "#F0F9FF")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 800, 600)

      // Draw words
      cloudWords.forEach((word) => {
        ctx.fillStyle = word.color
        ctx.font = `${word.size}px Arial`
        ctx.textAlign = "center"
        ctx.fillText(word.text, (word.x / 100) * 800, (word.y / 100) * 600)
      })

      // Download
      const link = document.createElement("a")
      link.download = `thought-cloud-${Date.now()}.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100 z-50 p-4 overflow-hidden"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Thought Cloud Builder</h2>
          <p className="text-gray-600">Drag positive words to create your affirmation cloud</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={saveCloud} variant="outline" size="sm" disabled={cloudWords.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Save Cloud
          </Button>
          <Button onClick={resetCloud} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={onClose} variant="ghost" size="sm">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full max-h-[calc(100vh-120px)] overflow-hidden">
        {/* Word Bank */}
        <div className="lg:col-span-1 overflow-hidden">
          <Card className="h-full bg-white/80 backdrop-blur-lg">
            <CardContent className="p-4 h-full overflow-hidden">
              <h3 className="font-semibold mb-4 text-gray-800">Positive Words</h3>
              <div className="space-y-2 overflow-y-auto" style={{ maxHeight: "calc(100vh - 250px)" }}>
                {availableWords.map((word) => (
                  <motion.div
                    key={word}
                    drag
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    whileDrag={{ scale: 1.1, zIndex: 10 }}
                    onDragStart={() => handleDragStart(word)}
                    className="bg-gradient-to-r from-purple-100 to-pink-100 p-2 rounded-lg cursor-move hover:from-purple-200 hover:to-pink-200 transition-all duration-200"
                  >
                    <p className="text-center font-medium text-gray-800">{word}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cloud Canvas */}
        <div className="lg:col-span-3 overflow-hidden">
          <Card className="h-full bg-gradient-to-br from-sky-50 to-blue-50 border-2 border-dashed border-blue-200">
            <CardContent className="p-0 h-full relative overflow-hidden">
              <div
                ref={canvasRef}
                className="w-full h-full relative overflow-hidden"
                style={{ minHeight: "300px", maxHeight: "calc(100vh - 200px)" }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {/* Cloud Background */}
                <div className="absolute inset-0 opacity-10">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute text-4xl text-blue-300"
                      style={{
                        left: `${Math.random() * 80 + 10}%`,
                        top: `${Math.random() * 80 + 10}%`,
                      }}
                    >
                      ☁️
                    </div>
                  ))}
                </div>

                {/* Floating Words */}
                <AnimatePresence>
                  {cloudWords.map((word) => (
                    <motion.div
                      key={word.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: [0, -10, 0],
                      }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{
                        y: {
                          duration: 3 + Math.random() * 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        },
                      }}
                      className="absolute cursor-pointer group"
                      style={{
                        left: `${word.x}%`,
                        top: `${word.y}%`,
                        fontSize: `${word.size}px`,
                        color: word.color,
                        transform: "translate(-50%, -50%)",
                      }}
                      onClick={() => removeWordFromCloud(word.id)}
                    >
                      <span className="font-bold drop-shadow-lg group-hover:scale-110 transition-transform duration-200">
                        {word.text}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Instructions */}
                {cloudWords.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <div className="text-3xl mb-4">☁️</div>
                      <p className="text-base">Drag positive words here to build your thought cloud</p>
                      <p className="text-sm mt-2">Click on words in the cloud to remove them</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats */}
      {cloudWords.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4">
          <Card className="bg-white/90 backdrop-blur-lg">
            <CardContent className="p-4 text-center">
              <p className="text-gray-700">
                ✨ Your cloud contains <span className="font-bold">{cloudWords.length}</span> positive affirmations
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </motion.div>
  )
}
