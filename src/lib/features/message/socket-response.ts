import { createSlice } from '@reduxjs/toolkit'

interface SocketResponseState {
  message: any
  inbox: any
}

const socketResponseSlice = createSlice({
  name: 'socketResponse',
  initialState: {
    message: null,
    inbox: null,
  } as SocketResponseState,
  reducers: {
    setSocketResponse: (state, action) => {
      state.message = action.payload.message
      state.inbox = action.payload.inbox
    },
  },
})

export const { setSocketResponse } = socketResponseSlice.actions
export default socketResponseSlice.reducer
