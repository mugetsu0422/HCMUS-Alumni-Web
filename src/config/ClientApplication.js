'use client'
import { useEffect } from 'react'
import WebSocketManager from './WebSocketManager'

export default function ClientApplication({ children }) {
  useEffect(() => {
    const showMessage = (message) => {
      console.log('Message from server:', message)
      // Handle the message received from the server
    }

    WebSocketManager.connect(userId, showMessage)

    // Cleanup on component unmount
    return () => {
      WebSocketManager.disconnect()
    }
  }, [])

  return children
}
