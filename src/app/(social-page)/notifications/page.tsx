'use client'

import React from 'react'
import { Avatar, List, ListItem } from '@material-tailwind/react'
import Link from 'next/link'
import { roboto } from '@/app/ui/fonts'

const notifications = [
  {
    id: '1',
    imageUrl: '/demo.jpg',
    notification: 'Trương Samuel đã phản hồi bình luận của bạn.',
    time: '2 phút trước',
    link: '#',
    isRead: false,
  },
  {
    id: '2',
    imageUrl: '/demo.jpg',
    notification: 'Trần Phúc đã bình luận bài viết của bạn của bạn.',
    time: '2 phút trước',
    link: '#',
    isRead: true,
  },
  {
    id: '3',
    imageUrl: '/demo.jpg',
    notification: 'Trương Samuel đã phản hồi bình luận của bạn.',
    time: '2 phút trước',
    link: '#',
    isRead: true,
  },
  {
    id: '4',
    imageUrl: '/demo.jpg',
    notification: 'Trương Samuel đã phản hồi bình luận của bạn.',
    time: '2 phút trước',
    link: '#',
    isRead: true,
  },
  {
    id: '5',
    imageUrl: '/demo.jpg',
    notification: 'Trương Samuel đã phản hồi bình luận của bạn.',
    time: '2 phút trước',
    link: '#',
    isRead: true,
  },
]

export default function Page() {
  return (
    <div className="mt-4 max-w-[850px] min-w-[500px] w-[80%] m-auto flex flex-col gap-6 h-fit mb-12">
      <p
        className={`${roboto.className} ml-5 lg:ml-0 text-3xl font-bold text-[var(--blue-02)]`}>
        THÔNG BÁO
      </p>
      <List placeholder={undefined}>
        {notifications.map(
          ({ id, imageUrl, notification, time, link, isRead }) => (
            <Link href={link} key={id}>
              <ListItem
                placeholder={undefined}
                className="flex gap-2 items-center justify-between">
                <Avatar placeholder={undefined} src={imageUrl} />
                <div className="w-full">
                  <p className="text-black ">{notification}</p>
                  <p>{time}</p>
                </div>
                <span
                  className={`mx-auto block h-[10px] w-[10px] rounded-full ${
                    !isRead ? 'bg-[--blue-05]' : ''
                  } `}
                />
              </ListItem>
            </Link>
          )
        )}
      </List>
    </div>
  )
}
