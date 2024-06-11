'use client'
import React from 'react'
import { Button } from '@material-tailwind/react'
import { Star, PencilFill, TagFill } from 'react-bootstrap-icons'
import PostListItem from '../../../../../ui/social-page/profile/profile-post-list-items'

const works = [
  {
    id: 1,
    name: 'Thông báo nhóm',
    startTime: '2023',
    endTime: 'Hiện tại',
    position: 'Junior FE',
    tags: [
      { id: 1, name: 'trường học' },
      { id: 2, name: 'học tập' },
    ],
  },
  {
    id: 2,
    name: 'Thông báo thi giữa kỳ',
    startTime: '2020',
    endTime: '2023',
    position: 'Intern FE',
    tags: [
      { id: 1, name: 'trường học' },
      { id: 2, name: 'học tập' },
    ],
  },
]

function AchievementListItem({ id, name, tags }) {
  return (
    <div key={id} className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <PostListItem />
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <div>
      <div className="w-full flex flex-col gap-4">
        <p className="text-[18px] lg:text-[22px] font-bold">Tư vấn & cố vấn</p>
        <div className="w-full flex flex-col gap-4">
          {works.length > 0 ? (
            works.map(({ id, name, tags }) => (
              <AchievementListItem key={id} id={id} name={name} tags={tags} />
            ))
          ) : (
            <div className="flex items-center gap-2">
              <Star className="text-[24px]" /> Không có bài viết tư vấn để hiển
              thị
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
