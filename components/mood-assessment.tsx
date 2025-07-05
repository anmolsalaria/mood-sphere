"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, ArrowRight, ArrowLeft, CheckCircle, RotateCcw, Volume2, VolumeX, Play, Pause } from "lucide-react"

interface Question {
  id: string
  text: string
  category: string
  options: {
    text: string
    weight: number
    moodImpact: {
      happy: number
      calm: number
      neutral: number
      anxious: number
      sad: number
    }
  }[]
}

interface MoodAssessmentProps {
  onComplete: (mood: string, confidence: number) => void
  onBack: () => void
}

const questionBank: Question[] = [
  {
    id: "energy",
    text: "How would you describe your energy level today?",
    category: "Physical State",
    options: [
      {
        text: "Very energetic and motivated",
        weight: 4,
        moodImpact: { happy: 3, calm: 1, neutral: 0, anxious: 0, sad: 0 },
      },
      {
        text: "Moderately energetic",
        weight: 3,
        moodImpact: { happy: 2, calm: 2, neutral: 1, anxious: 0, sad: 0 },
      },
      {
        text: "Average energy level",
        weight: 2,
        moodImpact: { happy: 0, calm: 1, neutral: 3, anxious: 0, sad: 0 },
      },
      {
        text: "Low energy, feeling tired",
        weight: 1,
        moodImpact: { happy: 0, calm: 0, neutral: 1, anxious: 1, sad: 2 },
      },
      {
        text: "Completely drained",
        weight: 0,
        moodImpact: { happy: 0, calm: 0, neutral: 0, anxious: 2, sad: 3 },
      },
    ],
  },
  {
    id: "social",
    text: "How do you feel about social interactions today?",
    category: "Social",
    options: [
      {
        text: "Excited to connect with others",
        weight: 4,
        moodImpact: { happy: 3, calm: 1, neutral: 0, anxious: 0, sad: 0 },
      },
      {
        text: "Open to socializing",
        weight: 3,
        moodImpact: { happy: 2, calm: 2, neutral: 1, anxious: 0, sad: 0 },
      },
      {
        text: "Neutral about social contact",
        weight: 2,
        moodImpact: { happy: 0, calm: 1, neutral: 3, anxious: 0, sad: 0 },
      },
      {
        text: "Prefer to be alone",
        weight: 1,
        moodImpact: { happy: 0, calm: 2, neutral: 1, anxious: 1, sad: 1 },
      },
      {
        text: "Want to avoid people completely",
        weight: 0,
        moodImpact: { happy: 0, calm: 0, neutral: 0, anxious: 2, sad: 3 },
      },
    ],
  },
  {
    id: "stress",
    text: "What's your stress level right now?",
    category: "Mental State",
    options: [
      {
        text: "Very relaxed and at peace",
        weight: 4,
        moodImpact: { happy: 2, calm: 3, neutral: 1, anxious: 0, sad: 0 },
      },
      {
        text: "Mostly calm with minor concerns",
        weight: 3,
        moodImpact: { happy: 1, calm: 3, neutral: 1, anxious: 0, sad: 0 },
      },
      {
        text: "Moderate stress level",
        weight: 2,
        moodImpact: { happy: 0, calm: 1, neutral: 2, anxious: 2, sad: 0 },
      },
      {
        text: "Quite stressed and worried",
        weight: 1,
        moodImpact: { happy: 0, calm: 0, neutral: 1, anxious: 3, sad: 1 },
      },
      {
        text: "Extremely overwhelmed",
        weight: 0,
        moodImpact: { happy: 0, calm: 0, neutral: 0, anxious: 4, sad: 2 },
      },
    ],
  },
  {
    id: "outlook",
    text: "How do you view the day ahead?",
    category: "Perspective",
    options: [
      {
        text: "Very optimistic and excited",
        weight: 4,
        moodImpact: { happy: 4, calm: 1, neutral: 0, anxious: 0, sad: 0 },
      },
      {
        text: "Generally positive",
        weight: 3,
        moodImpact: { happy: 3, calm: 1, neutral: 1, anxious: 0, sad: 0 },
      },
      {
        text: "Neutral expectations",
        weight: 2,
        moodImpact: { happy: 1, calm: 1, neutral: 3, anxious: 0, sad: 0 },
      },
      {
        text: "Somewhat pessimistic",
        weight: 1,
        moodImpact: { happy: 0, calm: 0, neutral: 1, anxious: 2, sad: 2 },
      },
      {
        text: "Very negative outlook",
        weight: 0,
        moodImpact: { happy: 0, calm: 0, neutral: 0, anxious: 1, sad: 4 },
      },
    ],
  },
  {
    id: "sleep",
    text: "How was your sleep quality recently?",
    category: "Physical State",
    options: [
      {
        text: "Excellent, feeling well-rested",
        weight: 4,
        moodImpact: { happy: 2, calm: 3, neutral: 1, anxious: 0, sad: 0 },
      },
      {
        text: "Good sleep, mostly refreshed",
        weight: 3,
        moodImpact: { happy: 1, calm: 2, neutral: 2, anxious: 0, sad: 0 },
      },
      {
        text: "Average sleep quality",
        weight: 2,
        moodImpact: { happy: 0, calm: 1, neutral: 3, anxious: 1, sad: 0 },
      },
      {
        text: "Poor sleep, feeling tired",
        weight: 1,
        moodImpact: { happy: 0, calm: 0, neutral: 1, anxious: 2, sad: 2 },
      },
      {
        text: "Terrible sleep, exhausted",
        weight: 0,
        moodImpact: { happy: 0, calm: 0, neutral: 0, anxious: 3, sad: 3 },
      },
    ],
  },
  {
    id: "motivation",
    text: "How motivated do you feel about your goals?",
    category: "Mental State",
    options: [
      {
        text: "Highly motivated and focused",
        weight: 4,
        moodImpact: { happy: 3, calm: 2, neutral: 0, anxious: 0, sad: 0 },
      },
      {
        text: "Reasonably motivated",
        weight: 3,
        moodImpact: { happy: 2, calm: 2, neutral: 1, anxious: 0, sad: 0 },
      },
      {
        text: "Somewhat motivated",
        weight: 2,
        moodImpact: { happy: 1, calm: 1, neutral: 3, anxious: 0, sad: 0 },
      },
      {
        text: "Low motivation",
        weight: 1,
        moodImpact: { happy: 0, calm: 0, neutral: 2, anxious: 1, sad: 2 },
      },
      {
        text: "No motivation at all",
        weight: 0,
        moodImpact: { happy: 0, calm: 0, neutral: 0, anxious: 2, sad: 4 },
      },
    ],
  },
  {
    id: "physical",
    text: "How does your body feel right now?",
    category: "Physical State",
    options: [
      {
        text: "Strong, healthy, and comfortable",
        weight: 4,
        moodImpact: { happy: 2, calm: 3, neutral: 1, anxious: 0, sad: 0 },
      },
      {
        text: "Generally feeling good",
        weight: 3,
        moodImpact: { happy: 1, calm: 2, neutral: 2, anxious: 0, sad: 0 },
      },
      {
        text: "Normal, no particular issues",
        weight: 2,
        moodImpact: { happy: 0, calm: 1, neutral: 4, anxious: 0, sad: 0 },
      },
      {
        text: "Some discomfort or tension",
        weight: 1,
        moodImpact: { happy: 0, calm: 0, neutral: 1, anxious: 2, sad: 1 },
      },
      {
        text: "Significant physical discomfort",
        weight: 0,
        moodImpact: { happy: 0, calm: 0, neutral: 0, anxious: 3, sad: 3 },
      },
    ],
  },
  {
    id: "relationships",
    text: "How are your relationships feeling lately?",
    category: "Social",
    options: [
      {
        text: "Very fulfilling and supportive",
        weight: 4,
        moodImpact: { happy: 4, calm: 2, neutral: 0, anxious: 0, sad: 0 },
      },
      {
        text: "Generally positive connections",
        weight: 3,
        moodImpact: { happy: 2, calm: 2, neutral: 1, anxious: 0, sad: 0 },
      },
      {
        text: "Mixed experiences",
        weight: 2,
        moodImpact: { happy: 1, calm: 1, neutral: 3, anxious: 1, sad: 0 },
      },
      {
        text: "Some relationship challenges",
        weight: 1,
        moodImpact: { happy: 0, calm: 0, neutral: 1, anxious: 2, sad: 2 },
      },
      {
        text: "Feeling isolated or conflicted",
        weight: 0,
        moodImpact: { happy: 0, calm: 0, neutral: 0, anxious: 2, sad: 4 },
      },
    ],
  },
  {
    id: "accomplishment",
    text: "How do you feel about your recent achievements?",
    category: "Self-Perception",
    options: [
      {
        text: "Very proud and accomplished",
        weight: 4,
        moodImpact: { happy: 4, calm: 1, neutral: 0, anxious: 0, sad: 0 },
      },
      {
        text: "Satisfied with progress",
        weight: 3,
        moodImpact: { happy: 3, calm: 1, neutral: 1, anxious: 0, sad: 0 },
      },
      {
        text: "Making steady progress",
        weight: 2,
        moodImpact: { happy: 1, calm: 2, neutral: 2, anxious: 0, sad: 0 },
      },
      {
        text: "Feeling behind on goals",
        weight: 1,
        moodImpact: { happy: 0, calm: 0, neutral: 1, anxious: 3, sad: 1 },
      },
      {
        text: "Disappointed in myself",
        weight: 0,
        moodImpact: { happy: 0, calm: 0, neutral: 0, anxious: 2, sad: 4 },
      },
    ],
  },
  {
    id: "future",
    text: "When you think about the future, you feel:",
    category: "Perspective",
    options: [
      {
        text: "Excited and hopeful",
        weight: 4,
        moodImpact: { happy: 4, calm: 1, neutral: 0, anxious: 0, sad: 0 },
      },
      {
        text: "Generally optimistic",
        weight: 3,
        moodImpact: { happy: 2, calm: 2, neutral: 1, anxious: 0, sad: 0 },
      },
      {
        text: "Uncertain but open",
        weight: 2,
        moodImpact: { happy: 0, calm: 1, neutral: 3, anxious: 1, sad: 0 },
      },
      {
        text: "Worried about what's ahead",
        weight: 1,
        moodImpact: { happy: 0, calm: 0, neutral: 1, anxious: 4, sad: 1 },
      },
      {
        text: "Fearful or hopeless",
        weight: 0,
        moodImpact: { happy: 0, calm: 0, neutral: 0, anxious: 3, sad: 4 },
      },
    ],
  },
]

