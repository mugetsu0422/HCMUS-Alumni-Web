'use client'
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react'
import { nunito } from '../../../ui/fonts'
import NotFound404 from '@/app/ui/common/not-found-404'
import axios from 'axios'
import Cookies from 'js-cookie'
import { JWT_COOKIE } from '../../../constant'
import { ClockFill, EyeFill } from 'react-bootstrap-icons'
import moment from 'moment'
import Link from 'next/link'

export default function Page({ params }: { params: { id: string } }) {
  const [hof, setHof] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const detailsPromise = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/hof/${params.id}`,
      {
        headers: Cookies.get(JWT_COOKIE)
          ? {
              Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
            }
          : null,
      }
    )
    Promise.all([detailsPromise])
      .then(([detailsRes]) => {
        const { data: hof } = detailsRes
        setHof(hof)
        setIsLoading(false)
      })
      .catch((error) => {
        return setNotFound(true)
      })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (notFound) {
    return <NotFound404 />
  }

  if (!isLoading)
    return (
      <>
        <div className="flex flex-col justify-center items-center m-auto mb-10 max-w-[1000px] w-[80%] gap-6">
          <div className={`mt-10 flex flex-col gap-y-6 mx-0 md:mx-auto w-full`}>
            {hof.linkedUser ? (
              <Link
                href={`/profile/${hof.linkedUser}/about`}
                target="blank"
                className="w-full flex justify-center">
                <img
                  src={hof.thumbnail}
                  alt="Hall of fame image"
                  className=" w-[650px] lg:h-[450px] sm:h-[350px] object-cover object-center rounded-xl"
                />
              </Link>
            ) : (
              <div className="w-full flex justify-center">
                <img
                  src={hof.thumbnail}
                  alt="Hall of fame image"
                  className=" w-[650px] lg:h-[450px] sm:h-[350px] object-cover object-center rounded-xl"
                />
              </div>
            )}

            <div className="w-full flex justify-center items-center">
              <div className="font-medium text-lg flex items-center gap-x-1 text-[--secondary] italic">
                <ClockFill className="text-[--blue-01] " />
                {moment(hof.publsihedAt).format('DD/MM/YYYY')}

                <span className="flex ml-2 items-center gap-x-2 italic">
                  <EyeFill className="text-[--blue-01]" />
                  {hof.views}
                </span>
              </div>
            </div>

            <div className="flex gap-2 flex-col w-4/5 m-auto">
              <p
                className={`${nunito.className} 2xl:text-[28px] sm:text-lg lg:text-2xl font-bold text-center`}>
                {hof.title}
              </p>
              <p className="font-semibold text-center">
                {hof.beginningYear && <span>Khóa {hof.beginningYear} </span>}
                {hof.faculty && <span>- Khoa {hof.faculty.name}</span>}
              </p>
              <p className="font-semibold text-center">{hof.position}</p>
            </div>
            <div
              className="flex flex-col gap-4 ql-editor sm:text:md lg:text-base text-justify"
              dangerouslySetInnerHTML={{ __html: hof.content }}></div>
          </div>
          <div className="w-full text-right">{hof.creator.fullName}</div>
        </div>
      </>
    )
}
