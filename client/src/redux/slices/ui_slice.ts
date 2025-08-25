"use client"

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { UIState } from "@/src/types/ui"

const initial_state: UIState = {
  theme: "system",
  is_credentials_modal_open: false,
  is_targets_modal_open: false,
  is_switch_user_modal_open: false,
  blur_backdrop: false,
  bmi_data: null,
}

const uiSlice = createSlice({
  name: "ui",
  initialState: initial_state,
  reducers: {
    set_theme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.theme = action.payload
    },
    toggle_credentials_modal: (state) => {
      state.is_credentials_modal_open = !state.is_credentials_modal_open
      state.blur_backdrop = state.is_credentials_modal_open
    },
    toggle_targets_modal: (state) => {
      state.is_targets_modal_open = !state.is_targets_modal_open
      state.blur_backdrop = state.is_targets_modal_open
    },
    toggle_switch_user_modal: (state) => {
      state.is_switch_user_modal_open = !state.is_switch_user_modal_open
      state.blur_backdrop = state.is_switch_user_modal_open
    },
    close_all_modals: (state) => {
      state.is_credentials_modal_open = false
      state.is_targets_modal_open = false
      state.is_switch_user_modal_open = false
      state.blur_backdrop = false
    },
    set_bmi_data: (state, action: PayloadAction<UIState["bmi_data"]>) => {
      state.bmi_data = action.payload
    },
  },
})

export const {
  set_theme,
  toggle_credentials_modal,
  toggle_targets_modal,
  toggle_switch_user_modal,
  close_all_modals,
  set_bmi_data,
} = uiSlice.actions

export default uiSlice.reducer
