export interface Trainer {
  id: string
  name: string
  email: string
  avatar?: string
  specialty: string[]
  rating: number
  experience_years: number
  bio: string
  certifications: string[]
  created_at: string
}
