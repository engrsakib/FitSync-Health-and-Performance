"use client"
import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Icosahedron, MeshDistortMaterial } from "@react-three/drei"
import { Suspense } from "react"
import { Calendar, Clock, User, MapPin, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppSelector } from "@/src/redux/store"

// 3D Animated Icosahedron Component
function AnimatedIcosahedron() {
  return (
    <Icosahedron args={[1]} scale={1.3}>
      <MeshDistortMaterial color="#dc2626" attach="material" distort={0.25} speed={1.3} roughness={0.1} />
    </Icosahedron>
  )
}

function SceneLoader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}

export default function MyBookingPage() {
  const { user } = useAppSelector((state) => state.auth)

  // Mock booking data - replace with actual API call
  const mockBookings = [
    {
      id: "1",
      schedule_id: "1",
      schedule_title: "Morning Yoga",
      schedule_description: "Start your day with energizing yoga",
      trainer_name: "Trainer User",
      date: "2024-01-15",
      start_time: "07:00",
      end_time: "08:00",
      status: "confirmed" as const,
      booked_at: "2024-01-10T10:00:00Z",
    },
    {
      id: "2",
      schedule_id: "2",
      schedule_title: "HIIT Training",
      schedule_description: "High intensity interval training",
      trainer_name: "Trainer User",
      date: "2024-01-12",
      start_time: "18:00",
      end_time: "19:00",
      status: "completed" as const,
      booked_at: "2024-01-08T15:30:00Z",
    },
    {
      id: "3",
      schedule_id: "3",
      schedule_title: "Strength Training",
      schedule_description: "Build muscle and strength",
      trainer_name: "Another Trainer",
      date: "2024-01-20",
      start_time: "16:00",
      end_time: "17:00",
      status: "cancelled" as const,
      booked_at: "2024-01-05T12:00:00Z",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const confirmedBookings = mockBookings.filter((b) => b.status === "confirmed")
  const completedBookings = mockBookings.filter((b) => b.status === "completed")
  const cancelledBookings = mockBookings.filter((b) => b.status === "cancelled")

  const renderBookingCard = (booking: (typeof mockBookings)[0], index: number) => (
    <motion.div
      key={booking.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -2 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl flex items-center space-x-2">
                <span>{booking.schedule_title}</span>
                {getStatusIcon(booking.status)}
              </CardTitle>
              <CardDescription>{booking.schedule_description}</CardDescription>
            </div>
            <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{new Date(booking.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {booking.start_time} - {booking.end_time}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{booking.trainer_name}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Booked: {new Date(booking.booked_at).toLocaleDateString()}</span>
            </div>
          </div>

          {booking.status === "confirmed" && (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                Reschedule
              </Button>
              <Button variant="destructive" size="sm" className="flex-1">
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
                  Bookings
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Manage your fitness class bookings and track your progress
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{confirmedBookings.length}</div>
                <div className="text-sm text-muted-foreground">Confirmed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{completedBookings.length}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{cancelledBookings.length}</div>
                <div className="text-sm text-muted-foreground">Cancelled</div>
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
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl"></div>
            <div className="relative h-full rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm border">
              <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} />
                <Suspense fallback={<SceneLoader />}>
                  <AnimatedIcosahedron />
                  <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.7} />
                </Suspense>
              </Canvas>
            </div>
          </motion.div>
        </div>

        {/* Bookings Tabs */}
        <Tabs defaultValue="confirmed" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="confirmed">Confirmed ({confirmedBookings.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedBookings.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({cancelledBookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="confirmed" className="space-y-6">
            {confirmedBookings.length > 0 ? (
              <div className="grid gap-6">
                {confirmedBookings.map((booking, index) => renderBookingCard(booking, index))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No confirmed bookings</h3>
                <p className="text-muted-foreground">Book a class to get started with your fitness journey!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {completedBookings.length > 0 ? (
              <div className="grid gap-6">
                {completedBookings.map((booking, index) => renderBookingCard(booking, index))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No completed bookings</h3>
                <p className="text-muted-foreground">Complete some classes to see them here!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-6">
            {cancelledBookings.length > 0 ? (
              <div className="grid gap-6">
                {cancelledBookings.map((booking, index) => renderBookingCard(booking, index))}
              </div>
            ) : (
              <div className="text-center py-12">
                <XCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No cancelled bookings</h3>
                <p className="text-muted-foreground">Great! You haven't cancelled any bookings.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
