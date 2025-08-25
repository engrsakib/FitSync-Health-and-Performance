"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Sphere, MeshDistortMaterial, Box } from "@react-three/drei"
import { Suspense, useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  Calendar,
  TrendingUp,
  Star,
  ArrowRight,
  Activity,
  Target,
  Award,
  Heart,
  Calculator,
  BarChart3,
  Droplets,
  Clock,
  Utensils,
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { useAppSelector, useAppDispatch } from "@/src/redux/store"
import { set_bmi_data, toggle_targets_modal } from "@/src/redux/slices/ui_slice"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { toast } from "sonner"
import { z } from "zod"
import recsData from "@/src/data/recs.json"

function AnimatedSphere() {
  return (
    <Sphere visible args={[1, 100, 200]} scale={2}>
      <MeshDistortMaterial color="#dc2626" attach="material" distort={0.3} speed={1.5} roughness={0} />
    </Sphere>
  )
}

function FloatingCube({ position }: { position: [number, number, number] }) {
  return (
    <Box position={position} args={[0.5, 0.5, 0.5]}>
      <MeshDistortMaterial color="#f59e0b" attach="material" distort={0.2} speed={2} roughness={0} />
    </Box>
  )
}

function SceneLoader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}

const heroSlides = [
  {
    title: "Transform Your Fitness Journey",
    subtitle: "Join FitSync and discover personalized workouts",
    image: "/fitness-gym-modern-equipment.png",
    cta: "Start Your Journey",
  },
  {
    title: "Expert Trainers at Your Service",
    subtitle: "Connect with certified professionals",
    image: "/personal-trainer-coaching-fitness.png",
    cta: "Meet Our Trainers",
  },
  {
    title: "Track Your Progress",
    subtitle: "Advanced analytics and goal tracking",
    image: "/fitness-tracking-charts.png",
    cta: "View Analytics",
  },
  {
    title: "Community Support",
    subtitle: "Join thousands of fitness enthusiasts",
    image: "/fitness-community-group-workout.png",
    cta: "Join Community",
  },
]

const healthAwarenessData = [
  { metric: "Exercise Frequency", Bangladesh: 45, International: 72 },
  { metric: "Balanced Diet", Bangladesh: 38, International: 68 },
  { metric: "Sleep Sufficiency", Bangladesh: 52, International: 75 },
  { metric: "Water Intake", Bangladesh: 41, International: 81 },
]

const healthTips = [
  { icon: Droplets, tip: "Drink 8-10 glasses of water daily", color: "text-blue-500" },
  { icon: Activity, tip: "Exercise for 30 minutes daily", color: "text-red-500" },
  { icon: Clock, tip: "Get 7-8 hours of quality sleep", color: "text-purple-500" },
  { icon: Utensils, tip: "Eat 5 servings of fruits & vegetables", color: "text-green-500" },
  { icon: Heart, tip: "Practice meditation for mental health", color: "text-pink-500" },
  { icon: Target, tip: "Set realistic fitness goals", color: "text-orange-500" },
  { icon: Users, tip: "Stay connected with fitness community", color: "text-indigo-500" },
  { icon: Award, tip: "Celebrate small victories", color: "text-yellow-500" },
]

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

const targetsSchema = z.object({
  gender: z.enum(["male", "female"]),
  age: z.number().min(13).max(100),
  height: z.number().min(100).max(250),
  weight: z.number().min(30).max(300),
  activity: z.enum(["low", "med", "high"]),
})

