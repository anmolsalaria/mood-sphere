"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface VideoBackgroundProps {
  mood: string
}

export function VideoBackground({ mood }: VideoBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const getMoodColors = (mood: string) => {
    switch (mood) {
      case "happy":
        return ["#FEF3C7", "#FDE68A", "#F59E0B", "#D97706"]
      case "calm":
        return ["#DBEAFE", "#BFDBFE", "#3B82F6", "#1D4ED8"]
      case "anxious":
        return ["#FEE2E2", "#FECACA", "#EF4444", "#DC2626"]
      case "stressed":
        return ["#FED7AA", "#FDBA74", "#F97316", "#EA580C"]
      case "neutral":
        return ["#D1FAE5", "#A7F3D0", "#10B981", "#059669"]
      case "sad":
        return ["#E0E7FF", "#C7D2FE", "#6366F1", "#4F46E5"]
      default:
        return ["#DBEAFE", "#BFDBFE", "#3B82F6", "#1D4ED8"]
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const colors = getMoodColors(mood)
    const spheres: Array<{
      x: number
      y: number
      radius: number
      vx: number
      vy: number
      color: string
      opacity: number
      pulsePhase: number
    }> = []

    // Create spheres
    for (let i = 0; i < 12; i++) {
      spheres.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 20 + Math.random() * 60,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0.1 + Math.random() * 0.2,
        pulsePhase: Math.random() * Math.PI * 2,
      })
    }

    let animationId: number
    let time = 0

    const animate = () => {
      time += 0.01
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) / 2,
      )
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.05)")
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw connecting lines between nearby spheres
      ctx.strokeStyle = `rgba(255, 255, 255, 0.1)`
      ctx.lineWidth = 1
      for (let i = 0; i < spheres.length; i++) {
        for (let j = i + 1; j < spheres.length; j++) {
          const dx = spheres[i].x - spheres[j].x
          const dy = spheres[i].y - spheres[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 200) {
            const opacity = ((200 - distance) / 200) * 0.2
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
            ctx.beginPath()
            ctx.moveTo(spheres[i].x, spheres[i].y)
            ctx.lineTo(spheres[j].x, spheres[j].y)
            ctx.stroke()
          }
        }
      }

      // Update and draw spheres
      spheres.forEach((sphere) => {
        // Update position
        sphere.x += sphere.vx
        sphere.y += sphere.vy

        // Bounce off edges
        if (sphere.x < -sphere.radius || sphere.x > canvas.width + sphere.radius) {
          sphere.vx *= -1
        }
        if (sphere.y < -sphere.radius || sphere.y > canvas.height + sphere.radius) {
          sphere.vy *= -1
        }

        // Keep spheres in bounds
        sphere.x = Math.max(-sphere.radius, Math.min(canvas.width + sphere.radius, sphere.x))
        sphere.y = Math.max(-sphere.radius, Math.min(canvas.height + sphere.radius, sphere.y))

        // Pulsing effect
        const pulseScale = 1 + Math.sin(time * 2 + sphere.pulsePhase) * 0.1
        const currentRadius = sphere.radius * pulseScale

        // Create radial gradient for sphere
        const sphereGradient = ctx.createRadialGradient(sphere.x, sphere.y, 0, sphere.x, sphere.y, currentRadius)

        // Parse hex color to RGB
        const hex = sphere.color.replace("#", "")
        const r = Number.parseInt(hex.substr(0, 2), 16)
        const g = Number.parseInt(hex.substr(2, 2), 16)
        const b = Number.parseInt(hex.substr(4, 2), 16)

        sphereGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${sphere.opacity * 0.8})`)
        sphereGradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${sphere.opacity * 0.4})`)
        sphereGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

        // Draw sphere
        ctx.fillStyle = sphereGradient
        ctx.beginPath()
        ctx.arc(sphere.x, sphere.y, currentRadius, 0, Math.PI * 2)
        ctx.fill()

        // Add subtle glow
        ctx.shadowColor = sphere.color
        ctx.shadowBlur = 20
        ctx.beginPath()
        ctx.arc(sphere.x, sphere.y, currentRadius * 0.3, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [mood])

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    />
  )
}
