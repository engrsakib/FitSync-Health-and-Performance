"use client"

import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Schedule } from "@/src/types/schedule"
import type { Trainer } from "@/src/types/trainer"
import type { User } from "@/src/types/user"

interface DataState {
  schedules: Schedule[]
  trainers: Trainer[]
  users: User[]
  health_tips: string[]
  chart_data: any[]
  is_loading: boolean
  error: string | null
}

const initial_state: DataState = {
  schedules: [],
  trainers: [],
  users: [],
  health_tips: [],
  chart_data: [],
  is_loading: false,
  error: null,
}

// TODO: Replace with actual API endpoints when backend is ready
// API Endpoints to implement:
// GET ${config.api_base_url}/schedules
// GET ${config.api_base_url}/trainers
// GET ${config.api_base_url}/users
// GET ${config.api_base_url}/health-tips
// GET ${config.api_base_url}/chart-data

export const fetch_schedules = createAsyncThunk("data/fetch_schedules", async () => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${config.api_base_url}/schedules`)
    // return await response.json()

    // Mock data - remove when API is ready
    return [
      {
        id: "1",
        title: "Morning Yoga",
        description: "Start your day with energizing yoga",
        trainer_id: "2",
        trainer_name: "Trainer User",
        date: "2024-01-15",
        start_time: "07:00",
        end_time: "08:00",
        capacity: 20,
        booked: 15,
        status: "active" as const,
        created_at: "2024-01-01T00:00:00Z",
      },
      {
        id: "2",
        title: "HIIT Training",
        description: "High intensity interval training",
        trainer_id: "2",
        trainer_name: "Trainer User",
        date: "2024-01-15",
        start_time: "18:00",
        end_time: "19:00",
        capacity: 15,
        booked: 12,
        status: "active" as const,
        created_at: "2024-01-01T00:00:00Z",
      },
    ]
  } catch (error) {
    throw error
  }
})

export const fetch_trainers = createAsyncThunk("data/fetch_trainers", async () => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${config.api_base_url}/trainers`)
    // return await response.json()

    // Mock data - remove when API is ready
    return [
      {
        id: "2",
        name: "Trainer User",
        email: "trainer@fitsync.dev",
        avatar: "/avatar-default.png",
        specialty: ["Yoga", "HIIT", "Strength Training"],
        rating: 4.8,
        experience_years: 5,
        bio: "Certified fitness trainer with 5 years of experience",
        certifications: ["NASM-CPT", "Yoga Alliance RYT-200"],
        created_at: "2024-01-01T00:00:00Z",
      },
    ]
  } catch (error) {
    throw error
  }
})

const dataSlice = createSlice({
  name: "data",
  initialState: initial_state,
  reducers: {
    clear_data: (state) => {
      state.schedules = []
      state.trainers = []
      state.users = []
      state.health_tips = []
      state.chart_data = []
    },
    set_health_tips: (state, action: PayloadAction<string[]>) => {
      state.health_tips = action.payload
    },
    set_chart_data: (state, action: PayloadAction<any[]>) => {
      state.chart_data = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetch_schedules.pending, (state) => {
        state.is_loading = true
        state.error = null
      })
      .addCase(fetch_schedules.fulfilled, (state, action) => {
        state.is_loading = false
        state.schedules = action.payload
      })
      .addCase(fetch_schedules.rejected, (state, action) => {
        state.is_loading = false
        state.error = action.error.message || "Failed to fetch schedules"
      })
      .addCase(fetch_trainers.pending, (state) => {
        state.is_loading = true
        state.error = null
      })
      .addCase(fetch_trainers.fulfilled, (state, action) => {
        state.is_loading = false
        state.trainers = action.payload
      })
      .addCase(fetch_trainers.rejected, (state, action) => {
        state.is_loading = false
        state.error = action.error.message || "Failed to fetch trainers"
      })
  },
})

export const { clear_data, set_health_tips, set_chart_data } = dataSlice.actions
export default dataSlice.reducer
