'use client'

import React, { useState } from 'react'
import { Avatar, Button } from '@material-tailwind/react'
import Link from 'next/link'
import Introduce from './introduce'

const group = {
  id: '1',
  name: 'Sinh viên lớp 20CLC11',
  creator: {
    id: '1',
    name: 'Đặng Nguyễn Duy',
    avatarUrl: '/demo.jpg',
  },
  privacy: 'Công Khai',
  avatarUrl: '/authentication.png',
  coverUrl: '/authentication.png',
  website: '',
  status: 'Bình thường',
  publicAt: '05-04-2023',
  numberMember: 500,
  isJoined: true,
  description:
    'Nhóm lớp 20CLC11. Nơi mà sinh viên lớp 20CLC11 chia sẻ kiến thức và sự kiện của nhà trường.',

  friendsInGroup: [
    {
      id: '1',
      fullName: 'Trương Sammuel',
      avatarUrl: '/demo.jpg',
    },
    {
      id: '2',
      fullName: 'Đặng Nguyễn Duy',
      avatarUrl: '/demo.jpg',
    },
    {
      id: '3',
      fullName: 'Huỳnh Cao Nguyên',
      avatarUrl: '/demo.jpg',
    },
  ],
}

function CreatePost() {
  return (
    <div className="flex gap-4 items-center">
      <Avatar
        src="/authentication.png"
        alt="user avatar"
        size="lg"
        placeholder={undefined}
      />
      <Link
        href="/groups/create"
        className=" w-full bg-blue-gray-50 rounded-full">
        <Button
          placeholder={undefined}
          size="sm"
          variant="text"
          className="p-3 normal-case text-left rounded-full w-full text-md font-normal">
          Bạn viết gì đi
        </Button>
      </Link>
    </div>
  )
}

export default function Discuss() {
  return (
    <div className="mt-8 flex">
      <div className="w-[70%] mr-4">
        <CreatePost />
      </div>
      <Introduce privacy={group.privacy} description={group.description} />
    </div>
  )
}
