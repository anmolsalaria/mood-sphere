"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Play, Pause } from "lucide-react"

const inspirationalPhrases = [
  "Breathe in peace, breathe out tension",
  "This moment is all you have",
  "You are exactly where you need to be",
  "Let go of what you cannot control",
  "Find stillness in the present moment",
  "Your breath is your anchor to now",
  "Peace begins with a single breath",
  "You have the power to choose calm",
]

interface TwoMinutePauseProps {
  onClose: () => void
}

export function TwoMinutePause({ onClose }: TwoMinutePauseProps) {
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes in seconds
  const [isActive, setIsActive] = useState(false)
  const [currentPhrase, setCurrentPhrase] = useState(0)
  const [streak, setStreak] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [tabSwitched, setTabSwitched] = useState(false)

  useEffect(() => {
    const savedStreak = localStorage.getItem("pauseStreak")
    if (savedStreak) {
      setStreak(Number.parseInt(savedStreak))
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsComplete(true)
            setIsActive(false)
            const newStreak = streak + 1
            setStreak(newStreak)
            localStorage.setItem("pauseStreak", newStreak.toString())
            return 0
          }
          return time - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, streak])

  // Change phrase every 30 seconds
  useEffect(() => {
    if (isActive && timeLeft % 30 === 0 && timeLeft !== 120) {
      setCurrentPhrase((prev) => (prev + 1) % inspirationalPhrases.length)
    }
  }, [timeLeft, isActive])

  // Detect tab switching
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isActive) {
        setTabSwitched(true)
        setIsActive(false)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [isActive])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const resetTimer = () => {
    setTimeLeft(120)
    setIsActive(false)
    setIsComplete(false)
    setTabSwitched(false)
    setCurrentPhrase(0)
  }

  const getProgress = () => {
    return ((120 - timeLeft) / 120) * 100
  }

  if (tabSwitched) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-br from-red-100 via-orange-100 to-yellow-100 z-50 flex items-center justify-center"
      >
        <Card className="max-w-md mx-4 bg-white/90 backdrop-blur-lg">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Session Interrupted</h3>
            <p className="text-gray-600 mb-6">
              The pause session was interrupted when you switched tabs. Mindfulness requires full presence.
            </p>
            <div className="flex gap-4">
              <Button onClick={resetTimer} className="flex-1">
                Try Again
              </Button>
              <Button onClick={onClose} variant="outline" className="flex-1">
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 z-50 flex items-center justify-center"
      >
        <Card className="max-w-md mx-4 bg-white/90 backdrop-blur-lg">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Mindful Moment Complete!</h3>
            <div className="space-y-2 mb-6">
              <p className="text-gray-700">You successfully completed 2 minutes of mindfulness</p>
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-3 rounded-lg">
                <p className="font-semibold text-purple-800">Current Streak: {streak} sessions</p>
              </div>
              <p className="text-sm text-gray-600 italic">
                "The present moment is the only time over which we have dominion."
              </p>
            </div>
            <div className="flex gap-4">
              <Button onClick={resetTimer} className="flex-1">
                Another Session
              </Button>
              <Button onClick={onClose} variant="outline" className="flex-1">
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-hidden"
    >
      <div className="w-full max-w-4xl mx-4 aspect-video bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 rounded-lg shadow-2xl flex items-center justify-center overflow-hidden">
        <div className="text-center text-gray-800 max-w-xl px-4 max-h-screen overflow-y-auto relative">
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 text-gray-800 hover:bg-white/20"
            disabled={isActive}
          >
            <X className="w-5 h-5" />
          </Button>

          <h2 className="text-3xl font-bold mb-8">2-Minute Pause</h2>

          {/* Timer Circle */}
          <div className="relative mb-8">
            <svg className="w-40 h-40 sm:w-48 sm:h-48 mx-auto transform -rotate-90">
              <circle cx="128" cy="128" r="120" stroke="rgba(255,255,255,0.3)" strokeWidth="8" fill="transparent" />
              <motion.circle
                cx="128"
                cy="128"
                r="120"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 120}`}
                strokeDashoffset={`${2 * Math.PI * 120 * (1 - getProgress() / 100)}`}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-light mb-2">{formatTime(timeLeft)}</div>
                <div className="text-lg opacity-75">{isActive ? "Stay present" : "Ready to begin?"}</div>
              </div>
            </div>
          </div>

          {/* Breathing Animation */}
          {isActive && (
            <motion.div
              className="w-24 h-24 mx-auto mb-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          )}

          {/* Inspirational Phrase */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhrase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1 }}
              className="mb-8"
            >
              <p className="text-lg italic font-medium">"{inspirationalPhrases[currentPhrase]}"</p>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="space-y-4">
            <Button
              onClick={() => setIsActive(!isActive)}
              disabled={timeLeft === 0}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg"
            >
              {isActive ? <Pause className="w-6 h-6 mr-2" /> : <Play className="w-6 h-6 mr-2" />}
              {isActive ? "Pause" : "Start"}
            </Button>

            {streak > 0 && (
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                <p className="text-sm">
                  🔥 Current streak: <span className="font-bold">{streak}</span> sessions
                </p>
              </div>
            )}

            <p className="text-sm opacity-75 max-w-md mx-auto">
              Stay focused on this tab. Switching away will reset your session.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
