'use client'

import Cookies from 'js-cookie'
import { useEffect } from 'react'
import SocketManager from './socket-manager'

export default function Socket() {
  useEffect(() => {
    const userId = Cookies.get('userId')
    const socketManager = SocketManager.getInstance()
    if (userId) {
      socketManager.connect(userId, (message) => {
        console.log(message)
      })
    } else {
      socketManager.disconnect()
    }
  }, [])

  return null
}
