'use client'

/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { Clock, GeoAltFill, BarChartFill, Tag } from 'react-bootstrap-icons'
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
      className={`${nunito.className} w-[75%] max-w-[1366px] bg-[--blue-04] rounded-lg m-auto py-10 mt-16`}>
      <div className="flex flex-col w-[90%] items-center justify-center m-auto gap-y-10">
        <div className="flex flex-col justify-center items-center gap-4 w-full">
          <img
            src={event?.thumbnail}
            alt="image event"
            className="sm:w-[450px] xl:w-[600px] 2xl:w-[750px] 2xl:h-[500px] object-cover object-center rounded-lg"
          />
          <div>
            <p className="text-center text-[1.9rem] font-extrabold">{event?.title}</p>
            {event?.faculty && (
              <p className="text-center text-[1.5rem] font-semibold">Khoa {event.faculty.name}</p>
            )}
          </div>

          <div className="w-full flex flex-col xl:gap-y-6 2xl:gap-y-10 items-center">
            <div>
              <p className="flex items-center gap-2 text-[20px]">
                <GeoAltFill className="text-[--blue-02]" /> Địa điểm:
                <span>{event?.organizationLocation}</span>
              </p>
              <p className="flex items-center gap-2 text-[20px]">
                <Clock className="text-[--blue-02]" /> Thời gian:
                <span>
                  {event &&
                    moment(event?.organizationTime).format(
                      'DD-MM-YYYY HH:mm:ss'
                    )}
                </span>
              </p>
              {event?.tags && (
                <p className="flex items-center gap-2 text-[20px]">
                  <Tag className="text-[--blue-02]" /> Thẻ:
                  {event.tags.map((tag) => (
                    <span key={tag.name}>{tag.name}</span>
                  ))}
                </p>
              )}
            </div>
          </div>
          <div className="w-full flex items-end gap-6 ">
            <div className="flex items-end">
              <BarChartFill className="text-[--blue-02] text-[4.1rem]" />
              <div className="flex flex-col">
                <p className="text-[30px] font-extrabold">
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
        <div className="flex flex-col gap-2 w-full">
          <p className="text-[26px] font-extrabold">Thông tin chi tiết</p>
          <p className="text-pretty text-base">{event?.content}</p>
        </div>
      </div>
    </div>
  )
}
