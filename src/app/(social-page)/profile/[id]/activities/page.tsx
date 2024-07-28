/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Button, Spinner } from '@material-tailwind/react'
import {
  Star,
  GeoAltFill,
  Clock,
  BarChartFill,
  TagFill,
} from 'react-bootstrap-icons'
import Link from 'next/link'
import axios from 'axios'
import Cookies from 'js-cookie'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { JWT_COOKIE, POST_STATUS } from '@/app/constant'
import moment from 'moment'
import InfiniteScroll from 'react-infinite-scroll-component'

function EventListItem({ event }) {
  return (
    <div key={event.id} className="flex justify-between items-center mt-4">
      <div className="flex items-center gap-4">
        <Link href={`/events/${event.id}`}>
          <figure className="relative w-[80%] h-[15rem] lg:w-[30rem] z-10">
            <img
              src={event.thumbnail}
              alt="thumbnail"
              className="w-full h-full object-cover object-center rounded-xl"
            />
            {event?.faculty && (
              <figcaption className="absolute p-2 top-4 left-6 font-medium text-white justify-between rounded-lg bg-[--secondary] saturate-200 z-20">
                {event?.faculty?.name}
              </figcaption>
            )}
          </figure>
        </Link>
        <div className="flex flex-col gap-1">
          <p className="text-[20px] lg:text-[24px] font-bold">{event.title}</p>

          <p className="text-[12px] lg:text-base flex items-center gap-1">
            <span className="">
              <GeoAltFill className="text-[--blue-02]" />
            </span>
            <span> Địa điểm: {event.organizationLocation}</span>
          </p>

          <p className="text-[12px] lg:text-base flex items-center gap-1">
            <span>
              <Clock className="text-[--blue-02]" />
            </span>
            <span>
              {' '}
              Thời gian:{' '}
              {moment(event.organizationTime)
                .local()
                .format('DD/MM/YYYY HH:mm')}
            </span>
          </p>

          <p className="flex items-center gap-1 text-md">
            <span>
              <BarChartFill className="text-[--blue-02]" />
            </span>
            <span>Số người tham gia:</span>
            <span>
              {event.participants} / {event.maximumParticipants}
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
      </div>
    </div>
  )
}

export default function Page({ params }: { params: { id: string } }) {
  const [joinedEvents, setJoinedEvent] = useState([])
  const curPage = useRef(0)
  const [totalPages, setTotalPages] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const onFetchMore = () => {
    curPage.current++
    if (curPage.current >= totalPages) {
      setHasMore(false)
      return
    }

    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/events/participated?requestedUserId=${params.id}&mode=1&page=${curPage.current}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { events } }) => {
        setJoinedEvent(joinedEvents.concat(events))
      })
      .catch((err) => {})
  }

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/events/participated?requestedUserId=${params.id}&mode=1`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { totalPages, events } }) => {
        setTotalPages(totalPages)
        setJoinedEvent(events)
      })
      .catch((error) => {})
  }, [])

  return (
    <div>
      <div className="w-full flex flex-col gap-4">
        <p className="text-[18px] lg:text-[22px] font-bold">
          Hoạt động đã tham gia
        </p>
        <div className="w-full flex flex-col gap-4">
          {joinedEvents?.length > 0 ? (
            <InfiniteScroll
              dataLength={joinedEvents.length}
              next={onFetchMore}
              hasMore={hasMore}
              loader={
                <div className="h-10 flex justify-center ">
                  <Spinner className="h-8 w-8"></Spinner>
                </div>
              }>
              {joinedEvents?.map((event) => (
                <EventListItem key={event.id} event={event} />
              ))}
            </InfiniteScroll>
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
