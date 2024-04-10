import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  imgSrc: '',
}

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    getDataFromCard(state, action) {
      state.name = action.payload.name
      state.imgSrc = action.payload.imgScr
    },
  },
})

export const { getDataFromCard } = newsSlice.actions
export default newsSlice.reducer
