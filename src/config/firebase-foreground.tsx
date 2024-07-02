'use client'
import NotificationToast from '@/app/ui/common/notification-toast'
import firebaseApp from '@/config/firebase'
import useFcmToken from '@/hooks/use-fcm-token'
import { getMessaging, onMessage } from 'firebase/messaging'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export default function FirebaseForeground() {
  const { notificationPermissionStatus } = useFcmToken()

  const onDimiss = (id: number): void => {
    toast.dismiss(id.toString())
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      if (notificationPermissionStatus === 'granted') {
        const messaging = getMessaging(firebaseApp)
        const unsubscribe = onMessage(messaging, (payload) => {
          const notification = JSON.parse(payload.data.body)
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
  }, [notificationPermissionStatus])

  return null // This component is primarily for handling foreground notifications
  // return <Temp />
}

// function Temp() {
//   return (
//     <>
//       <div
//         onClick={() => {
//           toast.success('New Notification', {
//             position: 'bottom-right',
//           })
//         }}>
//         Temp
//       </div>
//       <div
//         onClick={() => {
//           toast.success('New Notification 2', {})
//         }}>
//         Temp 2
//       </div>
//     </>
//   )
// }
