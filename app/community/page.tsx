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
import RequireAuth from "@/components/require-auth"
import { db } from "@/lib/firebase"
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore"

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
    activeMembers: 0,
    postsToday: 0,
    supportGiven: 0,
    heartsShared: 0,
  })

  const moods = [
    { id: "supportive", emoji: "🤗", label: "Supportive", color: "from-blue-500 to-cyan-500" },
    { id: "grateful", emoji: "🙏", label: "Grateful", color: "from-green-500 to-emerald-500" },
    { id: "proud", emoji: "💪", label: "Proud", color: "from-purple-500 to-violet-500" },
    { id: "seeking", emoji: "🤲", label: "Seeking Help", color: "from-orange-500 to-amber-500" },
    { id: "happy", emoji: "😊", label: "Happy", color: "from-yellow-500 to-orange-500" },
    { id: "calm", emoji: "😌", label: "Calm", color: "from-teal-500 to-cyan-500" },
  ]

  // Load posts from Firestore on component mount
  useEffect(() => {
    // Listen for real-time updates from Firestore
    const q = query(collection(db, "communityPosts"), orderBy("timestamp", "desc"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedPosts = snapshot.docs.map((doc) => {
        const data = doc.data();
        let idNum = Number(doc.id);
        if (isNaN(idNum)) {
          idNum = data.timestamp || Date.now();
        }
        return {
          id: idNum,
          author: data.author || "Anonymous",
          avatar: data.avatar || "🦋",
          time: data.time || "",
          content: data.content || "",
          likes: data.likes || 0,
          replies: data.replies || 0,
          mood: data.mood || "supportive",
          tags: data.tags || [],
          timestamp: data.timestamp || 0,
          liked: data.liked || false,
        };
      });
      setPosts(
        loadedPosts.filter(
          (post: any) =>
            ![
              "Gentle Wave",
              "Peaceful Owl",
              "Anonymous Butterfly",
            ].includes(post.author) &&
            post.content !==
              "Reminder: It's okay to have bad days. You're not broken, you're human. Tomorrow is a new opportunity to try again. Sending love to everyone who needs it today. ✨"
        )
      );
      setLoading(false);
    })
    return () => unsubscribe()
  }, [])

  // Update stats only based on real user interaction (e.g., when a post is added, liked, etc.)
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

  const handleSharePost = async () => {
    if (newPost.trim()) {
      const randomName = anonymousNames[Math.floor(Math.random() * anonymousNames.length)]
      const randomAvatar = anonymousAvatars[Math.floor(Math.random() * anonymousAvatars.length)]
      const post = {
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
        createdAt: serverTimestamp(),
      }
      try {
        await addDoc(collection(db, "communityPosts"), post)
        setNewPost("")
        showSuccessMessage("Your post has been shared anonymously! 💙")
      } catch (error) {
        showSuccessMessage("Failed to share post. Please try again.")
      }
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
        activeMembers: 0,
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
        <div className="text-center bg-black/70 rounded-lg p-8">
          <div className="text-white text-center">
            <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4" />
            <p className="text-xl text-black">Loading community...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <RequireAuth>
      <div
        className={`min-h-screen bg-gradient-to-br ${getMoodBackground(currentMood)} text-[#222] relative overflow-hidden`}
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
                <p className="text-black text-lg">A safe space for anonymous support and encouragement</p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={handleResetCommunity}
                  className={`backdrop-blur-lg border transition-all ${
                    showResetConfirm
                      ? "bg-red-500/20 hover:bg-red-500/30 border-red-500/50 text-red-300"
                      : "bg-white/10 hover:bg-white/20 border-black text-black"
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
            <Card className="bg-black/60 backdrop-blur-lg border-white/20 text-white">
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
              <Card className="bg-black/60 backdrop-blur-lg border-white/20 text-white mb-8">
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
                              : "bg-black/60 hover:bg-black/70"
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
                    className="bg-black/60 border-white/20 text-white placeholder:text-gray-400 min-h-32 resize-none"
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
                  <Card className="bg-black/60 backdrop-blur-lg border-white/20 text-white">
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
                      <Card className="bg-black/60 backdrop-blur-lg border-white/20 text-white hover:bg-black/70 transition-all">
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
              <Card className="bg-black/60 backdrop-blur-lg border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 mr-2 text-yellow-400" />
                      Community Stats
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {posts.length > 0 ? (
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
                  ) : (
                    <div className="text-gray-400 text-sm text-center py-4">No community stats yet</div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-black/60 backdrop-blur-lg border-white/20 text-white">
                <CardHeader>
                  <CardTitle>Mental Health Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-semibold">KIRAN Mental Health Helpline</span><br />
                      Toll-Free: <span className="font-mono">1800-599-0019</span><br />
                      <span className="text-gray-300">Available 24/7, this helpline provides immediate support for people facing mental health issues, including depression and anxiety.</span>
                    </div>
                    <div>
                      <span className="font-semibold">VISHWAS Mental Health Helpline (NIMHANS Bengaluru)</span><br />
                      Phone: <span className="font-mono">080-4611-0007</span><br />
                      <span className="text-gray-300">Operated by NIMHANS, this helpline offers counseling and mental health support, including for depression.</span>
                    </div>
                    <div>
                      <span className="font-semibold">AASRA Suicide Prevention Helpline</span><br />
                      Phone: <span className="font-mono">91-22-2754-6669</span><br />
                      <span className="text-gray-300">A dedicated helpline offering support for people dealing with suicidal thoughts and severe depression.</span>
                    </div>
                    <div>
                      <a href="https://www.vandrevalafoundation.com/free-counseling" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Vandrevala Foundation Free Counseling</a>
                    </div>
                    <div>
                      <a href="https://www.thelivelovelaughfoundation.org/find-help/helplines" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Live Love Laugh Foundation Helplines</a>
                    </div>
                    <div>
                      <a href="https://www.nimh.nih.gov/health/find-help" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">NIMH Mental Health Support</a>
                    </div>
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
    </RequireAuth>
  )
}
