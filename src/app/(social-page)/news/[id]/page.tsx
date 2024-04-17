'use client'

import React, { useEffect, useState } from 'react'
import MostViewed from '../../../ui/social-page/news/most-viewed'
import { Clock, BarChartFill, TagFill } from 'react-bootstrap-icons'
import { Textarea } from '@material-tailwind/react'

import { nunito } from '../../../ui/fonts'
import axios from 'axios'
import { JWT_COOKIE, MOST_VIEWED_LIMIT, TAGS } from '../../../constant'
import Cookies from 'js-cookie'
import NoData from '../../../ui/no-data'
import moment from 'moment'

export default function Page({ params }: { params: { id: string } }) {
  const [news, setNews] = useState(null)
  const [noData, setNoData] = useState(false)
  const [mostViewed, setMostViewed] = useState([])

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/news/${params.id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then(({ data }) => {
        setNews(data)
      })
      .catch((e) => {
        setNoData(true)
      })
    // Most viewed news
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/news/most-viewed?limit=${MOST_VIEWED_LIMIT}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { news } }) => {
        setMostViewed(news)
      })
      .catch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (noData) {
    return <NoData />
  }
  return (
    <div className="flex flex-col xl:flex-row m-auto w-[80%]">
      <div className={`mt-10 flex flex-col gap-y-8 mx-auto w-[70%]`}>
        <div className="flex justify-between">
          {news?.faculty ? (
            <p className="font-medium text-lg text-[--blue-05]">
              Khoa {news?.faculty.name}
            </p>
          ) : <p></p>}
          <p className="font-medium text-lg flex items-center gap-x-1">
            <Clock />
            {moment(news?.publsihedAt).format('DD/MM/YYYY')}
          </p>
        </div>
        <div className="text-left text-[1.8rem] font-bold text-[--blue-05]">
          {news?.title}
        </div>
        <div
          className="w-full h-auto ql-editor"
          dangerouslySetInnerHTML={{ __html: news?.content }}></div>

        <div className="flex flex-col gap-y-1 text-black text-base">
          <div className="flex items-center gap-x-2">
            <BarChartFill />
            Lượt xem: {news?.views}
          </div>
          <div className="flex gap-x-2 items-center">
            <TagFill />
            Thẻ:
            {news?.tags.map(({ name }) => {
              return (
                <span
                  className="text-[var(--blue-05)] font-semibold"
                  key={name}>
                  {name}
                </span>
              )
            })}
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-x-2">
              <Clock />
              Lần cuối cập nhật:{' '}
              {moment(news?.updateAt)
                .local()
                .format('DD/MM/YYYY')}
            </div>
            <div>React icon</div>
          </div>
        </div>
        <div className="flex flex-col gap-y-2  mb-8">
          <p className="text-xl">Bình luận</p>
          <Textarea placeholder={undefined} label="Chia sẻ ý kiến của bạn" />
        </div>
      </div>

      <MostViewed
        className={
          'xl:w-72 w-fit h-fit mt-6 xl:mt-0 bg-gray-300 text-[--blue-05] font-medium py-6 px-4'
        }
        news={mostViewed}
      />
    </div>
  )
}
