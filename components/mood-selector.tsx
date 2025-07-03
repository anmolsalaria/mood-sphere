"use client"

import { motion } from "framer-motion"
import { useState, useEffect, useMemo } from "react"
import type { MoodType } from "@/contexts/mood-context"

const moods = [
  { id: "happy", emoji: "😊", label: "Happy", color: "#FFD700" },
  { id: "calm", emoji: "😌", label: "Calm", color: "#87CEEB" },
  { id: "neutral", emoji: "😐", label: "Neutral", color: "#98FB98" },
  { id: "anxious", emoji: "😰", label: "Anxious", color: "#FF6B6B" },
  { id: "stressed", emoji: "😤", label: "Stressed", color: "#FF4500" },
  { id: "sad", emoji: "😢", label: "Sad", color: "#4169E1" },
]

// Video-like animated emoji component
function VideoEmoji({
  emoji,
  color,
  isActive,
  isHovered,
}: { emoji: string; color: string; isActive: boolean; isHovered: boolean }) {
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => { setHasMounted(true) }, [])

  // Memoize random values for sparkles and lightning
  const sparkles = useMemo(() =>
    Array.from({ length: 8 }, () => ({
      left: 30 + Math.random() * 40,
      top: 30 + Math.random() * 40,
      x: Math.random() * 60 - 30,
      y: Math.random() * 60 - 30,
      duration: 2 + Math.random(),
      delay: Math.random() * 2,
    })),
    []
  )
  const lightnings = useMemo(() =>
    Array.from({ length: 6 }, () => ({
      left: 20 + Math.random() * 60,
      top: 10 + Math.random() * 80,
      rotate: Math.random() * 30 - 15,
    })),
    []
  )

  if (!hasMounted) return (
    <div className="text-6xl mb-2 relative" style={{ filter: `drop-shadow(0 4px 8px ${color}40) drop-shadow(0 0 12px ${color}20)`, textShadow: `2px 2px 4px rgba(0,0,0,0.1), 0 0 8px ${color}60, 0 0 16px ${color}40, 0 0 24px ${color}20` }}>{emoji}</div>
  )

  return (
    <motion.div
      className="text-6xl mb-2 relative"
      style={{
        filter: `drop-shadow(0 4px 8px ${color}40) drop-shadow(0 0 12px ${color}20)`,
        textShadow: `2px 2px 4px rgba(0,0,0,0.1), 0 0 8px ${color}60, 0 0 16px ${color}40, 0 0 24px ${color}20`,
      }}
      animate={{
        rotateY: [0, 5, -5, 0],
        rotateX: [0, 2, -2, 0],
        scale: isActive ? [1.1, 1.15, 1.1] : [1, 1.05, 1],
        y: [0, -8, 0],
        rotateZ: [0, 1, -1, 0],
        scaleX: [1, 1.02, 1],
        scaleY: [1, 0.98, 1],
      }}
      transition={{
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        rotateY: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
        y: { duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
        rotateZ: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
        scaleX: { duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
        scaleY: { duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
      }}
    >
      {emoji}

      {/* Animated glow rings */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`, filter: "blur(10px)" }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3], rotate: [0, 180, 360] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      {/* Pulsing outer ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2"
        style={{ borderColor: color, borderWidth: isActive ? "3px" : "1px" }}
        animate={{ scale: [1, 1.2, 1.4, 1], opacity: [0.8, 0.4, 0, 0.8] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }}
      />

      {/* Floating energy particles */}
      {isActive && (
        <>
          {sparkles.map((s, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{ background: color, left: `${s.left}%`, top: `${s.top}%` }}
              animate={{ x: [0, s.x], y: [0, s.y], opacity: [0, 1, 0], scale: [0, 1.5, 0], rotate: [0, 360] }}
              transition={{ duration: s.duration, repeat: Number.POSITIVE_INFINITY, delay: s.delay, ease: "easeInOut" }}
            />
          ))}
        </>
      )}

      {/* Lightning effect on hover */}
      {isHovered && (
        <>
          {lightnings.map((l, i) => (
            <motion.div
              key={`lightning-${i}`}
              className="absolute w-0.5 h-8"
              style={{ background: `linear-gradient(to bottom, ${color}, transparent)`, left: `${l.left}%`, top: `${l.top}%`, transformOrigin: "bottom" }}
              animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, l.rotate] }}
              transition={{ duration: 0.3, delay: i * 0.1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
            />
          ))}
        </>
      )}

      {/* Morphing background effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: `conic-gradient(from 0deg, ${color}20, transparent, ${color}20)`, filter: "blur(15px)" }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
    </motion.div>
  )
}

interface MoodSelectorProps {
  currentMood: MoodType
  onMoodChange: (mood: MoodType) => void
}

export function MoodSelector({ currentMood, onMoodChange }: MoodSelectorProps) {
  const [hoveredMood, setHoveredMood] = useState<MoodType | null>(null)
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => { setHasMounted(true) }, [])

  // Memoize sparkle positions for each mood
  const sparkleMap = useMemo(() => {
    const map: Record<string, { left: number; top: number }[]> = {}
    moods.forEach((mood) => {
      map[mood.id] = Array.from({ length: 6 }, () => ({
        left: 10 + Math.random() * 80,
        top: 10 + Math.random() * 80,
      }))
    })
    return map
  }, [])

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {moods.map((mood, index) => (
          <motion.button
            key={mood.id}
            className={`relative p-6 rounded-2xl backdrop-blur-lg border transition-all duration-300 ${
              currentMood === mood.id
                ? "bg-white/70 border-white/60 scale-105 shadow-xl"
                : "bg-white/40 border-white/30 hover:bg-white/50 shadow-lg"
            }`}
            onClick={() => onMoodChange(mood.id as MoodType)}
            onHoverStart={() => setHoveredMood(mood.id as MoodType)}
            onHoverEnd={() => setHoveredMood(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              boxShadow: currentMood === mood.id ? `0 0 30px ${mood.color}40` : "none",
            }}
            initial={{ opacity: 0, y: 50, rotateY: -15 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            {/* Video-like Emoji */}
            <VideoEmoji
              emoji={mood.emoji}
              color={mood.color}
              isActive={currentMood === mood.id}
              isHovered={hoveredMood === mood.id}
            />

            <motion.div
              className="text-slate-800 font-medium text-lg"
              animate={{
                y: currentMood === mood.id ? [0, -2, 0] : 0,
                color: currentMood === mood.id ? [mood.color, "#1e293b", mood.color] : "#1e293b",
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              {mood.label}
            </motion.div>

            {currentMood === mood.id && (
              <motion.div
                className="absolute inset-0 rounded-2xl border-2"
                style={{ borderColor: mood.color }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: [1, 0.5, 1],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            )}

            {/* Dynamic sparkle effects */}
            {hasMounted && (hoveredMood === mood.id || currentMood === mood.id) && (
              <>
                {sparkleMap[mood.id].map((sparkle, i) => (
                  <motion.div
                    key={`sparkle-${i}`}
                    className="absolute w-2 h-2"
                    style={{
                      background: mood.color,
                      left: `${sparkle.left}%`,
                      top: `${sparkle.top}%`,
                      clipPath:
                        "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                    }}
                    animate={{
                      scale: [0, 1.5, 0],
                      rotate: [0, 180, 360],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.3,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                ))}
              </>
            )}
          </motion.button>
        ))}
      </div>

      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-slate-600 mb-2">Current mood:</p>
        <motion.p
          className="text-2xl font-bold text-slate-800"
          animate={{
            scale: [1, 1.05, 1],
            color: ["#1e293b", moods.find((m) => m.id === currentMood)?.color || "#1e293b", "#1e293b"],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          {moods.find((m) => m.id === currentMood)?.label}
        </motion.p>
      </motion.div>
    </div>
  )
}
