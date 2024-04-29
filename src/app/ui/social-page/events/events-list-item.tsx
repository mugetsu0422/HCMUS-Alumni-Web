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
    <div className="flex flex-col xl:flex-row justify-between h-fit gap-6 min-w-[25rem] w-[80%]">
      <Link href={`/events/${id}`} className="lg:w-[30rem] w-full h-64 lg:h-72">
        <figure className="relative h-72 lg:w-[30rem]">
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

      <div className="flex flex-col min-w-[25rem] w-full items-left justify-between">
        <p className="text-[24px] font-semibold w-full line-clamp-2 text-ellipsis overflow-hidden">
          {title}
        </p>
        <div className="flex flex-col gap-1">
          <p className="flex items-start gap-1 text-md w-full">
            <GeoAltFill className="text-[--blue-02]" />
            <span className="">Địa điểm:</span>
            <span className="w-[70%] whitespace-nowrap text-ellipsis overflow-hidden text-wrap">
              {organizationLocation}
            </span>
          </p>
          <p className="flex items-center gap-1 text-md">
            <Clock className="text-[--blue-02]" /> Thời gian:{' '}
            <span>
              {moment(organizationTime).format('DD-MM-YYYY HH:mm:ss')}
            </span>
          </p>
          <p className="flex items-center gap-1 text-md">
            <BarChartFill className="text-[--blue-02]" /> Số người tham gia:{' '}
            <span>{participants} / 100</span>
          </p>
          <p className="flex items-center gap-1 text-md">
            <BarChartFill className="text-[--blue-02]" /> Số người tối thiểu:{' '}
            <span>40</span>
          </p>
        </div>
        <Button
          placeholder={undefined}
          size="md"
          className="bg-[--blue-02] font-medium w-full text-[16px]">
          Tham gia
        </Button>
      </div>
    </div>
  )
}
