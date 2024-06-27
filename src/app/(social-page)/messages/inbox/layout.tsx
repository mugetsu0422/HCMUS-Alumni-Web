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
    name: 'QQQQQ',
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
  const [isSideBarOpen, setIsSideBarOpen] = React.useState(true)
  const [isSmallerThan2XL, setIsSmallerThan2XL] = React.useState(false)
  const [hasMore, setHasMore] = useState(true)
  const curPage = useRef(0)
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const [myParams, setMyParams] = useState(`?${params.toString()}`)
  const router = useRouter()

  const closeSideBar = () => setIsSideBarOpen((e) => !e)
  const toggleIsSideBar = () => setIsSideBarOpen((cur) => !cur)

  const handleChangeSmallScreen = () => {
    setIsSmallerThan2XL(true)
    setIsSideBarOpen(false)
  }

  const handleChangeBigScreen = () => {
    setIsSmallerThan2XL(false)
    setIsSideBarOpen(true)
  }

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
      if (window.innerWidth <= 1024) {
        if (window.innerWidth <= 570) {
          handleChangeSmallScreen()
          setIsSmallerThanLg(false)
        } else {
          handleChangeBigScreen()
          setIsSmallerThanLg(false)
        }
      } else {
        setIsSmallerThanLg(true)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <>
      <CustomToaster />
      {isSideBarOpen ? (
        ''
      ) : (
        <Button
          onClick={toggleIsSideBar}
          variant="text"
          placeholder={undefined}
          className="fixed p-0 mt-1 z-10">
          <PlusCircle className="text-2xl" />
        </Button>
      )}
      <div className="flex flex-1 h-full overflow-x-auto">
        {isSideBarOpen && (
          <div
            className={`fixed left-0 w-1/5 min-w-[120px] max-h-[90vh] overflow-auto scrollbar-webkit border-[#eeeeee] border-r-2 z-20`}>
            {isSmallerThan2XL && isSideBarOpen && (
              <div className="pt-4 pr-4 flex justify-end">
                <Button
                  onClick={closeSideBar}
                  placeholder={undefined}
                  className="p-2"
                  variant="text">
                  <XLg className="text-[22px]" />
                </Button>
              </div>
            )}
            <div className="flex flex-col p-4 gap-y-6 w-full">
              {isSmallerThanLg && (
                <div className="flex flex-col gap-2 justify-between">
                  <div
                    className={`${nunito.className} text-xl xl:text-2xl font-bold text-black pt-2 flex justify-between items-center`}>
                    <p>Nhắn tin</p>
                    <Button
                      onClick={() => router.push('/messages/inbox/new')}
                      placeholder={undefined}
                      className="p-2"
                      variant="text">
                      <PencilSquare className="text-xl xl:text-2xl" />
                    </Button>
                  </div>

                  <Input
                    size="lg"
                    crossOrigin={undefined}
                    placeholder="Tìm kiếm bạn bè"
                    containerProps={{ className: 'w-full' }}
                    {...register('title', {
                      onChange: (e) => onSearch(e.target.value),
                    })}
                    icon={<Search />}
                    className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                      className: 'before:content-none after:content-none',
                    }}
                  />
                </div>
              )}
              {/* #f7fafd */}
              <div className="flex flex-col gap-3 h-[91vh] w-fit max-w-[18rem] pr-2">
                {dataTemp.map(
                  ({ name, time, latestMes, isRead, isOline }, idx) => (
                    <Link
                      href={`/messages/inbox/id`}
                      key={idx}
                      className={`${plusJakartaSans.className} flex justify-around rounded-lg hover:bg-blue-gray-50 hover:cursor-pointer pt-2 pb-2 pl-2 pr-4 w-full`}>
                      <Avatar
                        placeholder={undefined}
                        src="/demo.jpg"
                        size="md"
                        alt="user avatar"
                      />
                      {isSmallerThanLg && (
                        <div className="ml-2 w-[100%] flex justify-around">
                          <div className="w-[90vw] max-w-[170px]">
                            <p className="font-bold text-black text-base">
                              {name}
                            </p>
                            <p
                              className={`truncate max-w-[80%] ${
                                !isRead && 'font-semibold text-[--secondary]'
                              } text-[14px]`}>
                              {latestMes}
                            </p>
                          </div>

                          <div>
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
        )}

        <main
          className={`fixed right-0 flex-1 ${
            !isSideBarOpen ? 'w-[92%]' : 'w-4/5'
          } min-w-[250px] h-[91vh] flex flex-col items-between overflow-hidden`}>
          {children}
        </main>
      </div>
    </>
  )
}
