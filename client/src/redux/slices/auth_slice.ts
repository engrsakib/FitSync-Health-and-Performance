"use client"

import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { AuthState, User, LoginCredentials, RegisterData } from "@/src/types/user"
import { config } from "@/src/lib/config"

const initial_state: AuthState = {
  user: null,
  access_token: null,
  refresh_token: null,
  is_authenticated: false,
  is_loading: false,
}

// TODO: Replace with actual API endpoints when backend is ready
// API Endpoints to implement:
// POST ${config.api_base_url}/auth/login
// POST ${config.api_base_url}/auth/register
// POST ${config.api_base_url}/auth/logout
// POST ${config.api_base_url}/auth/refresh

export const login = createAsyncThunk("auth/login", async (credentials: LoginCredentials) => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${config.api_base_url}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(credentials)
    // })
    // const data = await response.json()

    // Mock implementation - remove when API is ready
    const mock_user = config.mock_users.find(
      (u) => u.email === credentials.email && u.password === credentials.password,
    )

    if (!mock_user) {
      throw new Error("Invalid credentials")
    }

    const { password, ...user } = mock_user
    return {
      user,
      access_token: "mock_access_token_" + user.id,
      refresh_token: "mock_refresh_token_" + user.id,
    }
  } catch (error) {
    throw error
  }
})

export const register = createAsyncThunk("auth/register", async (data: RegisterData) => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${config.api_base_url}/auth/register`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // })
    // const result = await response.json()

    // Mock implementation - remove when API is ready
    const new_user: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      role: data.role,
      avatar: data.avatar || config.default_avatar,
    }

    return {
      user: new_user,
      access_token: "mock_access_token_" + new_user.id,
      refresh_token: "mock_refresh_token_" + new_user.id,
    }
  } catch (error) {
    throw error
  }
})

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    // TODO: Replace with actual API call
    // await fetch(`${config.api_base_url}/auth/logout`, {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${access_token}` }
    // })

    // Clear storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    }
  } catch (error) {
    console.error("Logout error:", error)
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState: initial_state,
  reducers: {
    hydrate_from_storage: (state) => {
      if (typeof window !== "undefined") {
        const access_token = localStorage.getItem("access_token")
        const refresh_token = localStorage.getItem("refresh_token")
        const user_data = localStorage.getItem("user")

        if (access_token && refresh_token && user_data) {
          state.access_token = access_token
          state.refresh_token = refresh_token
          state.user = JSON.parse(user_data)
          state.is_authenticated = true
        }
      }
    },
    clear_auth: (state) => {
      state.user = null
      state.access_token = null
      state.refresh_token = null
      state.is_authenticated = false
    },
    switch_user: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.access_token = "mock_access_token_" + action.payload.id
      state.refresh_token = "mock_refresh_token_" + action.payload.id
      state.is_authenticated = true

      // Update storage
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", state.access_token)
        localStorage.setItem("refresh_token", state.refresh_token)
        localStorage.setItem("user", JSON.stringify(action.payload))
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.is_loading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.is_loading = false
        state.user = action.payload.user
        state.access_token = action.payload.access_token
        state.refresh_token = action.payload.refresh_token
        state.is_authenticated = true

        // Store in localStorage and cookies
        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", action.payload.access_token)
          localStorage.setItem("refresh_token", action.payload.refresh_token)
          localStorage.setItem("user", JSON.stringify(action.payload.user))
          document.cookie = `access_token=${action.payload.access_token}; path=/`
          document.cookie = `refresh_token=${action.payload.refresh_token}; path=/`
        }
      })
      .addCase(login.rejected, (state) => {
        state.is_loading = false
      })
      .addCase(register.pending, (state) => {
        state.is_loading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.is_loading = false
        state.user = action.payload.user
        state.access_token = action.payload.access_token
        state.refresh_token = action.payload.refresh_token
        state.is_authenticated = true

        // Store in localStorage and cookies
        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", action.payload.access_token)
          localStorage.setItem("refresh_token", action.payload.refresh_token)
          localStorage.setItem("user", JSON.stringify(action.payload.user))
          document.cookie = `access_token=${action.payload.access_token}; path=/`
          document.cookie = `refresh_token=${action.payload.refresh_token}; path=/`
        }
      })
      .addCase(register.rejected, (state) => {
        state.is_loading = false
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.access_token = null
        state.refresh_token = null
        state.is_authenticated = false
      })
  },
})

export const { hydrate_from_storage, clear_auth, switch_user } = authSlice.actions
export default authSlice.reducer
