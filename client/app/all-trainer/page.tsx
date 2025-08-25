"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Dodecahedron, MeshDistortMaterial } from "@react-three/drei"
import { Suspense } from "react"
import { Star, Award, Calendar, Search, Filter, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppDispatch, useAppSelector } from "@/src/redux/store"
import { fetch_trainers } from "@/src/redux/slices/data_slice"

// 3D Animated Dodecahedron Component
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

export default function AllTrainerPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSpecialty, setFilterSpecialty] = useState("all")
  const dispatch = useAppDispatch()
  const { trainers, is_loading } = useAppSelector((state) => state.data)

  useEffect(() => {
    dispatch(fetch_trainers())
  }, [dispatch])

  const filteredTrainers = trainers.filter((trainer) => {
    const matchesSearch =
      trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.specialty.some((spec) => spec.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFilter = filterSpecialty === "all" || trainer.specialty.includes(filterSpecialty)
    return matchesSearch && matchesFilter
  })

  const allSpecialties = Array.from(new Set(trainers.flatMap((trainer) => trainer.specialty)))

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : i < rating
              ? "text-yellow-400 fill-current opacity-50"
              : "text-gray-300"
        }`}
      />
    ))
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
                  placeholder="Search trainers or specialties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {allSpecialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
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
        {is_loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Trainers Grid */}
        {!is_loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrainers.map((trainer, index) => (
              <motion.div
                key={trainer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardHeader className="text-center">
                    <Avatar className="h-20 w-20 mx-auto mb-4">
                      <AvatarImage src={trainer.avatar || "/placeholder.svg"} alt={trainer.name} />
                      <AvatarFallback className="text-lg">{trainer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-xl">{trainer.name}</CardTitle>
                    <CardDescription>{trainer.email}</CardDescription>

                    {/* Rating */}
                    <div className="flex items-center justify-center space-x-1 mt-2">
                      {renderStars(trainer.rating)}
                      <span className="text-sm text-muted-foreground ml-2">{trainer.rating.toFixed(1)}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Experience */}
                    <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                      <Award className="h-4 w-4" />
                      <span>{trainer.experience_years} years experience</span>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-muted-foreground text-center">{trainer.bio}</p>

                    {/* Specialties */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Specialties:</h4>
                      <div className="flex flex-wrap gap-1">
                        {trainer.specialty.map((spec) => (
                          <Badge key={spec} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Certifications */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Certifications:</h4>
                      <div className="flex flex-wrap gap-1">
                        {trainer.certifications.map((cert) => (
                          <Badge key={cert} variant="outline" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>

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
        {!is_loading && filteredTrainers.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No trainers found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterSpecialty !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No trainers are currently available"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
