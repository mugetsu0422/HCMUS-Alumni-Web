'use client'

/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Link from 'next/link'
import { Clock, GeoAltFill, BarChartFill } from 'react-bootstrap-icons'
import { Button } from '@material-tailwind/react'
import { useRouter } from 'next/navigation'

const dataTemp = [
  {
    id: '1',
    title: 'Khai mạc Trường hè Khoa học Dữ liệu 2024',
    thumbnail: '/authentication.png',
    views: 100,
    organizationLocation: '227 Nguyễn Văn Cừ, P4, Q5',
    organizationTime: 'DD-MM-YYYY HH:mm:ss',
    status: '',
    faculty_id: 'CNTT',
  },
  {
    id: '2',
    title: 'Khai mạc Trường hè Khoa học Dữ liệu 2025',
    thumbnail: '/authentication.png',
    views: 100,
    organizationLocation: '227 Nguyễn Văn Cừ, P4, Q5',
    organizationTime: 'DD-MM-YYYY HH:mm:ss',
    status: '',
    faculty_id: 'CNTT',
  },
  {
    id: '3',
    title: 'Khai mạc Trường hè Khoa học Dữ liệu 2026',
    thumbnail: '/authentication.png',
    views: 100,
    organizationLocation: '227 Nguyễn Văn Cừ, P4, Q5',
    organizationTime: 'DD-MM-YYYY HH:mm:ss',
    status: '',
    faculty_id: 'CNTT',
  },
]

function EventsListItem({
  id,
  title,
  thumbnail,
  views,
  organizationLocation,
  organizationTime,
  faculty_id,
}) {
  const router = useRouter()

  return (
    <div className="flex w-[25rem] flex-col justify-start items-start gap-3">
      <Link href={`/events/${id}`} className="w-full h-60 ">
        <figure className="relative h-60 w-full">
          <img
            src={thumbnail}
            alt="thumbnail"
            className="w-full h-full object-cover object-center rounded-xl"
          />
          <figcaption className="absolute p-2 top-4 left-6 font-medium text-white justify-between rounded-lg bg-[--blue-05] saturate-200">
            {faculty_id}
          </figcaption>
        </figure>
      </Link>
      <p className="text-2xl">{title}</p>
      <p className="flex items-center gap-1 text-md">
        <GeoAltFill className="text-[--blue-02]" /> Địa điểm:{' '}
        <text>{organizationLocation}</text>
      </p>
      <p className="flex items-center gap-1 text-md">
        <Clock className="text-[--blue-02]" /> Thời gian:{' '}
        <text>{organizationTime}</text>
      </p>
      <p className="flex items-center gap-1 text-md">
        <BarChartFill className="text-[--blue-02]" /> Số người tham gia:{' '}
        <text>{views}</text>
      </p>
      <Button
        placeholder={undefined}
        onClick={() => router.push(`/events/${id}`)}
        size="lg"
        className="bg-[--secondary] text-black w-full">
        Xem chi tiết
      </Button>
      <Button
        placeholder={undefined}
        size="lg"
        className="bg-[--blue-02] w-full">
        Tham gia
      </Button>
    </div>
  )
}

export default function Page() {
  return (
    <div className="flex justify-center gap-8 w-[70%] m-auto max-w-[1400px]">
      <div className="flex w-full flex-wrap gap-6 justify-center mt-8">
        {dataTemp.map(
          ({
            id,
            title,
            thumbnail,
            views,
            organizationLocation,
            organizationTime,
            faculty_id,
          }) => (
            <EventsListItem
              key={id}
              id={id}
              title={title}
              thumbnail={thumbnail}
              views={views}
              organizationLocation={organizationLocation}
              organizationTime={organizationTime}
              faculty_id={faculty_id}
            />
          )
        )}
      </div>
    </div>
  )
}
