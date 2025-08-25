"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { BarChart3 } from "lucide-react"
import { motion } from "framer-motion"

const healthAwarenessData = [
  { metric: "Exercise Frequency", Bangladesh: 45, International: 72 },
  { metric: "Balanced Diet", Bangladesh: 38, International: 68 },
  { metric: "Sleep Sufficiency", Bangladesh: 52, International: 75 },
  { metric: "Water Intake", Bangladesh: 41, International: 81 },
]

// Color tokens (Tailwind/hsl for theme-aware)
// Bangladesh: Orange (light: #f59e0b, dark: #ea580c)
// International: Teal (light: #17b9b2, dark: #0891b2)
const BANGLADESH_COLOR = "url(#bangladeshBar)";
const INTERNATIONAL_COLOR = "url(#intlBar)";

// SVG gradients for theme-aware color
const ChartGradients = () => (
  <svg width="0" height="0">
    <linearGradient id="bangladeshBar" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#f59e0b" />
      <stop offset="100%" stopColor="#ea580c" />
    </linearGradient>
    <linearGradient id="intlBar" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#17b9b2" />
      <stop offset="100%" stopColor="#0891b2" />
    </linearGradient>
  </svg>
)

export default function HealthAwarenessChart() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            বর্তমান স্বাস্থ্য সচেতনতা: বাংলাদেশ বনাম আন্তর্জাতিক
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-4xl mx-auto">
            Compare health awareness metrics between Bangladesh and international standards
          </p>
        </motion.div>

        <Card className="max-w-7xl mx-auto shadow-xl border-border/50">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
              <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              Health Awareness Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <ChartGradients />
            <div className="h-80 sm:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={healthAwarenessData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="metric"
                    fontSize={12}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    className="text-muted-foreground"
                  />
                  <YAxis fontSize={12} className="text-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "15px" }}
                    formatter={(value) =>
                      value === "Bangladesh"
                        ? <span style={{ color: "#ea580c", fontWeight: "bold" }}>Bangladesh</span>
                        : <span style={{ color: "#0891b2", fontWeight: "bold" }}>International</span>
                    }
                  />
                  <Bar
                    dataKey="Bangladesh"
                    fill={BANGLADESH_COLOR}
                    name="Bangladesh"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="International"
                    fill={INTERNATIONAL_COLOR}
                    name="International"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}