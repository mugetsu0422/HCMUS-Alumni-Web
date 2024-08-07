'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useState } from 'react'
import { Clock, GeoAltFill, BarChartFill, TagFill } from 'react-bootstrap-icons'
import Link from 'next/link'
import moment from 'moment'
import toast from 'react-hot-toast'
import ParticipateButton from './participate-button'

export default function EventsListItem({
  event,
  onParticipate,
  onCancelParticipation,
}) {
  const [isParticipated, setIsParticipated] = useState(event.isParticipated)
  const [isDisabled, setIsDisabled] = useState(false)
  const [participants, setParticipants] = useState(event.participants)

  const onClickParticipation = async (eventId) => {
    setIsDisabled(true)
    try {
      await onParticipate(eventId)
      setIsParticipated((isParticipated) => !isParticipated)
      setIsDisabled(false)
      setParticipants((e) => e + 1)
      toast.success('Tham gia sự kiện thành công')
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Lỗi không xác định')
    }
  }
  const onClickParticipationCancel = async (eventId) => {
    setIsDisabled(true)
    try {
      await onCancelParticipation(eventId)
      setIsParticipated((isParticipated) => !isParticipated)
      setIsDisabled(false)
      setParticipants((e) => e - 1)
      toast.success('Hủy tham gia sự kiện thành công')
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Lỗi không xác định')
    }
  }

  return (
    <div className="flex flex-col lg:flex-row justify-center gap-6">
      <Link href={`/events/${event.id}`} className="">
        <figure className="relative w-full h-64 lg:w-[30rem] lg:h-72">
          <img
            src={event.thumbnail}
            alt="thumbnail"
            className="w-full h-full object-cover object-center rounded-xl"
          />
          {event.faculty && (
            <figcaption className="absolute p-2 top-4 left-6 font-medium text-white justify-between rounded-lg bg-[--secondary] saturate-200">
              {event.faculty?.name}
            </figcaption>
          )}
        </figure>
      </Link>

      <div className="flex flex-col w-full items-left gap-2">
        <Link
          href={`/events/${event.id}`}
          className="text-[24px] font-semibold w-full line-clamp-2 text-ellipsis overflow-hidden">
          {event.title}
        </Link>
        <div className="flex flex-col gap-1">
          <p className="flex items-start gap-1 text-md w-full">
            <div className="flex items-center gap-1">
              <GeoAltFill className="text-[--blue-02]" />
              <p className="text-nowrap">Địa điểm:</p>
            </div>
            <span className="whitespace-nowrap text-ellipsis overflow-hidden text-wrap">
              {event.organizationLocation}
            </span>
          </p>
          <p className="flex items-center gap-1 text-md">
            <span>
              <Clock className="text-[--blue-02]" />
            </span>
            <span>Thời gian:</span>
            <span>
              {moment(event.organizationTime).format('DD-MM-YYYY HH:mm:ss')}
            </span>
          </p>
          <p className="flex items-center gap-1 text-md">
            <span>
              <BarChartFill className="text-[--blue-02]" />
            </span>
            <span>Số người tham gia:</span>
            <span>
              {participants} / {event.maximumParticipants}
            </span>
          </p>
          <div className="flex gap-x-2 items-center flex-wrap">
            <TagFill className="text-[--blue-02]" />
            {event.tags.map(({ name }) => (
              <p key={name} className="text-md hover:duration-300">
                {name}
              </p>
            ))}
          </div>
        </div>
        <ParticipateButton
          requiredPermission={'Event.Participant.Create'}
          isParticipated={isParticipated}
          isDisabled={isDisabled}
          onParticipate={onClickParticipation}
          onCancelParticipation={onClickParticipationCancel}
          eventId={event.id}
          participateBtnClassName={`flex justify-center items-center gap-2 bg-[--blue-02] font-bold w-full lg:w-[400px] bg-[--blue-02] text-[16px]`}
          cancelPartcipateBtnClassName={`flex justify-center items-center gap-2 bg-[#e4e6eb] text-[#4b4f56] font-bold w-full lg:w-[400px] text-[16px]`}
          requiredBtnClassName={`w-full lg:w-[400px] py-3 px-6 bg-[#e4e6eb] text-[#4b4f56] normal-case w-full text-[16px]`}
        />
      </div>
    </div>
  )
}
