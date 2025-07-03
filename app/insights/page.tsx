"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  TrendingUp,
  Brain,
  Heart,
  Target,
  Award,
  Clock,
  Calendar,
  Zap,
  Smile,
  RefreshCw,
} from "lucide-react"
import { useMood } from "@/contexts/mood-context"
import { useEffect, useState } from "react"

interface JournalEntry {
  id: string
  mood: string
  content: string
  date: string
  timestamp: number
}

interface ActivityProgress {
  [key: string]: {
    completed: boolean
    streak: number
    totalSessions: number
    totalTime: number
    lastCompleted?: string
  }
}

interface InsightData {
  totalEntries: number
  weeklyEntries: number
  currentStreak: number
  longestStreak: number
  moodDistribution: { [key: string]: number }
  weeklyMoodData: Array<{
    day: string
    happy: number
    calm: number
    anxious: number
    stressed: number
    sad: number
    neutral: number
  }>
  activityStats: ActivityProgress
  totalActivities: number
  completedToday: number
  averageSessionTime: number
}

const moodColors = {
  happy: "#FCD34D",
  calm: "#60A5FA",
  anxious: "#F87171",
  stressed: "#FB923C",
  sad: "#A78BFA",
  neutral: "#9CA3AF",
}

const moodEmojis = {
  happy: "😊",
  calm: "😌",
  anxious: "😰",
  stressed: "😤",
  sad: "😢",
  neutral: "😐",
}

