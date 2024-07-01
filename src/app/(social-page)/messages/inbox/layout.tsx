'use client'
import React, { useEffect, useState, useRef } from 'react'
import { nunito, plusJakartaSans } from '@/app/ui/fonts'
import { Avatar, Button, Input } from '@material-tailwind/react'
import Link from 'next/link'
import { XLg, PlusCircle, Search, PencilSquare } from 'react-bootstrap-icons'
import CustomToaster from '@/app/ui/common/custom-toaster'
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
  const [isSmallerThanLg, setIsSmallerThanLg] = useState(true)
  const [isSmallerThan2XL, setIsSmallerThan2XL] = React.useState(false)
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

  // Use Effect to set width view of sidebar component
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 900) {
        if (window.innerWidth <= 690) {
          setIsSmallerThan2XL(true)
          setIsSmallerThanLg(false)
        } else {
          setIsSmallerThan2XL(false)
          setIsSmallerThanLg(false)
        }
      } else {
        setIsSmallerThanLg(true)
      }
    }
    //handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

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
    <div className="relative top-0 flex flex-1 overflow-hidden h-[--min-height-view] min-w-[320px]">
      <CustomToaster />
      <div className="relative flex flex-1 h-full overflow-x-auto">
        <div
          className={`relative left-0 shrink h-full overflow-hidden border-[#eeeeee] border-r-2 z-20`}>
          <div className="flex flex-1 flex-col p-4 gap-y-6 w-full h-full">
            <div className="flex flex-0 flex-col gap-2 justify-between">
              <div
                className={`${nunito.className} text-xl xl:text-2xl font-bold text-black pt-2 flex justify-between items-center`}>
                {isSmallerThanLg && <p>Nhắn tin</p>}
                <Button
                  onClick={() => router.push('/messages/inbox/new')}
                  placeholder={undefined}
                  className={`p-2 ${!isSmallerThanLg && 'm-auto'} `}
                  variant="text">
                  <PencilSquare className="text-xl xl:text-2xl" />
                </Button>
              </div>

              <Input
                size="lg"
                crossOrigin={undefined}
                placeholder="Tìm kiếm bạn bè"
                containerProps={{ className: 'w-full shrink' }}
                {...register('title', {
                  onChange: (e) => onSearch(e.target.value),
                })}
                icon={<Search />}
                className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900 w-full shrink"
                labelProps={{
                  className: 'before:content-none after:content-none',
                }}
              />
            </div>
            <div
              className={`relative shrink h-full overflow-y-auto overflow-x-hidden scrollbar-webkit`}>
              <div className="relative flex flex-col mx-auto flex-1 lg:flex-0 h-full gap-3 w-fit max-w-[18rem] pr-2">
                {listInboxes.map(({ members, latestMessage }) =>
                  members
                    .filter((e) => e.id.userId != userID)
                    .map(({ id, user }) => (
                      <Link
                        href={`/messages/inbox/${id.inboxId}`}
                        key={id.inboxId}
                        className={`${plusJakartaSans.className}relative flex flex-0 h-fit justify-around rounded-lg hover:bg-blue-gray-50 hover:cursor-pointer pt-2 pb-2 pl-2 pr-4 w-full`}>
                        <Avatar
                          placeholder={undefined}
                          src={user.avatarUrl}
                          size="md"
                          alt="user avatar"
                        />
                        {isSmallerThanLg && (
                          <div className="flex-1 flex ml-2 shrink w-fit max-w-[100vw] justify-around">
                            <div className="flex-1 flex flex-col w-[90vw] max-w-[200px]">
                              <p className="font-bold text-black text-base">
                                {user.fullName}
                              </p>
                              <p
                                className={`truncate shrink w-full max-w-[90px] 2xl:max-w-[150px] text-[14px]`}>
                                {MESSAGE_TYPE[latestMessage.messageType] ===
                                'TEXT'
                                  ? latestMessage.content
                                  : `${latestMessage.sender.fullName} đã gửi 1 file phương tiện`}
                              </p>
                            </div>

                            <div className="absolute right-4">
                              <p className="text-[12px]">
                                {moment(latestMessage.createAt)
                                  .locale('vi')
                                  .local()
                                  .fromNow()}
                              </p>
                            </div>
                          </div>
                        )}
                      </Link>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>

        <main
          className={`relative flex-1 w-[92%] min-w-[250px] h-full flex flex-col`}>
          {children}
        </main>
      </div>
    </div>
  )
}
