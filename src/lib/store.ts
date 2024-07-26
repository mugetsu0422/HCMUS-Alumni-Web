import { configureStore } from '@reduxjs/toolkit'
import notificationCounter from './features/notification/notification-counter'
import socketResponse from './features/message/socket-response'
import inboxManager from './features/message/inbox-manager'
import newMessageSlice from './features/new-message/new-message'

export const makeStore = () => {
  return configureStore({
    reducer: {
      notificationCounter: notificationCounter,
      socketResponse: socketResponse,
      inboxManager: inboxManager,
      newMessage: newMessageSlice,
    },
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
