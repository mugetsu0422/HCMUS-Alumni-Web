'use client'

import React, { useState, useEffect } from 'react'
import { Avatar, Button } from '@material-tailwind/react'

import Link from 'next/link'
import AvatarUser from '../common/avatar-user'

export default function CreatePost() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  }, [])
  return (
    isMounted && (
      <div className="flex gap-4 items-center">
        <AvatarUser size="lg" />
        <Link
          href="/counsel/create"
          className=" w-full bg-blue-gray-50 rounded-full">
          <Button
            placeholder={undefined}
            size="sm"
            variant="text"
            className="p-3 px-5 normal-case text-left rounded-full w-full text-md font-normal">
            Bạn đang cần tư vấn?
          </Button>
        </Link>
      </div>
    )
  )
}
