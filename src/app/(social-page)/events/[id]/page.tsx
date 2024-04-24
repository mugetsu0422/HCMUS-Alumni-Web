'use client'

/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import {
  ClockFill,
  GeoAltFill,
  BarChartFill,
  TagFill,
} from 'react-bootstrap-icons'
import { nunito } from '../../../ui/fonts'
import { Button } from '@material-tailwind/react'
import axios from 'axios'
import { JWT_COOKIE } from '../../../constant'
import Cookies from 'js-cookie'
import NoData from '../../../ui/no-data'
import moment from 'moment'

export default function Page({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState(null)
  const [noData, setNoData] = useState(false)

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/events/${params.id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then(({ data }) => {
        setEvent(data)
      })
      .catch((e) => {
        setNoData(true)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (noData) {
    return <NoData />
  }

  return (
    <div
      className={`${nunito.className} flex flex-col gap-6 w-[75%] max-w-[1366px] bg-[--blue-04] rounded-lg m-auto lg:px-10 lg:py-10 mt-16 mb-16`}>
      <div className="flex flex-col xl:flex-row items-center justify-center m-auto gap-x-10">
        <img
          src={event?.thumbnail}
          alt="image event"
          className="sm:w-[450px] 2xl:w-[1000px] 2xl:h-[400px] object-cover object-center rounded-lg"
        />
        <div className="flex flex-col gap-4 w-full">
          <div>
            <p className="text-left sm:text-[1.5rem] 2xl:text-[1.9rem] font-extrabold ">
              {event?.title}
            </p>
            {event?.faculty && (
              <p className="text-left sm:text-[1.1rem] 2xl:text-[1.5rem] font-semibold">
                Khoa {event.faculty.name}
              </p>
            )}
          </div>

          <div className="w-full flex flex-col xl:gap-y-6 2xl:gap-y-10 items-start">
            <div>
              <p className="flex text-nowrap items-start gap-2 sm:text-[16px] 2xl:text-[20px]">
                <GeoAltFill className="text-[--blue-02]" /> Địa điểm:
                <span className="text-wrap">{event?.organizationLocation}</span>
              </p>
              <p className="flex items-center gap-2 sm:text-[16px] 2xl:text-[20px]">
                <ClockFill className="text-[--blue-02]" /> Thời gian:
                <span>
                  {event &&
                    moment(event?.organizationTime).format(
                      'DD-MM-YYYY HH:mm:ss'
                    )}
                </span>
              </p>

              {event?.tags && (
                <p className="flex items-center gap-2 sm:text-[16px] 2xl:text-[20px]">
                  <TagFill className="text-[--blue-02]" />
                  {event.tags.map((tag) => (
                    <span key={tag.name}>{tag.name}</span>
                  ))}
                </p>
              )}
            </div>
          </div>

          <div className="w-full flex flex-col justify-center items-center lg:items-start gap-6 ">
            <div className="flex gap-3">
              <BarChartFill className="text-[--blue-02] text-[4.1rem]" />
              <div className="flex flex-col">
                <p className="text-[20px] 2xl:text-[30px] font-extrabold">
                  {event?.participants}
                </p>
                <p className="text-lg">người tham gia</p>
              </div>
            </div>

            <Button
              placeholder={undefined}
              className="w-52 bg-[--blue-02]"
              size="lg">
              Tham gia ngay
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <p className="text-[26px] font-extrabold">Thông tin chi tiết</p>
        <p className="text-pretty text-base">{event?.content}</p>
      </div>
    </div>
  )
}
