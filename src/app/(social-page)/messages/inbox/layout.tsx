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

const dataTemp = [
  { name: 'Trần Phúc', time: '11:00', latestMes: 'Xin chào bạn', isRead: true },
  { name: 'QQQQQ', time: '11:00', latestMes: '122212213', isRead: true },
  { name: 'QQQQQ', time: '11:00', latestMes: '122212213', isRead: false },
  { name: 'QQQQQ', time: '11:00', latestMes: '122212213', isRead: false },
  {
    name: 'QQQQQ',
    time: '11:00',
    latestMes: '122212213',
    isOline: true,
    isRead: true,
  },
  {
    name: 'QQQQQ',
    time: '11:00',
    latestMes: '121111111111111111',
    isOline: true,
    isRead: false,
  },
  {
    name: 'QQQQQ',
    time: '11:00',
    latestMes: '122212213',
    isOline: true,
    isRead: true,
  },
  {
    name: 'QQQQQ',
    time: '11:00',
    latestMes: '111111111111121555555555555555555555555555111111',
    isOline: true,
    isRead: true,
  },
  {
    name: 'QQQQQ',
    time: '11:00',
    latestMes: '111111111111121555555555555555555555555555111111',
    isOline: true,
    isRead: true,
  },
  {
    name: 'QQQQQ',
    time: '11:00',
    latestMes: '111111111111121555555555555555555555555555111111',
    isOline: true,
    isRead: true,
  },
  {
    name: 'End mes',
    time: '11:00',
    latestMes: '111111111111121555555555555555555555555555111111',
    isRead: true,
  },
]

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
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    setMyParams(`?${params.toString()}`)
  }, 500)

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

  return (
    <div className="sticky top-0 flex flex-1 overflow-hidden">
      <CustomToaster />
      <div className="relative flex flex-1 h-full overflow-x-auto">
        {
          <div
            className={`relative left-0 shrink h-full overflow-hidden border-[#eeeeee] border-r-2 z-20`}>
            <div className="flex flex-1 flex-col p-4 gap-y-6 w-full">
              <div className="flex flex-1 flex-col gap-2 justify-between">
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
                className={`relative shrink h-full max-h-[65vh] overflow-y-auto overflow-x-hidden scrollbar-webkit`}>
                <div className="relative flex flex-col mx-auto flex-1 lg:flex-0 h-full gap-3 w-fit max-w-[18rem] pr-2">
                  {dataTemp.map(
                    ({ name, time, latestMes, isRead, isOline }, idx) => (
                      <Link
                        href={`/messages/inbox/id`}
                        key={idx}
                        className={`${plusJakartaSans.className}relative flex flex-1 justify-around rounded-lg hover:bg-blue-gray-50 hover:cursor-pointer pt-2 pb-2 pl-2 pr-4 w-full`}>
                        <Avatar
                          placeholder={undefined}
                          src="/demo.jpg"
                          size="md"
                          alt="user avatar"
                        />
                        {isSmallerThanLg && (
                          <div className="flex-1 flex ml-2 shrink w-fit max-w-[100vw] justify-around">
                            <div className="flex-1 flex flex-col w-[90vw] max-w-[200px]">
                              <p className="font-bold text-black text-base">
                                {name}
                              </p>
                              <p
                                className={`truncate shrink w-full max-w-[90px] 2xl:max-w-[150px] ${
                                  !isRead && 'font-semibold text-[--secondary]'
                                } text-[14px]`}>
                                {latestMes}
                              </p>
                            </div>

                            <div className="absolute right-4">
                              <p>{time}</p>
                              {!isRead && (
                                <span className="mx-auto mt-1 block h-2 w-2 rounded-full bg-[var(--warning)] content-['']" />
                              )}
                            </div>
                          </div>
                        )}
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        }

        <main
          className={`relative flex-1 w-[92%] min-w-[250px] h-full flex flex-col overflow-hidden`}>
          {children}
        </main>
      </div>
    </div>
  )
}
