'use client'

import React, { useEffect, useState } from 'react'
import { Avatar } from '@material-tailwind/react'
import Cookies from 'js-cookie'
import { size } from '@material-tailwind/react/types/components/avatar'

export default function AvatarUser({ size }: { size?: size }) {
  const [avatarUrl, setAvatarUrl] = useState('/none-avatar.png')

  useEffect(() => {
    const userId = Cookies.get('userId')
    setAvatarUrl(
      `https://storage.googleapis.com/${process.env.NEXT_PUBLIC_GCP_BUCKET_NAME}/images/users/avatar/${userId}`
    )
  }, [])

  return (
    <Avatar
      size={size}
      placeholder={undefined}
      src={avatarUrl}
      alt="avatar"
      onError={({ currentTarget }) => {
        currentTarget.onerror = null
        currentTarget.src = '/none-avatar.png'
      }}
    />
  )
}
