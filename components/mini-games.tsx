"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wind, Target, Flower, MemoryStick, Palette, Play, Sparkles, Clock, BombIcon as Balloon } from "lucide-react"

// Import game components
import { BreathingGame } from "./games/breathing-game"
import { EmotionRecognitionGame } from "./games/emotion-recognition-game"
import { GratitudeGarden } from "./games/gratitude-garden"
import { MindfulMemory } from "./games/mindful-memory"
import { ZenDrawing } from "./games/zen-drawing"
import { LetItGoGame } from "./games/let-it-go-game"

interface Game {
  id: string
  title: string
  icon: any
  description: string
  category: string
  difficulty: "Easy" | "Medium" | "Hard"
  duration: string
  benefits: string[]
}

const games: Game[] = [
  {
    id: "breathe",
    title: "Breathe With Me",
    icon: Wind,
    description: "Guided breathing exercises with visual patterns",
    category: "Relaxation",
    difficulty: "Easy",
    duration: "2-10 min",
    benefits: ["Reduces anxiety", "Improves focus", "Calms mind"],
  },
  {
    id: "mood-match",
    title: "Mood Match",
    icon: Target,
    description: "Match emotions and learn healthy coping strategies",
    category: "Awareness",
    difficulty: "Medium",
    duration: "5-15 min",
    benefits: ["Emotional awareness", "Coping skills", "Self-reflection"],
  },
  {
    id: "gratitude-garden",
    title: "Gratitude Garden",
    icon: Flower,
    description: "Grow a beautiful garden with gratitude entries",
    category: "Positivity",
    difficulty: "Easy",
    duration: "3-10 min",
    benefits: ["Boosts mood", "Increases gratitude", "Positive thinking"],
  },
  {
    id: "mindful-memory",
    title: "Mindful Memory",
    icon: MemoryStick,
    description: "Memory game with mindfulness concepts",
    category: "Focus",
    difficulty: "Medium",
    duration: "5-15 min",
    benefits: ["Improves focus", "Memory training", "Mindfulness"],
  },
  {
    id: "zen-drawing",
    title: "Zen Sand Drawing",
    icon: Palette,
    description: "Create calming patterns in digital sand",
    category: "Creativity",
    difficulty: "Easy",
    duration: "5-20 min",
    benefits: ["Creativity", "Relaxation", "Artistic expression"],
  },
  {
    id: "let-it-go",
    title: "Let It Go",
    icon: Balloon,
    description: "Release worries and watch them float away",
    category: "Release",
    difficulty: "Easy",
    duration: "2-5 min",
    benefits: ["Stress relief", "Emotional release", "Peace of mind"],
  },
]

export function MiniGames() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>("All")

  const categories = ["All", "Relaxation", "Awareness", "Positivity", "Focus", "Creativity", "Release"]

  const filteredGames = filter === "All" ? games : games.filter((game) => game.category === filter)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderGame = () => {
    switch (selectedGame) {
      case "breathe":
        return <BreathingGame onClose={() => setSelectedGame(null)} />
      case "mood-match":
        return <EmotionRecognitionGame onClose={() => setSelectedGame(null)} />
      case "gratitude-garden":
        return <GratitudeGarden onClose={() => setSelectedGame(null)} />
      case "mindful-memory":
        return <MindfulMemory onClose={() => setSelectedGame(null)} />
      case "zen-drawing":
        return <ZenDrawing onClose={() => setSelectedGame(null)} />
      case "let-it-go":
        return <LetItGoGame onClose={() => setSelectedGame(null)} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-purple-500" />
          Wellness Mini Games
        </h2>
        <p className="text-gray-300 text-lg">Interactive activities to boost your mental wellness</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            onClick={() => setFilter(category)}
            variant={filter === category ? "default" : "outline"}
            size="sm"
            className={
              filter === category
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-white border-white/30 hover:bg-white/20"
            }
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game, index) => {
          const Icon = game.icon

          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/15 transition-all duration-300 h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{game.title}</CardTitle>
                        <p className="text-sm text-gray-300">{game.category}</p>
                      </div>
                    </div>
                    <Badge className={getDifficultyColor(game.difficulty)}>{game.difficulty}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-sm">{game.description}</p>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{game.duration}</span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Benefits:</p>
                    <div className="flex flex-wrap gap-1">
                      {game.benefits.map((benefit) => (
                        <Badge key={benefit} variant="outline" className="text-xs border-white/30 text-gray-300">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => setSelectedGame(game.id)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Play Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Game Modals */}
      <AnimatePresence>{selectedGame && renderGame()}</AnimatePresence>
    </div>
  )
}
