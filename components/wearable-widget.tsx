"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Heart, Activity, Watch } from "lucide-react"

interface WearableWidgetProps {
  heartRate: number
  stressLevel: number
}

export function WearableWidget({ heartRate: initialHeartRate, stressLevel }: WearableWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [heartRate, setHeartRate] = useState<number | null>(null)
  const deviceRef = useRef<any>(null)
  const characteristicRef = useRef<any>(null)
  const [error, setError] = useState<string | null>(null)

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

  // Web Bluetooth connection logic
  const connectToWearable = async () => {
    setError(null)
    setIsConnecting(true)
    try {
      const navAny = navigator as any
      if (!navAny.bluetooth) {
        setError("Web Bluetooth is not supported in this browser.")
        setIsConnecting(false)
        return
      }
      const device = await navAny.bluetooth.requestDevice({
        filters: [{ services: ["heart_rate"] }],
        optionalServices: ["battery_service"]
      })
      deviceRef.current = device
      const server = await device.gatt.connect()
      const service = await server.getPrimaryService("heart_rate")
      const characteristic = await service.getCharacteristic("heart_rate_measurement")
      characteristicRef.current = characteristic
      await characteristic.startNotifications()
      characteristic.addEventListener("characteristicvaluechanged", handleHeartRateChanged)
      setIsConnected(true)
      setIsConnecting(false)
      setHeartRate(null)
    } catch (err: any) {
      setError(err.message || "Failed to connect to device.")
      setIsConnecting(false)
    }
  }

  const handleHeartRateChanged = (event: Event) => {
    const value = (event.target as any).value
    if (!value) return
    setHeartRate(value.getUint8(1))
  }

  // Disconnect on unmount or when widget closes
  useEffect(() => {
    return () => {
      if (characteristicRef.current) {
        characteristicRef.current.removeEventListener("characteristicvaluechanged", handleHeartRateChanged)
        try {
          characteristicRef.current.stopNotifications()
        } catch {}
      }
      if (deviceRef.current && deviceRef.current.gatt && deviceRef.current.gatt.connected) {
        try {
          deviceRef.current.gatt.disconnect()
        } catch {}
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
              {isConnected ? (
                <Badge className="ml-auto bg-green-500/20 text-green-600 border-green-500/30">Connected</Badge>
              ) : isConnecting ? (
                <Badge className="ml-auto bg-yellow-500/20 text-yellow-600 border-yellow-500/30">Connecting...</Badge>
              ) : (
                <Badge className="ml-auto bg-gray-400/20 text-gray-600 border-gray-400/30">Not Connected</Badge>
              )}
            </div>
            <div className="mb-3">
              <button
                onClick={connectToWearable}
                disabled={isConnected || isConnecting}
                className="w-full py-2 px-4 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {isConnected ? "Connected" : isConnecting ? "Connecting..." : "Connect to Watch"}
              </button>
              {error && <div className="text-red-600 text-xs mt-2">{error}</div>}
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-red-500" />
                  <span className="text-sm">Heart Rate</span>
                </div>
                <motion.span
                  className="font-bold text-red-500"
                  animate={isConnected && heartRate !== null ? { scale: [1, 1.1, 1] } : false}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                >
                  {isConnected && heartRate !== null ? `${Math.round(heartRate)} BPM` : "--"}
                </motion.span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-orange-500" />
                  <span className="text-sm">Stress Level</span>
                </div>
                <span className={`font-bold ${isConnected ? getStressColor(stressLevel) : "text-gray-400"}`}>{isConnected ? getStressLabel(stressLevel) : "--"}</span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-2">
                {isConnected ? (
                  <motion.div
                    className="bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${stressLevel}%` }}
                    transition={{ duration: 1 }}
                  />
                ) : (
                  <div className="bg-gray-400 h-2 rounded-full w-1/4 opacity-50" />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
