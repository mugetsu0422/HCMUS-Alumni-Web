import { createSlice } from '@reduxjs/toolkit'
// Define the type for the state
interface NotificationCounterState {
  value: number
}

// Create a slice for notifications
const notificationCounterSlice = createSlice({
  name: 'notificationCounter',
  initialState: {
    value: 0,
  } as NotificationCounterState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    reset: (state) => {
      state.value = 0
    },
  },
})

export const { increment, reset } = notificationCounterSlice.actions

export default notificationCounterSlice.reducer
