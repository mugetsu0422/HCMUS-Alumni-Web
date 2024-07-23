'use client'

import React, { useEffect, useState } from 'react'
import { Avatar } from '@material-tailwind/react'
import Cookies from 'js-cookie'

export default function AvatarUser() {
  const [avatarUrl, setAvatarUrl] = useState(
    'https://storage.googleapis.com/hcmus-alumverse/images/users/avatar/none'
  )

  useEffect(() => {
    const userId= Cookies.get('userId')
    setAvatarUrl(`https://storage.googleapis.com/hcmus-alumverse/images/users/avatar/${userId}`)
  }, [])

  return (
    <Avatar
      placeholder={undefined}
      src={avatarUrl}
      alt="avatar"
      onError={({ currentTarget }) => {
        currentTarget.onerror = null
        currentTarget.src =
          'https://storage.googleapis.com/hcmus-alumverse/images/users/avatar/none'
      }}
    />
  )
}
