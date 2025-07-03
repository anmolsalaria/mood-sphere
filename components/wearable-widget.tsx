"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Heart, Activity, Watch } from "lucide-react"

interface WearableWidgetProps {
  heartRate: number
  stressLevel: number
}

export function WearableWidget({ heartRate, stressLevel }: WearableWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)

  const getStressColor = (level: number) => {
    if (level < 30) return "text-green-600"
    if (level < 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getStressLabel = (level: number) => {
    if (level < 30) return "Low"
    if (level < 60) return "Moderate"
    return "High"
  }

  return (
    <motion.div
      className="fixed bottom-24 lg:bottom-6 left-6 z-40"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
    >
      {/* Small Watch Button - Always Visible */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-blue-600/80 hover:bg-blue-700/90 backdrop-blur-lg rounded-full shadow-lg transition-colors border border-white/30"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Watch className="w-6 h-6 text-white mx-auto" />
      </motion.button>

      {/* Expandable Widget Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-16 left-0 bg-white/80 backdrop-blur-xl border border-white/50 text-slate-800 w-64 rounded-lg shadow-xl p-4"
          >
            <div className="flex items-center mb-3">
              <span className="font-semibold">Wearable Sync</span>
              <Badge className="ml-auto bg-green-500/20 text-green-600 border-green-500/30">Connected</Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-red-500" />
                  <span className="text-sm">Heart Rate</span>
                </div>
                <motion.span
                  className="font-bold text-red-500"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                >
                  {Math.round(heartRate)} BPM
                </motion.span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-orange-500" />
                  <span className="text-sm">Stress Level</span>
                </div>
                <span className={`font-bold ${getStressColor(stressLevel)}`}>{getStressLabel(stressLevel)}</span>
              </div>

              <div className="w-full bg-gray-300 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${stressLevel}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
