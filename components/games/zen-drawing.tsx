"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, RotateCcw, Download } from "lucide-react"

interface ZenDrawingProps {
  onClose: () => void
}

export function ZenDrawing({ onClose }: ZenDrawingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushSize, setBrushSize] = useState(20)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size - increased from 600x450 to 800x600
    canvas.width = 800
    canvas.height = 600

    // Initialize with sand background
    ctx.fillStyle = "#F5E6D3"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add subtle texture
    for (let i = 0; i < 1500; i++) {
      ctx.fillStyle = `rgba(139, 69, 19, ${Math.random() * 0.1})`
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1)
    }
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    draw(e)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) * (canvas.width / rect.width)
    const y = (e.clientY - rect.top) * (canvas.height / rect.height)

    // Create zen drawing effect
    ctx.globalCompositeOperation = "multiply"
    ctx.fillStyle = "#D2B48C"

    // Draw with soft brush effect
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, brushSize)
    gradient.addColorStop(0, "rgba(139, 69, 19, 0.3)")
    gradient.addColorStop(1, "rgba(139, 69, 19, 0)")

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y, brushSize, 0, Math.PI * 2)
    ctx.fill()

    // Add particle effect
    for (let i = 0; i < 5; i++) {
      const px = x + (Math.random() - 0.5) * brushSize
      const py = y + (Math.random() - 0.5) * brushSize
      ctx.fillStyle = `rgba(160, 82, 45, ${Math.random() * 0.2})`
      ctx.fillRect(px, py, 2, 2)
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear the entire canvas first
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Reset composite operation
    ctx.globalCompositeOperation = "source-over"

    // Reset to sand background
    ctx.fillStyle = "#F5E6D3"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add texture again
    for (let i = 0; i < 1500; i++) {
      ctx.fillStyle = `rgba(139, 69, 19, ${Math.random() * 0.1})`
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1)
    }
  }

  const saveDrawing = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = `zen-art-${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
    >
      <div className="w-full max-w-8xl mx-4 h-[98vh] bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-lg shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Zen Sand Drawing</h2>
            <p className="text-gray-600">Create calming patterns in digital sand</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={saveDrawing}
              variant="outline"
              size="sm"
              className="text-gray-800 border-gray-300 bg-transparent hover:bg-gray-100"
            >
              <Download className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              onClick={clearCanvas}
              variant="outline"
              size="sm"
              className="text-gray-800 border-gray-300 bg-transparent hover:bg-gray-100"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button onClick={onClose} variant="ghost" size="sm" className="text-gray-800 hover:bg-gray-200">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Drawing Area */}
        <div className="flex flex-col items-center justify-center h-full p-6 pt-24 pb-8">
          <Card className="bg-white/80 backdrop-blur-lg shadow-2xl mb-6">
            <CardContent className="p-4">
              <canvas
                ref={canvasRef}
                className="border-2 border-amber-200 rounded-lg cursor-crosshair shadow-inner"
                style={{
                  width: "min(800px, 90vw)",
                  height: "min(600px, 60vh)",
                  maxWidth: "800px",
                  maxHeight: "600px",
                }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </CardContent>
          </Card>

          {/* Controls */}
          <Card className="bg-white/80 backdrop-blur-lg mb-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Brush Size:</label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-32"
                />
                <span className="text-sm text-gray-600">{brushSize}px</span>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="bg-white/90 backdrop-blur-lg">
            <CardContent className="p-4 text-center">
              <p className="text-gray-700">
                🖱️ Click and drag to draw peaceful patterns in the sand • 🎨 Adjust brush size • 💾 Save your zen art
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
