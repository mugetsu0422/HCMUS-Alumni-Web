'use client'

import React from 'react'
import { Avatar, Button } from '@material-tailwind/react'

import Link from 'next/link'

const user = {
  imageUrl: '/demo.jpg',
  fullName: 'Trương Samuel',
  id: '1',
}

export default function CreatePost() {
  return (
    <div className="flex gap-4 items-center">
      <Avatar
        src={user.imageUrl}
        alt="user avatar"
        size="lg"
        placeholder={undefined}
      />
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
}
