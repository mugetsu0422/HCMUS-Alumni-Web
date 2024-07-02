'use client'
import { useEffect } from 'react'
import WebSocketManager from './WebSocketManager'
import Cookies from 'js-cookie'

export default function ClientApplication({ children }) {
  const userId = Cookies.get('userId')

  useEffect(() => {
    if (!userId) {
      console.error('User ID is not available in cookies.')
      return
    }

    function showMessage(message) {
      var messages = document.getElementById('chat-messages')
      var p = document.createElement('p')
      p.textContent = message.sender.fullName + ': ' + message.content
      messages.appendChild(p)
    }

    WebSocketManager.connect(userId, showMessage)

    // Cleanup on component unmount
    return () => {
      WebSocketManager.disconnect()
    }
  }, [userId])

  return children
}
