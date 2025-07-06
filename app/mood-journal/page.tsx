"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  RotateCcw,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react"
import { useMood } from "@/contexts/mood-context"
import RequireAuth from "@/components/require-auth"

interface JournalEntry {
  id: string
  mood: string
  content: string
  date: string
  timestamp: number
}

interface JournalStats {
  totalEntries: number
  weeklyEntries: number
  mostCommonMood: string
  currentStreak: number
  moodDistribution: { [key: string]: number }
}

const moodOptions = [
  { value: "happy", label: "Happy", emoji: "😊", color: "bg-yellow-500" },
  { value: "sad", label: "Sad", emoji: "😢", color: "bg-blue-500" },
  { value: "anxious", label: "Anxious", emoji: "😰", color: "bg-red-500" },
  { value: "calm", label: "Calm", emoji: "😌", color: "bg-green-500" },
  { value: "excited", label: "Excited", emoji: "🤩", color: "bg-orange-500" },
  { value: "neutral", label: "Neutral", emoji: "😐", color: "bg-gray-500" },
]

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export default function MoodJournalPage() {
  const { currentMood, getMoodBackground } = useMood()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [newEntry, setNewEntry] = useState({ mood: "", content: "" })
  const [editingEntry, setEditingEntry] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [calendarDate, setCalendarDate] = useState(new Date())

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Load entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem("moodJournalEntries")
    if (savedEntries) {
      try {
        const parsedEntries = JSON.parse(savedEntries)
        setEntries(parsedEntries)
      } catch (error) {
        console.error("Error loading journal entries:", error)
      }
    }
  }, [])

  // Save entries to localStorage
  useEffect(() => {
    localStorage.setItem("moodJournalEntries", JSON.stringify(entries))
  }, [entries])

  const addEntry = () => {
    if (newEntry.mood && newEntry.content.trim()) {
      const entry: JournalEntry = {
        id: Date.now().toString(),
        mood: newEntry.mood,
        content: newEntry.content.trim(),
        date: new Date().toISOString().split("T")[0],
        timestamp: Date.now(),
      }

      setEntries((prev) => [entry, ...prev])
      setNewEntry({ mood: "", content: "" })
    }
  }

  const deleteEntry = (id: string) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      setEntries((prev) => prev.filter((entry) => entry.id !== id))
    }
  }

  const startEdit = (entry: JournalEntry) => {
    setEditingEntry(entry.id)
    setEditContent(entry.content)
  }

  const saveEdit = (id: string) => {
    if (editContent.trim()) {
      setEntries((prev) => prev.map((entry) => (entry.id === id ? { ...entry, content: editContent.trim() } : entry)))
      setEditingEntry(null)
      setEditContent("")
    }
  }

  const cancelEdit = () => {
    setEditingEntry(null)
    setEditContent("")
  }

  const resetJournal = () => {
    if (confirm("Are you sure you want to delete all journal entries? This action cannot be undone.")) {
      setEntries([])
      setShowResetConfirm(false)
      localStorage.removeItem("moodJournalEntries")
    }
  }

  const getMoodEmoji = (mood: string) => {
    const moodOption = moodOptions.find((option) => option.value === mood)
    return moodOption ? moodOption.emoji : "😐"
  }

  const getMoodColor = (mood: string) => {
    const moodOption = moodOptions.find((option) => option.value === mood)
    return moodOption ? moodOption.color : "bg-gray-500"
  }

  const getStats = (): JournalStats => {
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const weeklyEntries = entries.filter((entry) => new Date(entry.timestamp) >= oneWeekAgo).length

    const moodCounts = entries.reduce(
      (acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1
        return acc
      },
      {} as { [key: string]: number },
    )

    const mostCommonMood = Object.entries(moodCounts).reduce(
      (a, b) => (moodCounts[a[0]] > moodCounts[b[0]] ? a : b),
      ["neutral", 0],
    )[0]

    return {
      totalEntries: entries.length,
      weeklyEntries,
      mostCommonMood,
      currentStreak: calculateStreak(),
      moodDistribution: moodCounts,
    }
  }

  const calculateStreak = (): number => {
    if (entries.length === 0) return 0

    const sortedEntries = [...entries].sort((a, b) => b.timestamp - a.timestamp)
    const today = new Date().toISOString().split("T")[0]
    let streak = 0
    const currentDate = new Date()

    for (let i = 0; i < 365; i++) {
      const dateStr = currentDate.toISOString().split("T")[0]
      const hasEntry = sortedEntries.some((entry) => entry.date === dateStr)

      if (hasEntry) {
        streak++
      } else if (dateStr !== today) {
        break
      }

      currentDate.setDate(currentDate.getDate() - 1)
    }

    return streak
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getEntriesForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return entries.filter((entry) => entry.date === dateStr)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCalendarDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(calendarDate)
    const firstDay = getFirstDayOfMonth(calendarDate)
    const today = new Date()
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day)
      const dateEntries = getEntriesForDate(date)
      const isToday = date.toDateString() === today.toDateString()
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-8 w-8 flex items-center justify-center text-sm cursor-pointer rounded-full relative ${
            isToday ? "bg-blue-500 text-white font-bold" : isSelected ? "bg-purple-500 text-white" : "hover:bg-white/10"
          }`}
        >
          {day}
          {dateEntries.length > 0 && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
              {dateEntries.slice(0, 3).map((entry, index) => (
                <div key={index} className={`w-1.5 h-1.5 rounded-full ${getMoodColor(entry.mood)}`}></div>
              ))}
            </div>
          )}
        </div>,
      )
    }

    return days
  }

  const stats = getStats()

  return (
    <RequireAuth>
      <div className={`min-h-screen bg-gradient-to-br ${getMoodBackground(currentMood)} text-[#222]`}>
        <div className="container mx-auto px-6 py-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold flex items-center">
                <BookOpen className="w-10 h-10 mr-4 text-blue-400" />
                Mood Journal
              </h1>
              <div className="text-right">
                <div className="flex items-center text-lg font-mono mb-1">
                  <Clock className="w-5 h-5 mr-2 text-blue-300" />
                  {formatTime(currentTime)}
                </div>
                <div className="text-sm text-black">{formatDate(currentTime)}</div>
              </div>
            </div>
            <p className="text-black text-lg">Track your emotions and reflect on your daily experiences</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
              {/* New Entry Form */}
              <Card className="bg-black/60 backdrop-blur-lg border-white/20 text-white mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="w-5 h-5 mr-2 text-green-400" />
                    New Journal Entry
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">How are you feeling?</label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                      {moodOptions.map((mood) => (
                        <button
                          key={mood.value}
                          onClick={() => setNewEntry({ ...newEntry, mood: mood.value })}
                          className={`p-3 rounded-lg border transition-all ${
                            newEntry.mood === mood.value
                              ? "border-white bg-white/20"
                              : "border-white/30 hover:border-white/50 hover:bg-white/10"
                          }`}
                        >
                          <div className="text-2xl mb-1">{mood.emoji}</div>
                          <div className="text-xs">{mood.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">What's on your mind?</label>
                    <Textarea
                      value={newEntry.content}
                      onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                      placeholder="Write about your day, thoughts, or feelings..."
                      className="bg-white/10 border-white/30 text-white placeholder-gray-400 min-h-[100px]"
                    />
                  </div>

                  <Button
                    onClick={addEntry}
                    disabled={!newEntry.mood || !newEntry.content.trim()}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Entry
                  </Button>
                </CardContent>
              </Card>

              {/* Journal Entries */}
              <Card className="bg-black/60 backdrop-blur-lg border-white/20 text-white">
                <CardHeader>
                  <CardTitle>Your Journal Entries</CardTitle>
                </CardHeader>
                <CardContent>
                  {entries.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-400 text-lg">No entries yet</p>
                      <p className="text-gray-500 text-sm">Start by adding your first journal entry above</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {entries.map((entry) => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-black/60 rounded-lg p-4 border border-white/10"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                              <div>
                                <Badge className={`${getMoodColor(entry.mood)} text-white`}>
                                  {moodOptions.find((m) => m.value === entry.mood)?.label}
                                </Badge>
                                <p className="text-sm text-gray-400 mt-1">
                                  {new Date(entry.timestamp).toLocaleDateString()} at{" "}
                                  {new Date(entry.timestamp).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => startEdit(entry)}
                                size="sm"
                                variant="ghost"
                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                              >
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => deleteEntry(entry.id)}
                                size="sm"
                                variant="ghost"
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {editingEntry === entry.id ? (
                            <div className="space-y-3">
                              <Textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="bg-white/10 border-white/30 text-white"
                              />
                              <div className="flex space-x-2">
                                <Button
                                  onClick={() => saveEdit(entry.id)}
                                  size="sm"
                                  className="bg-green-500 hover:bg-green-600"
                                >
                                  Save
                                </Button>
                                <Button onClick={cancelEdit} size="sm" variant="ghost" className="text-gray-400">
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-200 leading-relaxed">{entry.content}</p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Sidebar */}
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              {/* Calendar Widget */}
              <Card className="bg-black/60 backdrop-blur-lg border-white/20 text-white">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-purple-400" />
                    Calendar
                  </CardTitle>
                  <Button
                    onClick={() => setShowCalendar(!showCalendar)}
                    size="sm"
                    variant="ghost"
                    className="text-gray-300 hover:text-white"
                  >
                    {showCalendar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </CardHeader>
                {showCalendar && (
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <Button
                          onClick={() => navigateMonth("prev")}
                          size="sm"
                          variant="ghost"
                          className="text-gray-300 hover:text-white"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <h3 className="font-semibold">
                          {monthNames[calendarDate.getMonth()]} {calendarDate.getFullYear()}
                        </h3>
                        <Button
                          onClick={() => navigateMonth("next")}
                          size="sm"
                          variant="ghost"
                          className="text-gray-300 hover:text-white"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {daysOfWeek.map((day) => (
                          <div key={day} className="text-center text-xs font-medium text-gray-400 p-1">
                            {day}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
                    </div>

                    {selectedDate && (
                      <div className="border-t border-white/20 pt-4">
                        <h4 className="font-medium mb-2">
                          {selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                        </h4>
                        {getEntriesForDate(selectedDate).length > 0 ? (
                          <div className="space-y-2">
                            {getEntriesForDate(selectedDate).map((entry) => (
                              <div key={entry.id} className="flex items-center space-x-2 text-sm">
                                <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                                <span className="text-gray-300 truncate">{entry.content.substring(0, 30)}...</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-400 text-sm">No entries for this date</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>

              {/* Quick Stats */}
              <Card className="bg-black/60 backdrop-blur-lg border-white/20 text-white">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Quick Stats</CardTitle>
                  <Button
                    onClick={() => setShowResetConfirm(true)}
                    size="sm"
                    variant="ghost"
                    className="text-red-300 hover:text-red-200 hover:bg-red-500/20"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-400">{stats.totalEntries}</p>
                      <p className="text-sm text-gray-400">Total Entries</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400">{stats.weeklyEntries}</p>
                      <p className="text-sm text-gray-400">This Week</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-lg font-semibold mb-1">Most Common Mood</p>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-2xl">{getMoodEmoji(stats.mostCommonMood)}</span>
                      <span className="capitalize">{stats.mostCommonMood}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Mood Distribution</p>
                    <div className="space-y-2">
                      {Object.entries(stats.moodDistribution).map(([mood, count]) => {
                        const percentage = stats.totalEntries > 0 ? (count / stats.totalEntries) * 100 : 0
                        return (
                          <div key={mood} className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <span>{getMoodEmoji(mood)}</span>
                              <span className="capitalize">{mood}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-white/20 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${getMoodColor(mood)}`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-400 w-8">{count}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reset Confirmation */}
              {showResetConfirm && (
                <Card className="bg-red-500/10 backdrop-blur-lg border-red-500/20 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-2">Reset Journal?</p>
                        <p className="text-xs text-gray-300 mb-3">
                          This will permanently delete all your journal entries and mood data.
                        </p>
                        <div className="flex space-x-2">
                          <Button onClick={resetJournal} size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                            Reset
                          </Button>
                          <Button
                            onClick={() => setShowResetConfirm(false)}
                            size="sm"
                            variant="ghost"
                            className="text-gray-300 hover:bg-white/10"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </RequireAuth>
  )
}
