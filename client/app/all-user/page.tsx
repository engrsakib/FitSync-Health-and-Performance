"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Tetrahedron, MeshDistortMaterial } from "@react-three/drei"
import { Suspense } from "react"
import { Users, Search, Filter, Mail, Calendar, UserCheck, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppSelector } from "@/src/redux/store"
import { config } from "@/src/lib/config"

// 3D Animated Tetrahedron Component
function AnimatedTetrahedron() {
  return (
    <Tetrahedron args={[1]} scale={1.5}>
      <MeshDistortMaterial color="#dc2626" attach="material" distort={0.4} speed={1.1} roughness={0.1} />
    </Tetrahedron>
  )
}

function SceneLoader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}

export default function AllUserPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const { user: currentUser } = useAppSelector((state) => state.auth)

  // Mock user data - replace with actual API call
  const mockUsers = [
    ...config.mock_users.map((user) => ({
      ...user,
      created_at: "2024-01-01T00:00:00Z",
      last_login: "2024-01-15T10:30:00Z",
      status: "active" as const,
      total_bookings: Math.floor(Math.random() * 20) + 1,
    })),
    {
      id: "4",
      name: "John Doe",
      email: "john@example.com",
      role: "TRAINEE" as const,
      avatar: "/placeholder.svg",
      created_at: "2024-01-05T00:00:00Z",
      last_login: "2024-01-14T15:20:00Z",
      status: "active" as const,
      total_bookings: 8,
    },
    {
      id: "5",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "TRAINEE" as const,
      avatar: "/placeholder.svg",
      created_at: "2024-01-03T00:00:00Z",
      last_login: "2024-01-13T09:45:00Z",
      status: "inactive" as const,
      total_bookings: 3,
    },
  ]

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterRole === "all" || user.role === filterRole
    return matchesSearch && matchesFilter
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "TRAINER":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "TRAINEE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

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

  const userStats = {
    total: mockUsers.length,
    admins: mockUsers.filter((u) => u.role === "ADMIN").length,
    trainers: mockUsers.filter((u) => u.role === "TRAINER").length,
    trainees: mockUsers.filter((u) => u.role === "TRAINEE").length,
    active: mockUsers.filter((u) => u.status === "active").length,
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
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Users</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Manage and monitor all platform users from one central dashboard
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{userStats.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{userStats.admins}</div>
                <div className="text-sm text-muted-foreground">Admins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{userStats.trainers}</div>
                <div className="text-sm text-muted-foreground">Trainers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{userStats.trainees}</div>
                <div className="text-sm text-muted-foreground">Trainees</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">{userStats.active}</div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="TRAINER">Trainer</SelectItem>
                  <SelectItem value="TRAINEE">Trainee</SelectItem>
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
                  <AnimatedTetrahedron />
                  <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.9} />
                </Suspense>
              </Canvas>
            </div>
          </motion.div>
        </div>

        {/* Users Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300">
                <CardHeader className="text-center">
                  <Avatar className="h-16 w-16 mx-auto mb-4">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="text-lg">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl">{user.name}</CardTitle>
                  <CardDescription className="flex items-center justify-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </CardDescription>

                  {/* Role and Status Badges */}
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                    <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* User Stats */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold">{user.total_bookings}</div>
                      <div className="text-xs text-muted-foreground">Bookings</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">
                        {Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))}d
                      </div>
                      <div className="text-xs text-muted-foreground">Member</div>
                    </div>
                  </div>

                  {/* Last Login */}
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Last login: {new Date(user.last_login).toLocaleDateString()}</span>
                  </div>

                  {/* Admin Actions */}
                  {currentUser?.role === "ADMIN" && user.id !== currentUser.id && (
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <UserCheck className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant={user.status === "active" ? "destructive" : "default"}
                        size="sm"
                        className="flex-1"
                      >
                        {user.status === "active" ? (
                          <>
                            <UserX className="h-4 w-4 mr-1" />
                            Suspend
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4 mr-1" />
                            Activate
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No users found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterRole !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No users are currently registered"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
