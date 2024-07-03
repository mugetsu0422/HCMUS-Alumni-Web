'use client'
import React, { useEffect, useState, useRef } from 'react'
import { nunito, plusJakartaSans } from '@/app/ui/fonts'
import { Avatar, Button, Input } from '@material-tailwind/react'
import Link from 'next/link'
import { XLg, PlusCircle, Search, PencilSquare } from 'react-bootstrap-icons'
import { useForm } from 'react-hook-form'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import axios, { AxiosResponse } from 'axios'
import Cookies from 'js-cookie'
import { JWT_COOKIE, MESSAGE_TYPE } from '@/app/constant'
import 'moment/locale/vi'
import moment from 'moment'
import toast from 'react-hot-toast'

export default function GroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { register, reset } = useForm({
    defaultValues: {
      title: '',
    },
  })
  const [hasMore, setHasMore] = useState(true)
  const curPage = useRef(0)
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const [myParams, setMyParams] = useState(`?${params.toString()}`)
  const router = useRouter()
  const [totalPages, setTotalPages] = useState(1)
  const [listInboxes, setListInboxes] = useState([])
  const userID = Cookies.get('userId')

  const resetCurPage = () => {
    params.delete('page')
    curPage.current = 0
    setHasMore(true)
  }

  const onSearch = useDebouncedCallback((keyword) => {
    if (keyword) {
      params.set('title', keyword)
    } else {
      params.delete('title')
    }
    resetCurPage()
    //replace(`${pathname}?${params.toString()}`, { scroll: false })
    setMyParams(`?${params.toString()}`)
  }, 500)

  useEffect(() => {
    curPage.current = 0
    setHasMore(true)
    // Fetch list of inboxes
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/messages/inbox${myParams}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then(({ data: { totalPages, inboxes } }) => {
        setTotalPages(totalPages)
        setListInboxes(inboxes)
        setHasMore(totalPages > 1)
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.error?.message || 'Lỗi không xác định'
        )
      })
  }, [myParams])

  return (
    <div className="flex overflow-hidden h-[--min-height-view]">
      <div
        className={`flex h-full overflow-hidden border-[#eeeeee] border-r-2 min-w-[100px] w-[360px]`}>
        <div className="flex flex-col p-4 gap-y-4 w-full h-full">
          <div className="flex flex-0 flex-col gap-2 justify-between">
            <div
              className={`${nunito.className} text-xl xl:text-2xl font-bold text-black pt-2 flex justify-between items-center`}>
              <p className="hidden sm:block">Nhắn tin</p>
              <Button
                onClick={() => router.push('/messages/inbox/new')}
                placeholder={undefined}
                className={`p-2 'm-auto'`}
                variant="text">
                <PencilSquare className="text-xl xl:text-2xl" />
              </Button>
            </div>

            <Input
              size="lg"
              crossOrigin={undefined}
              label="Tìm kiếm"
              containerProps={{ className: 'min-w-full w-full shrink' }}
              {...register('title', {
                onChange: (e) => onSearch(e.target.value),
              })}
              icon={<Search className="hidden md:block" />}
              className="w-full shrink"
            />
          </div>
          <div
            className={`relative shrink h-full overflow-y-auto overflow-x-hidden scrollbar-webkit`}>
            <div className="w-full flex flex-col mx-auto flex-1 lg:flex-0 h-full pr-2">
              {listInboxes.map(({ members, latestMessage }) =>
                members
                  .filter((e) => e.id.userId != userID)
                  .map(({ id, user }) => (
                    <Link
                      href={`/messages/inbox/${id.inboxId}`}
                      key={id.inboxId}
                      className={`${plusJakartaSans.className} p-3 pr-0 flex flex-0 h-fit rounded-lg hover:bg-blue-gray-50 hover:cursor-pointer w-full`}>
                      <Avatar
                        placeholder={undefined}
                        src={user.avatarUrl}
                        size="lg"
                        alt="user avatar"
                      />
                      {
                        <div className="hidden ml-2 md:flex w-full items-center">
                          <div className="max-w-[250px] flex flex-col">
                            <p className="font-bold text-black text-base truncate">
                              {user.fullName}
                            </p>
                            <div className="text-[14px] text-[--text-navbar]">
                              <span className={`truncate shrink w-full`}>
                                {latestMessage.messageType === MESSAGE_TYPE.TEXT
                                  ? latestMessage.sender.id === userID
                                    ? 'Bạn: ' + latestMessage.content
                                    : latestMessage.content
                                  : `${latestMessage.sender.fullName} đã gửi 1 phương tiện`}
                              </span>
                              <span> · </span>
                              <span>
                                {moment(latestMessage.createAt)
                                  .locale('vi')
                                  .local()
                                  .fromNow()}
                              </span>
                            </div>
                          </div>
                        </div>
                      }
                    </Link>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>

      <main className={`min-w-[250px] h-full flex flex-col flex-auto`}>
        {children}
      </main>
    </div>
  )
}
