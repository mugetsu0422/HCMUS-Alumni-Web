import { configureStore } from '@reduxjs/toolkit'
import newsReducer from '../app/admin/news/newsSlice'

export const store = () => {
  return configureStore({
    reducer: { news: newsReducer },
  })
}
