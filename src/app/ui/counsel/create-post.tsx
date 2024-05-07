'use client'

import React, { useState } from 'react'
import {
  Avatar,
  Button,
} from '@material-tailwind/react'

import CreatePostDialog from './create-post-dialog'

const user = {
  imageUrl: '/demo.jpg',
  fullName: 'Trương Samuel',
  id: '1',
}

export default function CreatePost() {
  const [openCreatePost, setOpenCreatePost] = useState(false)

  function handleOpenPost() {
    setOpenCreatePost((e) => !e)
  }

  return (
    <div className="flex gap-4 items-center">
      <Avatar
        src={user.imageUrl}
        alt="user avatar"
        size="lg"
        placeholder={undefined}
      />
      <Button
        onClick={handleOpenPost}
        placeholder={undefined}
        size="sm"
        variant="text"
        className="p-3 bg-blue-gray-50 normal-case w-full text-left text-md rounded-full font-normal">
        Bạn đang cần tư vấn?
      </Button>
      <CreatePostDialog
        openCreatePost={openCreatePost}
        handleOpenPost={handleOpenPost}
        user={user}
      />
    </div>
  )
}
