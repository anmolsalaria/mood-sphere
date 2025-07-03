"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Users,
  MessageCircle,
  Heart,
  Send,
  Star,
  Shield,
  Sparkles,
  RefreshCw,
  Trash2,
  RotateCcw,
  AlertTriangle,
} from "lucide-react"
import { useMood } from "@/contexts/mood-context"

interface CommunityPost {
  id: number
  author: string
  avatar: string
  time: string
  content: string
  likes: number
  replies: number
  mood: string
  tags: string[]
  timestamp: number
  liked?: boolean
}

const initialPosts: CommunityPost[] = [
  {
    id: 1,
    author: "Anonymous Butterfly",
    avatar: "🦋",
    time: "2 hours ago",
    content:
      "Had a panic attack today but used the breathing exercises from the app. Feeling much better now. Thank you to this amazing community for always being here! 💙",
    likes: 24,
    replies: 8,
    mood: "grateful",
    tags: ["anxiety", "breathing", "support"],
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
  },
  {
    id: 2,
    author: "Peaceful Owl",
    avatar: "🦉",
    time: "4 hours ago",
    content:
      "Week 3 of my meditation journey! Started with just 2 minutes and now I can do 15 minutes easily. Small steps really do make a big difference.",
    likes: 31,
    replies: 12,
    mood: "proud",
    tags: ["meditation", "progress", "mindfulness"],
    timestamp: Date.now() - 4 * 60 * 60 * 1000,
  },
  {
    id: 3,
    author: "Gentle Wave",
    avatar: "🌊",
    time: "6 hours ago",
    content:
      "Reminder: It's okay to have bad days. You're not broken, you're human. Tomorrow is a new opportunity to try again. Sending love to everyone who needs it today. ✨",
    likes: 47,
    replies: 15,
    mood: "supportive",
    tags: ["encouragement", "self-compassion", "love"],
    timestamp: Date.now() - 6 * 60 * 60 * 1000,
  },
]

const anonymousNames = [
  "Gentle Butterfly",
  "Peaceful Owl",
  "Calm Wave",
  "Bright Star",
  "Quiet Moon",
  "Soft Cloud",
  "Kind Heart",
  "Warm Sun",
  "Cool Breeze",
  "Happy Flower",
  "Wise Tree",
  "Free Bird",
  "Pure Light",
  "Sweet Dream",
  "Strong Mountain",
]

const anonymousAvatars = ["🦋", "🌟", "🌙", "☀️", "🌸", "🌊", "🦉", "🌺", "🍃", "💫", "🌈", "🕊️", "🌻", "🦄", "🌷"]

