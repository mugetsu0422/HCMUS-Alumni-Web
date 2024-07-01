import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  fullName: '',
  avatarUrl: '',
}

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    getInboxUser: {
      prepare(fullName, avatarUrl) {
        return {
          payload: {
            fullName,
            avatarUrl,
          },
        }
      },
      reducer(state, action) {
        state.fullName = action.payload.fullName
        state.avatarUrl = action.payload.avatarUrl
      },
    },
  },
})

export const { getInboxUser } = messageSlice.actions
export default messageSlice.reducer
