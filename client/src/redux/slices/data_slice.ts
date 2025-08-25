"use client"
import { config } from "@/src/lib/config"
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

// Auth token utility function
function getAccessToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token")
  }
  return null
}

// Fetch schedules from /api/v1/scheduling/ with Authorization header
export const fetch_schedules = createAsyncThunk("data/fetch_schedules", async (_, { rejectWithValue }) => {
  try {
    const token = getAccessToken()
    const response = await fetch(`${config.api_base_url}/api/v1/scheduling/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
    })
    if (!response.ok) {
      const error = await response.json()
      return rejectWithValue(error)
    }
    const data = await response.json()
    // Expecting: { success, data: [...schedules] }
    return data.data ?? []
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to fetch schedules")
  }
})

// Example: Fetch trainers (update endpoint as needed)
export const fetch_trainers = createAsyncThunk("data/fetch_trainers", async (_, { rejectWithValue }) => {
  try {
    const token = getAccessToken()
    const response = await fetch(`${config.api_base_url}/api/v1/users/role/TRAINER`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
    })
    if (!response.ok) {
      const error = await response.json()
      return rejectWithValue(error)
    }
    const data = await response.json()
    return data.data ?? []
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to fetch trainers")
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
      state.error = null
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
        state.error = typeof action.payload === "string"
          ? action.payload
          : action.error.message || "Failed to fetch schedules"
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
        state.error = typeof action.payload === "string"
          ? action.payload
          : action.error.message || "Failed to fetch trainers"
      })
  },
})

export const { clear_data, set_health_tips, set_chart_data } = dataSlice.actions
export default dataSlice.reducer