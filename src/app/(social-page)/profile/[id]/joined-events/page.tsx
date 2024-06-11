/* eslint-disable @next/next/no-img-element */
'use client'
import React from 'react'
import { Button } from '@material-tailwind/react'
import { Star } from 'react-bootstrap-icons'
import Link from 'next/link'

const works = [
  {
    id: 1,
    name: 'Employment Hero',
    time: '20/10/2023',
    placement: '227 Nguyễn Văn Cừ, Phường 4, Quận 5',
  },
  {
    id: 2,
    name: 'Công ty cổ phần VNG',
    time: '20/10/2020',
    placement: '227 Nguyễn Văn Cừ, Phường 4, Quận 5',
  },
]

function EventListItem({ id, name, time, placement }) {
  return (
    <div key={id} className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Link href={`/events/id`}>
          <img
            src="/placeholderImage.png"
            alt="event"
            className="w-40 h-[8rem] lg:w-[16rem] lg:h-[13rem]"
          />
        </Link>
        <div className="flex flex-col gap-1">
          <p className="text-[20px] lg:text-[24px] font-bold">{name}</p>
          <p className="text-[12px] lg:text-base text-[--secondary]">
            Thời gian: {time}
          </p>
          <p className="text-[12px] lg:text-base text-[--secondary]">
            Địa điểm: {placement}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <div>
      <div className="w-full flex flex-col gap-4">
        <p className="text-[18px] lg:text-[22px] font-bold">
          Hoạt động đã tham gia
        </p>
        <div className="w-full flex flex-col gap-4">
          {works.length > 0 ? (
            works.map(({ id, name, time, placement }) => (
              <EventListItem
                key={id}
                id={id}
                name={name}
                time={time}
                placement={placement}
              />
            ))
          ) : (
            <div className="flex items-center gap-2">
              <Star className="text-[20px] lg:text-[24px]" /> Không có hoạt động
              đã tham gia để hiển thị
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
