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
  loginuser: null,
}

// Login thunk: POST /api/v1/auth/login
export const login = createAsyncThunk("auth/login", async (credentials: LoginCredentials, { rejectWithValue }) => {
  try {
    const response = await fetch(`${config.api_base_url}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    })
    if (!response.ok) {
      const error = await response.json()
      return rejectWithValue(error)
    }
    const result = await response.json()
    // Pick out the fields from backend response
    const user = result.data.user
    const access_token = result.data.acccessToken
    const refresh_token = result.data.refreshToken

    // Set in localStorage immediately (for SSR hydration)
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", access_token)
      localStorage.setItem("refresh_token", refresh_token)
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("loginuser", JSON.stringify({ name: user.name }))
      document.cookie = `access_token=${access_token}; path=/`
      document.cookie = `refresh_token=${refresh_token}; path=/`
    }

    return {
      user,
      access_token,
      refresh_token,
    }
  } catch (error) {
    return rejectWithValue(error)
  }
})

// Register thunk: POST /api/v1/users/register (you can adjust as needed)
export const register = createAsyncThunk("auth/register", async (data: RegisterData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${config.api_base_url}/api/v1/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        name: data.name,
      }),
    })
    if (!response.ok) {
      const error = await response.json()
      return rejectWithValue(error)
    }
    const result = await response.json()
    // You may need to adjust based on backend response
    const user = result.data.user
    const access_token = result.data.acccessToken
    const refresh_token = result.data.refreshToken

    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", access_token)
      localStorage.setItem("refresh_token", refresh_token)
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("loginuser", JSON.stringify({ name: user.name }))
      document.cookie = `access_token=${access_token}; path=/`
      document.cookie = `refresh_token=${refresh_token}; path=/`
    }

    return {
      user,
      access_token,
      refresh_token,
    }
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const logout = createAsyncThunk("auth/logout", async () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
    localStorage.removeItem("loginuser")
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
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
        const loginuser_data = localStorage.getItem("loginuser")
        if (access_token && refresh_token && user_data) {
          state.access_token = access_token
          state.refresh_token = refresh_token
          state.user = JSON.parse(user_data)
          state.is_authenticated = true
          state.loginuser = loginuser_data ? JSON.parse(loginuser_data) : null
        }
      }
    },
    clear_auth: (state) => {
      state.user = null
      state.access_token = null
      state.refresh_token = null
      state.is_authenticated = false
      state.loginuser = null
    },
    switch_user: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.access_token = "mock_access_token_" + action.payload.id
      state.refresh_token = "mock_refresh_token_" + action.payload.id
      state.is_authenticated = true
      state.loginuser = { name: action.payload.name }
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", state.access_token)
        localStorage.setItem("refresh_token", state.refresh_token)
        localStorage.setItem("user", JSON.stringify(action.payload))
        localStorage.setItem("loginuser", JSON.stringify({ name: action.payload.name }))
      }
    },
    set_loginuser: (state, action: PayloadAction<{ name: string }>) => {
      state.loginuser = action.payload
      if (typeof window !== "undefined") {
        localStorage.setItem("loginuser", JSON.stringify(action.payload))
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
        state.loginuser = { name: action.payload.user.name }
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
        state.loginuser = { name: action.payload.user.name }
      })
      .addCase(register.rejected, (state) => {
        state.is_loading = false
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.access_token = null
        state.refresh_token = null
        state.is_authenticated = false
        state.loginuser = null
      })
  },
})

export const { hydrate_from_storage, clear_auth, switch_user, set_loginuser } = authSlice.actions
export default authSlice.reducer