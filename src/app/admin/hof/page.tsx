/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useEffect } from 'react'
import { Input, Button } from '@material-tailwind/react'
import { roboto } from '../../ui/fonts'
import { useForm } from 'react-hook-form'
import { JWT_COOKIE } from '../../constant'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ArrowCounterclockwise } from 'react-bootstrap-icons'
import { useDebouncedCallback } from 'use-debounce'
import axios from 'axios'
import Cookies from 'js-cookie'
import Pagination from '../../ui/common/pagination'
import FilterHeader from '../../ui/admin/halloffame/filter-header'
import HofListItem from '../../ui/admin/halloffame/hof-list-item'
import Link from 'next/link'

const hofTemp = [
  {
    id: '1',
    title: 'Nguyễn Mai Hoàng Quang Huy',
    beginning_year: '2016',
    thumbnail: '/demo.jpg',
    faculty: 'Sinh học - Công Nghệ Sinh Học',
    views: 100,
    status: { name: 'Bình thường' },
  },
]

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

      <Link href={'/admin/hof/create'}>
        <Button
          placeholder={undefined}
          className="h-full font-bold normal-case text-base min-w-fit bg-[var(--blue-02)] text-white ">
          Tạo mới
        </Button>
      </Link>

      <Button
        onClick={() => {
          onResetSearchAndFilter()
          reset()
        }}
        placeholder={undefined}
        className="rounded-full p-3 h-full font-bold normal-case text-base min-w-fit bg-[#E4E4E7] text-white ">
        <ArrowCounterclockwise className="text-2xl font-bold text-[#3F3F46]" />
      </Button>
    </div>
  )
}

export default function Page() {
  const { replace } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)

  const [myParams, setMyParams] = useState(`?${params.toString()}`)
  const [curPage, setCurPage] = useState(Number(params.get('page')) + 1 || 1)
  const [totalPages, setTotalPages] = useState(1)
  const [hof, setHof] = useState([])

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

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/hof${myParams}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then(({ data: { totalPages, hof } }) => {
        setTotalPages(totalPages)
        setHof(hof)
      })
      .catch()
  }, [myParams])
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

  return (
    <div className="flex flex-col sm:justify-center lg:justify-start m-auto max-w-[90%] mt-[3vw] overflow-x-auto">
      <p
        className={`${roboto.className} mx-auto w-[1184px] text-3xl font-bold text-[var(--blue-01)]`}>
        Quản lý gương thành công
      </p>
      <FuntionSection
        onSearch={onSearch}
        onResetSearchAndFilter={onResetSearchAndFilter}
      />
      <FilterHeader setParams={setMyParams} setCurPage={setCurPage} />

      <div className="relative mb-10">
        {hofTemp.map(
          ({
            id,
            title,
            beginning_year,
            thumbnail,
            faculty,
            views,
            status,
          }) => (
            <div key={title}>
              <HofListItem
                id={id}
                title={title}
                beginning_year={beginning_year}
                thumbnail={thumbnail}
                faculty={faculty}
                views={views}
                status={status}
              />
            </div>
          )
        )}
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
