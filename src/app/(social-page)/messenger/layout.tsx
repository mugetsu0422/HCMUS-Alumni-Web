'use client'
import React from 'react'
import Sidebar from '@/app/ui/social-page/messenger/sidebar'
import { nunito, plusJakartaSans } from '@/app/ui/fonts'
import { Avatar } from '@material-tailwind/react'
import Link from 'next/link'

const dataTemp = [
  { name: 'Trần Phúc', time: '11:00', latestMes: 'Xin chào bạn', isRead: true },
  { name: 'QQQQQ', time: '11:00', latestMes: '122212213', isRead: true },
  { name: 'QQQQQ', time: '11:00', latestMes: '122212213', isRead: false },
  { name: 'QQQQQ', time: '11:00', latestMes: '122212213', isRead: false },
  { name: 'QQQQQ', time: '11:00', latestMes: '122212213', isRead: true },
  {
    name: 'QQQQQ',
    time: '11:00',
    latestMes: '121111111111111111',
    isRead: false,
  },
  { name: 'QQQQQ', time: '11:00', latestMes: '122212213', isRead: true },
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
  return (
    <div className="flex relative">
      <Sidebar>
        <div className="p-4 gap-y-6 w-full bg-white">
          <div className="flex justify-between">
            <p
              className={`${nunito.className} text-xl xl:text-2xl font-bold text-black pl-4 pr-4 pb-4 pt-2`}>
              Nhắn tin
            </p>
          </div>
          {/* #f7fafd */}

          <div className="overflow-y-auto scrollbar-webkit">
            <div className="flex flex-col gap-3 h-screen w-[17.5rem]">
              {dataTemp.map(({ name, time, latestMes, isRead }, idx) => (
                <Link
                  href={`/messenger/id`}
                  key={idx}
                  className={`${plusJakartaSans.className} flex justify-between rounded-lg hover:bg-blue-gray-50 hover:cursor-pointer p-2 w-full`}>
                  <Avatar
                    placeholder={undefined}
                    src="/demo.jpg"
                    width={50}
                    height={50}
                    alt="user avatar"
                  />
                  <div className="ml-2 w-[100%] flex justify-around">
                    <div className="w-[170px]">
                      <p className="font-bold text-black text-base">{name}</p>
                      <p
                        className={`truncate w-[90%] ${
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
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Sidebar>
      {children}
    </div>
  )
}
