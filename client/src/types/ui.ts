export interface UIState {
  theme: "light" | "dark" | "system"
  is_credentials_modal_open: boolean
  is_targets_modal_open: boolean
  is_switch_user_modal_open: boolean
  blur_backdrop: boolean
  bmi_data: {
    height: number
    weight: number
    age: number
    gender: "male" | "female"
    bmi: number
    category: string
  } | null
}

export interface Toast {
  id: string
  title: string
  description?: string
  type: "success" | "error" | "warning" | "info"
  duration?: number
}
