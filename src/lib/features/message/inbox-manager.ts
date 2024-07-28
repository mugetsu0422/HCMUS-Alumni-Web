import { INBOX_PAGE_SIZE } from '@/app/constant'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface InboxManagerState {
  inboxes: any[]
  activeInboxId: number | null
  unreadInboxSet: number[]
}

type SetInboxesPayload = {
  type: 'set' | 'concat'
  newInboxes: any[]
}

const inboxManagerSlicers = createSlice({
  name: 'inboxManager',
  initialState: {
    inboxes: [],
    activeInboxId: null,
    unreadInboxSet: [],
  } as InboxManagerState,
  reducers: {
    setInboxes: (state, action: PayloadAction<SetInboxesPayload>) => {
      const { type, newInboxes } = action.payload
      if (type === 'set') {
        state.inboxes = newInboxes
      } else if (type === 'concat') {
        state.inboxes = state.inboxes.concat(newInboxes)
      }
      return state
    },
    markAsRead: (state, action: PayloadAction<number>) => {
      const inboxIndex = state.inboxes.findIndex(
        (inbox) => inbox.id === action.payload && !inbox.hasRead
      )
      if (inboxIndex !== -1) {
        state.inboxes[inboxIndex].hasRead = true
      }
    },
    incrementUnreadInboxCounter: (state, action: PayloadAction<number>) => {
      state.unreadInboxSet.includes(action.payload)
        ? state
        : state.unreadInboxSet.push(action.payload)
    },
    resetUnreadInboxCounter: (state) => {
      state.unreadInboxSet = []
    },
    setActiveInboxId: (state, action) => {
      state.activeInboxId = action.payload
    },
    handleIncomingMessage: (state, action) => {
      const { incomingInbox, incomingMessage } = action.payload
      const processedInbox = {
        ...incomingInbox,
        latestMessage: incomingMessage,
        hasRead: incomingInbox.id === state.activeInboxId,
      }

      const inboxIndex = state.inboxes.findIndex(
        (inbox) => inbox.id === processedInbox.id
      )

      if (inboxIndex !== -1) {
        // Inbox exists, move it to the beginning
        state.inboxes.splice(inboxIndex, 1)
        state.inboxes.unshift(processedInbox)
      } else {
        // Inbox does not exist, add it to the beginning and remove the last one if necessary
        if (state.inboxes.length % INBOX_PAGE_SIZE === 0) {
          state.inboxes.pop()
        }
        state.inboxes.unshift(processedInbox)
      }
    },
  },
})

export const {
  setInboxes,
  markAsRead,
  incrementUnreadInboxCounter,
  resetUnreadInboxCounter,
  setActiveInboxId,
  handleIncomingMessage,
} = inboxManagerSlicers.actions
export default inboxManagerSlicers.reducer
