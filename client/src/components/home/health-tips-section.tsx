"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Droplets, Activity, Apple, Moon, Dumbbell, Heart, Zap, Shield } from "lucide-react"

const healthTips = [
  {
    icon: Droplets,
    tip: "Drink 8-10 glasses of water daily for optimal hydration",
    color: "text-blue-600",
  },
  {
    icon: Activity,
    tip: "Exercise for at least 30 minutes, 5 days a week",
    color: "text-green-600",
  },
  {
    icon: Apple,
    tip: "Eat 5 servings of fruits and vegetables daily",
    color: "text-red-600",
  },
  {
    icon: Moon,
    tip: "Get 7-9 hours of quality sleep every night",
    color: "text-purple-600",
  },
  {
    icon: Dumbbell,
    tip: "Include strength training 2-3 times per week",
    color: "text-orange-600",
  },
  {
    icon: Heart,
    tip: "Monitor your heart rate during workouts",
    color: "text-pink-600",
  },
  {
    icon: Zap,
    tip: "Take breaks every hour if you sit for long periods",
    color: "text-yellow-600",
  },
  {
    icon: Shield,
    tip: "Practice stress management techniques daily",
    color: "text-indigo-600",
  },
]

export default function HealthTipsSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">Daily Health Tips</h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Essential tips for maintaining a healthy lifestyle every day
          </p>
        </motion.div>

        {/* Desktop: Ring Layout with Enhanced Animations */}
        <div className="hidden lg:block relative max-w-6xl mx-auto">
          {/* Center Image - Rotates Right with Pulse Effect */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.05, 1],
              }}
              transition={{
                rotate: { duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                scale: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
              }}
              className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl bg-gradient-to-br from-primary/10 to-secondary/10"
            >
              <img src="/healthy-lifestyle-icon.png" alt="Health Center" className="w-full h-full object-cover" />
            </motion.div>
          </div>

          {/* Tips Ring - Cards Rotate Left with Staggered Animation */}
          <motion.div
            className="relative w-full aspect-square max-w-5xl mx-auto"
            animate={{ rotate: -360 }}
            transition={{ duration: 80, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            {healthTips.map((tip, index) => {
              const angle = (index * 360) / healthTips.length
              const radius = 50
              const x = 50 + radius * Math.cos(((angle - 90) * Math.PI) / 180)
              const y = 50 + radius * Math.sin(((angle - 90) * Math.PI) / 180)

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  whileHover={{
                    scale: 1.15,
                    y: -12,
                    transition: { duration: 0.3 },
                  }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  {/* Counter-rotate with Enhanced Motion */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 80, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Card className="w-56 p-6 text-center hover:shadow-2xl transition-all duration-500 bg-card/95 backdrop-blur-sm border border-border/50 hover:border-primary/30">
                      <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }}>
                        <tip.icon className={`w-12 h-12 mx-auto mb-4 ${tip.color}`} />
                      </motion.div>
                      <p className="text-sm font-medium leading-relaxed text-foreground">{tip.tip}</p>
                    </Card>
                  </motion.div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Mobile & Tablet: Vertical Stack Layout */}
        <div className="lg:hidden space-y-4 sm:space-y-6 max-w-2xl mx-auto">
          {healthTips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300 bg-card/95 backdrop-blur-sm border border-border/50">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} className="flex-shrink-0">
                    <tip.icon className={`w-10 h-10 sm:w-12 sm:h-12 ${tip.color}`} />
                  </motion.div>
                  <p className="text-sm sm:text-base font-medium leading-relaxed flex-1">{tip.tip}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
