'use client'
import NotificationToast from '@/app/ui/common/notification-toast'
import firebaseApp from '@/config/notification/firebase'
import useFcmToken from '@/hooks/use-fcm-token'
import { increment } from '@/lib/features/notification/notification-counter'
import { useAppDispatch } from '@/lib/hooks'
import { getMessaging, onMessage } from 'firebase/messaging'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export default function FirebaseForeground() {
  const { notificationPermissionStatus } = useFcmToken()
  const dispatch = useAppDispatch()

  const onDimiss = (id: number): void => {
    toast.dismiss(id.toString())
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      if (notificationPermissionStatus === 'granted') {
        const messaging = getMessaging(firebaseApp)
        const unsubscribe = onMessage(messaging, (payload) => {
          const notification = JSON.parse(payload.data.body)
          if (notification.entityTable === 'message') return
          dispatch(increment())
          toast.custom(
            <NotificationToast
              notification={notification}
              onDismiss={onDimiss}
            />,
            {
              id: notification.id,
              duration: 5000,
              position: 'bottom-right',
            }
          )
        })
        return () => {
          unsubscribe() // Unsubscribe from the onMessage event on cleanup
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationPermissionStatus])

  return null // This component is primarily for handling foreground notifications
}
