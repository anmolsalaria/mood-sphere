"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Target,
  CheckCircle,
  Clock,
  Flame,
  Award,
  Wind,
  Music,
  BookOpen,
  Dumbbell,
  Coffee,
  Palette,
  RotateCcw,
  TrendingUp,
  Play,
  Pause,
  Square,
} from "lucide-react"
import { useMood } from "@/contexts/mood-context"
import { MiniGames } from "@/components/mini-games"
import RequireAuth from "@/components/require-auth"

interface Activity {
  id: number
  title: string
  icon: typeof Wind | typeof BookOpen | typeof Dumbbell | typeof Coffee | typeof Palette | typeof Music
  duration: number
  completed: boolean
  streak: number
  category: string
  description: string
  benefits: string[]
  isActive: boolean
  timeRemaining: number
  isPaused: boolean
}

const initialActivities: Activity[] = [
  {
    id: 1,
    title: "Morning Meditation",
    icon: Wind,
    duration: 10,
    completed: false,
    streak: 0,
    category: "Mindfulness",
    description: "Start your day with peaceful meditation",
    benefits: ["Reduces stress", "Improves focus", "Increases awareness"],
    isActive: false,
    timeRemaining: 0,
    isPaused: false,
  },
  {
    id: 2,
    title: "Gratitude Journal",
    icon: BookOpen,
    duration: 5,
    completed: false,
    streak: 0,
    category: "Reflection",
    description: "Write down three things you're grateful for",
    benefits: ["Boosts mood", "Increases positivity", "Improves relationships"],
    isActive: false,
    timeRemaining: 0,
    isPaused: false,
  },
  {
    id: 3,
    title: "Exercise",
    icon: Dumbbell,
    duration: 30,
    completed: false,
    streak: 0,
    category: "Physical",
    description: "Get your body moving with any physical activity",
    benefits: ["Improves health", "Boosts energy", "Releases endorphins"],
    isActive: false,
    timeRemaining: 0,
    isPaused: false,
  },
  {
    id: 4,
    title: "Mindful Tea Break",
    icon: Coffee,
    duration: 15,
    completed: false,
    streak: 0,
    category: "Mindfulness",
    description: "Take a peaceful break with your favorite beverage",
    benefits: ["Reduces anxiety", "Promotes relaxation", "Mindful awareness"],
    isActive: false,
    timeRemaining: 0,
    isPaused: false,
  },
  {
    id: 5,
    title: "Creative Time",
    icon: Palette,
    duration: 20,
    completed: false,
    streak: 0,
    category: "Creativity",
    description: "Engage in any creative activity you enjoy",
    benefits: ["Boosts creativity", "Reduces stress", "Self-expression"],
    isActive: false,
    timeRemaining: 0,
    isPaused: false,
  },
  {
    id: 6,
    title: "Evening Reflection",
    icon: Music,
    duration: 10,
    completed: false,
    streak: 0,
    category: "Reflection",
    description: "Reflect on your day and set intentions",
    benefits: ["Improves self-awareness", "Better sleep", "Goal clarity"],
    isActive: false,
    timeRemaining: 0,
    isPaused: false,
  },
]

interface Stats {
  totalSessions: number
  totalTime: number
  currentStreak: number
  longestStreak: number
  completedToday: number
  badges: string[]
}

