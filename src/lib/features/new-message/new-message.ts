import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface NewMessageState {
  userFromProfile: {
    fullName: string
    id: string
    avatarUrl: string
  } | null
}

const initialState: NewMessageState = {
  userFromProfile: null,
}

const newMessageSlice = createSlice({
  name: 'newMessage',
  initialState,
  reducers: {
    setUserFromProfile: (state, action: PayloadAction<NewMessageState>) => {
      state.userFromProfile = action.payload.userFromProfile
    },
  },
})

export const { setUserFromProfile } = newMessageSlice.actions
export default newMessageSlice.reducer
