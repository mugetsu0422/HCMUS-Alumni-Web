'use client'

import React from 'react'
import { Avatar } from '@material-tailwind/react'
import Cookies from 'js-cookie'

export default function AvatarUser() {
  return (
    <Avatar
      placeholder={undefined}
      src={`https://storage.googleapis.com/hcmus-alumverse/images/users/avatar/${Cookies.get(
        'userId'
      )}`}
      alt="avatar"
    />
  )
}