export default function CommunityPage() {
  const { currentMood, getMoodBackground } = useMood()
  const [newPost, setNewPost] = useState("")
  const [selectedMood, setSelectedMood] = useState("supportive")
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [stats, setStats] = useState({
    activeMembers: 2847,
    postsToday: 156,
    supportGiven: 1203,
    heartsShared: 4521,
  })

  const moods = [
    { id: "supportive", emoji: "🤗", label: "Supportive", color: "from-blue-500 to-cyan-500" },
    { id: "grateful", emoji: "🙏", label: "Grateful", color: "from-green-500 to-emerald-500" },
    { id: "proud", emoji: "💪", label: "Proud", color: "from-purple-500 to-violet-500" },
    { id: "seeking", emoji: "🤲", label: "Seeking Help", color: "from-orange-500 to-amber-500" },
    { id: "happy", emoji: "😊", label: "Happy", color: "from-yellow-500 to-orange-500" },
    { id: "calm", emoji: "😌", label: "Calm", color: "from-teal-500 to-cyan-500" },
  ]

  // Load posts from localStorage on component mount
  useEffect(() => {
    const loadPosts = () => {
      setLoading(true)
      try {
        const savedPosts = localStorage.getItem("communityPosts")
        if (savedPosts) {
          const parsedPosts = JSON.parse(savedPosts)
          setPosts(parsedPosts)
        } else {
          setPosts(initialPosts)
          localStorage.setItem("communityPosts", JSON.stringify(initialPosts))
        }
      } catch (error) {
        console.error("Error loading posts:", error)
        setPosts(initialPosts)
      }
      setLoading(false)
    }

    loadPosts()
  }, [])

  // Save posts to localStorage whenever posts change
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem("communityPosts", JSON.stringify(posts))
    }
  }, [posts])

  // Update stats based on posts
  useEffect(() => {
    const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0)
    const todaysPosts = posts.filter((post) => {
      const today = new Date()
      const postDate = new Date(post.timestamp)
      return postDate.toDateString() === today.toDateString()
    }).length

    setStats((prev) => ({
      ...prev,
      postsToday: todaysPosts,
      heartsShared: totalLikes,
      supportGiven: Math.floor(totalLikes * 0.8) + posts.length * 2,
    }))
  }, [posts])

  const getTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) return `${minutes} minutes ago`
    if (hours < 24) return `${hours} hours ago`
    return `${days} days ago`
  }

  const handleSharePost = () => {
    if (newPost.trim()) {
      const randomName = anonymousNames[Math.floor(Math.random() * anonymousNames.length)]
      const randomAvatar = anonymousAvatars[Math.floor(Math.random() * anonymousAvatars.length)]

      const post: CommunityPost = {
        id: Date.now(),
        author: randomName,
        avatar: randomAvatar,
        time: "Just now",
        content: newPost.trim(),
        likes: 0,
        replies: 0,
        mood: selectedMood,
        tags: ["new-post"],
        timestamp: Date.now(),
        liked: false,
      }

      setPosts((prev) => [post, ...prev])
      setNewPost("")

      // Show success message
      showSuccessMessage("Your post has been shared anonymously! 💙")
    }
  }

  const handleLike = (postId: number) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = post.liked
          return {
            ...post,
            likes: isLiked ? post.likes - 1 : post.likes + 1,
            liked: !isLiked,
          }
        }
        return post
      }),
    )
  }

  const handleDeletePost = (postId: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      setPosts((prev) => prev.filter((post) => post.id !== postId))
      showSuccessMessage("Post deleted successfully!")
    }
  }

  const handleResetCommunity = () => {
    if (showResetConfirm) {
      // Reset all community data
      setPosts([])
      setStats({
        activeMembers: 2847,
        postsToday: 0,
        supportGiven: 0,
        heartsShared: 0,
      })
      localStorage.removeItem("communityPosts")
      setShowResetConfirm(false)
      showSuccessMessage("Community data has been reset successfully!")
    } else {
      setShowResetConfirm(true)
    }
  }

  const refreshPosts = () => {
    setLoading(true)
    // Simulate loading
    setTimeout(() => {
      setStats((prev) => ({
        activeMembers: prev.activeMembers + Math.floor(Math.random() * 10),
        postsToday: prev.postsToday,
        supportGiven: prev.supportGiven + Math.floor(Math.random() * 5),
        heartsShared: prev.heartsShared,
      }))
      setLoading(false)
    }, 1000)
  }

  const showSuccessMessage = (message: string) => {
    const successMessage = document.createElement("div")
    successMessage.className =
      "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse"
    successMessage.textContent = message
    document.body.appendChild(successMessage)

    setTimeout(() => {
      if (document.body.contains(successMessage)) {
        document.body.removeChild(successMessage)
      }
    }, 3000)
  }

  const getMoodColor = (mood: string) => {
    const moodObj = moods.find((m) => m.id === mood)
    return moodObj?.color || "from-gray-500 to-gray-600"
  }

  const getTrendingTags = () => {
    const tagCount: { [key: string]: number } = {}
    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1
      })
    })

    return Object.entries(tagCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([tag]) => tag)
  }

  if (loading) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${getMoodBackground(currentMood)} flex items-center justify-center`}
      >
        <div className="text-white text-center">
          <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-xl">Loading community...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${getMoodBackground(currentMood)} text-white relative overflow-hidden`}
    >
      {/* Starry Background */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4 flex items-center">
                <Users className="w-10 h-10 mr-4 text-purple-400" />
                Community Support
              </h1>
              <p className="text-gray-300 text-lg">A safe space for anonymous support and encouragement</p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={refreshPosts}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={handleResetCommunity}
                className={`backdrop-blur-lg border transition-all ${
                  showResetConfirm
                    ? "bg-red-500/20 hover:bg-red-500/30 border-red-500/50 text-red-300"
                    : "bg-white/10 hover:bg-white/20 border-white/20"
                }`}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {showResetConfirm ? "Confirm Reset" : "Reset Community"}
              </Button>
            </div>
          </div>

          {/* Reset Confirmation Warning */}
          {showResetConfirm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg backdrop-blur-lg"
            >
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <div>
                  <h3 className="font-semibold text-red-300">Warning: This action cannot be undone!</h3>
                  <p className="text-red-200 text-sm">
                    This will permanently delete all community posts and reset all statistics.
                  </p>
                </div>
                <Button
                  onClick={() => setShowResetConfirm(false)}
                  variant="ghost"
                  size="sm"
                  className="text-red-300 hover:text-red-200"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Community Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-blue-500/10 backdrop-blur-lg border-blue-500/20 text-white">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 mr-3 text-blue-400" />
                <h3 className="text-lg font-semibold">Safe Space Guidelines</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
                  <span>Be kind and supportive</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-green-400" />
                  <span>Respect anonymity</span>
                </div>
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-pink-400" />
                  <span>Share with compassion</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* New Post Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="w-6 h-6 mr-2 text-purple-400" />
                  Share with the Community
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-3">Your mood</label>
                  <div className="grid grid-cols-3 gap-3">
                    {moods.map((mood) => (
                      <button
                        key={mood.id}
                        onClick={() => setSelectedMood(mood.id)}
                        className={`p-3 rounded-lg transition-all flex flex-col items-center space-y-1 ${
                          selectedMood === mood.id
                            ? `bg-gradient-to-r ${mood.color} scale-105 shadow-lg`
                            : "bg-white/10 hover:bg-white/15"
                        }`}
                      >
                        <span className="text-xl">{mood.emoji}</span>
                        <span className="text-xs">{mood.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Textarea
                  placeholder="Share your thoughts, experiences, or offer support to others..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-32 resize-none"
                  maxLength={500}
                />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{newPost.length}/500 characters</span>
                  <Button
                    className={`bg-gradient-to-r ${getMoodColor(selectedMood)} hover:scale-105 transition-all disabled:opacity-50`}
                    onClick={handleSharePost}
                    disabled={!newPost.trim()}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Share Anonymously
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Community Posts */}
            <div className="space-y-6">
              {posts.length === 0 ? (
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                  <CardContent className="p-12 text-center">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                    <p className="text-gray-400">Be the first to share something with the community!</p>
                  </CardContent>
                </Card>
              ) : (
                posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/15 transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar className={`w-12 h-12 bg-gradient-to-r ${getMoodColor(post.mood)}`}>
                            <AvatarFallback className="text-2xl bg-transparent">{post.avatar}</AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold">{post.author}</span>
                                <Badge
                                  className={`bg-gradient-to-r ${getMoodColor(post.mood)} text-white text-xs border-0`}
                                >
                                  {post.mood}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-gray-400 text-sm">{getTimeAgo(post.timestamp)}</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeletePost(post.id)}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1 h-auto"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>

                            <p className="text-gray-100 mb-4 leading-relaxed">{post.content}</p>

                            <div className="flex flex-wrap gap-2 mb-4">
                              {post.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="border-white/30 text-gray-300 text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center space-x-6">
                              <button
                                className={`flex items-center space-x-2 transition-colors ${
                                  post.liked ? "text-pink-400" : "text-gray-400 hover:text-pink-400"
                                }`}
                                onClick={() => handleLike(post.id)}
                              >
                                <Heart className={`w-4 h-4 ${post.liked ? "fill-current" : ""}`} />
                                <span className="text-sm">{post.likes}</span>
                              </button>
                              <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors">
                                <MessageCircle className="w-4 h-4" />
                                <span className="text-sm">{post.replies}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Community Stats Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-400" />
                    Community Stats
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Active Members</span>
                    <span className="font-bold text-purple-400">{stats.activeMembers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Posts Today</span>
                    <span className="font-bold text-blue-400">{stats.postsToday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Support Given</span>
                    <span className="font-bold text-green-400">{stats.supportGiven.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hearts Shared</span>
                    <span className="font-bold text-pink-400">{stats.heartsShared.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <CardHeader>
                <CardTitle>Trending Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getTrendingTags().length > 0 ? (
                    getTrendingTags().map((tag, index) => {
                      const colors = [
                        "bg-purple-500/20 text-purple-300 border-purple-500/30",
                        "bg-blue-500/20 text-blue-300 border-blue-500/30",
                        "bg-green-500/20 text-green-300 border-green-500/30",
                        "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
                        "bg-pink-500/20 text-pink-300 border-pink-500/30",
                        "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
                      ]
                      return (
                        <Badge key={tag} className={`w-full justify-start ${colors[index % colors.length]}`}>
                          #{tag}
                        </Badge>
                      )
                    })
                  ) : (
                    <p className="text-gray-400 text-sm text-center py-4">No trending topics yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
                <h3 className="text-lg font-semibold mb-2">Daily Inspiration</h3>
                <p className="text-gray-300 text-sm italic">
                  "You are braver than you believe, stronger than you seem, and more loved than you know."
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
