"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Heart, Users, Target, Sparkles, Shield, Zap, Globe, CheckCircle, Linkedin, Mail } from "lucide-react"
import { useMood } from "@/contexts/mood-context"

export default function AboutPage() {
  const { currentMood, getMoodBackground } = useMood()

  const teamMembers = [
    {
      name: "Anmol Salaria",
      image: "/images/kushagra-photo.png",
      email: "anmolsalaria31@gmail.com",
      linkedin: "https://www.linkedin.com/in/anmol-salaria-b2164028a/",
    },
    {
      name: "Kushagra Gupta",
      image: "/images/anmol-photo.jpeg",
      email: "mail2kush13@gmail.com",
      linkedin: "https://www.linkedin.com/in/kushagra-gupta-a1b6b4291/",
    },
    {
      name: "Raghav Ahuja",
      image: "/images/raghav-photo.jpeg",
      email: "raghavahuja2412@gmail.com",
      linkedin: "https://www.linkedin.com/in/raghav-ahuja-46ba58290",
    },
  ]

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description:
        "Advanced machine learning algorithms analyze your mood patterns and provide personalized recommendations.",
    },
    {
      icon: Heart,
      title: "Holistic Wellness",
      description: "Comprehensive approach combining mental, emotional, and physical well-being strategies.",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data is encrypted and secure. We never share personal information with third parties.",
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with others on similar journeys in a safe, moderated environment.",
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Set and achieve wellness goals with our intelligent progress tracking system.",
    },
    {
      icon: Zap,
      title: "Real-time Monitoring",
      description: "Integration with wearables for continuous mood and stress level monitoring.",
    },
  ]

  const values = [
    {
      icon: Heart,
      title: "Empathy",
      description: "We approach mental health with compassion and understanding",
    },
    {
      icon: Shield,
      title: "Trust",
      description: "Building secure, reliable platforms you can depend on",
    },
    {
      icon: Sparkles,
      title: "Innovation",
      description: "Pioneering new approaches to digital mental wellness",
    },
    {
      icon: Globe,
      title: "Accessibility",
      description: "Making mental health support available to everyone, everywhere",
    },
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getMoodBackground(currentMood)} text-slate-800`}>
      {/* Hero Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge className="mb-4 bg-white/20 text-slate-800 border-white/30">About MoodSphere</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-slate-800">Revolutionizing Mental Wellness</h1>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto mb-8">
              We're on a mission to make mental health support accessible, personalized, and effective through the power
              of AI and human connection.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-3xl font-bold mb-6 text-slate-800">Our Mission</h2>
              <p className="text-lg text-slate-700 mb-6">
                Mental health challenges affect millions worldwide, yet access to quality care remains limited.
                MoodSphere bridges this gap by combining cutting-edge AI technology with evidence-based therapeutic
                approaches.
              </p>
              <p className="text-lg text-slate-700 mb-8">
                We believe everyone deserves personalized mental health support that adapts to their unique needs,
                lifestyle, and goals. Our platform empowers individuals to take control of their mental wellness journey
                with confidence and support.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Evidence-based approaches</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">24/7 AI support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Privacy-first design</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <motion.div
                className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 border border-white/40 shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Brain className="w-16 h-16 text-blue-600 mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-slate-800">AI-Powered Care</h3>
                <p className="text-slate-700">
                  Our advanced AI learns from your interactions, mood patterns, and preferences to provide increasingly
                  personalized support and recommendations.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-slate-800">Platform Features</h2>
            <p className="text-lg text-slate-700">
              Comprehensive tools designed to support your mental wellness journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white/60 backdrop-blur-lg border-white/40 shadow-lg h-full hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                    <h3 className="text-xl font-bold mb-3 text-slate-800">{feature.title}</h3>
                    <p className="text-slate-700">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-slate-800">Meet Our Team</h2>
            <p className="text-lg text-slate-700">ARKitechs</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white/60 backdrop-blur-lg border-white/40 shadow-lg text-center hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-white/30"
                    />
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-blue-600 transition-colors group"
                      >
                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {member.name}
                        </h3>
                        <Linkedin className="w-5 h-5 text-blue-600 hover:text-blue-700 transition-colors" />
                      </a>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4 text-slate-600" />
                      <a
                        href={`mailto:${member.email}`}
                        className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
                      >
                        {member.email}
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-slate-800">Our Values</h2>
            <p className="text-lg text-slate-700">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/60 backdrop-blur-lg rounded-full flex items-center justify-center mx-auto mb-4 border border-white/40">
                    <value.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-800">{value.title}</h3>
                  <p className="text-slate-700">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
