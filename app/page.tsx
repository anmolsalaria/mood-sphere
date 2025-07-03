"use client"

import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars, Environment } from "@react-three/drei"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MoodSelector } from "@/components/mood-selector"
import { ActivityCards } from "@/components/activity-cards"
import { WearableWidget } from "@/components/wearable-widget"
import { VideoBackground } from "@/components/video-background"
import { MovableChatbot } from "@/components/movable-chatbot"
import { useMood } from "@/contexts/mood-context"
import { LoginSignup } from "@/components/login-signup"
import { useSidebar } from "@/components/navigation"
import { MoodAssessment } from "@/components/mood-assessment"
import { X } from "lucide-react"
import React from "react"
import type { MoodType } from "@/contexts/mood-context"

function GlowingSphere({ mood }: { mood: MoodType }) {
  const getMoodColor = (mood: string) => {
    // 40% darker colors for the sphere
    switch (mood) {
      case "happy":
        return "#B8860B" // Darker gold
      case "calm":
        return "#4682B4" // Darker steel blue
      case "anxious":
        return "#CD5C5C" // Darker red
      case "stressed":
        return "#FF6347" // Darker orange-red
      case "neutral":
        return "#6B8E23" // Darker olive green
      case "sad":
        return "#483D8B" // Darker slate blue
      default:
        return "#4682B4"
    }
  }

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere args={[2, 64, 64]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color={getMoodColor(mood)}
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.1}
          metalness={0.8}
        />
      </Sphere>
      <pointLight position={[0, 0, 0]} intensity={2} color={getMoodColor(mood)} />
    </Float>
  )
}

