'use client'

import React, { useEffect, useState } from 'react'
import EventsListItem from '../../ui/social-page/events/events-list-item'
import Pagination from '../../ui/common/pagination'
import { JWT_COOKIE, POST_STATUS } from '../../constant'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import axios from 'axios'
import Cookies from 'js-cookie'
import { roboto } from '../../ui/fonts'
import Thumbnail from '../../ui/social-page/thumbnail-image'
import SearchAndFilterFaculty from '../../ui/social-page/common/filter-and-search'
import toast, { Toaster } from 'react-hot-toast'
import CustomToaster from '@/app/ui/common/custom-toaster'

export default function Page() {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)

  const [myParams, setMyParams] = useState(`?${params.toString()}`)
  const [curPage, setCurPage] = useState(Number(params.get('page')) + 1 || 1)
  const [totalPages, setTotalPages] = useState(1)
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

  const onParticipateEvent = async (id) => {
    return await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/events/${id}/participants`,
      {},
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
  }
  const onCancelEventParticipation = async (id) => {
    return await axios.delete(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/events/${id}/participants`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
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
        const eventIds = events.map(({ id }) => id)

        // Get list of events that users whether have participated in
        axios
          .get(
            `${
              process.env.NEXT_PUBLIC_SERVER_HOST
            }/events/is-participated?eventIds=${eventIds.join(',')}`,
            {
              headers: {
                Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
              },
            }
          )
          .then(({ data }) => {
            for (let i = 0; i < events.length; i++) {
              events[i].isParticipated = data[i].isParticipated
            }

            setTotalPages(totalPages)
            setEvents(events)
          })
      })
      .catch((error) => {})
  }, [myParams])

  return (
    <>
      <Thumbnail />
      <div className="xl:w-[1264px] flex flex-col xl:flex-row justify-between gap-x-8 m-auto">
        <CustomToaster />
        <div className="flex flex-col gap-y-6 mt-10">
          <p
            className={`${roboto.className} ml-5 lg:ml-0 text-3xl font-bold text-[var(--blue-02)]`}>
            SỰ KIỆN
          </p>
          <SearchAndFilterFaculty
            name="sự kiện"
            onSearch={onSearch}
            onFilter={onFilter}
            onResetFilter={onResetFilter}
            onFilterTag={onFilterTag}
            params={{
              title: params.get('title'),
              facultyId: params.get('facultyId'),
              tagsId: params.get('tagsId'),
            }}
          />
          <div className="flex xl:w-[1264px] flex-col gap-6 justify-center mt-4">
            {events.map((event) => (
              <EventsListItem
                key={event.id}
                event={event}
                onParticipate={onParticipateEvent}
                onCancelParticipation={onCancelEventParticipation}
              />
            ))}
          </div>
        </div>
      </div>
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          curPage={curPage}
          onNextPage={onNextPage}
          onPrevPage={onPrevPage}
        />
      )}
    </>
  )
}
