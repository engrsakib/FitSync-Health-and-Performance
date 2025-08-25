"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Plane, MeshDistortMaterial } from "@react-three/drei"
import { Suspense } from "react"
import { Users, Search, Filter, Mail, Calendar, TrendingUp, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 3D Animated Plane Component
function AnimatedPlane() {
  return (
    <Plane args={[3, 3, 32, 32]} scale={1}>
      <MeshDistortMaterial color="#f59e0b" attach="material" distort={0.5} speed={2} roughness={0.2} />
    </Plane>
  )
}

function SceneLoader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
    </div>
  )
}

export default function AllTraineePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Mock trainee data - replace with actual API call
  const mockTrainees = [
    {
      id: "3",
      name: "Trainee User",
      email: "trainee@fitsync.dev",
      avatar: "/placeholder.svg",
      joined_date: "2024-01-01T00:00:00Z",
      last_activity: "2024-01-15T10:30:00Z",
      status: "active" as const,
      total_bookings: 12,
      completed_sessions: 8,
      progress_score: 85,
      current_goals: ["Weight Loss", "Strength Building"],
    },
    {
      id: "4",
      name: "John Doe",
      email: "john@example.com",
      avatar: "/placeholder.svg",
      joined_date: "2024-01-05T00:00:00Z",
      last_activity: "2024-01-14T15:20:00Z",
      status: "active" as const,
      total_bookings: 8,
      completed_sessions: 6,
      progress_score: 72,
      current_goals: ["Cardio Improvement"],
    },
    {
      id: "5",
      name: "Jane Smith",
      email: "jane@example.com",
      avatar: "/placeholder.svg",
      joined_date: "2024-01-03T00:00:00Z",
      last_activity: "2024-01-10T09:45:00Z",
      status: "inactive" as const,
      total_bookings: 3,
      completed_sessions: 2,
      progress_score: 45,
      current_goals: ["Flexibility", "Stress Relief"],
    },
    {
      id: "6",
      name: "Mike Johnson",
      email: "mike@example.com",
      avatar: "/placeholder.svg",
      joined_date: "2024-01-08T00:00:00Z",
      last_activity: "2024-01-15T18:00:00Z",
      status: "active" as const,
      total_bookings: 15,
      completed_sessions: 13,
      progress_score: 92,
      current_goals: ["Muscle Building", "Performance"],
    },
  ]

  const filteredTrainees = mockTrainees.filter((trainee) => {
    const matchesSearch =
      trainee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainee.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || trainee.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      case "suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-amber-600"
    return "text-red-600"
  }

  const traineeStats = {
    total: mockTrainees.length,
    active: mockTrainees.filter((t) => t.status === "active").length,
    inactive: mockTrainees.filter((t) => t.status === "inactive").length,
    avgProgress: Math.round(mockTrainees.reduce((sum, t) => sum + t.progress_score, 0) / mockTrainees.length),
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
                All{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  Trainees
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Monitor your trainees' progress and provide personalized guidance
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{traineeStats.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{traineeStats.active}</div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{traineeStats.inactive}</div>
                <div className="text-sm text-muted-foreground">Inactive</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">{traineeStats.avgProgress}%</div>
                <div className="text-sm text-muted-foreground">Avg Progress</div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search trainees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
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
                  <AnimatedPlane />
                  <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.4} />
                </Suspense>
              </Canvas>
            </div>
          </motion.div>
        </div>

        {/* Trainees Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrainees.map((trainee, index) => (
            <motion.div
              key={trainee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300">
                <CardHeader className="text-center">
                  <Avatar className="h-16 w-16 mx-auto mb-4">
                    <AvatarImage src={trainee.avatar || "/placeholder.svg"} alt={trainee.name} />
                    <AvatarFallback className="text-lg">{trainee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl">{trainee.name}</CardTitle>
                  <CardDescription className="flex items-center justify-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>{trainee.email}</span>
                  </CardDescription>

                  {/* Status Badge */}
                  <Badge className={getStatusColor(trainee.status)}>{trainee.status}</Badge>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progress Score */}
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getProgressColor(trainee.progress_score)}`}>
                      {trainee.progress_score}%
                    </div>
                    <div className="text-sm text-muted-foreground">Progress Score</div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold">{trainee.total_bookings}</div>
                      <div className="text-xs text-muted-foreground">Total Bookings</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">{trainee.completed_sessions}</div>
                      <div className="text-xs text-muted-foreground">Completed</div>
                    </div>
                  </div>

                  {/* Goals */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Current Goals:</h4>
                    <div className="flex flex-wrap gap-1">
                      {trainee.current_goals.map((goal) => (
                        <Badge key={goal} variant="outline" className="text-xs">
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Last Activity */}
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Last active: {new Date(trainee.last_activity).toLocaleDateString()}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Progress
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTrainees.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No trainees found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No trainees are currently assigned to you"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
