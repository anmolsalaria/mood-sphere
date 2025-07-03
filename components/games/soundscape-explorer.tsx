"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X, Volume2, VolumeX } from "lucide-react"

interface Scene {
  id: string
  name: string
  background: string
  regions: Region[]
  ambientSound: string
}

interface Region {
  id: string
  name: string
  x: number
  y: number
  width: number
  height: number
  sound: string
  description: string
}

const scenes: Scene[] = [
  {
    id: "forest",
    name: "Peaceful Forest",
    background: "bg-gradient-to-b from-green-300 via-green-400 to-green-600",
    ambientSound: "forest-ambient",
    regions: [
      {
        id: "birds",
        name: "Birds",
        x: 20,
        y: 10,
        width: 30,
        height: 20,
        sound: "birds",
        description: "Gentle bird songs",
      },
      {
        id: "stream",
        name: "Stream",
        x: 60,
        y: 70,
        width: 35,
        height: 15,
        sound: "stream",
        description: "Flowing water",
      },
      { id: "wind", name: "Wind", x: 10, y: 40, width: 80, height: 30, sound: "wind", description: "Rustling leaves" },
    ],
  },
  {
    id: "beach",
    name: "Calm Beach",
    background: "bg-gradient-to-b from-blue-300 via-blue-400 to-blue-600",
    ambientSound: "ocean-ambient",
    regions: [
      { id: "waves", name: "Waves", x: 0, y: 60, width: 100, height: 40, sound: "waves", description: "Ocean waves" },
      {
        id: "seagulls",
        name: "Seagulls",
        x: 70,
        y: 20,
        width: 25,
        height: 15,
        sound: "seagulls",
        description: "Seagull calls",
      },
      {
        id: "breeze",
        name: "Breeze",
        x: 20,
        y: 30,
        width: 60,
        height: 25,
        sound: "breeze",
        description: "Ocean breeze",
      },
    ],
  },
  {
    id: "mountain",
    name: "Mountain Peak",
    background: "bg-gradient-to-b from-purple-300 via-purple-400 to-purple-600",
    ambientSound: "mountain-ambient",
    regions: [
      { id: "echo", name: "Echo", x: 30, y: 20, width: 40, height: 30, sound: "echo", description: "Mountain echo" },
      {
        id: "wind-mountain",
        name: "Wind",
        x: 10,
        y: 10,
        width: 80,
        height: 40,
        sound: "mountain-wind",
        description: "Mountain wind",
      },
    ],
  },
]

const moods = [
  { id: "relax", name: "Relax", scene: "forest" },
  { id: "energize", name: "Energize", scene: "beach" },
  { id: "focus", name: "Focus", scene: "mountain" },
]

interface SoundscapeExplorerProps {
  onClose: () => void
}

export function SoundscapeExplorer({ onClose }: SoundscapeExplorerProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [currentScene, setCurrentScene] = useState<Scene | null>(null)
  const [exploredRegions, setExploredRegions] = useState<Set<string>>(new Set())
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showJournal, setShowJournal] = useState(false)
  const [journalText, setJournalText] = useState("")
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (selectedMood) {
      const mood = moods.find((m) => m.id === selectedMood)
      if (mood) {
        const scene = scenes.find((s) => s.id === mood.scene)
        setCurrentScene(scene || null)
      }
    }
  }, [selectedMood])

  const handleRegionClick = (region: Region) => {
    setExploredRegions((prev) => new Set([...prev, region.id]))

    if (soundEnabled) {
      // In a real app, you would play the actual sound file
      console.log(`Playing sound: ${region.sound}`)
    }
  }

  const getProgress = () => {
    if (!currentScene) return 0
    return (exploredRegions.size / currentScene.regions.length) * 100
  }

  const isComplete = () => {
    return currentScene && exploredRegions.size === currentScene.regions.length
  }

  const handleJournalSubmit = () => {
    const entry = {
      scene: currentScene?.name,
      mood: selectedMood,
      text: journalText,
      timestamp: new Date().toISOString(),
    }

    const savedEntries = JSON.parse(localStorage.getItem("soundscapeJournal") || "[]")
    savedEntries.push(entry)
    localStorage.setItem("soundscapeJournal", JSON.stringify(savedEntries))

    setJournalText("")
    setShowJournal(false)
  }

  if (!selectedMood) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-br from-teal-100 via-blue-100 to-purple-100 z-50 flex items-center justify-center p-4 overflow-hidden"
      >
        <Card className="w-full max-w-xl bg-white/90 backdrop-blur-lg max-h-[90vh] overflow-y-auto">
          <CardContent className="p-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Soundscape Explorer</h2>
              <p className="text-gray-600">Choose your mood to begin your audio journey</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {moods.map((mood) => (
                <motion.div key={mood.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Card
                    className="cursor-pointer bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 transition-all duration-200"
                    onClick={() => setSelectedMood(mood.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-4">
                        {mood.id === "relax" && "🌲"}
                        {mood.id === "energize" && "🏖️"}
                        {mood.id === "focus" && "⛰️"}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">{mood.name}</h3>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button onClick={onClose} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (showJournal) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <Card className="w-full max-w-md bg-white">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4">Reflect & Journal</h3>
            <p className="text-gray-600 mb-4">How did this soundscape make you feel?</p>
            <textarea
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              className="w-full h-32 p-3 border rounded-lg resize-none"
              placeholder="Write your thoughts and feelings..."
            />
            <div className="flex gap-4 mt-4">
              <Button onClick={handleJournalSubmit} className="flex-1" disabled={!journalText.trim()}>
                Save Reflection
              </Button>
              <Button onClick={() => setShowJournal(false)} variant="outline" className="flex-1">
                Skip
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
      className={`fixed inset-0 ${currentScene?.background} z-50 overflow-hidden`}
    >
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="bg-white/90 backdrop-blur-lg rounded-lg p-3">
          <h2 className="text-xl font-bold text-gray-800">{currentScene?.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Progress value={getProgress()} className="w-32 h-2" />
            <span className="text-sm text-gray-600">
              {exploredRegions.size}/{currentScene?.regions.length}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setSoundEnabled(!soundEnabled)}
            variant="ghost"
            size="sm"
            className="bg-white/20 text-white hover:bg-white/30"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
          <Button onClick={onClose} variant="ghost" size="sm" className="bg-white/20 text-white hover:bg-white/30">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Scene */}
      <div className="relative w-full h-full">
        {currentScene?.regions.map((region) => (
          <motion.div
            key={region.id}
            className={`absolute cursor-pointer transition-all duration-200 ${
              exploredRegions.has(region.id)
                ? "bg-white/30 border-2 border-white/50"
                : "hover:bg-white/20 border-2 border-transparent hover:border-white/30"
            }`}
            style={{
              left: `${region.x}%`,
              top: `${region.y}%`,
              width: `${region.width}%`,
              height: `${region.height}%`,
            }}
            onClick={() => handleRegionClick(region)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/50 text-white px-2 py-1 rounded text-sm font-medium">{region.name}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 right-4">
        <Card className="bg-white/90 backdrop-blur-lg">
          <CardContent className="p-4 text-center">
            <p className="text-gray-800">
              {exploredRegions.size === 0
                ? "Click on different areas to explore sounds and collect calm points"
                : isComplete()
                  ? "🎉 You've explored everything! Ready to reflect?"
                  : `Keep exploring! ${currentScene?.regions.length - exploredRegions.size} areas remaining`}
            </p>
            {isComplete() && (
              <Button
                onClick={() => setShowJournal(true)}
                className="mt-3 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
              >
                Reflect & Journal
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
