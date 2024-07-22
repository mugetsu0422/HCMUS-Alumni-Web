import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface NewMessageState {
  fullName: string
  id: string
  avatarUrl: string
}

const initialState: NewMessageState = {
  id: '',
  fullName: '',
  avatarUrl: '',
}

const newMessageSlice = createSlice({
  name: 'newMessageSlice',
  initialState,
  reducers: {
    getDataUser: (state, action: PayloadAction<NewMessageState>) => {
      state.id = action.payload.id
      state.fullName = action.payload.fullName
      state.avatarUrl = action.payload.avatarUrl
    },
  },
})

export const { getDataUser } = newMessageSlice.actions
export default newMessageSlice.reducer
