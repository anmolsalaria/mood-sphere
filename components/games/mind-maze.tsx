"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, RotateCcw } from "lucide-react"

interface ThoughtBubble {
  id: string
  text: string
  category: "helpful" | "unhelpful" | "true" | "distorted"
}

const thoughtBubbles: ThoughtBubble[] = [
  { id: "1", text: "I can learn from this mistake", category: "helpful" },
  { id: "2", text: "Everyone thinks I'm stupid", category: "distorted" },
  { id: "3", text: "I have supportive friends", category: "true" },
  { id: "4", text: "I'll never be good enough", category: "unhelpful" },
  { id: "5", text: "This challenge will help me grow", category: "helpful" },
  { id: "6", text: "I always mess everything up", category: "distorted" },
  { id: "7", text: "I completed my project on time", category: "true" },
  { id: "8", text: "Why even try anymore?", category: "unhelpful" },
  { id: "9", text: "I can ask for help when needed", category: "helpful" },
  { id: "10", text: "Nobody likes me", category: "distorted" },
]

const categories = [
  {
    id: "helpful",
    label: "Helpful",
    color: "bg-green-200 border-green-400",
    description: "Thoughts that support your wellbeing",
  },
  {
    id: "unhelpful",
    label: "Unhelpful",
    color: "bg-red-200 border-red-400",
    description: "Thoughts that don't serve you",
  },
  { id: "true", label: "True", color: "bg-blue-200 border-blue-400", description: "Facts based on reality" },
  {
    id: "distorted",
    label: "Distorted",
    color: "bg-purple-200 border-purple-400",
    description: "Thoughts that twist reality",
  },
]

interface MindMazeProps {
  onClose: () => void
}

export function MindMaze({ onClose }: MindMazeProps) {
  const [currentBubbles, setCurrentBubbles] = useState<ThoughtBubble[]>([])
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [draggedBubble, setDraggedBubble] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ show: boolean; correct: boolean; message: string }>({
    show: false,
    correct: false,
    message: "",
  })

  useEffect(() => {
    resetGame()
  }, [])

  const resetGame = () => {
    const shuffled = [...thoughtBubbles].sort(() => Math.random() - 0.5).slice(0, 6)
    setCurrentBubbles(shuffled)
    setScore(0)
    setAttempts(0)
  }

  const handleDragStart = (bubbleId: string) => {
    setDraggedBubble(bubbleId)
  }

  const handleDrop = (categoryId: string) => {
    if (!draggedBubble) return

    const bubble = currentBubbles.find((b) => b.id === draggedBubble)
    if (!bubble) return

    const isCorrect = bubble.category === categoryId
    setAttempts((prev) => prev + 1)

    if (isCorrect) {
      setScore((prev) => prev + 1)
      setCurrentBubbles((prev) => prev.filter((b) => b.id !== draggedBubble))
      setFeedback({
        show: true,
        correct: true,
        message: "Great job! That thought belongs in this category.",
      })
    } else {
      const correctCategory = categories.find((c) => c.id === bubble.category)
      setFeedback({
        show: true,
        correct: false,
        message: `Not quite. This thought is actually "${correctCategory?.label}". ${correctCategory?.description}`,
      })
    }

    setTimeout(() => {
      setFeedback({ show: false, correct: false, message: "" })
    }, 3000)

    setDraggedBubble(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 z-50 p-4 overflow-hidden"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Mind Maze</h2>
          <p className="text-gray-600">
            Score: {score}/{attempts} | Remaining: {currentBubbles.length}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={resetGame} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={onClose} variant="ghost" size="sm">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full max-h-[calc(100vh-120px)] overflow-y-auto">
        {/* Thought Bubbles */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Drag thoughts to the right category</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {currentBubbles.map((bubble) => (
                <motion.div
                  key={bubble.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  drag
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  whileDrag={{ scale: 1.05, zIndex: 10 }}
                  onDragStart={() => handleDragStart(bubble.id)}
                  className="cursor-move"
                >
                  <Card className="bg-white/80 hover:bg-white/90 transition-all duration-200 shadow-lg">
                    <CardContent className="p-4">
                      <p className="text-gray-800 font-medium">{bubble.text}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Category Bins */}
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              className={`${category.color} border-2 border-dashed rounded-lg p-4 min-h-24 flex flex-col items-center justify-center text-center transition-all duration-200 hover:scale-105`}
              onDrop={() => handleDrop(category.id)}
              onDragOver={handleDragOver}
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="font-bold text-base mb-2">{category.label}</h4>
              <p className="text-sm text-gray-700">{category.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {feedback.show && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-4 right-4"
          >
            <Card
              className={`${feedback.correct ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500"} border-2`}
            >
              <CardContent className="p-3">
                <p className="font-medium text-gray-800">{feedback.message}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion */}
      {currentBubbles.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-10"
        >
          <Card className="bg-white max-w-md mx-4">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold mb-4">Congratulations!</h3>
              <p className="text-gray-700 mb-4">
                You completed the Mind Maze with a score of {score}/{attempts}!
              </p>
              <div className="flex gap-4">
                <Button onClick={resetGame} className="flex-1">
                  Play Again
                </Button>
                <Button onClick={onClose} variant="outline" className="flex-1">
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}
