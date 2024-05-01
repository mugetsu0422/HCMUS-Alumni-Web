'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useState } from 'react'
import { Clock, GeoAltFill, BarChartFill } from 'react-bootstrap-icons'
import { Button } from '@material-tailwind/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import moment from 'moment'
import toast from 'react-hot-toast'

export default function EventsListItem({
  event,
  onParticipate,
  onCancelParticipation,
}) {
  const [isParticipated, setIsParticipated] = useState(event.isParticipated)
  const [isDisabled, setIsDisabled] = useState(false)

  const onClickParticipation = async () => {
    setIsDisabled(true)
    try {
      await onParticipate(event.id)
      setIsParticipated((isParticipated) => !isParticipated)
      setIsDisabled(false)
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra!')
    }
  }
  const onClickParticipationCancel = async () => {
    setIsDisabled(true)
    try {
      await onCancelParticipation(event.id)
      setIsParticipated((isParticipated) => !isParticipated)
      setIsDisabled(false)
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra!')
    }
  }

  return (
    <div className="flex flex-col xl:flex-row justify-between h-fit gap-6 min-w-[25rem] w-[80%]">
      <Link
        href={`/events/${event.id}`}
        className="lg:w-[30rem] w-full h-64 lg:h-72">
        <figure className="relative h-72 lg:w-[30rem]">
          <img
            src={event.thumbnail}
            alt="thumbnail"
            className="w-full h-full object-cover object-center rounded-xl"
          />
          {event.faculty && (
            <figcaption className="absolute p-2 top-4 left-6 font-medium text-white justify-between rounded-lg bg-[--blue-05] saturate-200">
              {event.faculty?.name}
            </figcaption>
          )}
        </figure>
      </Link>

      <div className="flex flex-col min-w-[25rem] w-full items-left justify-between">
        <Link
          href={`/events/${event.id}`}
          className="text-[24px] font-semibold w-full line-clamp-2 text-ellipsis overflow-hidden">
          {event.title}
        </Link>
        <div className="flex flex-col gap-1">
          <p className="flex items-start gap-1 text-md w-full">
            <GeoAltFill className="text-[--blue-02]" />
            <span className="">Địa điểm:</span>
            <span className="w-[70%] whitespace-nowrap text-ellipsis overflow-hidden text-wrap">
              {event.organizationLocation}
            </span>
          </p>
          <p className="flex items-center gap-1 text-md">
            <Clock className="text-[--blue-02]" /> Thời gian:{' '}
            <span>
              {moment(event.organizationTime).format('DD-MM-YYYY HH:mm:ss')}
            </span>
          </p>
          <p className="flex items-center gap-1 text-md">
            <BarChartFill className="text-[--blue-02]" /> Số người tham gia:{' '}
            <span>
              {event.participants} / {event.maximumParticipants}
            </span>
          </p>
          <p className="flex items-center gap-1 text-md">
            <BarChartFill className="text-[--blue-02]" /> Số người tối thiểu:{' '}
            <span>{event.minimumParticipants}</span>
          </p>
        </div>
        {!isParticipated ? (
          <Button
            onClick={() => onClickParticipation()}
            disabled={isDisabled}
            placeholder={undefined}
            size="md"
            className="bg-[--blue-02] font-medium w-full text-[16px]">
            Tham gia
          </Button>
        ) : (
          <Button
            onClick={() => onClickParticipationCancel()}
            disabled={isDisabled}
            placeholder={undefined}
            size="md"
            className="bg-[--blue-02] font-medium w-full text-[16px]">
            Huỷ tham gia
          </Button>
        )}
      </div>
    </div>
  )
}
