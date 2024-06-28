'use client'
import firebaseApp from '@/firebase'
import useFcmToken from '@/hooks/use-fcm-token'
import { getMessaging, onMessage } from 'firebase/messaging'
import { useEffect } from 'react'

export default function FirebaseForeground() {
  const { notificationPermissionStatus } = useFcmToken()

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      if (notificationPermissionStatus === 'granted') {
        const messaging = getMessaging(firebaseApp)
        console.log('Foreground push notification enabled')
        const unsubscribe = onMessage(messaging, (payload) =>
          console.log('Foreground push notification received:', payload)
        )
        return () => {
          unsubscribe() // Unsubscribe from the onMessage event on cleanup
        }
      }
    }
  }, [notificationPermissionStatus])

  return null // This component is primarily for handling foreground notifications
}
