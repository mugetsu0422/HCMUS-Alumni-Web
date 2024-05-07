'use client'
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react'
import { nunito } from '../../../ui/fonts'
import NoData from '../../../ui/no-data'
import axios from 'axios'
import Cookies from 'js-cookie'
import { JWT_COOKIE } from '../../../constant'
import { ClockFill, EyeFill } from 'react-bootstrap-icons'
import moment from 'moment'

export default function Page({ params }: { params: { id: string } }) {
  const [hof, setHof] = useState(null)
  const [noData, setNoData] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const detailsPromise = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/hof/${params.id}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
    Promise.all([detailsPromise])
      .then(([detailsRes]) => {
        const { data: hof } = detailsRes
        setHof(hof)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setNoData(true)
      })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (noData) {
    return <NoData />
  }

  if (!isLoading)
    return (
      <>
        <div className="flex flex-col justify-center items-center m-auto mb-10 max-w-[1000px] w-[80%] gap-6">
          <div className={`mt-10 flex flex-col gap-y-8 mx-0 md:mx-auto w-full`}>
            <div className="w-full flex justify-end items-start">
              <p className="font-medium text-lg flex items-center gap-x-1 text-[--secondary]">
                <ClockFill className="text-[--blue-01]" />
                {moment(hof.publsihedAt).format('DD/MM/YYYY')}
                <span className="flex ml-2 items-center gap-x-2">
                  <EyeFill className="text-[--blue-01]" />
                  {hof.views}
                </span>
              </p>
            </div>
            <div className="w-full flex justify-center">
              <img
                src={hof.thumbnail}
                alt="Hall of fame image"
                className=" w-[650px] lg:h-[450px] sm:h-[350px] object-cover object-center rounded-xl"
              />
            </div>
            <p
              className={`${nunito.className} 2xl:text-[28px] sm:text-lg lg:text-2xl font-bold text-center`}>
              {hof.title}
            </p>
            <div
              className="flex flex-col gap-4 ql-editor sm:text:md lg:text-base text-justify"
              dangerouslySetInnerHTML={{ __html: hof.content }}></div>

            <div className="flex flex-col gap-y-1 text-black text-base">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-x-2">
                  <ClockFill />
                  Lần cuối cập nhật:{' '}
                  {moment(hof.updateAt)
                    .local()
                    .format('DD/MM/YYYY')}
                </div>
                <div>{hof.creator.fullName}</div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
}
