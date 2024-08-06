'use client'

import React, { useState, useEffect } from 'react'
import { Avatar, Button } from '@material-tailwind/react'

import Link from 'next/link'
import AvatarUser from '../common/avatar-user'
import checkPermission from '../common/checking-permission'
import useAuth from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'

export default function CreatePost() {
  const [hasPermission, setHasPermission] = useState(false)
  const { userId } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setHasPermission(checkPermission('Counsel.Create'))
  }, [])

  return hasPermission ? (
    <div className="flex gap-4 items-center">
      <AvatarUser size="lg" />
      <Link
        href={'/counsel/create'}
        className="w-full bg-blue-gray-50 rounded-full">
        <Button
          placeholder={undefined}
          size="sm"
          variant="text"
          className="p-3 px-5 normal-case text-left rounded-full w-full text-md font-normal">
          Bạn đang cần tư vấn?
        </Button>
      </Link>
    </div>
  ) : (
    <div className="flex gap-4 items-center">
      <AvatarUser size="lg" />
      <Button
        onClick={() => router.push(`/profile/${userId}`)}
        placeholder={undefined}
        size="sm"
        variant="text"
        className="w-full bg-blue-gray-50 rounded-full p-3 px-5 normal-case text-left text-md font-normal">
        Xét duyệt để đăng bài tư vấn
      </Button>
    </div>
  )
}
