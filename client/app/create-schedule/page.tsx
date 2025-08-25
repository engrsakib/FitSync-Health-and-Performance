"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Cone, MeshDistortMaterial } from "@react-three/drei"
import { Suspense } from "react"
import { Calendar, Clock, Users, Plus, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

// 3D Animated Cone Component
function AnimatedCone() {
  return (
    <Cone args={[1, 2, 8]} scale={1.2}>
      <MeshDistortMaterial color="#f59e0b" attach="material" distort={0.3} speed={1.4} roughness={0.1} />
    </Cone>
  )
}

function SceneLoader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
    </div>
  )
}

export default function CreateSchedulePage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    trainer_id: "",
    date: "",
    start_time: "",
    end_time: "",
    capacity: "",
  })

  // Mock trainers data - replace with actual API call
  const mockTrainers = [
    { id: "2", name: "Trainer User", specialty: ["Yoga", "HIIT"] },
    { id: "6", name: "Sarah Johnson", specialty: ["Pilates", "Strength"] },
    { id: "7", name: "Mike Wilson", specialty: ["CrossFit", "Cardio"] },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validation
    if (
      !formData.title ||
      !formData.trainer_id ||
      !formData.date ||
      !formData.start_time ||
      !formData.end_time ||
      !formData.capacity
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (new Date(`${formData.date}T${formData.start_time}`) >= new Date(`${formData.date}T${formData.end_time}`)) {
      toast({
        title: "Time Error",
        description: "End time must be after start time.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${config.api_base_url}/schedules`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })

      // Mock success
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Schedule Created",
        description: "The fitness schedule has been created successfully!",
      })

      // Reset form
      setFormData({
        title: "",
        description: "",
        trainer_id: "",
        date: "",
        start_time: "",
        end_time: "",
        capacity: "",
      })
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create schedule. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header with 3D Animation */}
        <div className="grid lg:grid-cols-2 gap-8 items-center mb-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold">
                Create{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  Schedule
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Set up new fitness classes and training sessions for your members
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-card rounded-lg border">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-sm text-muted-foreground">Schedule</div>
                <div className="font-semibold">Planning</div>
              </div>
              <div className="text-center p-4 bg-card rounded-lg border">
                <Users className="h-8 w-8 mx-auto mb-2 text-secondary" />
                <div className="text-sm text-muted-foreground">Capacity</div>
                <div className="font-semibold">Management</div>
              </div>
              <div className="text-center p-4 bg-card rounded-lg border">
                <Clock className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-sm text-muted-foreground">Time</div>
                <div className="font-semibold">Optimization</div>
              </div>
            </div>
          </motion.div>

          {/* 3D Scene */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[300px] lg:h-[400px]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-3xl blur-3xl"></div>
            <div className="relative h-full rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm border">
              <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} />
                <Suspense fallback={<SceneLoader />}>
                  <AnimatedCone />
                  <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.6} />
                </Suspense>
              </Canvas>
            </div>
          </motion.div>
        </div>

        {/* Create Schedule Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center space-x-2">
                <Plus className="h-6 w-6" />
                <span>New Fitness Schedule</span>
              </CardTitle>
              <CardDescription>
                Fill in the details below to create a new fitness class or training session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>

                  <div className="space-y-2">
                    <Label htmlFor="title">Class Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Morning Yoga, HIIT Training"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the class, its benefits, and what participants can expect..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trainer">Trainer *</Label>
                    <Select
                      value={formData.trainer_id}
                      onValueChange={(value) => handleInputChange("trainer_id", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a trainer" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockTrainers.map((trainer) => (
                          <SelectItem key={trainer.id} value={trainer.id}>
                            {trainer.name} - {trainer.specialty.join(", ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Schedule Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Schedule Details</h3>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        min={getMinDate()}
                        value={formData.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="start_time">Start Time *</Label>
                      <Input
                        id="start_time"
                        type="time"
                        value={formData.start_time}
                        onChange={(e) => handleInputChange("start_time", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="end_time">End Time *</Label>
                      <Input
                        id="end_time"
                        type="time"
                        value={formData.end_time}
                        onChange={(e) => handleInputChange("end_time", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capacity">Maximum Capacity *</Label>
                    <Input
                      id="capacity"
                      type="number"
                      min="1"
                      max="100"
                      placeholder="e.g., 20"
                      value={formData.capacity}
                      onChange={(e) => handleInputChange("capacity", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full group" disabled={isLoading} size="lg">
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                      Create Schedule
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