export function MoodAssessment({ onComplete, onBack }: MoodAssessmentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [detectedMood, setDetectedMood] = useState("")
  const [confidence, setConfidence] = useState(0)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  // Initialize questions on component mount
  useEffect(() => {
    const initialQuestions = [questionBank[0]] // Start with energy question
    setSelectedQuestions(initialQuestions)
  }, [])

  // Auto-play audio when question changes and audio is enabled
  useEffect(() => {
    if (audioEnabled && selectedQuestions.length > 0 && currentQuestionIndex < selectedQuestions.length) {
      const timer = setTimeout(() => {
        playCurrentQuestion()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentQuestionIndex, audioEnabled, selectedQuestions])

  const playCurrentQuestion = () => {
    if (!audioEnabled || currentQuestionIndex >= selectedQuestions.length) return

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const currentQuestion = selectedQuestions[currentQuestionIndex]
    let textToSpeak = `Question: ${currentQuestion.text}. `

    currentQuestion.options.forEach((option, index) => {
      textToSpeak += `Option ${index + 1}: ${option.text}. `
    })

    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 0.8

    utterance.onstart = () => setIsPlaying(true)
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)

    window.speechSynthesis.speak(utterance)
  }

  const stopSpeech = () => {
    window.speechSynthesis.cancel()
    setIsPlaying(false)
  }

  const toggleAudio = () => {
    if (audioEnabled) {
      stopSpeech()
    }
    setAudioEnabled(!audioEnabled)
  }

  const selectNextQuestions = (currentAnswers: Record<string, number>) => {
    // Adaptive question selection based on previous answers
    const answeredCategories = selectedQuestions.map((q) => q.category)
    const availableQuestions = questionBank.filter(
      (q) => !selectedQuestions.some((sq) => sq.id === q.id) && !answeredCategories.includes(q.category),
    )

    if (availableQuestions.length === 0) return selectedQuestions

    // Select next question based on current mood indicators
    const moodScores = calculateMoodScores(currentAnswers)
    const dominantMood = Object.entries(moodScores).reduce((a, b) => (moodScores[a[0]] > moodScores[b[0]] ? a : b))[0]

    // Prioritize questions that can help clarify the dominant mood
    let nextQuestion = availableQuestions[0] // fallback

    if (dominantMood === "anxious" && availableQuestions.find((q) => q.category === "Mental State")) {
      nextQuestion = availableQuestions.find((q) => q.category === "Mental State") || nextQuestion
    } else if (dominantMood === "sad" && availableQuestions.find((q) => q.category === "Social")) {
      nextQuestion = availableQuestions.find((q) => q.category === "Social") || nextQuestion
    } else if (dominantMood === "happy" && availableQuestions.find((q) => q.category === "Self-Perception")) {
      nextQuestion = availableQuestions.find((q) => q.category === "Self-Perception") || nextQuestion
    }

    return [...selectedQuestions, nextQuestion]
  }

  const calculateMoodScores = (currentAnswers: Record<string, number>) => {
    const moodScores = { happy: 0, calm: 0, neutral: 0, anxious: 0, sad: 0 }

    selectedQuestions.forEach((question, index) => {
      if (index < Object.keys(currentAnswers).length) {
        const answerIndex = currentAnswers[question.id]
        const selectedOption = question.options[answerIndex]

        Object.entries(selectedOption.moodImpact).forEach(([mood, impact]) => {
          moodScores[mood as keyof typeof moodScores] += impact
        })
      }
    })

    return moodScores
  }

  const handleAnswer = (optionIndex: number) => {
    // Stop speech when user selects an answer
    if (isPlaying) {
      stopSpeech()
    }

    const newAnswers = { ...answers, [selectedQuestions[currentQuestionIndex].id]: optionIndex }
    setAnswers(newAnswers)

    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else if (selectedQuestions.length < 5) {
      // Add more questions adaptively
      const updatedQuestions = selectNextQuestions(newAnswers)
      setSelectedQuestions(updatedQuestions)
      if (updatedQuestions.length > selectedQuestions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        completeAssessment(newAnswers)
      }
    } else {
      completeAssessment(newAnswers)
    }
  }

  const completeAssessment = (finalAnswers: Record<string, number>) => {
    const moodScores = calculateMoodScores(finalAnswers)
    const totalScore = Object.values(moodScores).reduce((sum, score) => sum + score, 0)

    // Find the dominant mood
    const dominantMood = Object.entries(moodScores).reduce((a, b) => (moodScores[a[0]] > moodScores[b[0]] ? a : b))[0]

    // Calculate confidence based on how dominant the top mood is
    const dominantScore = moodScores[dominantMood as keyof typeof moodScores]
    const confidenceLevel = totalScore > 0 ? Math.min((dominantScore / totalScore) * 100, 95) : 50

    setDetectedMood(dominantMood)
    setConfidence(Math.round(confidenceLevel))
    setIsComplete(true)

    // Read completion message if audio is enabled
    if (audioEnabled) {
      setTimeout(() => {
        const completionText = `Assessment complete. Your detected mood is ${dominantMood} with ${Math.round(confidenceLevel)} percent confidence.`
        const utterance = new SpeechSynthesisUtterance(completionText)
        utterance.rate = 0.9
        window.speechSynthesis.speak(utterance)
      }, 1000)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleRestart = () => {
    setCurrentQuestionIndex(0)
    setAnswers({})
    setSelectedQuestions([questionBank[0]])
    setIsComplete(false)
    setDetectedMood("")
    setConfidence(0)
    stopSpeech()
  }

  const handleComplete = () => {
    onComplete(detectedMood, confidence)
  }

  const progress =
    selectedQuestions.length > 0 ? ((currentQuestionIndex + 1) / Math.min(selectedQuestions.length, 5)) * 100 : 0

  if (isComplete) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
          <CardHeader className="text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
            </motion.div>
            <CardTitle className="text-2xl">Assessment Complete!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div>
              <p className="text-lg mb-2">Your detected mood is:</p>
              <Badge className="text-2xl px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 capitalize">
                {detectedMood}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-gray-300 mb-2">Confidence Level</p>
              <div className="flex items-center space-x-3">
                <Progress value={confidence} className="flex-1" />
                <span className="text-lg font-bold">{confidence}%</span>
              </div>
            </div>

            <p className="text-gray-300">
              Based on your responses, we've identified patterns that suggest you're feeling {detectedMood}. We'll use
              this to personalize your experience and suggest relevant activities.
            </p>

            <div className="flex space-x-3">
              <Button
                onClick={handleRestart}
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Assessment
              </Button>
              <Button
                onClick={handleComplete}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (selectedQuestions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
          <CardContent className="p-8 text-center">
            <Brain className="w-12 h-12 mx-auto mb-4 text-purple-400 animate-pulse" />
            <p>Loading assessment...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion = selectedQuestions[currentQuestionIndex]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-black">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Button
                onClick={toggleAudio}
                variant="outline"
                size="sm"
                className="border-black text-black hover:bg-black/10 bg-transparent"
              >
                {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              {audioEnabled && (
                <Button
                  onClick={isPlaying ? stopSpeech : playCurrentQuestion}
                  variant="outline"
                  size="sm"
                  className="border-black text-black hover:bg-black/10 bg-transparent"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              )}
            </div>
            <Badge variant="secondary" className="bg-white/20 text-black border border-black">
              {currentQuestionIndex + 1} of {Math.min(selectedQuestions.length, 5)}
            </Badge>
          </div>
          <Progress value={progress} className="mb-4" />
          <CardTitle className="text-xl text-black">{currentQuestion.text}</CardTitle>
          <p className="text-sm text-black">{currentQuestion.category}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleAnswer(index)}
                  className="w-full p-4 text-left rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 border border-white/10 hover:border-white/30 text-black"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span>{option.text}</span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between pt-4">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              className="border-black text-black hover:bg-black/10 disabled:opacity-50 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={onBack}
              variant="outline"
              className="border-black text-black hover:bg-black/10 bg-transparent"
            >
              Back to Selection
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