// Moving background particles component
function MovingBackground({ mood }: { mood: MoodType }) {
  const getMoodParticleColor = (mood: string) => {
    switch (mood) {
      case "happy":
        return "bg-yellow-400"
      case "calm":
        return "bg-blue-400"
      case "anxious":
        return "bg-red-400"
      case "stressed":
        return "bg-orange-400"
      case "neutral":
        return "bg-green-400"
      case "sad":
        return "bg-indigo-400"
      default:
        return "bg-blue-400"
    }
  }

  const [hasMounted, setHasMounted] = React.useState(false)
  React.useEffect(() => { setHasMounted(true) }, [])

  // Memoize random values for particles and shapes
  const particles = React.useMemo(() =>
    Array.from({ length: 20 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
      duration: 8 + Math.random() * 4,
    })),
    []
  )

  const shapes = React.useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      borderRadius: i % 2 === 0 ? "50%" : "0%",
      x: Math.random() * 300 - 150,
      y: Math.random() * 300 - 150,
      duration: 12 + Math.random() * 6,
    })),
    []
  )

  if (!hasMounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={`${mood}-${i}`}
          className={`absolute w-2 h-2 ${getMoodParticleColor(mood)} rounded-full opacity-20`}
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
          }}
          animate={{
            x: [0, p.x],
            y: [0, p.y],
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating geometric shapes */}
      {shapes.map((s, i) => (
        <motion.div
          key={`shape-${mood}-${i}`}
          className={`absolute w-8 h-8 ${getMoodParticleColor(mood)} opacity-10`}
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            borderRadius: s.borderRadius,
          }}
          animate={{
            x: [0, s.x],
            y: [0, s.y],
            rotate: [0, 360],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: s.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

export default function HomePage() {
  const { currentMood, setCurrentMood, getMoodBackground } = useMood()
  const { isSidebarOpen } = useSidebar()
  const [stressLevel, setStressLevel] = useState([30])
  const [heartRate, setHeartRate] = useState(72)
  const [isPlayMode, setIsPlayMode] = useState(false)
  const [moodSelectionMode, setMoodSelectionMode] = useState<"select" | "assess">("select")

  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate((prev) => prev + Math.random() * 6 - 3)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Handle ESC key to exit play mode
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isPlayMode) {
        setIsPlayMode(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isPlayMode])

  const scrollToMoodSection = () => {
    const moodSection = document.getElementById("mood-section")
    if (moodSection) {
      moodSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  const enterPlayMode = () => {
    setIsPlayMode(true)
  }

  const exitPlayMode = () => {
    setIsPlayMode(false)
  }

  const handleAssessmentComplete = (detectedMood: string, _confidence: number) => {
    setCurrentMood(detectedMood as MoodType)
    setMoodSelectionMode("select")
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${getMoodBackground(currentMood)} text-slate-800 overflow-hidden relative`}
    >
      {/* Animated Video Background */}
      <VideoBackground mood={currentMood} />

      {/* Moving Background */}
      <MovingBackground mood={currentMood} />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        {/* 3D Canvas - Always present but with different opacity */}
        <div
          className={`absolute inset-0 z-0 transition-opacity duration-500 ${isPlayMode ? "opacity-80" : "opacity-30"}`}
        >
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <ambientLight intensity={0.3} />
            <Stars radius={300} depth={60} count={1000} factor={7} />
            <GlowingSphere mood={currentMood} />
            <Environment preset="night" />
            <OrbitControls
              enableZoom={isPlayMode}
              enablePan={isPlayMode}
              enableRotate={true}
              autoRotate={!isPlayMode}
              autoRotateSpeed={0.5}
            />
          </Canvas>
        </div>

        {/* Text Content - Hidden in play mode */}
        <AnimatePresence>
          {!isPlayMode && (
            <motion.div
              className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 text-black leading-tight">
                  MoodSphere
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl mb-8 text-slate-900">
                  Your AI-powered mental wellness companion
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-8 py-4 text-lg rounded-full shadow-lg"
                    onClick={scrollToMoodSection}
                  >
                    Begin Your Journey
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/20 backdrop-blur-sm border-white/40 hover:bg-white/30 text-slate-800 px-8 py-4 text-lg rounded-full shadow-lg"
                    onClick={enterPlayMode}
                  >
                    Play with Sphere
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Play Mode Instructions */}
        <AnimatePresence>
          {isPlayMode && (
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white/20 backdrop-blur-sm border border-white/40 rounded-lg px-6 py-3 shadow-lg">
                <p className="text-slate-800 text-center text-sm">
                  Drag to rotate • Scroll to zoom • Press ESC or click X to exit
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Content Sections - Hidden in play mode */}
      <AnimatePresence>
        {!isPlayMode && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            {/* Mood Check-In Section */}
            <section id="mood-section" className="py-20 px-6 relative">
              <div className="max-w-6xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-12"
                >
                  <h2 className="text-4xl font-bold mb-4 text-slate-800">How are you feeling today?</h2>
                  <p className="text-slate-600 text-lg mb-8">Let's check in with your emotional state</p>

                  {/* Mode Selection Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                    <Button
                      variant={moodSelectionMode === "select" ? "default" : "outline"}
                      className={`px-6 py-3 rounded-full transition-all duration-300 ${
                        moodSelectionMode === "select"
                          ? "bg-slate-700 text-white shadow-lg"
                          : "bg-white/20 backdrop-blur-sm border-white/40 hover:bg-white/30 text-slate-800"
                      }`}
                      onClick={() => setMoodSelectionMode("select")}
                    >
                      Select Your Mood
                    </Button>
                    <Button
                      variant={moodSelectionMode === "assess" ? "default" : "outline"}
                      className={`px-6 py-3 rounded-full transition-all duration-300 ${
                        moodSelectionMode === "assess"
                          ? "bg-slate-700 text-white shadow-lg"
                          : "bg-white/20 backdrop-blur-sm border-white/40 hover:bg-white/30 text-slate-800"
                      }`}
                      onClick={() => setMoodSelectionMode("assess")}
                    >
                      Know Your Mood by Answering Questions
                    </Button>
                  </div>
                </motion.div>

                {/* Conditional Rendering based on mode */}
                <AnimatePresence mode="wait">
                  {moodSelectionMode === "select" ? (
                    <motion.div
                      key="mood-selector"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MoodSelector currentMood={currentMood} onMoodChange={setCurrentMood} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="mood-assessment"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MoodAssessment onComplete={handleAssessmentComplete} onBack={() => setMoodSelectionMode("select")} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* AI Activity Suggestions */}
            <section className="py-20 px-6 relative">
              <div className="max-w-6xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-12"
                >
                  <h2 className="text-4xl font-bold mb-4 text-slate-800">Personalized Activities</h2>
                  <p className="text-slate-600 text-lg">AI-curated suggestions based on your current mood</p>
                </motion.div>

                <ActivityCards mood={currentMood} />
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Elements - Always visible but repositioned */}
      <motion.div
        className="fixed bottom-20 z-40"
        animate={{
          right: isSidebarOpen ? 340 : 20,
          opacity: isPlayMode ? 0.7 : 1,
        }}
        transition={{
          type: "tween",
          duration: 0.3,
          ease: "easeInOut",
        }}
      >
        <WearableWidget heartRate={heartRate} stressLevel={stressLevel[0]} />
      </motion.div>

      {/* Login/Signup in top right - Also responsive to sidebar */}
      <motion.div
        className="fixed top-4 z-40"
        animate={{
          right: isSidebarOpen ? 340 : 20,
          opacity: isPlayMode ? 0.7 : 1,
        }}
        transition={{
          type: "tween",
          duration: 0.3,
          ease: "easeInOut",
        }}
      >
        <LoginSignup />
      </motion.div>

      {/* Exit Play Mode Button - Positioned in top right corner below Login/Signup */}
      <AnimatePresence>
        {isPlayMode && (
          <motion.div
            className="fixed top-16 z-40"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, right: isSidebarOpen ? 340 : 20 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              size="sm"
              variant="outline"
              className="bg-white/20 backdrop-blur-sm border-white/40 hover:bg-white/30 text-slate-800 rounded-full p-2 shadow-lg"
              onClick={exitPlayMode}
            >
              <X className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="fixed bottom-4 z-50"
        animate={{
          right: isSidebarOpen ? 340 : 16,
          opacity: isPlayMode ? 0.7 : 1,
        }}
        transition={{
          type: "tween",
          duration: 0.3,
          ease: "easeInOut",
        }}
      >
        <MovableChatbot />
      </motion.div>
    </div>
  )
}
