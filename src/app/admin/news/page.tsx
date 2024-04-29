'use client'
import React, { useEffect, useState } from 'react'
import NewsListItem from '../../ui/admin/news/news-list-item'
import FilterHeader from '../../ui/admin/news/Header'
import { Input, Button } from '@material-tailwind/react'
import { ArrowCounterclockwise, Search } from 'react-bootstrap-icons'
import { JWT_COOKIE } from '../../constant'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useDebouncedCallback } from 'use-debounce'
import { roboto } from '../../ui/fonts'
import { useForm } from 'react-hook-form'
import Pagination from '../../ui/common/pagination'
import FilterAdmin from '../../ui/common/filter'
interface FunctionSectionProps {
  onSearch: (keyword: string) => void
  onResetAll: () => void
}

function FuntionSection({
  onSearch,
  onResetAll,
}: FunctionSectionProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const { register, reset } = useForm({
    defaultValues: {
      title: params.get('title'),
    },
  })

  return (
    <div className="my-5 w-full max-w-[1184px] flex items-center gap-5 m-auto">
      <div className="h-full w-[500px] mr-auto">
        <Input
          size="lg"
          crossOrigin={undefined}
          label="Tìm kiếm bài viết..."
          placeholder={undefined}
          icon={<Search />}
          defaultValue={params.get('title')}
          {...register('title', {
            onChange: (e) => onSearch(e.target.value),
          })}
          className="text-[--secondary]"
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
          onResetAll()
          reset()
        }}
        placeholder={undefined}
        className="rounded-full p-3 h-full font-bold normal-case text-base min-w-fit bg-[#E4E4E7]">
        <ArrowCounterclockwise className="text-2xl font-bold text-[#3F3F46]" />
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
    replace(`${pathname}?${params.toString()}`)
    setMyParams(`?${params.toString()}`)
  }, 500)
  const onResetAll = () => {
    resetCurPage()
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
  const onOrder = (name: string, order: string) => {
    params.delete('page')
    setCurPage(1)
    params.set('orderBy', name)
    params.set('order', order)
    replace(`${pathname}?${params.toString()}`)
    setMyParams(`?${params.toString()}`)
  }

  const onFilterFaculties = (facultyId: string) => {
    if (facultyId != '0') {
      params.set('facultyId', facultyId)
    } else {
      params.delete('facultyId')
    }
    resetCurPage()
    replace(`${pathname}?${params.toString()}`)
    setMyParams(`?${params.toString()}`)
  }
  const onFilterTag = (tag: string) => {
    if (tag != '0') {
      params.set('tagsId', tag)
    } else {
      params.delete('tagsId')
    }
    resetCurPage()
    replace(`${pathname}?${params.toString()}`)
    setMyParams(`?${params.toString()}`)
  }

  const onResetFilter = () => {
    params.delete('facultyId')
    params.delete('tagsId')
    resetCurPage()
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
    <div className="flex flex-col sm:justify-center lg:justify-start m-auto max-w-[90%] mt-[3vw]">
      <p
        className={`${roboto.className} mx-auto max-w-[1184px] w-full text-3xl font-bold text-[var(--blue-01)]`}>
        Quản lý tin tức
      </p>
      <FuntionSection
        onSearch={onSearch}
        onResetAll={onResetAll}
      />
      <FilterAdmin
        witdh={'1184px'}
        onFilterTag={onFilterTag}
        onFilterFaculties={onFilterFaculties}
        onResetFilter={onResetFilter}
        params={{
          tagsId: params.get('tagsId'),
          facultyId: params.get('facultyId'),
        }}
      />
      <div className="overflow-x-auto">
        <FilterHeader onFilter={onOrder} />
        <div className="relative mb-10">
          {news.map(
            ({
              id,
              title,
              thumbnail,
              views,
              status,
              publishedAt,
              faculty,
              tags,
            }) => (
              <NewsListItem
                key={id}
                name={title}
                imgSrc={thumbnail}
                status={status}
                views={views}
                id={id}
                publishedAt={publishedAt}
                faculty={faculty}
                tags={tags}
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
    </div>
  )
}
