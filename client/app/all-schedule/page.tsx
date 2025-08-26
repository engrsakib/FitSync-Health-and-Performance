"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Octahedron, MeshDistortMaterial } from "@react-three/drei"
import { Suspense } from "react"
import { Calendar, Clock, Users, Star, Filter, Search, XCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useAppDispatch, useAppSelector } from "@/src/redux/store"
import { fetch_schedules } from "@/src/redux/slices/data_slice"
import { config } from "@/src/lib/config"

function AnimatedOctahedron() {
  return (
    <Octahedron args={[1]} scale={1.5}>
      <MeshDistortMaterial color="#dc2626" attach="material" distort={0.2} speed={1.5} roughness={0.1} />
    </Octahedron>
  )
}

function SceneLoader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
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

type BookingModalProps = {
  open: boolean
  onClose: () => void
  scheduleId: string
  traineeId: string
  onBooked: () => void
  showMessage: (type: "success" | "error", message: string) => void
  goToMyBooking: () => void
}

function BookingModal({ open, onClose, scheduleId, traineeId, onBooked, showMessage, goToMyBooking }: BookingModalProps) {
  const [bookingDate, setBookingDate] = useState("")
  const [bookingTime, setBookingTime] = useState("")
  const [loading, setLoading] = useState(false)

  const handleBook = async () => {
    if (!bookingDate || !bookingTime) {
      showMessage("error", "Please select date and time")
      return
    }
    setLoading(true)
    try {
      const dateIso = new Date(`${bookingDate}T${bookingTime}:00`).toISOString()
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("acccessToken") ||
            localStorage.getItem("access_token") ||
            ""
          : ""
      const res = await fetch(`${config.api_base_url}/api/v1/booking/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          schedule: scheduleId,
          trainee: traineeId,
          bookingDate: dateIso,
        }),
      })
      const result = await res.json()
      if (res.ok && result.success) {
        setBookingDate("")
        setBookingTime("")
        setLoading(false)
        onBooked()
        onClose()
        showMessage("success", "Booking successful!")
        // Redirect after a slight delay to let modal show
        setTimeout(goToMyBooking, 1200)
      } else {
        setLoading(false)
        showMessage("error", result.message || "Booking failed!")
      }
    } catch (e) {
      setLoading(false)
      showMessage("error", "Booking failed!")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle>Book Schedule</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              min={new Date().toISOString().slice(0, 10)}
            />
          </div>
          <div>
            <Label>Time</Label>
            <Input
              type="time"
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
            />
          </div>
          <Button onClick={handleBook} className="w-full mt-4" disabled={loading}>
            {loading ? "Booking..." : "Confirm Booking"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Helper function to get trainee name by id from users in redux (if available)
function getTraineeName(traineeId: string, users: any[]): string {
  const found = users?.find((u) => u?.id === traineeId || u?._id === traineeId)
  return found?.name ? found.name : "Annonimus Trinynar"
}

export default function AllSchedulePage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null)
  const [messageModalOpen, setMessageModalOpen] = useState(false)
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  const [messageText, setMessageText] = useState("")
  const dispatch = useAppDispatch()
  const { schedules, is_loading, users } = useAppSelector((state) => state.data)
  const { user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetch_schedules())
  }, [dispatch])

  // Backend schedules mapping
  const mappedSchedules = schedules.map((s: any) => ({
    id: s._id,
    title: s.title,
    description: s.description,
    trainer_name: s?.trainer?.name
      || s.trainer_name
      || "Anonymous Trainer",
    date: s.classDate,
    start_time: s.startTime,
    end_time: s.endTime,
    status: s.status === "scheduled" && !s.isCancelled && !s.isCompleted ? "active"
      : s.isCancelled ? "cancelled"
      : s.isCompleted ? "completed"
      : s.status,
    capacity: s.maxTrainees,
    booked: Array.isArray(s.trainees) ? s.trainees.length : 0,
    isFull: s.isFull,
    raw: s,
    userBookingId: user?.role === "TRAINEE" && Array.isArray(s.bookings)
      ? s.bookings.find((b: any) => b.trainee === user.id)?._id
      : null,
    traineeNames: Array.isArray(s.trainees)
      ? s.trainees.map((tid: string) => getTraineeName(tid, users || []))
      : [],
  }))

  const filteredSchedules = mappedSchedules.filter((schedule) => {
    const matchesSearch =
      schedule.title.toLowerCase().includes(searchTerm.toLowerCase())
      || (schedule.trainer_name?.toLowerCase?.()?.includes(searchTerm.toLowerCase()) ?? false)
    const matchesFilter = filterStatus === "all" || schedule.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "completed": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getAvailabilityColor = (booked: number, capacity: number) => {
    const percentage = (booked / capacity) * 100
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 70) return "text-amber-600"
    return "text-green-600"
  }

  const [bookingScheduleId, setBookingScheduleId] = useState<string | null>(null)

  // Open modal for booking
  const openBookingModal = (scheduleId: string) => {
    setBookingScheduleId(scheduleId)
    setBookingModalOpen(true)
  }
  const closeBookingModal = () => {
    setBookingScheduleId(null)
    setBookingModalOpen(false)
  }

  // Message modal handler
  const showMessage = (type: "success" | "error", text: string) => {
    setMessageType(type)
    setMessageText(text)
    setMessageModalOpen(true)
  }
  const closeMessageModal = () => {
    setMessageModalOpen(false)
    setMessageText("")
  }

  // Cancel booking
  const handleCancelBooking = async (bookingId: string) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("acccessToken") ||
          localStorage.getItem("access_token") ||
          ""
        : ""
    try {
      const res = await fetch(`${config.api_base_url}/api/v1/booking/${bookingId}`, {
        method: "PATCH",
        headers: {
          Authorization: `${token}`,
        },
      })
      const result = await res.json()
      if (res.ok && result.success) {
        showMessage("success", "Booking cancelled!")
        dispatch(fetch_schedules())
      } else {
        showMessage("error", result.message || "Cancel booking failed!")
      }
    } catch (e) {
      showMessage("error", "Cancel booking failed!")
    }
  }

  // Go to /my-booking after booking success
  const goToMyBooking = () => {
    router.push("/my-booking")
  }

  // Find selected schedule for booking modal
  const selectedSchedule = mappedSchedules.find(s => s.id === bookingScheduleId)

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
                  Schedules
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Discover and book fitness classes that match your goals and schedule
              </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search schedules or trainers..."
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
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
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
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl"></div>
            <div className="relative h-full rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm border">
              <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} />
                <Suspense fallback={<SceneLoader />}>
                  <AnimatedOctahedron />
                  <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
                </Suspense>
              </Canvas>
            </div>
          </motion.div>
        </div>

        {/* Loading State */}
        {is_loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Schedules Grid */}
        {!is_loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchedules.map((schedule, index) => (
              <motion.div
                key={schedule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-xl">{schedule.title}</CardTitle>
                        <CardDescription>{schedule.description}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(schedule.status)}>{schedule.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(schedule.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {schedule.start_time} - {schedule.end_time}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Star className="h-4 w-4" />
                        <span>
                          Trainer: {schedule.trainer_name || "Unknown Trainer"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Users className="h-4 w-4" />
                        <span className={getAvailabilityColor(schedule.booked, schedule.capacity)}>
                          {schedule.booked}/{schedule.capacity} spots filled
                        </span>
                      </div>
                      {/* Trainee names list */}
                      {schedule.traineeNames?.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-2">
                          <span className="font-semibold">Trainees: </span>
                          {schedule.traineeNames.map((tn: string, i: number) => (
                            <span key={i} className="mr-2">
                              {tn}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {user?.role === "TRAINEE" && schedule.status === "active" && (
                      schedule.userBookingId ? (
                        <Button
                          className="w-full"
                          variant="destructive"
                          onClick={() => handleCancelBooking(schedule.userBookingId)}
                        >
                          Cancel Booking
                        </Button>
                      ) : (
                        <Button
                          className="w-full"
                          disabled={schedule.booked >= schedule.capacity || schedule.isFull}
                          onClick={() => openBookingModal(schedule.id)}
                        >
                          {schedule.booked >= schedule.capacity || schedule.isFull
                            ? "Fully Booked"
                            : "Book Now"}
                        </Button>
                      )
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Booking Modal */}
        {bookingModalOpen && selectedSchedule && user?.role === "TRAINEE" && (
          <BookingModal
            open={bookingModalOpen}
            onClose={closeBookingModal}
            scheduleId={selectedSchedule.id}
            traineeId={user.id}
            onBooked={() => dispatch(fetch_schedules())}
            showMessage={showMessage}
            goToMyBooking={goToMyBooking}
          />
        )}

        {/* Success/Error Message Modal */}
        <MessageModal
          open={messageModalOpen}
          type={messageType}
          message={messageText}
          onClose={closeMessageModal}
        />

        {/* Empty State */}
        {!is_loading && filteredSchedules.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No schedules found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No schedules are currently available"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}