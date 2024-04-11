import { configureStore } from '@reduxjs/toolkit'
import newsReducer from '../app/admin/news/newsSclice'

export const store = () => {
  return configureStore({
    reducer: { news: newsReducer },
  })
}
