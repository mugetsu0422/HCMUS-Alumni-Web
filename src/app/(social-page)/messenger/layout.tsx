'use client'
import React, { useEffect, useState } from 'react'
import { nunito, plusJakartaSans } from '@/app/ui/fonts'
import { Avatar } from '@material-tailwind/react'
import Link from 'next/link'

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
  const [isSmallerThan2XL, setIsSmallerThan2XL] = useState(true)

  useEffect(() => {
    window.addEventListener('resize', () => {
      window.innerWidth <= 1024
        ? setIsSmallerThan2XL(false)
        : setIsSmallerThan2XL(true)
    })
  }, [])

  return (
    <div className="flex flex-1 h-full">
      <div className="w-1/4 max-w-[340px] h-[90vh] overflow-hidden">
        <div className="flex flex-col p-4 gap-y-6 w-full overflow-hidden">
          <div className="flex justify-between">
            <p
              className={`${nunito.className} text-xl xl:text-2xl font-bold text-black pt-2`}>
              Nhắn tin
            </p>
          </div>
          {/* #f7fafd */}
          <div className="overflow-y-auto scrollbar-webkit">
            <div className="flex flex-col gap-3 h-[91vh] w-fit max-w-[18rem] pr-2">
              {dataTemp.map(
                ({ name, time, latestMes, isRead, isOline }, idx) => (
                  <Link
                    href={`/messenger/id`}
                    key={idx}
                    className={`${plusJakartaSans.className} flex justify-around rounded-lg hover:bg-blue-gray-50 hover:cursor-pointer pt-2 pb-2 pl-2 pr-4 w-full`}>
                    <Avatar
                      placeholder={undefined}
                      src="/demo.jpg"
                      size="md"
                      alt="user avatar"
                    />
                    {isSmallerThan2XL && (
                      <div className="ml-2 w-[100%] flex justify-around">
                        <div className="w-[90vw] max-w-[170px]">
                          <p className="font-bold text-black text-base">
                            {name}
                          </p>
                          <p
                            className={`truncate max-w-[90%] ${
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
      </div>

      <main className=" flex-1 w-3/4 h-[91vh] flex flex-col items-between border-[#eeeeee] border-l-2 overflow-hidden">
        {children}
      </main>
    </div>
  )
}
