'use client'
import React, { useEffect, useState } from 'react'
import { Input, Button } from '@material-tailwind/react'
import { ArrowCounterclockwise } from 'react-bootstrap-icons'
import { roboto } from '../../ui/fonts'
import Pagination from '../../ui/common/pagination'
import EventsListItem from '../../ui/admin/events/events-list-item'
import FilterHeader from '../../ui/admin/events/header-filter'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { JWT_COOKIE } from '../../constant'
import Cookies from 'js-cookie'

const events = [
  {
    id: '1',
    title: 'Khai mạc Trường hè Khoa học Dữ liệu 2024',
    thumbnail: '/authentication.png',
    views: 100,
    organizationLocation: '227 Nguyễn Văn Cừ, P4, Q5 ',
    organizationTime: 'DD/MM/YYYY HH:mm:ss',
    status: { name: 'Ẩn' },
  },
]

interface FunctionSectionProps {
  onSearch: (keyword: string) => void
  onResetSearchAndFilter: () => void
}

function FuntionSection({
  onSearch,
  onResetSearchAndFilter,
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
    <div className="my-5 w-full max-w-[1500px] m-auto flex items-center gap-5">
      <div className="h-full w-[500px] mr-auto">
        <Input
          size="lg"
          crossOrigin={undefined}
          label="Tìm kiếm sự kiện..."
          placeholder={undefined}
          defaultValue={params.get('title')}
          {...register('title', {
            onChange: (e) => onSearch(e.target.value),
          })}
        />
      </div>
      <Button
        onClick={() => router.push('/admin/events/create')}
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
  const [events, setEvents] = useState([])

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
      .get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/events${myParams}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then(({ data: { totalPages, events } }) => {
        setTotalPages(totalPages)
        setEvents(events)
      })
      .catch()
  }, [myParams])

  return (
    <div className="flex flex-col sm:justify-center lg:justify-start m-auto max-w-[90%] mt-[3vw] ">
      <p
        className={`${roboto.className} mx-auto w-full max-w-[1500px] text-3xl font-bold text-[var(--blue-02)]`}>
        Quản lý sự kiện
      </p>
      <FuntionSection
        onSearch={onSearch}
        onResetSearchAndFilter={onResetSearchAndFilter}
      />
      <div className='overflow-x-auto'>
        <FilterHeader onFilter={onFilter} />
        <div className="relative mb-10">
          {events.map(
            ({
              id,
              title,
              thumbnail,
              participants,
              organizationLocation,
              organizationTime,
              status,
            }) => (
              <EventsListItem
                key={id}
                id={id}
                title={title}
                thumbnail={thumbnail}
                participants={participants}
                organizationLocation={organizationLocation}
                organizationTime={organizationTime}
                status={status}
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
