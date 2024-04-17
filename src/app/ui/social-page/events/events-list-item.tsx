'use client'
/* eslint-disable @next/next/no-img-element */

import React from 'react'
import { Clock, GeoAltFill, BarChartFill } from 'react-bootstrap-icons'
import { Button } from '@material-tailwind/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import moment from 'moment'

export default function EventsListItem({
  id,
  title,
  thumbnail,
  participants,
  organizationLocation,
  organizationTime,
  faculty,
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
          {faculty && (
            <figcaption className="absolute p-2 top-4 left-6 font-medium text-white justify-between rounded-lg bg-[--blue-05] saturate-200">
              {faculty?.name}
            </figcaption>
          )}
        </figure>
      </Link>
      <div className="flex flex-col w-full h-[128px]">
        <p className="text-xl font-semibold w-full line-clamp-2 text-ellipsis overflow-hidden">
          {title}
        </p>
        <p className="flex items-center gap-1 text-md w-full">
          <GeoAltFill className="text-[--blue-02]" />
          <span className="">Địa điểm:</span>
          <span className="w-[70%] whitespace-nowrap text-ellipsis overflow-hidden">
            {organizationLocation}
          </span>
        </p>
        <p className="flex items-center gap-1 text-md">
          <Clock className="text-[--blue-02]" /> Thời gian:{' '}
          <span>{moment(organizationTime).format('DD-MM-YYYY HH:mm:ss')}</span>
        </p>
        <p className="flex items-center gap-1 text-md">
          <BarChartFill className="text-[--blue-02]" /> Số người tham gia:{' '}
          <span>{participants}</span>
        </p>
      </div>
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
