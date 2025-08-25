export interface Schedule {
  id: string
  title: string
  description: string
  trainer_id: string
  trainer_name: string
  date: string
  start_time: string
  end_time: string
  capacity: number
  booked: number
  status: "active" | "cancelled" | "completed"
  created_at: string
}

export interface Booking {
  id: string
  schedule_id: string
  user_id: string
  status: "confirmed" | "cancelled" | "completed"
  booked_at: string
}
