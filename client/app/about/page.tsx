"use client"

import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Cylinder, MeshDistortMaterial } from "@react-three/drei"
import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Target, Users, Award, Zap, Shield } from "lucide-react"

// 3D Animated Cylinder Component
function AnimatedCylinder() {
  return (
    <Cylinder args={[1, 1, 2, 32]} scale={1.2}>
      <MeshDistortMaterial color="#f59e0b" attach="material" distort={0.3} speed={1.2} roughness={0.1} />
    </Cylinder>
  )
}

function SceneLoader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
    </div>
  )
}

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Health First",
      description: "We prioritize your health and well-being above all else",
      color: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
    },
    {
      icon: Target,
      title: "Goal-Oriented",
      description: "Every workout is designed to help you achieve your specific goals",
      color: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a supportive community of fitness enthusiasts",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to delivering the highest quality fitness experience",
      color: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400",
    },
  ]

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Workouts",
      description: "Personalized fitness plans powered by artificial intelligence",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Your data and privacy are protected with enterprise-grade security",
    },
    {
      icon: Users,
      title: "Expert Trainers",
      description: "Certified professionals with years of experience",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-card to-background py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  About FitSync
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                  Transforming Lives Through{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    Fitness
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  FitSync is more than just a fitness platform. We're a community dedicated to helping you achieve your
                  health and wellness goals through personalized workouts, expert guidance, and cutting-edge technology.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-semibold">Our Mission</h3>
                <p className="text-muted-foreground">
                  To make fitness accessible, enjoyable, and effective for everyone, regardless of their starting point
                  or fitness level. We believe that everyone deserves to live a healthy, active life.
                </p>
              </div>
            </motion.div>

            {/* Right Content - 3D Scene */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[500px]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-3xl blur-3xl"></div>
              <div className="relative h-full rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm border">
                <Canvas camera={{ position: [0, 0, 5] }}>
                  <ambientLight intensity={0.6} />
                  <pointLight position={[10, 10, 10]} />
                  <Suspense fallback={<SceneLoader />}>
                    <AnimatedCylinder />
                    <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.6} />
                  </Suspense>
                </Canvas>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do at FitSync
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${value.color}`}>
                      <value.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{value.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">What Makes Us Different</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Cutting-edge technology meets personalized fitness coaching
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "2,500+", label: "Active Members" },
              { number: "150+", label: "Weekly Classes" },
              { number: "25+", label: "Expert Trainers" },
              { number: "95%", label: "Success Rate" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="space-y-2"
              >
                <div className="text-4xl font-bold text-primary">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
