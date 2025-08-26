"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Dodecahedron, MeshDistortMaterial } from "@react-three/drei"
import { Suspense } from "react"
import { Calendar, Search, Filter, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { config } from "@/src/lib/config"

function AnimatedDodecahedron() {
  return (
    <Dodecahedron args={[1]} scale={1.2}>
      <MeshDistortMaterial color="#f59e0b" attach="material" distort={0.3} speed={1.2} roughness={0.1} />
    </Dodecahedron>
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
  email: string
  role: string
  picture?: string | null
}

export default function AllTrainerPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [trainers, setTrainers] = useState<TrainerType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchTrainers() {
      setIsLoading(true)
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("acccessToken") ||
              localStorage.getItem("access_token") ||
              ""
            : ""
        const res = await fetch(`${config.api_base_url}/api/v1/users/role/TRAINER`, {
          headers: { Authorization: `${token}` }
        })
        const result = await res.json()
        if (res.ok && result.success && Array.isArray(result.data)) {
          setTrainers(result.data)
        } else {
          setTrainers([])
        }
      } catch {
        setTrainers([])
      }
      setIsLoading(false)
    }
    fetchTrainers()
  }, [])

  const filteredTrainers = trainers.filter((trainer) => {
    const matchesSearch =
      trainer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterRole === "all" || trainer.role === filterRole
    return matchesSearch && matchesFilter
  })

  // For role filter, but will always be TRAINER, so just for design consistency
  const allRoles = Array.from(new Set(trainers.map((trainer) => trainer.role)))

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
                Expert{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  Trainers
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Connect with certified fitness professionals who will guide you to success
              </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search trainers by name or email..."
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
                  {allRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
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
                  <AnimatedDodecahedron />
                  <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
                </Suspense>
              </Canvas>
            </div>
          </motion.div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Trainers Grid */}
        {!isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrainers.map((trainer, index) => (
              <motion.div
                key={trainer.id || trainer._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardHeader className="text-center">
                    <Avatar className="h-20 w-20 mx-auto mb-4">
                      <AvatarImage
                        src={trainer.picture ?? "/images/dummy-avatar.jpg"}
                        alt={trainer.name}
                      />
                      <AvatarFallback className="text-lg">
                        {trainer.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-xl">{trainer.name}</CardTitle>
                    <CardDescription>{trainer.email}</CardDescription>
                    <div className="mt-2 flex justify-center">
                      <Badge variant="secondary" className="text-xs">{trainer.role}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      View Schedule
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredTrainers.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No trainers found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterRole !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No trainers are currently available"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}