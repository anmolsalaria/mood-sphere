"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, RotateCcw } from "lucide-react"

interface Scenario {
  id: number
  text: string
  correctEmotion: string
  emotions: string[]
  copingStrategies: string[]
  correctCoping: string
}

const scenarios: Scenario[] = [
  {
    id: 1,
    text: "I lost my notes before the exam",
    correctEmotion: "Anxious",
    emotions: ["Happy", "Anxious", "Angry", "Confused"],
    copingStrategies: ["Deep breathing", "Blame others", "Give up", "Panic"],
    correctCoping: "Deep breathing",
  },
  {
    id: 2,
    text: "My friend didn't invite me to their party",
    correctEmotion: "Hurt",
    emotions: ["Excited", "Hurt", "Proud", "Grateful"],
    copingStrategies: ["Talk to friend", "Spread rumors", "Isolate myself", "Get revenge"],
    correctCoping: "Talk to friend",
  },
  {
    id: 3,
    text: "I got promoted at work",
    correctEmotion: "Proud",
    emotions: ["Sad", "Worried", "Proud", "Angry"],
    copingStrategies: [
      "Celebrate mindfully",
      "Worry about new responsibilities",
      "Downplay achievement",
      "Boast to everyone",
    ],
    correctCoping: "Celebrate mindfully",
  },
  {
    id: 4,
    text: "I made a mistake in front of everyone",
    correctEmotion: "Embarrassed",
    emotions: ["Embarrassed", "Excited", "Grateful", "Calm"],
    copingStrategies: ["Learn from mistake", "Hide forever", "Blame others", "Make excuses"],
    correctCoping: "Learn from mistake",
  },
]

interface EmotionRecognitionGameProps {
  onClose: () => void
}

export function EmotionRecognitionGame({ onClose }: EmotionRecognitionGameProps) {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [gamePhase, setGamePhase] = useState<"emotion" | "coping" | "feedback">("emotion")
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)
  const [selectedCoping, setSelectedCoping] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  useEffect(() => {
    const savedProgress = localStorage.getItem("emotionGameProgress")
    if (savedProgress) {
      const progress = JSON.parse(savedProgress)
      setScore(progress.score || 0)
      setTotalQuestions(progress.totalQuestions || 0)
    }
  }, [])

  const saveProgress = () => {
    localStorage.setItem("emotionGameProgress", JSON.stringify({ score, totalQuestions }))
  }

  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion)
    const correct = emotion === scenarios[currentScenario].correctEmotion
    setIsCorrect(correct)
    if (correct) setScore((prev) => prev + 1)
    setTotalQuestions((prev) => prev + 1)
    setShowFeedback(true)

    setTimeout(() => {
      setShowFeedback(false)
      setGamePhase("coping")
    }, 2000)
  }

  const handleCopingSelect = (coping: string) => {
    setSelectedCoping(coping)
    const correct = coping === scenarios[currentScenario].correctCoping
    setIsCorrect(correct)
    if (correct) setScore((prev) => prev + 1)
    setTotalQuestions((prev) => prev + 1)
    setShowFeedback(true)

    setTimeout(() => {
      setShowFeedback(false)
      nextScenario()
    }, 2000)

    saveProgress()
  }

  const nextScenario = () => {
    setCurrentScenario((prev) => (prev + 1) % scenarios.length)
    setGamePhase("emotion")
    setSelectedEmotion(null)
    setSelectedCoping(null)
  }

  const resetGame = () => {
    setCurrentScenario(0)
    setGamePhase("emotion")
    setSelectedEmotion(null)
    setSelectedCoping(null)
    setScore(0)
    setTotalQuestions(0)
    localStorage.removeItem("emotionGameProgress")
  }

  const scenario = scenarios[currentScenario]

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
            <h2 className="text-2xl font-bold text-white">Mood Match</h2>
            <p className="text-gray-300">
              Score: {score}/{totalQuestions}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={resetGame}
              variant="outline"
              size="sm"
              className="text-white border-white/30 bg-transparent hover:bg-white/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={onClose} variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col h-full p-4 pt-20 overflow-y-auto">
          {/* Scenario Card */}
          <Card className="mb-8 bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-4 text-white">Scenario</h3>
              <p className="text-lg text-gray-300 italic">"{scenario.text}"</p>
            </CardContent>
          </Card>

          {/* Game Phase */}
          <div className="flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {gamePhase === "emotion" && (
                <motion.div
                  key="emotion"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h3 className="text-xl font-semibold mb-4 text-center text-white">
                    How would you feel in this situation?
                  </h3>
                  <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {scenario.emotions.map((emotion) => (
                      <motion.div key={emotion} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Card
                          className="cursor-pointer bg-white/10 hover:bg-white/20 transition-all duration-200 border-white/20"
                          onClick={() => handleEmotionSelect(emotion)}
                        >
                          <CardContent className="p-6 text-center">
                            <p className="text-lg font-medium text-white">{emotion}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {gamePhase === "coping" && (
                <motion.div
                  key="coping"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h3 className="text-xl font-semibold mb-4 text-center text-white">
                    What would be a healthy way to cope?
                  </h3>
                  <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {scenario.copingStrategies.map((strategy) => (
                      <motion.div key={strategy} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Card
                          className="cursor-pointer bg-white/10 hover:bg-white/20 transition-all duration-200 border-white/20"
                          onClick={() => handleCopingSelect(strategy)}
                        >
                          <CardContent className="p-6 text-center">
                            <p className="text-lg font-medium text-white">{strategy}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed inset-0 flex items-center justify-center bg-black/50 z-20"
              >
                <Card
                  className={`${isCorrect ? "bg-green-900/90" : "bg-red-900/90"} border-2 ${isCorrect ? "border-green-500" : "border-red-500"}`}
                >
                  <CardContent className="p-8 text-center">
                    <div className="text-4xl mb-4">{isCorrect ? "✅" : "❌"}</div>
                    <h3 className="text-2xl font-bold mb-2 text-white">{isCorrect ? "Correct!" : "Not quite"}</h3>
                    <p className="text-gray-300">
                      {gamePhase === "emotion"
                        ? `The correct emotion was: ${scenario.correctEmotion}`
                        : `A better coping strategy: ${scenario.correctCoping}`}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
