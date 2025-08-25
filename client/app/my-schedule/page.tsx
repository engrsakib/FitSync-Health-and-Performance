"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Ring, MeshDistortMaterial } from "@react-three/drei"
import { Suspense } from "react"
import { Calendar, Clock, Users, Edit, Trash2, Plus, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppSelector } from "@/src/redux/store"
import Link from "next/link"
import { config } from "@/src/lib/config"

function AnimatedRing() {
  return (
    <Ring args={[0.5, 1.5, 32]} scale={1.3}>
      <MeshDistortMaterial color="#dc2626" attach="material" distort={0.2} speed={1.6} roughness={0.1} />
    </Ring>
  )
}

function SceneLoader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}

type ScheduleType = {
  _id: string
  title: string
  description: string
  classDate: string
  startTime: string
  endTime: string
  maxTrainees: number
  trainees: string[]
  status: string
  isCancelled: boolean
  isCompleted: boolean
  isFull: boolean
  createdAt: string
}

export default function MySchedulePage() {
  const { user } = useAppSelector((state) => state.auth)
  const [schedules, setSchedules] = useState<ScheduleType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTrainerSchedules() {
      if (!user?.id) return
      setLoading(true)
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("acccessToken") ||
              localStorage.getItem("access_token") ||
              ""
            : ""
        const res = await fetch(
          `${config.api_base_url}/api/v1/scheduling/trainer/${user.id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        )
        const result = await res.json()
        if (res.ok && result.success !== false && Array.isArray(result.data)) {
          setSchedules(result.data)
        } else {
          setSchedules([])
        }
      } catch {
        setSchedules([])
      }
      setLoading(false)
    }
    fetchTrainerSchedules()
  }, [user?.id])

  const getStatusColor = (status: string, isCancelled: boolean, isCompleted: boolean) => {
    if (isCancelled) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    if (isCompleted) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    if (status === "scheduled") return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }

  const getAvailabilityColor = (booked: number, capacity: number) => {
    const percentage = (booked / capacity) * 100
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 70) return "text-amber-600"
    return "text-green-600"
  }

  // Categorize
  const activeSchedules = schedules.filter((s) => s.status === "scheduled" && !s.isCancelled && !s.isCompleted)
  const completedSchedules = schedules.filter((s) => s.isCompleted)
  const cancelledSchedules = schedules.filter((s) => s.isCancelled)

  const scheduleStats = {
    total: schedules.length,
    active: activeSchedules.length,
    completed: completedSchedules.length,
    cancelled: cancelledSchedules.length,
    totalBookings: schedules.reduce((sum, s) => sum + (s.trainees?.length ?? 0), 0),
  }

  const renderScheduleCard = (schedule: ScheduleType, index: number) => (
    <motion.div
      key={schedule._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -2 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl">{schedule.title}</CardTitle>
              <CardDescription>{schedule.description}</CardDescription>
            </div>
            <Badge className={getStatusColor(schedule.status, schedule.isCancelled, schedule.isCompleted)}>
              {schedule.isCancelled
                ? "cancelled"
                : schedule.isCompleted
                ? "completed"
                : schedule.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{new Date(schedule.classDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {schedule.startTime} - {schedule.endTime}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm col-span-full">
              <Users className="h-4 w-4" />
              <span className={getAvailabilityColor(schedule.trainees?.length ?? 0, schedule.maxTrainees)}>
                {(schedule.trainees?.length ?? 0)}/{schedule.maxTrainees} participants
              </span>
            </div>
          </div>

          {!schedule.isCancelled && !schedule.isCompleted && (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" className="flex-1">
                <Trash2 className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )

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
                My{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  Schedule
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Manage your fitness classes and track participant engagement
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{scheduleStats.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{scheduleStats.active}</div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{scheduleStats.completed}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{scheduleStats.cancelled}</div>
                <div className="text-sm text-muted-foreground">Cancelled</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">{scheduleStats.totalBookings}</div>
                <div className="text-sm text-muted-foreground">Bookings</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-4">
              <Link href="/create-schedule">
                <Button className="group">
                  <Plus className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                  Create New Schedule
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* 3D Scene */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[300px] lg:h-[400px]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl"></div>
            <div className="relative h-full rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm border">
              <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} />
                <Suspense fallback={<SceneLoader />}>
                  <AnimatedRing />
                  <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                </Suspense>
              </Canvas>
            </div>
          </motion.div>
        </div>

        {/* Schedule Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active ({activeSchedules.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedSchedules.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({cancelledSchedules.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <SceneLoader />
              </div>
            ) : activeSchedules.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeSchedules.map((schedule, index) => renderScheduleCard(schedule, index))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No active schedules</h3>
                <p className="text-muted-foreground mb-4">Create your first fitness class to get started!</p>
                <Link href="/create-schedule">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Schedule
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <SceneLoader />
              </div>
            ) : completedSchedules.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedSchedules.map((schedule, index) => renderScheduleCard(schedule, index))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No completed schedules</h3>
                <p className="text-muted-foreground">Completed classes will appear here.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <SceneLoader />
              </div>
            ) : cancelledSchedules.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cancelledSchedules.map((schedule, index) => renderScheduleCard(schedule, index))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No cancelled schedules</h3>
                <p className="text-muted-foreground">Great! You haven't cancelled any classes.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}