import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/navigation"
import { MoodProvider } from "@/contexts/mood-context"
import { MoodBackgroundWrapper } from "@/components/mood-background-wrapper"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MoodSphere - Your AI-Powered Mental Wellness Companion",
  description:
    "Track your mood, get personalized activities, and connect with a supportive community for better mental health.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <MoodProvider>
            <SidebarProvider>
              <MoodBackgroundWrapper>
                {children}
              </MoodBackgroundWrapper>
            </SidebarProvider>
          </MoodProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