export default function HomePage() {
  const { user, is_authenticated } = useAppSelector((state) => state.auth)
  const { bmi_data, is_targets_modal_open } = useAppSelector((state) => state.ui)
  const dispatch = useAppDispatch()

  const [currentSlide, setCurrentSlide] = useState(0)
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

  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const calculateBMI = () => {
    const weight = Number.parseFloat(bmiForm.weight)
    const age = Number.parseInt(bmiForm.age)

    let heightValue = 0
    if (bmiForm.unit === "cm") {
      heightValue = Number.parseFloat(bmiForm.height)
    } else {
      const feet = Number.parseFloat(bmiForm.heightFeet) || 0
      const inches = Number.parseFloat(bmiForm.heightInches) || 0
      heightValue = (feet * 12 + inches) * 2.54 // Convert to cm
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
        heightValue = (feet * 12 + inches) * 2.54 // Convert to cm
      }

      if (!age || !weight || !heightValue) {
        toast.error("Please fill all fields")
        return
      }

      const data = {
        gender: targetsForm.gender,
        age,
        height: heightValue,
        weight,
        activity: targetsForm.activity,
      }

      // Calculate BMI
      const heightInM = heightValue / 100
      const bmi = weight / (heightInM * heightInM)
      let bmiCategory = ""
      if (bmi < 18.5) bmiCategory = "Underweight"
      else if (bmi < 25) bmiCategory = "Normal"
      else if (bmi < 30) bmiCategory = "Overweight"
      else bmiCategory = "Obese"

      // Calculate targets
      const water = Math.round(data.weight * recsData.water_liters_per_kg * 10) / 10
      const baseCalories = recsData.calorie_base_by_gender[data.gender]
      const calories = Math.round(baseCalories * recsData.activity_multipliers[data.activity])

      let caloriesBurn = 0
      if (bmiCategory === "Overweight")
        caloriesBurn = Math.round(calories * 0.15) // 15% deficit
      else if (bmiCategory === "Obese")
        caloriesBurn = Math.round(calories * 0.25) // 25% deficit
      else if (bmiCategory === "Underweight")
        caloriesBurn = 0 // No deficit needed
      else caloriesBurn = Math.round(calories * 0.1) // 10% for maintenance

      let sleep = 7.0
      if (data.age >= 18 && data.age <= 25) sleep = recsData.sleep_by_age["18-25"]
      else if (data.age >= 26 && data.age <= 40) sleep = recsData.sleep_by_age["26-40"]
      else if (data.age >= 41 && data.age <= 60) sleep = recsData.sleep_by_age["41-60"]
      else if (data.age > 60) sleep = recsData.sleep_by_age["60+"]

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
      {/* Hero Section - Enhanced for mobile */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{
                opacity: currentSlide === index ? 1 : 0,
                scale: currentSlide === index ? 1 : 1.1,
              }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})` }} />
              <div className="absolute inset-0 bg-black/40" />
            </motion.div>
          ))}
        </div>

        {/* 3D Background Element - Hidden on mobile for performance */}
        <div className="absolute top-20 right-20 w-32 h-32 opacity-30 hidden lg:block">
          <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Suspense fallback={null}>
              <FloatingCube position={[0, 0, 0]} />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
            </Suspense>
          </Canvas>
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-2xl text-white"
            >
              <Badge variant="secondary" className="mb-4">
                <Star className="w-4 h-4 mr-1" />
                #1 Fitness Platform in Bangladesh
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-lg sm:text-xl mb-8 opacity-90">{heroSlides[currentSlide].subtitle}</p>
              <Link href={is_authenticated ? "/all-schedule" : "/login"}>
                <Button size="lg" className="group">
                  {heroSlides[currentSlide].cta}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      </section>

      {/* BMI Calculator - Enhanced with feet/inches option */}
      <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">BMI Calculator</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Calculate your Body Mass Index and understand your health status
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Calculate Your BMI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Gender</Label>
                        <Select
                          value={bmiForm.gender}
                          onValueChange={(value: "male" | "female") => setBmiForm({ ...bmiForm, gender: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Age</Label>
                        <Input
                          type="number"
                          placeholder="Age"
                          value={bmiForm.age}
                          onChange={(e) => setBmiForm({ ...bmiForm, age: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Height Unit</Label>
                      <Select
                        value={bmiForm.unit}
                        onValueChange={(value: "cm" | "ft") =>
                          setBmiForm({ ...bmiForm, unit: value, height: "", heightFeet: "", heightInches: "" })
                        }
                      >
                        <SelectTrigger>
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
                        <Label>Height (cm)</Label>
                        <Input
                          type="number"
                          placeholder="Height in cm"
                          value={bmiForm.height}
                          onChange={(e) => setBmiForm({ ...bmiForm, height: e.target.value })}
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Feet</Label>
                          <Input
                            type="number"
                            placeholder="Feet"
                            value={bmiForm.heightFeet}
                            onChange={(e) => setBmiForm({ ...bmiForm, heightFeet: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Inches</Label>
                          <Input
                            type="number"
                            placeholder="Inches"
                            value={bmiForm.heightInches}
                            onChange={(e) => setBmiForm({ ...bmiForm, heightInches: e.target.value })}
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <Label>Weight (kg)</Label>
                      <Input
                        type="number"
                        placeholder="Weight"
                        value={bmiForm.weight}
                        onChange={(e) => setBmiForm({ ...bmiForm, weight: e.target.value })}
                      />
                    </div>
                    <Button onClick={calculateBMI} className="w-full">
                      Calculate BMI
                    </Button>
                  </div>

                  {bmi_data && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-6"
                    >
                      <h3 className="text-xl sm:text-2xl font-bold mb-4">Your BMI Result</h3>
                      <div className="text-center">
                        <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">{bmi_data.bmi}</div>
                        <div
                          className={`text-base sm:text-lg font-semibold mb-4 ${
                            bmi_data.category === "Normal"
                              ? "text-green-600"
                              : bmi_data.category === "Underweight"
                                ? "text-blue-600"
                                : bmi_data.category === "Overweight"
                                  ? "text-orange-600"
                                  : "text-red-600"
                          }`}
                        >
                          {bmi_data.category}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Height: {Math.round(bmi_data.height)} cm</p>
                          <p>Weight: {bmi_data.weight} kg</p>
                          <p>Age: {bmi_data.age} years</p>
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

      {/* Health Awareness Chart - Enhanced responsiveness */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">বর্তমান স্বাস্থ্য সচেতনতা: বাংলাদেশ বনাম আন্তর্জাতিক</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Compare health awareness metrics between Bangladesh and international standards
            </p>
          </motion.div>

          <Card className="max-w-6xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <BarChart3 className="w-5 h-5" />
                Health Awareness Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 sm:h-80 lg:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={healthAwarenessData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" fontSize={12} interval={0} angle={-45} textAnchor="end" height={80} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Bangladesh" fill="#dc2626" name="Bangladesh" />
                    <Bar dataKey="International" fill="#f59e0b" name="International" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* CTA Band */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-16 relative overflow-hidden rounded-3xl"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(/placeholder.svg?height=200&width=1200&query=fitness+motivation+banner)` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90" />
            <div className="relative z-10 text-center py-16 px-8 text-white">
              <h3 className="text-3xl font-bold mb-4">Ready to Improve Your Health?</h3>
              <p className="text-xl mb-8 opacity-90">Join thousands who have transformed their lifestyle</p>
              <Link href="/login">
                <Button size="lg" variant="secondary" className="group">
                  Join with us
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Personalized Daily Targets - Enhanced with feet/inches option */}
      <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Personalized Daily Targets</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Get customized daily recommendations based on your profile
            </p>
          </motion.div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Calculate Your Daily Targets</CardTitle>
              <CardDescription>Enter your details to get personalized recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Gender</Label>
                    <Select
                      value={targetsForm.gender}
                      onValueChange={(value: "male" | "female") => setTargetsForm({ ...targetsForm, gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Age</Label>
                    <Input
                      type="number"
                      placeholder="Age"
                      value={targetsForm.age}
                      onChange={(e) => setTargetsForm({ ...targetsForm, age: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Height Unit</Label>
                  <Select
                    value={targetsForm.unit}
                    onValueChange={(value: "cm" | "ft") =>
                      setTargetsForm({ ...targetsForm, unit: value, height: "", heightFeet: "", heightInches: "" })
                    }
                  >
                    <SelectTrigger>
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
                    <Label>Height (cm)</Label>
                    <Input
                      type="number"
                      placeholder="Height in cm"
                      value={targetsForm.height}
                      onChange={(e) => setTargetsForm({ ...targetsForm, height: e.target.value })}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Feet</Label>
                      <Input
                        type="number"
                        placeholder="Feet"
                        value={targetsForm.heightFeet}
                        onChange={(e) => setTargetsForm({ ...targetsForm, heightFeet: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Inches</Label>
                      <Input
                        type="number"
                        placeholder="Inches"
                        value={targetsForm.heightInches}
                        onChange={(e) => setTargetsForm({ ...targetsForm, heightInches: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Weight (kg)</Label>
                    <Input
                      type="number"
                      placeholder="Weight"
                      value={targetsForm.weight}
                      onChange={(e) => setTargetsForm({ ...targetsForm, weight: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Activity Level</Label>
                    <Select
                      value={targetsForm.activity}
                      onValueChange={(value: "low" | "med" | "high") =>
                        setTargetsForm({ ...targetsForm, activity: value })
                      }
                    >
                      <SelectTrigger>
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

      {/* Enhanced Daily Targets Modal */}
      <Dialog open={is_targets_modal_open} onOpenChange={() => dispatch(toggle_targets_modal())}>
        <DialogContent className="max-w-md mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Your Daily Targets</DialogTitle>
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
                        ? "text-green-600"
                        : dailyTargets.bmiCategory === "Underweight"
                          ? "text-blue-600"
                          : dailyTargets.bmiCategory === "Overweight"
                            ? "text-orange-600"
                            : "text-red-600"
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

      {/* Health Tips Ring - Enhanced responsiveness */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Daily Health Tips</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Essential tips for maintaining a healthy lifestyle
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {/* Center Image */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-primary/20"
              >
                <img src="/healthy-lifestyle-icon.png" alt="Health Center" className="w-full h-full object-cover" />
              </motion.div>
            </div>

            {/* Tips Ring - Responsive layout */}
            <div className="relative w-full aspect-square max-w-2xl mx-auto">
              {healthTips.map((tip, index) => {
                const angle = (index * 360) / healthTips.length
                const radius = window.innerWidth < 640 ? 35 : 45 // Smaller radius on mobile
                const x = 50 + radius * Math.cos(((angle - 90) * Math.PI) / 180)
                const y = 50 + radius * Math.sin(((angle - 90) * Math.PI) / 180)

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <Card className="w-36 sm:w-48 p-3 sm:p-4 text-center hover:shadow-lg transition-all duration-300">
                      <tip.icon className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 ${tip.color}`} />
                      <p className="text-xs sm:text-sm font-medium">{tip.tip}</p>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose FitSync?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of fitness with our cutting-edge platform designed for your success
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.color}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form - Enhanced responsiveness */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Get In Touch</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Mail className="w-5 h-5" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        type="text"
                        placeholder="Your name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Message</Label>
                    <Textarea
                      placeholder="Your message..."
                      rows={4}
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

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Visit Our Location</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find us at our convenient location in Magura, Bangladesh
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative h-96 rounded-2xl overflow-hidden"
            >
              <img
                src="/bangladesh-map-location-magura.png"
                alt="Location Map"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>

            {/* Address Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Our Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium mb-2">স্টেডিয়ামপাড়া, মাগুরা সদর</p>
                  <p className="text-lg font-medium mb-4">মাগুরা, বাংলাদেশ</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary" />
                      <span className="text-lg">01922545444</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary" />
                      <span className="text-lg">info@fitsync.bd</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Opening Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span className="font-medium">6:00 AM - 10:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span className="font-medium">7:00 AM - 9:00 PM</span>
                    </div>
                    <div className="flex justify-between">
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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-12 text-center text-white"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Start Your Fitness Journey?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied members who have transformed their lives with FitSync. Your fitness goals are
              just one click away.
            </p>
            {is_authenticated ? (
              <div className="space-y-4">
                <p className="text-lg">Welcome back, {user?.name}!</p>
                <Link href="/all-schedule">
                  <Button size="lg" variant="secondary" className="group">
                    View Your Schedules
                    <Calendar className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            ) : (
              <Link href="/login">
                <Button size="lg" variant="secondary" className="group">
                  Join FitSync Today
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
