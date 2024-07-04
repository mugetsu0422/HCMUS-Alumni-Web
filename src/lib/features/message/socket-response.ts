import { createSlice } from '@reduxjs/toolkit'

const socketResponseSlice = createSlice({
  name: 'socketResponse',
  initialState: {
    message: null,
    inbox: null,
  },
  reducers: {
    setSocketResponse: (state, action) => {
      state.message = action.payload.message
      state.inbox = action.payload.inbox
    },
  },
})

export const { setSocketResponse } = socketResponseSlice.actions
export default socketResponseSlice.reducer
