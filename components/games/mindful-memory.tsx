"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, RotateCcw } from "lucide-react"

interface MemoryCard {
  id: string
  word: string
  isFlipped: boolean
  isMatched: boolean
}

const mindfulWords = [
  "Peace",
  "Calm",
  "Hope",
  "Love",
  "Joy",
  "Strength",
  "Patience",
  "Kindness",
  "Gratitude",
  "Courage",
  "Wisdom",
  "Serenity",
]

interface MindfulMemoryProps {
  onClose: () => void
}

export function MindfulMemory({ onClose }: MindfulMemoryProps) {
  const [cards, setCards] = useState<MemoryCard[]>([])
  const [flippedCards, setFlippedCards] = useState<string[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [gameTime, setGameTime] = useState(0)

  useEffect(() => {
    initializeGame()
  }, [])

  useEffect(() => {
    if (!gameComplete) {
      const timer = setInterval(() => {
        setGameTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [startTime, gameComplete])

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards
      const firstCard = cards.find((card) => card.id === first)
      const secondCard = cards.find((card) => card.id === second)

      if (firstCard && secondCard && firstCard.word === secondCard.word) {
        // Match found
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) => (card.id === first || card.id === second ? { ...card, isMatched: true } : card)),
          )
          setMatches((prev) => prev + 1)
          setFlippedCards([])

          if (matches + 1 === 6) {
            // 6 pairs = 12 cards
            setGameComplete(true)
            saveBestScore()
          }
        }, 600)
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) => (card.id === first || card.id === second ? { ...card, isFlipped: false } : card)),
          )
          setFlippedCards([])
        }, 600)
      }
      setMoves((prev) => prev + 1)
    }
  }, [flippedCards, cards, matches])

  const initializeGame = () => {
    const selectedWords = mindfulWords.slice(0, 6) // Use 6 pairs (12 cards)
    const cardPairs = [...selectedWords, ...selectedWords]
    const shuffledCards = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((word, index) => ({
        id: `${word}-${index}`,
        word,
        isFlipped: false,
        isMatched: false,
      }))

    setCards(shuffledCards)
    setFlippedCards([])
    setMoves(0)
    setMatches(0)
    setGameComplete(false)
    setStartTime(Date.now())
    setGameTime(0)
  }

  const handleCardClick = (cardId: string) => {
    if (flippedCards.length === 2) return

    const card = cards.find((c) => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched) return

    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c)))
    setFlippedCards((prev) => [...prev, cardId])
  }

  const saveBestScore = () => {
    const currentScore = { moves, time: gameTime }
    const savedScores = JSON.parse(localStorage.getItem("mindfulMemoryScores") || "[]")
    savedScores.push(currentScore)
    savedScores.sort((a: any, b: any) => a.moves - b.moves || a.time - b.time)
    localStorage.setItem("mindfulMemoryScores", JSON.stringify(savedScores.slice(0, 10)))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-4 h-[95vh] bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 rounded-lg shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">Mindful Memory</h2>
            <div className="flex gap-4 text-gray-300">
              <span>Moves: {moves}</span>
              <span>Matches: {matches}/6</span>
              <span>Time: {formatTime(gameTime)}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={initializeGame}
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

        {/* Game Board */}
        <div className="flex items-center justify-center h-full p-4 pt-20">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl">
            {cards.map((card) => (
              <motion.div key={card.id}>
                <Card
                  className={`w-24 h-24 sm:w-32 sm:h-32 cursor-pointer transition-all duration-200 ${
                    card.isMatched
                      ? "bg-green-900/50 border-green-400"
                      : card.isFlipped
                        ? "bg-blue-900/50 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border-white/20"
                  }`}
                  onClick={() => handleCardClick(card.id)}
                >
                  <CardContent className="p-0 h-full flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {card.isFlipped || card.isMatched ? (
                        <motion.div
                          key="front"
                          initial={{ rotateY: -90 }}
                          animate={{ rotateY: 0 }}
                          exit={{ rotateY: 90 }}
                          transition={{ duration: 0.2 }}
                          className="text-center"
                        >
                          <div className="text-3xl sm:text-4xl mb-1">
                            {card.word === "Peace" && "☮️"}
                            {card.word === "Calm" && "🧘"}
                            {card.word === "Hope" && "🌟"}
                            {card.word === "Love" && "💖"}
                            {card.word === "Joy" && "😊"}
                            {card.word === "Strength" && "💪"}
                            {card.word === "Patience" && "⏳"}
                            {card.word === "Kindness" && "🤗"}
                            {card.word === "Gratitude" && "🙏"}
                            {card.word === "Courage" && "🦁"}
                            {card.word === "Wisdom" && "🦉"}
                            {card.word === "Serenity" && "🕊️"}
                          </div>
                          <p className="text-xs sm:text-sm font-medium text-white">{card.word}</p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="back"
                          initial={{ rotateY: -90 }}
                          animate={{ rotateY: 0 }}
                          exit={{ rotateY: 90 }}
                          transition={{ duration: 0.2 }}
                          className="text-5xl sm:text-6xl text-gray-400"
                        >
                          🧠
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Game Complete Modal */}
        <AnimatePresence>
          {gameComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 flex items-center justify-center bg-black/50 z-20"
            >
              <Card className="bg-gray-900 max-w-sm mx-4 border-white/20">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-3xl font-bold mb-4 text-white">Congratulations!</h3>
                  <div className="space-y-3 mb-6">
                    <p className="text-xl text-green-400 font-semibold">You did it!</p>
                    <p className="text-gray-300">
                      Completed in <span className="font-bold text-white">{moves}</span> moves
                    </p>
                    <p className="text-gray-300">
                      Time: <span className="font-bold text-white">{formatTime(gameTime)}</span>
                    </p>
                    <p className="text-sm text-gray-400 italic mt-4">
                      "A calm mind brings inner strength and self-confidence."
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Button onClick={initializeGame} className="flex-1">
                      Play Again
                    </Button>
                    <Button
                      onClick={onClose}
                      variant="outline"
                      className="flex-1 text-white border-white/30 bg-transparent hover:bg-white/10"
                    >
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