export default function SelfCarePage() {
  const { currentMood, getMoodBackground } = useMood()
  const [activities, setActivities] = useState<Activity[]>(initialActivities)
  const [stats, setStats] = useState<Stats>({
    totalSessions: 0,
    totalTime: 0,
    currentStreak: 0,
    longestStreak: 0,
    completedToday: 0,
    badges: [],
  })
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [showActivityDetail, setShowActivityDetail] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Icon mapping for deserialization
  const iconMap: Record<string, typeof Wind> = {
    Wind,
    BookOpen,
    Dumbbell,
    Coffee,
    Palette,
    Music,
  }

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedActivities = localStorage.getItem("selfCareActivities")
    const savedStats = localStorage.getItem("selfCareStats")
    const today = new Date().toDateString()
    const lastActiveDate = localStorage.getItem("lastSelfCareDate")

    if (savedActivities) {
      let parsedActivities = JSON.parse(savedActivities)
      // Re-attach icon components after deserialization
      parsedActivities = parsedActivities.map((activity: any) => ({
        ...activity,
        icon: iconMap[activity.icon?.name || activity.icon] || Wind,
      }))
      // Reset daily completion if it's a new day
      if (lastActiveDate !== today) {
        const resetActivities = parsedActivities.map((activity: Activity) => ({
          ...activity,
          completed: false,
          isActive: false,
          timeRemaining: 0,
          isPaused: false,
        }))
        setActivities(resetActivities)
        localStorage.setItem("selfCareActivities", JSON.stringify(resetActivities))
        localStorage.setItem("lastSelfCareDate", today)
      } else {
        setActivities(parsedActivities)
      }
    } else {
      localStorage.setItem("lastSelfCareDate", today)
    }

    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }
  }, [])

  // Save data to localStorage whenever activities or stats change
  useEffect(() => {
    localStorage.setItem("selfCareActivities", JSON.stringify(activities))
  }, [activities])

  useEffect(() => {
    localStorage.setItem("selfCareStats", JSON.stringify(stats))
  }, [stats])

  // Timer effect
  useEffect(() => {
    const activeActivity = activities.find((a) => a.isActive && !a.isPaused)

    if (activeActivity && activeActivity.timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setActivities((prev) =>
          prev.map((activity) => {
            if (activity.id === activeActivity.id && activity.isActive && !activity.isPaused) {
              const newTimeRemaining = activity.timeRemaining - 1

              if (newTimeRemaining <= 0) {
                // Activity completed
                const newActivity = {
                  ...activity,
                  completed: true,
                  isActive: false,
                  timeRemaining: 0,
                  isPaused: false,
                  streak: activity.streak + 1,
                }

                // Update stats
                setStats((prevStats) => ({
                  ...prevStats,
                  totalSessions: prevStats.totalSessions + 1,
                  totalTime: prevStats.totalTime + activity.duration,
                  completedToday: prevStats.completedToday + 1,
                  currentStreak: Math.max(prevStats.currentStreak, newActivity.streak),
                  longestStreak: Math.max(prevStats.longestStreak, newActivity.streak),
                  badges: updateBadges(prevStats, newActivity),
                }))

                return newActivity
              }

              return { ...activity, timeRemaining: newTimeRemaining }
            }
            return activity
          }),
        )
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [activities])

  const completedToday = activities.filter((a) => a.completed).length
  const totalActivities = activities.length
  const progressPercentage = (completedToday / totalActivities) * 100

  const startActivity = (id: number) => {
    setActivities((prev) =>
      prev.map((activity) => {
        if (activity.id === id) {
          return {
            ...activity,
            isActive: true,
            timeRemaining: activity.duration * 60, // Convert minutes to seconds
            isPaused: false,
          }
        }
        // Stop other activities
        return {
          ...activity,
          isActive: false,
          isPaused: false,
        }
      }),
    )
  }

  const pauseActivity = (id: number) => {
    setActivities((prev) =>
      prev.map((activity) => {
        if (activity.id === id) {
          return { ...activity, isPaused: !activity.isPaused }
        }
        return activity
      }),
    )
  }

  const stopActivity = (id: number) => {
    setActivities((prev) =>
      prev.map((activity) => {
        if (activity.id === id) {
          return {
            ...activity,
            isActive: false,
            timeRemaining: 0,
            isPaused: false,
          }
        }
        return activity
      }),
    )
  }

  const updateBadges = (currentStats: Stats, activity: Activity): string[] => {
    const newBadges = [...currentStats.badges]

    // Streak badges
    if (activity.streak === 7 && !newBadges.includes("Week Warrior")) {
      newBadges.push("Week Warrior")
    }
    if (activity.streak === 30 && !newBadges.includes("Month Master")) {
      newBadges.push("Month Master")
    }

    // Category badges
    if (activity.category === "Mindfulness" && !newBadges.includes("Meditation Master")) {
      newBadges.push("Meditation Master")
    }
    if (activity.category === "Reflection" && !newBadges.includes("Journal Keeper")) {
      newBadges.push("Journal Keeper")
    }
    if (activity.category === "Physical" && !newBadges.includes("Fitness Enthusiast")) {
      newBadges.push("Fitness Enthusiast")
    }

    // Total session badges
    if (currentStats.totalSessions >= 50 && !newBadges.includes("Dedication Champion")) {
      newBadges.push("Dedication Champion")
    }

    return newBadges
  }

  const resetProgress = () => {
    if (confirm("Are you sure you want to reset all progress? This action cannot be undone.")) {
      // Clear any active timers
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      setActivities(initialActivities)
      setStats({
        totalSessions: 0,
        totalTime: 0,
        currentStreak: 0,
        longestStreak: 0,
        completedToday: 0,
        badges: [],
      })
      localStorage.removeItem("selfCareActivities")
      localStorage.removeItem("selfCareStats")
      localStorage.removeItem("lastSelfCareDate")
      alert("Progress reset successfully!")
    }
  }

  const showActivityDetails = (activity: Activity) => {
    setSelectedActivity(activity)
    setShowActivityDetail(true)
  }

  const getBadgeEmoji = (badge: string) => {
    const badgeEmojis: { [key: string]: string } = {
      "Week Warrior": "🏆",
      "Month Master": "👑",
      "Meditation Master": "🧘",
      "Journal Keeper": "📝",
      "Fitness Enthusiast": "💪",
      "Dedication Champion": "🌟",
    }
    return badgeEmojis[badge] || "🎖️"
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <RequireAuth>
      <div className={`min-h-screen bg-gradient-to-br ${getMoodBackground(currentMood)} text-[#222] overflow-x-hidden`}>
        <div className="container mx-auto px-6 py-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-4 flex items-center">
                  <Target className="w-10 h-10 mr-4 text-purple-400" />
                  Self-Care Arena
                </h1>
                <p className="text-black text-lg">Your personalized wellness journey</p>
              </div>
              <Button
                onClick={resetProgress}
                variant="outline"
                className="text-black border-black bg-transparent hover:bg-white/10"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Progress
              </Button>
            </div>
          </motion.div>

          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border-white/20 text-white">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Today's Progress</h2>
                    <p className="text-gray-300">Keep up the great work!</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-purple-400">
                      {completedToday}/{totalActivities}
                    </div>
                    <div className="text-gray-300">Activities</div>
                  </div>
                </div>

                <Progress value={progressPercentage} className="h-3 mb-4" />

                <div className="flex justify-between text-sm text-gray-300">
                  <span>{Math.round(progressPercentage)}% Complete</span>
                  <span>{totalActivities - completedToday} remaining</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Flame className="w-12 h-12 mx-auto mb-4 text-orange-400" />
                <h3 className="text-2xl font-bold mb-2">{stats.currentStreak}</h3>
                <p className="text-gray-300">Current Streak</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
                <h3 className="text-2xl font-bold mb-2">{stats.badges.length}</h3>
                <p className="text-gray-300">Badges Earned</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Clock className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                <h3 className="text-2xl font-bold mb-2">{Math.floor(stats.totalTime / 60)}h</h3>
                <p className="text-gray-300">Total Time</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-400" />
                <h3 className="text-2xl font-bold mb-2">{stats.totalSessions}</h3>
                <p className="text-gray-300">Total Sessions</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Activities List */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-2xl font-bold mb-6">Daily Activities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activities.map((activity, index) => {
                const Icon = activity.icon

                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`bg-gradient-to-r from-purple-800/40 to-pink-800/40 backdrop-blur-lg border-white/20 text-white transition-all duration-300 cursor-pointer ${
                        activity.completed
                          ? "bg-green-500/20 border-green-500/30"
                          : activity.isActive
                            ? "bg-blue-500/20 border-blue-500/30"
                            : "bg-white/10 hover:bg-white/15"
                      }`}
                      onClick={() => showActivityDetails(activity)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`p-3 rounded-full ${
                                activity.completed ? "bg-green-500" : activity.isActive ? "bg-blue-500" : "bg-purple-500"
                              }`}
                            >
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">{activity.title}</h3>
                              <p className="text-gray-300 text-sm">{activity.duration} minutes</p>
                              <Badge variant="outline" className="mt-1 text-xs border-white/30 text-gray-300">
                                {activity.category}
                              </Badge>
                            </div>
                          </div>

                          {activity.completed && <CheckCircle className="w-6 h-6 text-green-400" />}
                        </div>

                        {/* Timer Display */}
                        {activity.isActive && activity.timeRemaining > 0 && (
                          <div className="mb-4 p-3 bg-blue-500/20 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-blue-300 font-mono text-lg">
                                {formatTime(activity.timeRemaining)}
                              </span>
                              <div className="flex space-x-2">
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    pauseActivity(activity.id)
                                  }}
                                  size="sm"
                                  variant="outline"
                                  className="border-blue-400 text-blue-400 hover:bg-blue-500/20"
                                >
                                  {activity.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                                </Button>
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    stopActivity(activity.id)
                                  }}
                                  size="sm"
                                  variant="outline"
                                  className="border-red-400 text-red-400 hover:bg-red-500/20"
                                >
                                  <Square className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <Progress
                              value={((activity.duration * 60 - activity.timeRemaining) / (activity.duration * 60)) * 100}
                              className="h-2 mt-2"
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Flame className="w-4 h-4 text-orange-400" />
                            <span className="text-sm text-gray-300">{activity.streak} day streak</span>
                          </div>

                          {!activity.completed && !activity.isActive && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation()
                                startActivity(activity.id)
                              }}
                              size="sm"
                              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Start
                            </Button>
                          )}

                          {activity.completed && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>
                          )}

                          {activity.isActive && (
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                              {activity.isPaused ? "Paused" : "Active"}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Achievement Badges */}
          {stats.badges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12"
            >
              <h2 className="text-2xl font-bold mb-6">Your Achievements</h2>
              <div className="flex flex-wrap gap-4">
                {stats.badges.map((badge, index) => (
                  <Badge
                    key={index}
                    className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 px-4 py-2 text-base"
                  >
                    {getBadgeEmoji(badge)} {badge}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}

          {/* Mini Games Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border-white/20 text-white">
              <CardContent className="p-6">
                <MiniGames />
              </CardContent>
            </Card>
          </motion.div>

          {/* Activity Detail Modal */}
          {showActivityDetail && selectedActivity && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="bg-gray-900 max-w-md w-full border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 rounded-full bg-purple-500">
                        <selectedActivity.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{selectedActivity.title}</h3>
                        <p className="text-gray-400">{selectedActivity.duration} minutes</p>
                      </div>
                    </div>
                    <Button onClick={() => setShowActivityDetail(false)} variant="ghost" size="sm" className="text-white">
                      ×
                    </Button>
                  </div>

                  <div className="space-y-4 text-white">
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-gray-300">{selectedActivity.description}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Benefits</h4>
                      <ul className="list-disc list-inside text-gray-300 space-y-1">
                        {selectedActivity.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/20">
                      <div className="flex items-center space-x-2">
                        <Flame className="w-4 h-4 text-orange-400" />
                        <span className="text-sm text-gray-300">{selectedActivity.streak} day streak</span>
                      </div>

                      {!selectedActivity.completed && !selectedActivity.isActive && (
                        <Button
                          onClick={() => {
                            startActivity(selectedActivity.id)
                            setShowActivityDetail(false)
                          }}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Activity
                        </Button>
                      )}

                      {selectedActivity.completed && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed Today</Badge>
                      )}

                      {selectedActivity.isActive && (
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Currently Active</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </RequireAuth>
  )
}