export default function InsightsPage() {
  const { currentMood, getMoodBackground } = useMood()
  const [insightData, setInsightData] = useState<InsightData>({
    totalEntries: 0,
    weeklyEntries: 0,
    currentStreak: 0,
    longestStreak: 0,
    moodDistribution: {},
    weeklyMoodData: [],
    activityStats: {},
    totalActivities: 0,
    completedToday: 0,
    averageSessionTime: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  const loadInsightData = () => {
    setIsLoading(true)

    // Load journal data
    const journalEntries: JournalEntry[] = JSON.parse(localStorage.getItem("moodJournalEntries") || "[]")

    // Load activity data
    const activityProgress: ActivityProgress = JSON.parse(localStorage.getItem("selfCareProgress") || "{}")

    // Calculate journal insights
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const weeklyEntries = journalEntries.filter((entry) => new Date(entry.date) >= oneWeekAgo).length

    // Calculate mood distribution
    const moodDistribution: { [key: string]: number } = {}
    journalEntries.forEach((entry) => {
      moodDistribution[entry.mood] = (moodDistribution[entry.mood] || 0) + 1
    })

    // Calculate streak
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0

    const sortedEntries = journalEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const uniqueDates = [...new Set(sortedEntries.map((entry) => entry.date.split("T")[0]))]

    for (let i = 0; i < uniqueDates.length; i++) {
      const currentDate = new Date(uniqueDates[i])
      const expectedDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)

      if (currentDate.toDateString() === expectedDate.toDateString()) {
        tempStreak++
        if (i === 0) currentStreak = tempStreak
      } else {
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 0
        break
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak)

    // Generate weekly mood data
    const weeklyMoodData = []
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dayEntries = journalEntries.filter((entry) => new Date(entry.date).toDateString() === date.toDateString())

      const dayMoods = { happy: 0, calm: 0, anxious: 0, stressed: 0, sad: 0, neutral: 0 }
      dayEntries.forEach((entry) => {
        if (dayMoods.hasOwnProperty(entry.mood)) {
          dayMoods[entry.mood as keyof typeof dayMoods]++
        }
      })

      weeklyMoodData.push({
        day: days[date.getDay()],
        ...dayMoods,
      })
    }

    // Calculate activity insights
    const totalActivities = Object.keys(activityProgress).length
    const completedToday = Object.values(activityProgress).filter(
      (activity) => activity.completed && activity.lastCompleted === new Date().toDateString(),
    ).length

    const totalTime = Object.values(activityProgress).reduce((sum, activity) => sum + (activity.totalTime || 0), 0)
    const totalSessions = Object.values(activityProgress).reduce(
      (sum, activity) => sum + (activity.totalSessions || 0),
      0,
    )
    const averageSessionTime = totalSessions > 0 ? Math.round(totalTime / totalSessions) : 0

    setInsightData({
      totalEntries: journalEntries.length,
      weeklyEntries,
      currentStreak,
      longestStreak,
      moodDistribution,
      weeklyMoodData,
      activityStats: activityProgress,
      totalActivities,
      completedToday,
      averageSessionTime,
    })

    setIsLoading(false)
  }

  useEffect(() => {
    loadInsightData()
  }, [])

  const getMostCommonMood = () => {
    const moods = Object.entries(insightData.moodDistribution)
    if (moods.length === 0) return "neutral"
    return moods.reduce((a, b) => (a[1] > b[1] ? a : b))[0]
  }

  const getImprovementPercentage = () => {
    const positiveCount = (insightData.moodDistribution.happy || 0) + (insightData.moodDistribution.calm || 0)
    const totalCount = Object.values(insightData.moodDistribution).reduce((sum, count) => sum + count, 0)
    return totalCount > 0 ? Math.round((positiveCount / totalCount) * 100) : 0
  }

  const getActivityStreak = () => {
    const streaks = Object.values(insightData.activityStats).map((activity) => activity.streak || 0)
    return streaks.length > 0 ? Math.max(...streaks) : 0
  }

  if (isLoading) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${getMoodBackground(currentMood)} text-white flex items-center justify-center`}
      >
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-400" />
          <p className="text-lg">Loading your insights...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getMoodBackground(currentMood)} text-white overflow-x-hidden`}>
      <div className="container mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4 flex items-center">
                <BarChart3 className="w-10 h-10 mr-4 text-purple-400" />
                Insights & Analytics
              </h1>
              <p className="text-gray-300 text-lg">Track your mental wellness journey with personalized insights</p>
            </div>
            <Button
              onClick={loadInsightData}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg border-emerald-400/40 text-white shadow-lg shadow-emerald-500/20">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-emerald-400" />
              <h3 className="text-2xl font-bold mb-2 text-white">{getImprovementPercentage()}%</h3>
              <p className="text-gray-200">Positive Moods</p>
              <Badge className="mt-2 bg-emerald-500/20 text-emerald-400 border-emerald-400/40">
                {insightData.totalEntries} total entries
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg border-cyan-400/40 text-white shadow-lg shadow-cyan-500/20">
            <CardContent className="p-6 text-center">
              <Target className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
              <h3 className="text-2xl font-bold mb-2 text-white">{insightData.currentStreak}</h3>
              <p className="text-gray-200">Current Streak</p>
              <Badge className="mt-2 bg-cyan-500/20 text-cyan-400 border-cyan-400/40">
                Best: {insightData.longestStreak} days
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg border-violet-400/40 text-white shadow-lg shadow-violet-500/20">
            <CardContent className="p-6 text-center">
              <Clock className="w-12 h-12 mx-auto mb-4 text-violet-400" />
              <h3 className="text-2xl font-bold mb-2 text-white">{insightData.averageSessionTime}m</h3>
              <p className="text-gray-200">Avg Session Time</p>
              <Badge className="mt-2 bg-violet-500/20 text-violet-400 border-violet-400/40">
                {insightData.completedToday} completed today
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg border-amber-400/40 text-white shadow-lg shadow-amber-500/20">
            <CardContent className="p-6 text-center">
              <Award className="w-12 h-12 mx-auto mb-4 text-amber-400" />
              <h3 className="text-2xl font-bold mb-2 text-white">{getActivityStreak()}</h3>
              <p className="text-gray-200">Activity Streak</p>
              <Badge className="mt-2 bg-amber-500/20 text-amber-400 border-amber-400/40">
                {insightData.weeklyEntries} entries this week
              </Badge>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mood Trends */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-6 h-6 mr-2 text-purple-400" />
                  Weekly Mood Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                {insightData.weeklyMoodData.length > 0 ? (
                  <div className="space-y-4">
                    {insightData.weeklyMoodData.map((day, index) => {
                      const totalMoods = Object.values(day)
                        .slice(1)
                        .reduce((sum: number, count) => sum + (count as number), 0)
                      return (
                        <motion.div
                          key={day.day}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="flex items-center space-x-4"
                        >
                          <span className="w-8 text-sm font-medium">{day.day}</span>
                          <div className="flex-1 flex space-x-1 h-4">
                            {totalMoods > 0 ? (
                              Object.entries(day)
                                .slice(1)
                                .map(
                                  ([mood, count]) =>
                                    count > 0 && (
                                      <div
                                        key={mood}
                                        className="h-4 rounded-sm"
                                        style={{
                                          backgroundColor: moodColors[mood as keyof typeof moodColors],
                                          width: `${((count as number) / totalMoods) * 100}%`,
                                        }}
                                        title={`${mood}: ${count}`}
                                      />
                                    ),
                                )
                            ) : (
                              <div className="w-full bg-gray-600 h-4 rounded-sm opacity-50" />
                            )}
                          </div>
                          <span className="text-xs text-gray-400 w-8">{totalMoods}</span>
                        </motion.div>
                      )
                    })}
                    <div className="flex justify-center flex-wrap gap-4 mt-6 text-sm">
                      {Object.entries(moodColors).map(([mood, color]) => (
                        <div key={mood} className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }} />
                          <span className="capitalize">
                            {mood} {moodEmojis[mood as keyof typeof moodEmojis]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No mood data available yet.</p>
                    <p className="text-sm">Start journaling to see your trends!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Mood Distribution */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-6 h-6 mr-2 text-pink-400" />
                  Mood Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(insightData.moodDistribution).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(insightData.moodDistribution)
                      .sort(([, a], [, b]) => b - a)
                      .map(([mood, count]) => {
                        const percentage = Math.round((count / insightData.totalEntries) * 100)
                        return (
                          <div key={mood} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium capitalize flex items-center">
                                <span className="mr-2">{moodEmojis[mood as keyof typeof moodEmojis]}</span>
                                {mood}
                              </span>
                              <span className="text-sm text-gray-300">
                                {count} ({percentage}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className="h-2 rounded-full transition-all duration-500"
                                style={{
                                  backgroundColor: moodColors[mood as keyof typeof moodColors],
                                  width: `${percentage}%`,
                                }}
                              />
                            </div>
                          </div>
                        )
                      })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Smile className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No mood data available yet.</p>
                    <p className="text-sm">Start journaling to see your distribution!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-6 h-6 mr-2 text-purple-400" />
                AI-Powered Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-white">Patterns Detected</h4>
                  <div className="space-y-3">
                    {insightData.totalEntries > 0 ? (
                      <>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm font-medium text-white">Most Common Mood</p>
                            <p className="text-xs text-gray-200">
                              You feel {getMostCommonMood()} most often (
                              {Math.round(
                                ((insightData.moodDistribution[getMostCommonMood()] || 0) / insightData.totalEntries) *
                                  100,
                              )}
                              % of entries)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm font-medium text-white">Journaling Consistency</p>
                            <p className="text-xs text-gray-200">
                              {insightData.currentStreak > 0
                                ? `You're on a ${insightData.currentStreak}-day streak! Keep it up!`
                                : "Try to journal daily for better insights"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm font-medium text-white">Weekly Activity</p>
                            <p className="text-xs text-gray-200">
                              You've made {insightData.weeklyEntries} entries this week
                              {insightData.weeklyEntries >= 5
                                ? " - Excellent consistency!"
                                : " - Try to journal more regularly"}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4 text-gray-400">
                        <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Start journaling to unlock AI insights!</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-white">Recommendations</h4>
                  <div className="space-y-3">
                    {insightData.totalEntries > 0 ? (
                      <>
                        <div className="p-3 bg-white/10 rounded-lg">
                          <p className="text-sm font-medium mb-1 text-white">
                            {getImprovementPercentage() >= 70 ? "Maintain Your Positivity" : "Focus on Self-Care"}
                          </p>
                          <p className="text-xs text-gray-200">
                            {getImprovementPercentage() >= 70
                              ? "Your mood trends are positive! Keep up the great work with your current routine."
                              : "Consider incorporating more self-care activities to boost your mood."}
                          </p>
                        </div>
                        <div className="p-3 bg-white/10 rounded-lg">
                          <p className="text-sm font-medium mb-1 text-white">
                            {insightData.currentStreak >= 7 ? "Streak Master!" : "Build Your Habit"}
                          </p>
                          <p className="text-xs text-gray-200">
                            {insightData.currentStreak >= 7
                              ? "Amazing consistency! Your journaling habit is well-established."
                              : "Try to journal daily to build a stronger habit and gain better insights."}
                          </p>
                        </div>
                        <div className="p-3 bg-white/10 rounded-lg">
                          <p className="text-sm font-medium mb-1 text-white">Activity Integration</p>
                          <p className="text-xs text-gray-200">
                            {insightData.completedToday > 0
                              ? `Great job completing ${insightData.completedToday} activities today!`
                              : "Try combining journaling with self-care activities for better results."}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4 text-gray-400">
                        <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">AI recommendations will appear as you use the app!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
