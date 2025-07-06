"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Lock, Eye, EyeOff, X, LogIn, UserPlus, User } from "lucide-react"
import { auth, googleProvider } from "../lib/firebase"
import { signInWithPopup } from "firebase/auth"
import { usePathname, useRouter } from "next/navigation"

interface UserInterface {
  id: string
  email: string
  name: string
}

export function LoginSignup() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(pathname === "/login")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserInterface | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Form states
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  })
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // Mock authentication functions
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Mock successful login
      const user: UserInterface = {
        id: "1",
        email: loginForm.email,
        name: loginForm.email.split("@")[0],
      }
      setCurrentUser(user)
      setIsLoggedIn(true)
      setIsOpen(false)
      // Store in localStorage for persistence
      localStorage.setItem("moodsphere_user", JSON.stringify(user))
      showSuccessMessage("Signed in successfully")
      router.push("/")
      setIsLoading(false)
    }, 1500)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (signupForm.password !== signupForm.confirmPassword) {
      alert("Passwords don't match!")
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Mock successful signup
      const user: UserInterface = {
        id: Date.now().toString(),
        email: signupForm.email,
        name: signupForm.name,
      }
      setCurrentUser(user)
      setIsLoggedIn(true)
      setIsOpen(false)
      // Store in localStorage for persistence
      localStorage.setItem("moodsphere_user", JSON.stringify(user))
      showSuccessMessage("Signed in successfully")
      router.push("/")
      setIsLoading(false)
    }, 1500)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem("moodsphere_user")
    setLoginForm({ email: "", password: "" })
    setSignupForm({ name: "", email: "", password: "", confirmPassword: "" })
  }

  // Check for existing user on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("moodsphere_user")
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser)
          setCurrentUser(user)
          setIsLoggedIn(true)
        } catch (error) {
          console.error("Error parsing saved user:", error)
        }
      }
    }
  }, [])

  // Add this function for Google sign-in
  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      setCurrentUser({
        id: user.uid,
        email: user.email || "",
        name: user.displayName || user.email?.split("@")[0] || "User",
      })
      setIsLoggedIn(true)
      setIsOpen(false)
      localStorage.setItem("moodsphere_user", JSON.stringify({
        id: user.uid,
        email: user.email || "",
        name: user.displayName || user.email?.split("@")[0] || "User",
      }))
      showSuccessMessage("Signed in successfully")
      router.push("/")
    } catch (error) {
      alert("Google sign-in failed. Please try again.")
    }
    setIsLoading(false)
  }

  // Add this function to show a popup message
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

  return (
    <div className={pathname === "/login" ? "flex items-center justify-center min-h-screen" : "fixed top-4 right-4 z-50"}>
      {!isLoggedIn ? (
        <>
          {(!isOpen && pathname !== "/login") ? (
            // Login Button
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setIsOpen(true)}
                className="bg-white/20 backdrop-blur-lg border border-white/30 text-slate-800 hover:bg-white/30 shadow-lg"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </motion.div>
          ) : (
            // Login/Signup Modal or Full Page
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <Card className="w-96 bg-white/95 backdrop-blur-xl border border-white/30 shadow-2xl">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl text-slate-800">Welcome to MoodSphere</CardTitle>
                      {pathname !== "/login" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setIsOpen(false)}
                          className="w-6 h-6 text-slate-500 hover:text-slate-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <Tabs defaultValue="login" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="login">Sign In</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                      </TabsList>

                      <TabsContent value="login">
                        <form onSubmit={handleLogin} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="login-email">Email</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input
                                id="login-email"
                                type="email"
                                placeholder="Enter your email"
                                value={loginForm.email}
                                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="login-password">Password</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input
                                id="login-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={loginForm.password}
                                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                className="pl-10 pr-10"
                                required
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 text-slate-400" />
                                ) : (
                                  <Eye className="h-4 w-4 text-slate-400" />
                                )}
                              </Button>
                            </div>
                          </div>

                          <Button
                            type="button"
                            className="w-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2"
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                          >
                            <svg width="20" height="20" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.7 33.1 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 3l6.1-6.1C34.5 5.5 29.6 3.5 24 3.5 12.7 3.5 3.5 12.7 3.5 24S12.7 44.5 24 44.5c11.3 0 20.5-9.2 20.5-20.5 0-1.4-.1-2.7-.3-4z"/><path fill="#34A853" d="M6.3 14.7l7 5.1C15.2 17.1 19.2 14 24 14c3.1 0 5.9 1.1 8.1 3l6.1-6.1C34.5 5.5 29.6 3.5 24 3.5c-6.6 0-12 5.4-12 12 0 2.1.5 4.1 1.3 5.9z"/><path fill="#FBBC05" d="M24 44.5c5.8 0 10.7-2.1 14.6-5.7l-6.7-5.5c-2 1.4-4.5 2.2-7.9 2.2-5.8 0-10.7-3.9-12.5-9.2l-7 5.4C7.5 41.1 15.2 44.5 24 44.5z"/><path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.1 5.5-7.7 5.5-2.2 0-4.2-.7-5.7-2.1l-7 5.4C15.2 41.1 19.2 44.5 24 44.5c6.6 0 12-5.4 12-12 0-1.4-.1-2.7-.3-4z"/></g></svg>
                            Continue with Google
                          </Button>

                          <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <motion.div
                                className="flex items-center gap-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Signing In...
                              </motion.div>
                            ) : (
                              <>
                                <LogIn className="w-4 h-4 mr-2" />
                                Sign In
                              </>
                            )}
                          </Button>
                        </form>
                      </TabsContent>

                      <TabsContent value="signup">
                        <form onSubmit={handleSignup} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="signup-name">Full Name</Label>
                            <div className="relative">
                              <motion.div className="absolute left-3 top-3 h-4 w-4 text-slate-400">
                                <UserPlus />
                              </motion.div>
                              <Input
                                id="signup-name"
                                type="text"
                                placeholder="Enter your full name"
                                value={signupForm.name}
                                onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="signup-email">Email</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input
                                id="signup-email"
                                type="email"
                                placeholder="Enter your email"
                                value={signupForm.email}
                                onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="signup-password">Password</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input
                                id="signup-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password"
                                value={signupForm.password}
                                onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                                className="pl-10 pr-10"
                                required
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 text-slate-400" />
                                ) : (
                                  <Eye className="h-4 w-4 text-slate-400" />
                                )}
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input
                                id="signup-confirm-password"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                value={signupForm.confirmPassword}
                                onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                                className="pl-10 pr-10"
                                required
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4 text-slate-400" />
                                ) : (
                                  <Eye className="h-4 w-4 text-slate-400" />
                                )}
                              </Button>
                            </div>
                          </div>

                          <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <motion.div
                                className="flex items-center gap-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Creating Account...
                              </motion.div>
                            ) : (
                              <>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Create Account
                              </>
                            )}
                          </Button>
                        </form>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          )}
        </>
      ) : (
        // User Profile Dropdown
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative">
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-white/20 backdrop-blur-lg border border-white/30 text-slate-800 hover:bg-white/30 shadow-lg"
          >
            <motion.div className="w-4 h-4 mr-2">
              <User />
            </motion.div>
            {currentUser?.name || "User"}
          </Button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl border border-white/30 rounded-lg shadow-lg"
              >
                <div className="p-4 border-b border-slate-200">
                  <p className="font-medium text-slate-800">{currentUser?.name}</p>
                  <p className="text-sm text-slate-600">{currentUser?.email}</p>
                </div>
                <div className="p-2">
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogIn className="w-4 h-4 mr-2 rotate-180" />
                    Sign Out
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
