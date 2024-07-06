import { createSlice } from '@reduxjs/toolkit'

interface SocketResponseState {
  isSocketConnected: boolean
  message: any
  inbox: any
}

const socketResponseSlice = createSlice({
  name: 'socketResponse',
  initialState: {
    isSocketConnected: false,
    message: null,
    inbox: null,
  } as SocketResponseState,
  reducers: {
    setSocketResponse: (state, action) => {
      state.message = action.payload.message
      state.inbox = action.payload.inbox
    },
    setSocketConnected: (state) => {
      state.isSocketConnected = true
    },
  },
})

export const { setSocketResponse, setSocketConnected } = socketResponseSlice.actions
export default socketResponseSlice.reducer
