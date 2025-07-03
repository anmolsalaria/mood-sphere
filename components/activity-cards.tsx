"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wind, Music, BookOpen, Dumbbell, Coffee, Palette, Heart, Zap } from "lucide-react"

const activities = {
  happy: [
    {
      icon: Music,
      title: "Upbeat Playlist",
      description: "Dance to your favorite energetic songs",
      duration: "15 min",
      color: "bg-yellow-500",
    },
    {
      icon: Dumbbell,
      title: "Power Workout",
      description: "Channel your energy into exercise",
      duration: "30 min",
      color: "bg-orange-500",
    },
    {
      icon: Palette,
      title: "Creative Expression",
      description: "Paint or draw your current feelings",
      duration: "20 min",
      color: "bg-pink-500",
    },
  ],
  calm: [
    {
      icon: Wind,
      title: "Breathing Exercise",
      description: "Deep breathing for relaxation",
      duration: "10 min",
      color: "bg-blue-500",
    },
    {
      icon: BookOpen,
      title: "Mindful Reading",
      description: "Read something inspiring",
      duration: "25 min",
      color: "bg-green-500",
    },
    {
      icon: Coffee,
      title: "Tea Meditation",
      description: "Mindful tea drinking ritual",
      duration: "15 min",
      color: "bg-teal-500",
    },
  ],
  anxious: [
    {
      icon: Wind,
      title: "4-7-8 Breathing",
      description: "Calming breath technique",
      duration: "5 min",
      color: "bg-blue-500",
    },
    {
      icon: Heart,
      title: "Grounding Exercise",
      description: "5-4-3-2-1 sensory technique",
      duration: "10 min",
      color: "bg-purple-500",
    },
    {
      icon: Music,
      title: "Calming Sounds",
      description: "Nature sounds and ambient music",
      duration: "20 min",
      color: "bg-indigo-500",
    },
  ],
  stressed: [
    {
      icon: Zap,
      title: "Quick Meditation",
      description: "Short stress-relief session",
      duration: "8 min",
      color: "bg-red-500",
    },
    {
      icon: Dumbbell,
      title: "Stress Release",
      description: "Physical activity to release tension",
      duration: "15 min",
      color: "bg-orange-500",
    },
    {
      icon: Wind,
      title: "Progressive Relaxation",
      description: "Muscle tension release",
      duration: "12 min",
      color: "bg-blue-500",
    },
  ],
  neutral: [
    {
      icon: BookOpen,
      title: "Journaling",
      description: "Reflect on your thoughts",
      duration: "15 min",
      color: "bg-gray-500",
    },
    {
      icon: Music,
      title: "Mood Playlist",
      description: "Curated songs for reflection",
      duration: "20 min",
      color: "bg-purple-500",
    },
    {
      icon: Coffee,
      title: "Mindful Moment",
      description: "Present moment awareness",
      duration: "10 min",
      color: "bg-green-500",
    },
  ],
  sad: [
    {
      icon: Heart,
      title: "Self-Compassion",
      description: "Gentle self-care practice",
      duration: "12 min",
      color: "bg-pink-500",
    },
    {
      icon: Music,
      title: "Comfort Playlist",
      description: "Soothing and uplifting music",
      duration: "25 min",
      color: "bg-blue-500",
    },
    {
      icon: BookOpen,
      title: "Gratitude Journal",
      description: "Write three things you're grateful for",
      duration: "10 min",
      color: "bg-yellow-500",
    },
  ],
}

interface ActivityCardsProps {
  mood: string
}

export function ActivityCards({ mood }: ActivityCardsProps) {
  const currentActivities = activities[mood as keyof typeof activities] || activities.neutral

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {currentActivities.map((activity, index) => {
        const Icon = activity.icon

        return (
          <motion.div
            key={activity.title}
            initial={{ opacity: 0, y: 50, rotateY: -15 }}
            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{
              scale: 1.05,
              rotateY: 5,
              transition: { duration: 0.3 },
            }}
            className="perspective-1000"
          >
            <Card className="bg-white/60 backdrop-blur-lg border-white/40 text-slate-800 h-full overflow-hidden group shadow-lg">
              <CardContent className="p-6 h-full flex flex-col">
                <div
                  className={`w-12 h-12 rounded-full ${activity.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-bold mb-2 text-slate-800">{activity.title}</h3>
                <p className="text-slate-600 mb-4 flex-1">{activity.description}</p>

                <div className="flex items-center justify-center">
                  <Badge variant="secondary" className="bg-slate-200 text-slate-700">
                    {activity.duration}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
