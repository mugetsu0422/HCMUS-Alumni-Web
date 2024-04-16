'use client'

import React, { useEffect, useState } from 'react'
import EventsListItem from '../../ui/social-page/events/events-list-item'
import Pagination from '../../ui/common/pagination'
import { Button, Input } from '@material-tailwind/react'
import { FACULTIES, JWT_COOKIE, POST_STATUS } from '../../constant'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { useForm } from 'react-hook-form'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import axios from 'axios'
import Cookies from 'js-cookie'

interface SearchAndFilterFacultyProps {
  onSearch: (keyword: string) => void
  onFilter: (facultyId: string) => void
  onResetFilter: () => void
  params: { title: string | null; facultyId: string | null }
}

function SearchAndFilterFaculty({
  onSearch,
  onFilter,
  onResetFilter,
  params,
}: SearchAndFilterFacultyProps) {
  const { register, reset } = useForm({
    defaultValues: {
      title: params.title,
      facultyId: params.facultyId || 0,
    },
  })

  return (
    <div className="flex flex-col gap-4 w-fit">
      <Input
        size="lg"
        crossOrigin={undefined}
        label="Tìm kiếm sự kiện..."
        placeholder={undefined}
        containerProps={{ className: '!w-[500px]' }}
        {...register('title', {
          onChange: (e) => onSearch(e.target.value),
        })}
      />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-md">Khoa</p>
          <select
            className="h-[2.8rem] hover:cursor-pointer pl-3 w-fit text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 rounded-md border-blue-gray-200 focus:border-gray-900"
            {...register('facultyId', {
              onChange: (e) => onFilter(e.target.value),
            })}>
            <option value={0}>Không</option>
            {FACULTIES.map(({ id, name }) => {
              return (
                <option key={id} value={id}>
                  {name}
                </option>
              )
            })}
          </select>
        </div>

        <Button
          onClick={() => {
            onResetFilter()
            reset({ facultyId: 0 })
          }}
          placeholder={undefined}
          className="bg-[--blue-05] w-fit">
          <FontAwesomeIcon
            icon={faFilterCircleXmark}
            className="text-lg mr-2"
          />
          Xóa bộ lọc
        </Button>
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
  const onFilter = (facultyId: string) => {
    if (facultyId != '0') {
      params.set('facultyId', facultyId)
    } else {
      params.delete('facultyId')
    }
    resetCurPage()
    replace(`${pathname}?${params.toString()}`)
    setMyParams(`?${params.toString()}`)
  }
  const onResetFilter = () => {
    params.delete('facultyId')
    resetCurPage()
    replace(`${pathname}?${params.toString()}`)
    setMyParams(`?${params.toString()}`)
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
    // News list
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/events${myParams}&statusId=${POST_STATUS['Bình thường']}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { totalPages, events } }) => {
        setTotalPages(totalPages)
        setEvents(events)
      })
      .catch()
  }, [myParams])

  return (
    <div className="mt-8 flex flex-col justify-center gap-8 w-[70%] m-auto max-w-[1248px]">
      <SearchAndFilterFaculty
        onSearch={onSearch}
        onFilter={onFilter}
        onResetFilter={onResetFilter}
        params={{
          title: params.get('title'),
          facultyId: params.get('facultyId'),
        }}
      />
      <div className="flex w-full flex-wrap gap-6 justify-center mt-4">
        {events.map(
          ({
            id,
            title,
            thumbnail,
            participants,
            organizationLocation,
            organizationTime,
            faculty,
          }) => (
            <EventsListItem
              key={id}
              id={id}
              title={title}
              thumbnail={thumbnail}
              participants={participants}
              organizationLocation={organizationLocation}
              organizationTime={organizationTime}
              faculty={faculty}
            />
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
