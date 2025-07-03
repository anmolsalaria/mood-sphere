"use client"

import type React from "react"

import { useState, createContext, useContext, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Home, BookOpen, Target, Users, BarChart3, Menu, X, Brain, Info } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/mood-journal", label: "Mood Journal", icon: BookOpen },
  { href: "/self-care", label: "Self-Care Arena", icon: Target },
  { href: "/community", label: "Community", icon: Users },
  { href: "/insights", label: "Insights", icon: BarChart3 },
  { href: "/about", label: "About", icon: Info },
]

// Create context for sidebar state
const SidebarContext = createContext({
  isSidebarOpen: false,
  toggleSidebar: () => {},
  setSidebarOpen: (open: boolean) => {},
})

export const useSidebar = () => useContext(SidebarContext)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const setSidebarOpen = (open: boolean) => setIsSidebarOpen(open)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "b") {
        event.preventDefault()
        toggleSidebar()
      }
      if (event.key === "Escape" && isSidebarOpen) {
        setSidebarOpen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isSidebarOpen]) // Removed toggleSidebar and setSidebarOpen from dependencies

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement

      // Don't close if clicking on sidebar or toggle button
      if (target.closest('[data-sidebar="true"]') || target.closest('[data-sidebar-toggle="true"]')) {
        return
      }

      // Close sidebar on outside click (desktop only)
      if (isSidebarOpen && window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isSidebarOpen]) // Removed setSidebarOpen from dependencies

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar, setSidebarOpen }}>
      <div className="min-h-screen flex">
        {/* Desktop Sidebar */}
        <motion.div
          className="hidden lg:block"
          animate={{
            width: isSidebarOpen ? 320 : 0,
          }}
          transition={{
            type: "tween",
            duration: 0.3,
            ease: "easeInOut",
          }}
        >
          <AnimatePresence mode="wait">
            {isSidebarOpen && (
              <motion.nav
                data-sidebar="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                }}
                className="h-full w-80 bg-white/80 backdrop-blur-xl border-r border-white/30 flex flex-col shadow-xl fixed left-0 top-0 z-40"
              >
                {/* Sidebar Header */}
                <motion.div
                  className="p-6 border-b border-white/20"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                >
                  <Link href="/" className="flex items-center space-x-3">
                    <Brain className="w-8 h-8 text-slate-600" />
                    <span className="text-xl font-bold text-slate-800">MoodSphere</span>
                  </Link>
                </motion.div>

                {/* Navigation Items */}
                <div className="flex-1 px-4 py-6">
                  <div className="space-y-2">
                    {navItems.map((item, index) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href

                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.1 + index * 0.03,
                            duration: 0.2,
                          }}
                        >
                          <Link href={item.href} onClick={() => setSidebarOpen(false)}>
                            <motion.div
                              className={cn(
                                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                                isActive
                                  ? "bg-slate-200/60 text-slate-800 border border-slate-300/40"
                                  : "text-slate-600 hover:bg-white/40 hover:text-slate-800",
                              )}
                              whileHover={{ x: 4 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Icon className="w-5 h-5 flex-shrink-0" />
                              <span className="font-medium">{item.label}</span>
                              {isActive && (
                                <motion.div
                                  className="ml-auto w-2 h-2 bg-slate-600 rounded-full"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ duration: 0.2 }}
                                />
                              )}
                            </motion.div>
                          </Link>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>

                {/* Sidebar Footer */}
                <motion.div
                  className="p-6 border-t border-white/20"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.2 }}
                >
                  <div className="text-center text-slate-600 text-sm">
                    <p className="font-medium text-slate-800 mb-1">MoodSphere</p>
                    <p>Your Mental Wellness Companion</p>
                  </div>
                </motion.div>
              </motion.nav>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Main Content Area */}
        <motion.div
          className="flex-1 min-h-screen relative"
          animate={{
            marginLeft: isSidebarOpen ? 0 : 0,
          }}
          transition={{
            type: "tween",
            duration: 0.3,
            ease: "easeInOut",
          }}
        >
          {/* Desktop Sidebar Toggle Button */}
          <motion.div
            className="hidden lg:block fixed top-4 z-50"
            animate={{
              left: isSidebarOpen ? 340 : 20,
            }}
            transition={{
              type: "tween",
              duration: 0.3,
              ease: "easeInOut",
            }}
          >
            <Button
              data-sidebar-toggle="true"
              onClick={toggleSidebar}
              className="bg-white/20 backdrop-blur-md border border-white/30 text-slate-600 hover:bg-white/30 hover:text-slate-800 rounded-lg p-3 shadow-lg transition-all duration-200 w-12 h-12"
            >
              <motion.div animate={{ rotate: isSidebarOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.div>
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </motion.div>

          {/* Mobile Header */}
          <MobileHeader />

          {/* Page Content */}
          <div className="pt-16 pb-20 lg:pt-0 lg:pb-0">{children}</div>

          {/* Mobile Bottom Navigation */}
          <MobileBottomNav />
        </motion.div>
      </div>
    </SidebarContext.Provider>
  )
}

function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white/60 backdrop-blur-xl border-b border-white/30 z-50 px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-slate-600" />
            <span className="text-lg font-bold text-slate-800">MoodSphere</span>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-600 hover:bg-white/40 border border-white/30"
          >
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{
                type: "tween",
                duration: 0.25,
                ease: "easeOut",
              }}
              className="lg:hidden fixed top-0 right-0 h-full w-80 bg-white/90 backdrop-blur-xl border-l border-white/30 z-50 p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-800">Navigation</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-slate-600 hover:bg-white/40"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <div className="space-y-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.05,
                        duration: 0.2,
                      }}
                    >
                      <Link href={item.href} onClick={() => setIsOpen(false)}>
                        <motion.div
                          className={cn(
                            "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200",
                            isActive
                              ? "bg-slate-200/60 text-slate-800 border border-slate-300/40"
                              : "text-slate-600 hover:bg-white/40 hover:text-slate-800",
                          )}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </motion.div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-center text-slate-600 text-sm">
                  <p className="font-medium text-slate-800 mb-1">MoodSphere</p>
                  <p>Your Mental Wellness Companion</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-xl border-t border-white/30 z-50 shadow-lg">
      <div className="flex justify-around py-2">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                className={cn(
                  "flex flex-col items-center p-2 rounded-lg transition-colors duration-200",
                  isActive ? "text-slate-800 bg-white/40" : "text-slate-600",
                )}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.label.split(" ")[0]}</span>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export function Navigation() {
  return null // This component is now integrated into SidebarProvider
}
