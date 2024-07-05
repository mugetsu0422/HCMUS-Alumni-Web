'use client'
import React, { useEffect, useState, useRef } from 'react'
import { nunito } from '@/app/ui/fonts'
import { Button, Input, Spinner } from '@material-tailwind/react'
import { XLg, PlusCircle, Search, PencilSquare } from 'react-bootstrap-icons'
import { useDebouncedCallback } from 'use-debounce'
import axios from 'axios'
import Cookies from 'js-cookie'
import { JWT_COOKIE } from '@/app/constant'
import 'moment/locale/vi'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import InboxItem from '@/app/ui/social-page/messages/inbox-item'
import { useRouter, useSearchParams } from 'next/navigation'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useAppSelector } from '@/lib/hooks'

export default function GroupLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: any
}) {
  const router = useRouter()
  const searchParams = useSearchParams()!
  const [query, setQuery] = useState('')
  const [queryInput, setQueryInput] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const curPage = useRef(0)
  const [totalPages, setTotalPages] = useState(1)
  const [inboxes, setInboxes] = useState([])
  const userID = Cookies.get('userId')

  const activeInboxId = useAppSelector((state) => state.socketResponse.activeInboxId)

  const onSearch = useDebouncedCallback((query) => {
    setQuery(query)
  }, 500)

  const onFetchMore = () => {
    curPage.current++
    if (curPage.current >= totalPages) {
      setHasMore(false)
      return
    }

    let params = ''
    if (query !== '') {
      params = `query=${query}`
    }
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/messages/inbox?page=${curPage.current}&${params}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { inboxes } }) => {
        setInboxes((prev) => prev.concat(inboxes))
      })
      .catch((err) => {})
  }

  useEffect(() => {
    curPage.current = 0
    setHasMore(true)
    let params = ''
    if (query !== '') {
      params = `?query=${query}`
    }
    // Fetch list of inboxes
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/messages/inbox${params}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then(({ data: { totalPages, inboxes } }) => {
        setTotalPages(totalPages)
        setInboxes(inboxes)
        setHasMore(totalPages > 1)
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.error?.message || 'Lỗi không xác định'
        )
      })
  }, [query])

  return (
    <div className="flex overflow-hidden h-[--min-height-view]">
      <div
        className={`flex h-full overflow-hidden border-[#eeeeee] border-r-2 min-w-[150px] w-[150px] lg:w-[360px]`}>
        <div className="flex flex-col p-4 gap-y-4 w-full h-full">
          <div className="flex flex-0 flex-col gap-2 justify-between">
            <div
              className={`${nunito.className} text-xl xl:text-2xl font-bold text-black pt-2 flex justify-between items-center`}>
              <p className="hidden sm:block">Nhắn tin</p>
              <Button
                onClick={() => router.push('/messages/inbox/new')}
                placeholder={undefined}
                className={`p-2 m-auto'`}
                variant="text">
                <PencilSquare className="text-xl xl:text-2xl" />
              </Button>
            </div>

            <Input
              size="lg"
              crossOrigin={undefined}
              label="Tìm kiếm"
              containerProps={{
                className: 'flex flex-1 shrink !min-w-[100px] -z-10',
              }}
              value={queryInput}
              onChange={(e) => {
                setQueryInput(e.target.value)
                onSearch(e.target.value)
              }}
              icon={
                <XLg
                  onClick={() => {
                    setQueryInput('')
                    setQuery('')
                  }}
                  className={clsx({
                    hidden: queryInput === '',
                    'hover:cursor-pointer': true,
                  })}
                />
              }
            />
          </div>
          <div
            id="inboxList"
            className={`shrink h-full overflow-y-auto overflow-x-hidden scrollbar-webkit`}>
            <InfiniteScroll
              dataLength={inboxes.length}
              next={onFetchMore}
              hasMore={hasMore}
              loader={
                <div className="h-10 flex justify-center ">
                  <Spinner className="h-8 w-8"></Spinner>
                </div>
              }
              scrollableTarget="inboxList"
              className="w-full flex flex-col mx-auto flex-1 lg:flex-0 h-full pr-2">
              {inboxes.map(({ members, latestMessage }) =>
                members
                  .filter((member) => member.id.userId != userID)
                  .map(({ id, user }) => (
                    <InboxItem
                      key={id.inboxId}
                      id={id}
                      user={user}
                      latestMessage={latestMessage}
                      currentInboxId={activeInboxId}
                    />
                  ))
              )}
            </InfiniteScroll>
          </div>
        </div>
      </div>

      <main className={`min-w-[250px] h-full flex flex-col flex-auto`}>
        {children}
      </main>
    </div>
  )
}
