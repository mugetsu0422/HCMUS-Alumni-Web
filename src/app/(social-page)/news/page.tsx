/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@material-tailwind/react'
import { ArrowRight, ArrowLeft } from 'react-bootstrap-icons'
import { Calendar } from 'react-bootstrap-icons'
import MostViewed from '../../ui/social-page/news/most-viewed'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { JWT_COOKIE } from '../../constant'
import Cookies from 'js-cookie'
import axios from 'axios'
import Link from 'next/link'
import moment from 'moment'
import Pagination from '../../ui/common/pagination'

function NewsListItem({
  id,
  title,
  summary,
  publishedAt,
  faculty,
  tags,
  thumbnail,
}) {
  return (
    <div className="flex lg:flex-row flex-col justify-center items-center gap-6">
      <Link href={`/news/${id}`} className="w-[25rem] xl:w-[20rem] h-52 ">
        <img
          src={thumbnail}
          alt="thumbnail"
          className="w-full h-full object-cover object-center rounded-xl"
        />
      </Link>
      <div className="flex flex-col gap-y-2 text-black">
        <Link
          href={`/news/${id}`}
          className="font-extrabold w-[500px] md:w-[600px] text-[--blue-05] text-2xl cursor-pointer hover:text-[--secondary] hover:duration-300">
          {title}
        </Link>
        <p className="w-[500px] md:w-[600px]">{summary}</p>
        <div className="flex gap-x-1 items-center">
          <Calendar className="text-[--blue-02]" />
          <p>{moment(publishedAt).local().format('DD/MM/YYYY')}</p>
        </div>
        {faculty ? <p>Khoa {faculty.name}</p> : null}
        <div className="flex gap-x-2">
          Thẻ:
          {tags.map(({ name }) => (
            <p
              key={name}
              className="font-extrabold text-[--blue-05] text-md hover:text-[--secondary] hover:duration-300">
              {name}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)

  const [myParams, setMyParams] = useState(`?${params.toString()}`)
  const [curPage, setCurPage] = useState(Number(params.get('page')) + 1 || 1)
  const [totalPages, setTotalPages] = useState(0)
  const [news, setNews] = useState([])

  const resetCurPage = () => {
    params.delete('page')
    setCurPage(1)
  }
  const onSearch = useDebouncedCallback((keyword) => {
    if (keyword) {
      params.set('title', keyword)
    } else {
      params.delete('title')
    }
    resetCurPage()
    replace(`${pathname}?${params.toString()}`)
    setMyParams(`?${params.toString()}`)
  }, 500)
  const onResetSearchAndFilter = () => {
    replace(pathname)
    setMyParams(``)
  }
  const onNextPage = () => {
    if (curPage == totalPages) return
    params.set('page', curPage.toString())
    replace(`${pathname}?${params.toString()}`)
    setMyParams(`?${params.toString()}`)
    setCurPage((curPage) => {
      return curPage + 1
    })
  }
  const onPrevPage = () => {
    if (curPage == 1) return
    params.set('page', (curPage - 2).toString())
    replace(`${pathname}?${params.toString()}`)
    setMyParams(`?${params.toString()}`)
    setCurPage((curPage) => {
      return curPage - 1
    })
  }

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/news${myParams}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then(({ data: { totalPages, news } }) => {
        console.log(news)

        setTotalPages(totalPages)
        setNews(news)
      })
      .catch()
  }, [myParams])

  return (
    <>
      <div className="flex flex-col xl:flex-row m-auto justify-center gap-x-8">
        <div className="flex flex-col gap-y-6 mt-10">
          {news.map(
            ({ id, title, summary, publishedAt, faculty, tags, thumbnail }) => (
              <NewsListItem
                id={id}
                key={id}
                title={title}
                summary={summary}
                publishedAt={publishedAt}
                faculty={faculty}
                tags={tags}
                thumbnail={thumbnail}
              />
            )
          )}
        </div>
        <MostViewed />
      </div>
      <Pagination
        totalPages={totalPages}
        curPage={curPage}
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
      />
    </>
  )
}
