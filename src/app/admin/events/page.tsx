'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Input, Button, Spinner } from '@material-tailwind/react'
import { ArrowCounterclockwise, Search } from 'react-bootstrap-icons'
import { roboto } from '../../ui/fonts'
import Pagination from '../../ui/common/pagination'
import EventsListItem from '../../ui/admin/events/events-list-item'
import SortHeader from '../../ui/admin/events/sort-header'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { JWT_COOKIE } from '../../constant'
import Cookies from 'js-cookie'
import FilterAdmin from '../../ui/common/filter'
import Link from 'next/link'
import { TagSelected, Tag } from 'react-tag-autocomplete'
import useHasAnyPermission from '@/hooks/use-has-any-permission'
import NoResult from '@/app/ui/common/no-results'

// Mode 3: Fetch all events
const FETCH_MODE = 3

interface FunctionSectionProps {
  onSearch: (keyword: string) => void
  onFilterFaculties: (keyword: string) => void
  selectedTags: TagSelected[]
  onAddTags: (tag: Tag) => void
  onDeleteTags: (index: number) => void
  onResetAll: () => void
}

function FuntionSection({
  onSearch,
  onResetAll,
  onFilterFaculties,
  selectedTags,
  onAddTags,
  onDeleteTags,
}: FunctionSectionProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const { register, reset } = useForm({
    defaultValues: {
      title: params.get('title'),
    },
  })
  const hasPermissionCreate = useHasAnyPermission(
    ['Event.Create'],
    Cookies.get('permissions') ? Cookies.get('permissions').split(',') : []
  )

  return (
    <div className="my-5 w-full max-w-[1650px] m-auto flex flex-wrap items-end justify-between gap-5">
      <div className="w-[800px] flex gap-5 justify-start flex-wrap">
        <div className="h-full w-full mr-auto flex flex-col gap-2">
          <p className="font-semibold text-md">Tìm kiếm sự kiện </p>
          <Input
            size="lg"
            crossOrigin={undefined}
            placeholder={undefined}
            icon={<Search />}
            defaultValue={params.get('title')}
            {...register('title', {
              onChange: (e) => onSearch(e.target.value),
            })}
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
            containerProps={{
              className: 'h-[50px]',
            }}
            className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
          />
        </div>

        <FilterAdmin
          onFilterFaculties={onFilterFaculties}
          selectedTags={selectedTags}
          onAddTags={onAddTags}
          onDeleteTags={onDeleteTags}
          params={{
            facultyId: params.get('facultyId'),
          }}
        />
      </div>
      <div className="flex gap-5">
        <Button
          placeholder={undefined}
          className="h-full font-bold normal-case text-base min-w-fit bg-[var(--blue-02)] text-white "
          disabled={!hasPermissionCreate}>
          <Link href={'/admin/events/create'}>Tạo mới</Link>
        </Button>

        <Button
          onClick={() => {
            onResetAll()
            reset()
          }}
          placeholder={undefined}
          className="rounded-full p-3 h-full font-bold normal-case text-base min-w-fit bg-[#E4E4E7] text-white ">
          <ArrowCounterclockwise className="text-2xl font-bold text-[#3F3F46]" />
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

  // lấy toàn bộ events
  const [myParams, setMyParams] = useState(
    `?mode=${FETCH_MODE}&${params.toString()}`
  )
  const [curPage, setCurPage] = useState(Number(params.get('page')) + 1 || 1)
  const [totalPages, setTotalPages] = useState(1)
  const [events, setEvents] = useState([])
  const [selectedTags, setSelectedTags] = useState(() => {
    const tagNames = params.get('tagNames')
    if (!tagNames) return []
    return tagNames.split(',').map((tag) => ({ value: tag, label: tag }))
  })

  const [isFetching, setIsFetching] = useState(true)

  const resetCurPage = () => {
    params.delete('page')
    setCurPage(1)
  }
  const onChangeMyParams = () => {
    setMyParams(`?mode=${FETCH_MODE}&${params.toString()}`)
  }
  const onSearch = useDebouncedCallback((keyword) => {
    if (keyword) {
      params.set('title', keyword)
    } else {
      params.delete('title')
    }
    resetCurPage()
    replace(`${pathname}?${params.toString()}`)
    onChangeMyParams()
  }, 500)
  const onResetAll = () => {
    resetCurPage()
    replace(pathname)
    setSelectedTags([])
    setMyParams(`?mode=${FETCH_MODE}`)
  }
  const onNextPage = () => {
    if (curPage == totalPages) return
    params.set('page', curPage.toString())
    replace(`${pathname}?${params.toString()}`)
    onChangeMyParams()
    setCurPage((curPage) => {
      return curPage + 1
    })
  }

  const onPrevPage = () => {
    if (curPage == 1) return
    params.set('page', (curPage - 2).toString())
    replace(`${pathname}?${params.toString()}`)
    onChangeMyParams()
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
    onChangeMyParams()
  }

  const onFilterFaculties = (facultyId: string) => {
    if (facultyId != '0') {
      params.set('facultyId', facultyId)
    } else {
      params.delete('facultyId')
    }
    resetCurPage()
    replace(`${pathname}?${params.toString()}`)
    onChangeMyParams()
  }
  const onAddTags = (newTag) => {
    const newTags = [...selectedTags, newTag]
    setSelectedTags(newTags)
    params.set('tagNames', newTags.map(({ value }) => value).join(','))
    resetCurPage()
    replace(`${pathname}?${params.toString()}`, { scroll: true })
    setMyParams(`?${params.toString()}`)
  }
  const onDeleteTags = (tagIndex) => {
    const newTags = selectedTags.filter((_, i) => i !== tagIndex)
    setSelectedTags(newTags)
    if (newTags.length == 0) {
      params.delete('tagNames')
    } else {
      params.set('tagNames', newTags.map(({ value }) => value).join(','))
    }
    resetCurPage()
    replace(`${pathname}?${params.toString()}`, { scroll: true })
    setMyParams(`?${params.toString()}`)
  }

  useEffect(() => {
    const fechtData = async () => {
      setIsFetching(true)
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_HOST}/events${myParams}&fetchMode=MANAGEMENT`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
            },
          }
        )
        const { totalPages, events } = response.data
        setTotalPages(totalPages)
        setEvents(events)
        setIsFetching(false)
      } catch (error) {}
    }
    fechtData()
  }, [myParams])

  return (
    <div className="flex flex-col sm:justify-center lg:justify-start m-auto max-w-[90%] mt-[3vw] ">
      <p
        className={`${roboto.className} mx-auto w-full max-w-[1650px] text-3xl font-bold text-[var(--blue-01)]`}>
        Quản lý sự kiện
      </p>
      <FuntionSection
        onSearch={onSearch}
        onResetAll={onResetAll}
        onFilterFaculties={onFilterFaculties}
        selectedTags={selectedTags}
        onAddTags={onAddTags}
        onDeleteTags={onDeleteTags}
      />

      {isFetching ? (
        <div className="w-full flex justify-center items-center">
          <Spinner className="h-8 w-8"></Spinner>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {events.length > 0 && <SortHeader onOrder={onOrder} />}
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
                tags,
                faculty,
                minimumParticipants,
                maximumParticipants,
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
                  tags={tags}
                  faculty={faculty}
                  minimumParticipants={minimumParticipants}
                  maximumParticipants={maximumParticipants}
                />
              )
            )}
          </div>
        </div>
      )}
      {!isFetching &&
        (totalPages > 1 ? (
          <Pagination
            totalPages={totalPages}
            curPage={curPage}
            onNextPage={onNextPage}
            onPrevPage={onPrevPage}
          />
        ) : (
          events.length === 0 && (
            <NoResult message="Không tìm thấy sự kiện nào" />
          )
        ))}
    </div>
  )
}
