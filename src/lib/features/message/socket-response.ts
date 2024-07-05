import { createSlice } from '@reduxjs/toolkit'

interface SocketResponseState {
  message: any
  inbox: any
  activeInboxId: number
}

const socketResponseSlice = createSlice({
  name: 'socketResponse',
  initialState: {
    message: null,
    inbox: null,
    activeInboxId: null,
  } as SocketResponseState,
  reducers: {
    setSocketResponse: (state, action) => {
      state.message = action.payload.message
      state.inbox = action.payload.inbox
    },
    setActiveInboxId: (state, action) => {
      state.activeInboxId = action.payload
    },
  },
})

export const { setSocketResponse, setActiveInboxId } =
  socketResponseSlice.actions
export default socketResponseSlice.reducer
