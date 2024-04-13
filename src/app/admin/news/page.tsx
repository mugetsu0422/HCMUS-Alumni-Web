'use client'
import React, { useEffect, useState, useRef } from 'react'
import NewsListItem from '../../ui/admin/news/news-list-item'
import FilterHeader from '../../ui/admin/news/Header'
import { Input, Button } from '@material-tailwind/react'
import { ArrowCounterclockwise } from 'react-bootstrap-icons'
import { JWT_COOKIE } from '../../constant'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useDebouncedCallback } from 'use-debounce'
import { roboto } from '../../ui/fonts'
import { classNames } from 'react-easy-crop/helpers'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import Pagination from '../../ui/common/pagination'

function FuntionSection({ onSearch, onResetSearchAndFilter }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const { register, reset } = useForm({
    defaultValues: {
      title: params.get('title'),
    },
  })

  return (
    <div className="my-5 w-[1184px] m-auto flex items-center gap-5">
      <div className="h-full w-[500px] mr-auto">
        <Input
          size="lg"
          crossOrigin={undefined}
          label="Tìm kiếm bài viết..."
          placeholder={undefined}
          defaultValue={params.get('title')}
          {...register('title', {
            onChange: (e) => onSearch(e.target.value),
          })}
        />
      </div>
      <Button
        onClick={() => router.push('/admin/news/create')}
        placeholder={undefined}
        className="h-full font-bold normal-case text-base min-w-fit bg-[var(--blue-02)] text-white ">
        Tạo mới
      </Button>
      <Button
        onClick={() => {
          onResetSearchAndFilter()
          reset()
        }}
        placeholder={undefined}
        className="rounded-full p-3 h-full font-bold normal-case text-base min-w-fit bg-[var(--blue-02)] text-white ">
        <ArrowCounterclockwise className="text-2xl font-bold" />
      </Button>
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
  const onFilter = (name: string, order: string) => {
    params.delete('page')
    setCurPage(1)
    params.set('orderBy', name)
    params.set('order', order)
    replace(`${pathname}?${params.toString()}`)
    setMyParams(`?${params.toString()}`)
  }

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/news${myParams}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then(({ data: { totalPages, news } }) => {
        setTotalPages(totalPages)
        setNews(news)
      })
      .catch()
  }, [myParams])

  return (
    <div className="flex flex-col sm:justify-center lg:justify-start m-auto max-w-[90%] mt-[3vw] overflow-x-auto">
      <p
        className={`${roboto.className} mx-auto w-[1184px] text-3xl font-bold text-[var(--blue-02)]`}>
        Quản lý tin tức
      </p>
      <FuntionSection
        onSearch={onSearch}
        onResetSearchAndFilter={onResetSearchAndFilter}
      />
      <FilterHeader onFilter={onFilter} />
      <div className="relative mb-10">
        {news.map(({ id, title, thumbnail, views, status, publishedAt }) => (
          <div key={title} className="">
            <NewsListItem
              name={title}
              imgSrc={thumbnail}
              status={status}
              views={views}
              id={id}
              publishedAt={publishedAt}
            />
          </div>
        ))}
      </div>
      <Pagination
        totalPages={totalPages}
        curPage={curPage}
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
      />
    </div>
  )
}
