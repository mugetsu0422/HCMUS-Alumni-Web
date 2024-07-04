'use client'

import Cookies from 'js-cookie'
import { useEffect } from 'react'
import SocketManager from './socket-manager'
import { useAppDispatch } from '@/lib/hooks'
import { setSocketResponse } from '@/lib/features/message/socket-response'

export default function Socket() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const userId = Cookies.get('userId')
    const socketManager = SocketManager.getInstance()
    if (userId) {
      socketManager.connect(userId, (body) => {
        dispatch(setSocketResponse(body))
      })
    } else {
      socketManager.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
