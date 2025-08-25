"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { z } from "zod"
import Link from "next/link"
import {
  Calculator,
  BarChart3,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  Calendar,
  Users,
  Award,
  TrendingUp,
  Activity,
  Target,
  Heart,
  Droplets,
  Utensils,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { useAppSelector, useAppDispatch } from "@/src/redux/store"
import { set_bmi_data, toggle_targets_modal } from "@/src/redux/slices/ui_slice"
import recsData from "@/src/data/recs.json"
import HeroSection from "@/src/components/home/hero-section"
import HealthTipsSection from "@/src/components/home/health-tips-section"

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

const healthAwarenessData = [
  { metric: "Regular Exercise", Bangladesh: 35, International: 65 },
  { metric: "Balanced Diet", Bangladesh: 42, International: 78 },
  { metric: "Mental Health Care", Bangladesh: 28, International: 72 },
  { metric: "Preventive Checkups", Bangladesh: 31, International: 68 },
  { metric: "Sleep Quality", Bangladesh: 45, International: 71 },
  { metric: "Stress Management", Bangladesh: 33, International: 69 },
]

export default function HomePage() {
  const { user, is_authenticated, loginuser } = useAppSelector((state) => state.auth)
  const { bmi_data, is_targets_modal_open } = useAppSelector((state) => state.ui)
  const dispatch = useAppDispatch()

  const [bmiForm, setBmiForm] = useState({
    gender: "male" as "male" | "female",
    height: "",
    heightFeet: "",
    heightInches: "",
    weight: "",
    age: "",
    unit: "cm" as "cm" | "ft",
  })

  const [targetsForm, setTargetsForm] = useState({
    gender: "male" as "male" | "female",
    age: "",
    height: "",
    heightFeet: "",
    heightInches: "",
    weight: "",
    activity: "med" as "low" | "med" | "high",
    unit: "cm" as "cm" | "ft",
  })

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [dailyTargets, setDailyTargets] = useState<{
    water: number
    calories: number
    caloriesBurn: number
    sleep: number
    bmi?: number
    bmiCategory?: string
  } | null>(null)

  const calculateBMI = () => {
    const weight = Number.parseFloat(bmiForm.weight)
    const age = Number.parseInt(bmiForm.age)

    let heightValue = 0
    if (bmiForm.unit === "cm") {
      heightValue = Number.parseFloat(bmiForm.height)
    } else {
      const feet = Number.parseFloat(bmiForm.heightFeet) || 0
      const inches = Number.parseFloat(bmiForm.heightInches) || 0
      heightValue = (feet * 12 + inches) * 2.54
    }

    if (!weight || !heightValue || !age) {
      toast.error("Please fill all fields")
      return
    }

    const heightInM = heightValue / 100
    const bmi = weight / (heightInM * heightInM)
    let category = ""

    if (bmi < 18.5) category = "Underweight"
    else if (bmi < 25) category = "Normal"
    else if (bmi < 30) category = "Overweight"
    else category = "Obese"

    const bmiData = {
      height: heightValue,
      weight,
      age,
      gender: bmiForm.gender,
      bmi: Math.round(bmi * 10) / 10,
      category,
    }

    dispatch(set_bmi_data(bmiData))
    toast.success(`BMI calculated: ${bmiData.bmi} (${category})`)
  }

  const calculateTargets = () => {
    try {
      const age = Number.parseInt(targetsForm.age)
      const weight = Number.parseFloat(targetsForm.weight)

      let heightValue = 0
      if (targetsForm.unit === "cm") {
        heightValue = Number.parseFloat(targetsForm.height)
      } else {
        const feet = Number.parseFloat(targetsForm.heightFeet) || 0
        const inches = Number.parseFloat(targetsForm.heightInches) || 0
        heightValue = (feet * 12 + inches) * 2.54
      }

      if (!age || !weight || !heightValue) {
        toast.error("Please fill all fields")
        return
      }

      const heightInM = heightValue / 100
      const bmi = weight / (heightInM * heightInM)
      let bmiCategory = ""
      if (bmi < 18.5) bmiCategory = "Underweight"
      else if (bmi < 25) bmiCategory = "Normal"
      else if (bmi < 30) bmiCategory = "Overweight"
      else bmiCategory = "Obese"

      const water = Math.round(weight * recsData.water_liters_per_kg * 10) / 10
      const baseCalories = recsData.calorie_base_by_gender[targetsForm.gender]
      const calories = Math.round(baseCalories * recsData.activity_multipliers[targetsForm.activity])

      let caloriesBurn = 0
      if (bmiCategory === "Overweight") caloriesBurn = Math.round(calories * 0.15)
      else if (bmiCategory === "Obese") caloriesBurn = Math.round(calories * 0.25)
      else if (bmiCategory === "Underweight") caloriesBurn = 0
      else caloriesBurn = Math.round(calories * 0.1)

      let sleep = 7.0
      if (age >= 18 && age <= 25) sleep = recsData.sleep_by_age["18-25"]
      else if (age >= 26 && age <= 40) sleep = recsData.sleep_by_age["26-40"]
      else if (age >= 41 && age <= 60) sleep = recsData.sleep_by_age["41-60"]
      else if (age > 60) sleep = recsData.sleep_by_age["60+"]

      setDailyTargets({
        water,
        calories,
        caloriesBurn,
        sleep,
        bmi: Math.round(bmi * 10) / 10,
        bmiCategory,
      })
      dispatch(toggle_targets_modal())
    } catch (error) {
      toast.error("Please fill all fields correctly")
    }
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      contactSchema.parse(contactForm)
      toast.success("Message received (demo)")
      setContactForm({ name: "", email: "", message: "" })
    } catch (error) {
      toast.error("Please fill all fields correctly")
    }
  }

  const stats = [
    { icon: Users, label: "Active Members", value: "2,500+", color: "text-blue-600" },
    { icon: Calendar, label: "Classes Weekly", value: "150+", color: "text-green-600" },
    { icon: Award, label: "Expert Trainers", value: "25+", color: "text-purple-600" },
    { icon: TrendingUp, label: "Success Rate", value: "95%", color: "text-orange-600" },
  ]

  const features = [
    {
      icon: Activity,
      title: "Personalized Workouts",
      description: "AI-powered workout plans tailored to your fitness level and goals",
      color: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Track your progress with detailed analytics and milestone celebrations",
      color: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
    },
    {
      icon: Users,
      title: "Expert Trainers",
      description: "Connect with certified trainers for personalized guidance and support",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    },
    {
      icon: Heart,
      title: "Health Monitoring",
      description: "Comprehensive health tracking including BMI, heart rate, and nutrition",
      color: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* BMI Calculator Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">BMI Calculator</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Calculate your Body Mass Index and understand your health status with precision
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <Card className="shadow-xl border-border/50">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
                  <Calculator className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                  Calculate Your BMI
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                  <div className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <Label className="text-sm sm:text-base font-medium mb-2 sm:mb-3 block">Gender</Label>
                        <Select
                          value={bmiForm.gender}
                          onValueChange={(value: "male" | "female") => setBmiForm({ ...bmiForm, gender: value })}
                        >
                          <SelectTrigger className="h-10 sm:h-12 border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm sm:text-base font-medium mb-2 sm:mb-3 block">Age</Label>
                        <Input
                          type="number"
                          placeholder="Enter your age"
                          className="h-10 sm:h-12 border-border"
                          value={bmiForm.age}
                          onChange={(e) => setBmiForm({ ...bmiForm, age: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm sm:text-base font-medium mb-2 sm:mb-3 block">Height Unit</Label>
                      <Select
                        value={bmiForm.unit}
                        onValueChange={(value: "cm" | "ft") =>
                          setBmiForm({ ...bmiForm, unit: value, height: "", heightFeet: "", heightInches: "" })
                        }
                      >
                        <SelectTrigger className="h-10 sm:h-12 border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cm">Centimeters</SelectItem>
                          <SelectItem value="ft">Feet & Inches</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {bmiForm.unit === "cm" ? (
                      <div>
                        <Label className="text-sm sm:text-base font-medium mb-2 sm:mb-3 block">Height (cm)</Label>
                        <Input
                          type="number"
                          placeholder="Enter height in cm"
                          className="h-10 sm:h-12 border-border"
                          value={bmiForm.height}
                          onChange={(e) => setBmiForm({ ...bmiForm, height: e.target.value })}
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <Label className="text-sm sm:text-base font-medium mb-2 sm:mb-3 block">Feet</Label>
                          <Input
                            type="number"
                            placeholder="Feet"
                            className="h-10 sm:h-12 border-border"
                            value={bmiForm.heightFeet}
                            onChange={(e) => setBmiForm({ ...bmiForm, heightFeet: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label className="text-sm sm:text-base font-medium mb-2 sm:mb-3 block">Inches</Label>
                          <Input
                            type="number"
                            placeholder="Inches"
                            className="h-10 sm:h-12 border-border"
                            value={bmiForm.heightInches}
                            onChange={(e) => setBmiForm({ ...bmiForm, heightInches: e.target.value })}
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <Label className="text-sm sm:text-base font-medium mb-2 sm:mb-3 block">Weight (kg)</Label>
                      <Input
                        type="number"
                        placeholder="Enter your weight"
                        className="h-10 sm:h-12 border-border"
                        value={bmiForm.weight}
                        onChange={(e) => setBmiForm({ ...bmiForm, weight: e.target.value })}
                      />
                    </div>
                    <Button onClick={calculateBMI} className="w-full h-10 sm:h-12 text-base sm:text-lg font-semibold">
                      Calculate BMI
                    </Button>
                  </div>

                  {bmi_data && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-muted/50 rounded-2xl p-6 sm:p-8"
                    >
                      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Your BMI Result</h3>
                      <div className="text-center">
                        <div className="text-4xl sm:text-5xl font-bold text-primary mb-4">{bmi_data.bmi}</div>
                        <div
                          className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 px-3 sm:px-4 py-2 rounded-full inline-block ${
                            bmi_data.category === "Normal"
                              ? "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30"
                              : bmi_data.category === "Underweight"
                                ? "text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30"
                                : bmi_data.category === "Overweight"
                                  ? "text-orange-700 bg-orange-100 dark:text-orange-300 dark:bg-orange-900/30"
                                  : "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30"
                          }`}
                        >
                          {bmi_data.category}
                        </div>
                        <div className="text-sm sm:text-base text-muted-foreground space-y-2 bg-background/50 rounded-lg p-3 sm:p-4">
                          <p>
                            <strong>Height:</strong> {Math.round(bmi_data.height)} cm
                          </p>
                          <p>
                            <strong>Weight:</strong> {bmi_data.weight} kg
                          </p>
                          <p>
                            <strong>Age:</strong> {bmi_data.age} years
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Health Awareness Chart */}
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
              Current Health Awareness: Bangladesh vs International
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
                    <Legend />
                    <Bar dataKey="Bangladesh" fill="hsl(var(--primary))" name="Bangladesh" radius={[4, 4, 0, 0]} />
                    <Bar
                      dataKey="International"
                      fill="hsl(var(--secondary))"
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

      {/* Personalized Daily Targets */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">Personalized Daily Targets</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Get customized daily recommendations based on your profile
            </p>
          </motion.div>

          <Card className="max-w-2xl mx-auto border-border/50">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Calculate Your Daily Targets</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Enter your details to get personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Gender</Label>
                    <Select
                      value={targetsForm.gender}
                      onValueChange={(value: "male" | "female") => setTargetsForm({ ...targetsForm, gender: value })}
                    >
                      <SelectTrigger className="border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Age</Label>
                    <Input
                      type="number"
                      placeholder="Age"
                      className="border-border"
                      value={targetsForm.age}
                      onChange={(e) => setTargetsForm({ ...targetsForm, age: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Height Unit</Label>
                  <Select
                    value={targetsForm.unit}
                    onValueChange={(value: "cm" | "ft") =>
                      setTargetsForm({ ...targetsForm, unit: value, height: "", heightFeet: "", heightInches: "" })
                    }
                  >
                    <SelectTrigger className="border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cm">Centimeters</SelectItem>
                      <SelectItem value="ft">Feet & Inches</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {targetsForm.unit === "cm" ? (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Height (cm)</Label>
                    <Input
                      type="number"
                      placeholder="Height in cm"
                      className="border-border"
                      value={targetsForm.height}
                      onChange={(e) => setTargetsForm({ ...targetsForm, height: e.target.value })}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Feet</Label>
                      <Input
                        type="number"
                        placeholder="Feet"
                        className="border-border"
                        value={targetsForm.heightFeet}
                        onChange={(e) => setTargetsForm({ ...targetsForm, heightFeet: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Inches</Label>
                      <Input
                        type="number"
                        placeholder="Inches"
                        className="border-border"
                        value={targetsForm.heightInches}
                        onChange={(e) => setTargetsForm({ ...targetsForm, heightInches: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Weight (kg)</Label>
                    <Input
                      type="number"
                      placeholder="Weight"
                      className="border-border"
                      value={targetsForm.weight}
                      onChange={(e) => setTargetsForm({ ...targetsForm, weight: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Activity Level</Label>
                    <Select
                      value={targetsForm.activity}
                      onValueChange={(value: "low" | "med" | "high") =>
                        setTargetsForm({ ...targetsForm, activity: value })
                      }
                    >
                      <SelectTrigger className="border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (Sedentary)</SelectItem>
                        <SelectItem value="med">Medium (Moderate Exercise)</SelectItem>
                        <SelectItem value="high">High (Very Active)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <Button onClick={calculateTargets} className="w-full mt-6">
                Calculate Targets
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Daily Targets Modal */}
      <Dialog open={is_targets_modal_open} onOpenChange={() => dispatch(toggle_targets_modal())}>
        <DialogContent className="max-w-md border-border/50">
          <DialogHeader>
            <DialogTitle className="text-xl">Your Daily Targets</DialogTitle>
            <DialogDescription>Personalized recommendations for optimal health</DialogDescription>
          </DialogHeader>
          {dailyTargets && (
            <div className="space-y-6">
              {dailyTargets.bmi && (
                <div className="text-center bg-muted/50 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">Your BMI</div>
                  <div className="text-2xl font-bold text-primary">{dailyTargets.bmi}</div>
                  <div
                    className={`text-sm font-medium ${
                      dailyTargets.bmiCategory === "Normal"
                        ? "text-green-600 dark:text-green-400"
                        : dailyTargets.bmiCategory === "Underweight"
                          ? "text-blue-600 dark:text-blue-400"
                          : dailyTargets.bmiCategory === "Overweight"
                            ? "text-orange-600 dark:text-orange-400"
                            : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {dailyTargets.bmiCategory}
                  </div>
                </div>
              )}

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Droplets className="w-6 h-6 text-blue-500" />
                  <span className="text-lg font-semibold">Daily Water</span>
                </div>
                <div className="text-3xl font-bold text-blue-600">{dailyTargets.water}L</div>
                <p className="text-sm text-muted-foreground">Stay hydrated throughout the day</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Utensils className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-semibold">Daily Calories</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{dailyTargets.calories}</div>
                  <p className="text-xs text-muted-foreground">Intake target</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-semibold">Burn Calories</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600">{dailyTargets.caloriesBurn}</div>
                  <p className="text-xs text-muted-foreground">Exercise target</p>
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-6 h-6 text-purple-500" />
                  <span className="text-lg font-semibold">Sleep Hours</span>
                </div>
                <div className="text-3xl font-bold text-purple-600">{dailyTargets.sleep}h</div>
                <p className="text-sm text-muted-foreground">Quality sleep for recovery (7-9 hours recommended)</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Health Tips Section */}
      <HealthTipsSection />

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16 sm:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">Why Choose FitSync?</h2>
            <p className="text-lg sm:text-2xl text-muted-foreground max-w-4xl mx-auto">
              Experience the future of fitness with our cutting-edge platform
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 p-2 border-border/50">
                  <CardHeader className="pb-4">
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 ${feature.color}`}
                    >
                      <feature.icon className="h-7 w-7 sm:h-8 sm:w-8" />
                    </div>
                    <CardTitle className="text-lg sm:text-2xl font-bold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm sm:text-lg">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">Get In Touch</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions? We'd love to hear from you.
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Mail className="w-5 h-5" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Name</Label>
                      <Input
                        type="text"
                        placeholder="Your name"
                        className="border-border"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Email</Label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        className="border-border"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Message</Label>
                    <Textarea
                      placeholder="Your message..."
                      rows={4}
                      className="border-border"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map & Address */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Visit Our Location</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Find us at our convenient location in Magura, Bangladesh
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative h-80 sm:h-96 rounded-2xl overflow-hidden"
            >
              <img
                src="/bangladesh-map-location-magura.png"
                alt="Location Map"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6 sm:space-y-8"
            >
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <MapPin className="w-5 h-5" />
                    Our Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base sm:text-lg font-medium mb-2">স্টেডিয়ামপাড়া, মাগুরা সদর</p>
                  <p className="text-base sm:text-lg font-medium mb-4">মাগুরা, বাংলাদেশ</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary" />
                      <span className="text-base sm:text-lg">01922545444</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary" />
                      <span className="text-base sm:text-lg">info@fitsync.bd</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-xl">Opening Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm sm:text-base">
                      <span>Monday - Friday</span>
                      <span className="font-medium">6:00 AM - 10:00 PM</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span>Saturday</span>
                      <span className="font-medium">7:00 AM - 9:00 PM</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span>Sunday</span>
                      <span className="font-medium">8:00 AM - 8:00 PM</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 sm:p-16 text-center text-white shadow-2xl"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">Ready to Start Your Fitness Journey?</h2>
            <p className="text-lg sm:text-2xl opacity-90 mb-8 sm:mb-12 max-w-4xl mx-auto">
              Join thousands of satisfied members who have transformed their lives with FitSync.
            </p>
            {is_authenticated ? (
              <div className="space-y-4 sm:space-y-6">
                <p className="text-xl sm:text-2xl">Welcome back, {loginuser?.name || user?.name}!</p>
                <Link href="/all-schedule">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="group px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold"
                  >
                    View Your Schedules
                    <Calendar className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            ) : (
              <Link href="/login">
                <Button
                  size="lg"
                  variant="secondary"
                  className="group px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold"
                >
                  Join FitSync Today
                  <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
