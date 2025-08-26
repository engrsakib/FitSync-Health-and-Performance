"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Cone, MeshDistortMaterial } from "@react-three/drei"
import { Suspense } from "react"
import { Calendar, Clock, Users, Plus, Save, XCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAppSelector } from "@/src/redux/store"
import { config } from "@/src/lib/config"

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

type TrainerType = {
  _id: string
  id: string
  name: string
}

type MessageModalProps = {
  open: boolean
  type: "success" | "error"
  message: string
  onClose: () => void
}

function MessageModal({ open, type, message, onClose }: MessageModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xs mx-auto text-center">
        <DialogHeader>
          <DialogTitle className="flex flex-col items-center gap-2">
            {type === "success" ? (
              <CheckCircle className="w-10 h-10 text-green-600 mx-auto" />
            ) : (
              <XCircle className="w-10 h-10 text-red-600 mx-auto" />
            )}
            {type === "success" ? "Success!" : "Error"}
          </DialogTitle>
        </DialogHeader>
        <div className="py-2 text-lg">{message}</div>
        <Button onClick={onClose} variant={type === "success" ? "default" : "destructive"} className="w-full mt-2">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default function CreateSchedulePage() {
  const { user } = useAppSelector((state) => state.auth)
  const [isLoading, setIsLoading] = useState(false)
  const [trainers, setTrainers] = useState<TrainerType[]>([])
  const [trainersLoading, setTrainersLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    trainer: "",
    classDate: "",
    startTime: "",
    endTime: "",
  })

  // Success/Error Message Modal
  const [messageModalOpen, setMessageModalOpen] = useState(false)
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  const [messageText, setMessageText] = useState("")

  // SSR hydration error fix: getMinDate without Date object in render
  // Use useEffect to set minDate on mount
  const [minDate, setMinDate] = useState("")
  useEffect(() => {
    setMinDate(new Date().toISOString().split("T")[0])
  }, [])

  // Fetch trainers from API (client-side only)
  useEffect(() => {
    async function fetchTrainers() {
      setTrainersLoading(true)
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("acccessToken") ||
              localStorage.getItem("access_token") ||
              ""
            : ""
        const res = await fetch(`${config.api_base_url}/api/v1/users/role/TRAINER`, {
          headers: { Authorization: `${token}` },
        })
        const result = await res.json()
        if (res.ok && result.success !== false && Array.isArray(result.data)) {
          setTrainers(result.data)
        } else {
          setTrainers([])
        }
      } catch {
        setTrainers([])
      }
      setTrainersLoading(false)
    }
    fetchTrainers()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const showMessage = (type: "success" | "error", text: string) => {
    setMessageType(type)
    setMessageText(text)
    setMessageModalOpen(true)
  }
  const closeMessageModal = () => {
    setMessageModalOpen(false)
    setMessageText("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validation
    if (
      !formData.title ||
      !formData.trainer ||
      !formData.classDate ||
      !formData.startTime
    ) {
      showMessage("error", "Please fill in all required fields.")
      setIsLoading(false)
      return
    }

    if (
      new Date(`${formData.classDate}T${formData.startTime}`) >=
      new Date(`${formData.classDate}T${formData.endTime}`)
    ) {
      showMessage("error", "End time must be after start time.")
      setIsLoading(false)
      return
    }

    try {
      // Format data for API
      const payload = {
        title: formData.title,
        description: formData.description,
        trainer: formData.trainer,
        classDate: new Date(formData.classDate).toISOString(),
        startTime: formData.startTime,
        createdBy: user?.id || user?._id || "",
      }

      // Send to backend
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("acccessToken") ||
            localStorage.getItem("access_token") ||
            ""
          : ""
      const response = await fetch(`${config.api_base_url}/api/v1/scheduling/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(payload),
      })
      const result = await response.json()

      if (response.ok && result.success) {
        showMessage("success", "The fitness schedule has been created successfully!")
        setFormData({
          title: "",
          description: "",
          trainer: "",
          classDate: "",
          startTime: "",
        
        })
      } else {
        showMessage("success", result.message || "Failed to create schedule. Please try again.");
        window.location.href = "/all-schedule"
      }
    } catch (error) {
      showMessage("error", "Failed to create schedule. Please try again.")
    } finally {
      setIsLoading(false)
    }
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
                    {trainersLoading ? (
                      <div className="flex items-center gap-2 text-muted-foreground py-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                        Loading trainers...
                      </div>
                    ) : (
                      <Select
                        value={formData.trainer}
                        onValueChange={(value) => handleInputChange("trainer", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a trainer" />
                        </SelectTrigger>
                        <SelectContent>
                          {trainers.map((trainer) => (
                            <SelectItem key={trainer._id || trainer.id} value={trainer._id || trainer.id}>
                              {trainer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>

                {/* Schedule Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Schedule Details</h3>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="classDate">Date *</Label>
                      <Input
                        id="classDate"
                        type="date"
                        min={minDate}
                        value={formData.classDate}
                        onChange={(e) => handleInputChange("classDate", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time *</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => handleInputChange("startTime", e.target.value)}
                        required
                      />
                    </div>

                    {/* <div className="space-y-2">
                      <Label htmlFor="endTime">End Time *</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => handleInputChange("endTime", e.target.value)}
                        required
                      />
                    </div> */}
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
        <MessageModal
          open={messageModalOpen}
          type={messageType}
          message={messageText}
          onClose={closeMessageModal}
        />
      </div>
    </div>
  )
}