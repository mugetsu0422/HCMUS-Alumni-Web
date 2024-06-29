'use client'
import { useEffect, useRef, useState } from 'react'
import { getMessaging, getToken } from 'firebase/messaging'
import firebaseApp from '@/config/firebase'
import axios from 'axios'
import { JWT_COOKIE } from '@/app/constant'
import Cookies from 'js-cookie'

const useFcmToken = () => {
  const effectRan = useRef(false)
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState('')

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
          const messaging = getMessaging(firebaseApp)
          const permission = await Notification.requestPermission()
          setNotificationPermissionStatus(permission)

          if (permission === 'granted') {
            const currentToken = await getToken(messaging, {
              vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            })
            const storageToken = localStorage.getItem('notificationToken')

            if (currentToken) {
              if (currentToken !== storageToken) {
                localStorage.setItem('notificationToken', currentToken)
                // Save token to db
                await axios.post(
                  `${process.env.NEXT_PUBLIC_SERVER_HOST}/notification/subscription`,
                  { token: currentToken },
                  {
                    headers: {
                      Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
                    },
                  }
                )

                // Delete old token from db
                if (storageToken) {
                  axios.delete(
                    `${process.env.NEXT_PUBLIC_SERVER_HOST}/notification/subscription`,
                    {
                      headers: {
                        Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
                      },
                      data: { token: storageToken },
                    }
                  )
                }
              }
            } else {
              console.log(
                'No registration token available. Request permission to generate one.'
              )
            }
          }
        }
      } catch (error) {
        console.log('Error retrieving token:', error)
      }
    }

    if (!effectRan.current) {
      retrieveToken()
    }

    return () => {
      effectRan.current = true
    }
  }, [])

  return { notificationPermissionStatus }
}

export default useFcmToken
