'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useState } from 'react'
import {
  Button,
  Avatar,
  Badge,
  Textarea,
  avatar,
} from '@material-tailwind/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faImage } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

const chatDataTemp = [
  {
    id: 1,
    sender: {
      id: 1,
      fullName: 'A',
      avatarUrl: '/demo.jpg',
    },
    content: 'Hi Phúc',
    messageType: 'TEXT',
    parentMessage: '',
    createAt: 'String',
    updateAt: 'String',
    isDelete: 'Boolean',
  },
  {
    id: 2,
    sender: {
      id: 1,
      fullName: 'A',
      avatarUrl: '/demo.jpg',
    },
    content: 'Look at my new picture',
    messageType: 'TEXT',
    parentMessage: '',
    createAt: 'String',
    updateAt: 'String',
    isDelete: 'Boolean',
  },
  {
    id: 3,
    sender: {
      id: 1,
      fullName: 'A',
      avatarUrl: '/demo.jpg',
    },
    content: '/thumbnail-social-pages.jpg',
    messageType: 'IMAGE',
    parentMessage: '',
    createAt: 'String',
    updateAt: 'String',
    isDelete: 'Boolean',
  },
  {
    id: 4,
    sender: {
      id: 1,
      fullName: 'B',
      avatarUrl: '/none-avatar.png',
    },
    content: 'Waoo! That looks great',
    messageType: 'TEXT',
    parentMessage: '',
    createAt: 'String',
    updateAt: 'String',
    isDelete: 'Boolean',
  },
  {
    id: 4,
    sender: {
      id: 1,
      fullName: 'B',
      avatarUrl: '/none-avatar.png',
    },
    content:
      'I see that you have been using our app. Is there anything problems with our app ?',
    messageType: 'TEXT',
    parentMessage: '',
    createAt: 'String',
    updateAt: 'String',
    isDelete: 'Boolean',
  },
  {
    id: 5,
    sender: {
      id: 1,
      fullName: 'A',
      avatarUrl: '/demo.jpg',
    },
    content: 'No. It is great !',
    messageType: 'TEXT',
    parentMessage: '',
    createAt: 'String',
    updateAt: 'String',
    isDelete: 'Boolean',
  },
  {
    id: 3,
    sender: {
      id: 1,
      fullName: 'B',
      avatarUrl: '/none-avatar.png',
    },
    content: '/thumbnail-social-pages.jpg',
    messageType: 'IMAGE',
    parentMessage: '',
    createAt: 'String',
    updateAt: 'String',
    isDelete: 'Boolean',
  },
]

export default function Page() {
  return (
    <>
      <header className="fixed flex top-0 w-full bg-[--blue-04] px-4 py-2 border-[#eeeeee] border-b-2 mt-20 z-10">
        <Link
          href={`/profile/id/about`}
          className="flex items-center gap-3 hover:bg-[#cbcbcb] w-fit p-2 rounded-lg">
          <Badge color="green" placement="bottom-end">
            <Avatar
              placeholder={undefined}
              src="/authentication.png"
              alt="avatar"
              size="md"
            />
          </Badge>

          <div>
            <p className="text-md font-bold">Trần Phúc</p>
            <p className="text-sm">Đang hoạt động</p>
          </div>
        </Link>
      </header>

      <div className="relative w-full h-full max-h-[80vh] px-4 overflow-x-auto scrollbar-webkit flex flex-col z-0 mt-20">
        {chatDataTemp.map((chat) => (
          <div
            key={chat.id}
            className={` items-start gap-x-2 my-3 ${
              chat.sender.fullName === 'B' ? 'flex' : 'flex flex-row-reverse'
            }`}>
            <Avatar
              placeholder={undefined}
              size="md"
              src={chat.sender.avatarUrl} //Điều kiện này sau này thay đổi + scr ảnh :((
              alt="avatar"
            />
            {chat.messageType === 'TEXT' && (
              <div className="py-2 px-3 h-fit w-fit max-w-[200px] lg:max-w-[250px] xl:max-w-[300px]  2xl:max-w-[350px] text-wrap bg-[var(--hcmus-logo)] text-white text-sm font-light rounded-2xl">
                <p>{chat.content}</p>
              </div>
            )}

            {chat.messageType === 'IMAGE' && (
              <img
                src={chat.content}
                alt="message"
                className="w-[200px] h-[112.5px] sm:w-[320px] sm:h-[180px] lg:w-[380px] lg:h-[213px] 2xl:w-[440px] 2xl:h-[247.5px] rounded-xl object-contain object-center"
              />
            )}
          </div>
        ))}
      </div>

      <div className="relative w-full flex-1 flex items-center gap-2 p-2 border-[#eeeeee] border-t-2">
        <Button
          placeholder={undefined}
          variant="text"
          className="p-2 w-fit h-fit">
          <FontAwesomeIcon icon={faImage} className="text-xl text-[#64748B]" />
        </Button>
        <Textarea
          rows={1}
          placeholder="Nhập tin nhắn"
          className="min-h-full border-1 focus:border-transparent rounded-full bg-[#f5f5f5] grow min-w-20"
          containerProps={{
            className: 'grid h-full',
          }}
          labelProps={{
            className: 'before:content-none after:content-none',
          }}
        />
        <Button
          placeholder={undefined}
          variant="text"
          className="p-2 w-fit h-fit">
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="text-xl text-[#64748B]"
          />
        </Button>
      </div>
    </>
  )
}
