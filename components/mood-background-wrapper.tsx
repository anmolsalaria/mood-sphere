"use client"

import React from "react"
import { useMood } from "@/contexts/mood-context"

export function MoodBackgroundWrapper({ children }: { children: React.ReactNode }) {
  const { currentMood, getMoodBackground } = useMood()
  return (
    <div className={`min-h-screen bg-gradient-to-br ${getMoodBackground(currentMood)} transition-colors duration-500 relative text-black`}>
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none z-0" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
} 