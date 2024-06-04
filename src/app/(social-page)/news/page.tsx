/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useEffect, useState } from 'react'
import { Button, Input } from '@material-tailwind/react'
import { Calendar, TagFill } from 'react-bootstrap-icons'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { JWT_COOKIE, POST_STATUS } from '../../constant'
import Cookies from 'js-cookie'
import axios from 'axios'
import Link from 'next/link'
import moment from 'moment'
import Pagination from '../../ui/common/pagination'
import { roboto } from '../../ui/fonts'
import { useForm } from 'react-hook-form'
import Thumbnail from '../../ui/social-page/thumbnail-image'
import SearchAndFilterFaculty from '../../ui/social-page/common/filter-and-search'
import NewsListItem from '../../ui/social-page/news/news-litst-item'

export default function Page() {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)

  const [myParams, setMyParams] = useState(`?${params.toString()}`)
  const [curPage, setCurPage] = useState(Number(params.get('page')) + 1 || 1)
  const [totalPages, setTotalPages] = useState(1)
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
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    setMyParams(`?${params.toString()}`)
  }, 500)

  const onFilter = (facultyId: string) => {
    if (facultyId != '0') {
      params.set('facultyId', facultyId)
    } else {
      params.delete('facultyId')
    }
    resetCurPage()
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    setMyParams(`?${params.toString()}`)
  }

  const onFilterFaculties = (facultyId: string) => {
    if (facultyId != '0') {
      params.set('facultyId', facultyId)
    } else {
      params.delete('facultyId')
    }
    resetCurPage()
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    setMyParams(`?${params.toString()}`)
  }

  const onFilterTag = (tag: string) => {
    if (tag != '0') {
      params.set('tagsId', tag)
    } else {
      params.delete('tagsId')
    }
    resetCurPage()
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    setMyParams(`?${params.toString()}`)
  }

  const onResetFilter = () => {
    params.delete('facultyId')
    params.delete('tagsId')
    resetCurPage()
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    setMyParams(`?${params.toString()}`)
  }

  const onNextPage = () => {
    if (curPage == totalPages) return
    params.set('page', curPage.toString())
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    setMyParams(`?${params.toString()}`)
    setCurPage((curPage) => {
      return curPage + 1
    })
  }
  const onPrevPage = () => {
    if (curPage == 1) return
    params.set('page', (curPage - 2).toString())
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    setMyParams(`?${params.toString()}`)
    setCurPage((curPage) => {
      return curPage - 1
    })
  }

  useEffect(() => {
    // News list
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/news${myParams}&statusId=${POST_STATUS['Bình thường']}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { totalPages, news } }) => {
        setTotalPages(totalPages)
        setNews(news)
      })
      .catch((error) => {})
  }, [myParams])

  return (
    <>
      <Thumbnail />
      <div className="xl:w-[1264px] flex flex-col xl:flex-row justify-between gap-x-8 m-auto">
        <div className="flex flex-col gap-y-6 mt-10">
          <p
            className={`${roboto.className} ml-5 lg:ml-0 text-3xl font-bold text-[var(--blue-02)]`}>
            TIN TỨC
          </p>

          <SearchAndFilterFaculty
            name="tin tức"
            onSearch={onSearch}
            onFilter={onFilter}
            onResetFilter={onResetFilter}
            onFilterTag={onFilterTag}
            params={{
              title: params.get('title'),
              facultyId: params.get('facultyId'),
              tagsId: params.get('tagsID'),
            }}
          />

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
