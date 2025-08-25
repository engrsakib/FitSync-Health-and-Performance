"use client"

import { useState, useEffect, Suspense } from "react"
import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star, ChevronLeft, ChevronRight } from "lucide-react"
import { useAppSelector } from "@/src/redux/store"

function FloatingCube({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#dc2626" />
    </mesh>
  )
}

const heroSlides = [
  {
    title: "Transform Your Body",
    subtitle: "Join the ultimate fitness revolution with personalized training programs",
    cta: "Start Your Journey",
    image: "/fitness-gym-modern-equipment.png",
  },
  {
    title: "Expert Guidance",
    subtitle: "Work with certified trainers who understand your unique fitness goals",
    cta: "Meet Our Trainers",
    image: "/personal-trainer-coaching-fitness.png",
  },
  {
    title: "Track Your Progress",
    subtitle: "Advanced analytics and insights to monitor your fitness transformation",
    cta: "View Analytics",
    image: "/fitness-tracking-charts.png",
  },
  {
    title: "Community Support",
    subtitle: "Join a community of fitness enthusiasts on the same journey as you",
    cta: "Join Community",
    image: "/fitness-community-group-workout.png",
  },
]

export default function HeroSection() {
  const { user, is_authenticated } = useAppSelector((state) => state.auth)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative h-screen overflow-hidden">
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{
              opacity: currentSlide === index ? 1 : 0,
              scale: currentSlide === index ? 1 : 1.1,
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})` }} />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        ))}
      </div>

      {/* 3D Background Element - Hidden on mobile for performance */}
      <div className="absolute top-20 right-20 w-32 h-32 opacity-30 hidden lg:block">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Suspense fallback={null}>
            <FloatingCube position={[0, 0, 0]} />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-2xl text-white"
          >
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
              <Star className="w-4 h-4 mr-2" />
              #1 Fitness Platform in Bangladesh
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 leading-tight">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-xl sm:text-2xl mb-10 opacity-90 leading-relaxed">{heroSlides[currentSlide].subtitle}</p>
            <Link href={is_authenticated ? "/all-schedule" : "/login"}>
              <Button size="lg" className="group px-8 py-4 text-lg font-semibold">
                {heroSlides[currentSlide].cta}
                <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Carousel Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${currentSlide === index ? "bg-white scale-110" : "bg-white/50 hover:bg-white/70"}`}
          />
        ))}
      </div>

      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
        className="absolute left-4 sm:left-8 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10" />
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
        className="absolute right-4 sm:right-8 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10" />
      </button>
    </section>
  )
}
