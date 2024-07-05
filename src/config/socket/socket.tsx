'use client'

import Cookies from 'js-cookie'
import { useEffect } from 'react'
import SocketManager from './socket-manager'
import { useAppDispatch } from '@/lib/hooks'
import { setSocketResponse } from '@/lib/features/message/socket-response'
import { usePathname } from 'next/navigation'
import { incrementUnreadInboxCounter } from '@/lib/features/message/inbox-manager'

export default function Socket() {
  const dispatch = useAppDispatch()
  const pathName = usePathname()

  useEffect(() => {
    const userId = Cookies.get('userId')
    const socketManager = SocketManager.getInstance()
    if (userId) {
      socketManager.connect(userId, (body) => {
        dispatch(setSocketResponse(body))
        if (!pathName.match(/^\/messages\/inbox/)) {
          dispatch(incrementUnreadInboxCounter(body.inbox.id))
        }
      })
    } else {
      socketManager.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
