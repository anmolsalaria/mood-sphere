"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type MoodType = "happy" | "calm" | "neutral" | "anxious" | "stressed" | "sad"

interface MoodContextType {
  currentMood: MoodType
  setCurrentMood: (mood: MoodType) => void
  getMoodBackground: (mood: MoodType) => string
  getMoodGradient: (mood: MoodType) => string
}

const MoodContext = createContext<MoodContextType | undefined>(undefined)

export function MoodProvider({ children }: { children: React.ReactNode }) {
  const [currentMood, setCurrentMood] = useState<MoodType>("calm")

  // Persist mood in localStorage
  useEffect(() => {
    const savedMood = localStorage.getItem("moodSphere-mood")
    if (savedMood && ["happy", "calm", "neutral", "anxious", "stressed", "sad"].includes(savedMood)) {
      setCurrentMood(savedMood as MoodType)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("moodSphere-mood", currentMood)
  }, [currentMood])

  // Get background gradient based on mood (10% darker - 300 level)
  const getMoodBackground = (mood: MoodType) => {
    switch (mood) {
      case "happy":
        return "from-yellow-300 via-orange-200 to-pink-300"
      case "calm":
        return "from-blue-300 via-cyan-200 to-teal-300"
      case "anxious":
        return "from-red-300 via-pink-200 to-rose-300"
      case "stressed":
        return "from-orange-300 via-red-200 to-yellow-300"
      case "neutral":
        return "from-green-300 via-emerald-200 to-lime-300"
      case "sad":
        return "from-indigo-300 via-blue-200 to-purple-300"
      default:
        return "from-blue-300 via-cyan-200 to-teal-300"
    }
  }

  // Get darker gradient for other pages
  const getMoodGradient = (mood: MoodType) => {
    switch (mood) {
      case "happy":
        return "from-yellow-900 via-orange-800 to-pink-900"
      case "calm":
        return "from-blue-900 via-cyan-800 to-teal-900"
      case "anxious":
        return "from-red-900 via-pink-800 to-rose-900"
      case "stressed":
        return "from-orange-900 via-red-800 to-yellow-900"
      case "neutral":
        return "from-green-900 via-emerald-800 to-lime-900"
      case "sad":
        return "from-indigo-900 via-blue-800 to-purple-900"
      default:
        return "from-blue-900 via-cyan-800 to-teal-900"
    }
  }

  return (
    <MoodContext.Provider
      value={{
        currentMood,
        setCurrentMood,
        getMoodBackground,
        getMoodGradient,
      }}
    >
      {children}
    </MoodContext.Provider>
  )
}

export function useMood() {
  const context = useContext(MoodContext)
  if (context === undefined) {
    throw new Error("useMood must be used within a MoodProvider")
  }
  return context
}
