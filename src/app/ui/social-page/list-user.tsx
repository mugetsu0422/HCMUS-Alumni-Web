'use-client'

import React from 'react'
import { Button, Card } from '@material-tailwind/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { nunito, plusJakartaSans } from '../fonts'
import Image from 'next/image'
const dataTemp = [
  { name: 'QQQQQ', time: '11:00', latestMes: '122212213', isRead: true },
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
  { name: 'QQQQQ', time: '11:00', latestMes: '122212213', isRead: true },
  {
    name: 'QQQQQ',
    time: '11:00',
    latestMes: '111111111111121555555555555555555555555555111111',
    isRead: true,
  },
  { name: 'QQQQQ', time: '11:00', latestMes: '122212213', isRead: true },
  { name: 'QQQQQ', time: '11:00', latestMes: '122212213', isRead: false },
  { name: 'QQQQQ', time: '11:00', latestMes: '122212213', isRead: false },
  { name: 'QQQQQ', time: '11:00', latestMes: '122212213', isRead: true },
  { name: 'QQQQQ', time: '11:00', latestMes: '122212213', isRead: false },
  { name: 'QQQQQ', time: '11:00', latestMes: '122212213', isRead: false },
]

export default function ListUser() {
  return (
    <Card placeholder={undefined} className="p-4 gap-y-4 mt-3  ">
      <div className="flex justify-between">
        <p className={`${nunito.className}`}>Nhắn tin</p>
        <Button
          placeholder={undefined}
          size="sm"
          variant="text"
          className={`${plusJakartaSans.className} flex items-center `}>
          Tất cả
          <FontAwesomeIcon icon={faAngleRight} />
        </Button>
      </div>

      {dataTemp.map(({ name, time, latestMes, isRead }, idx) => (
        <div
          key={idx}
          className={`${plusJakartaSans.className} flex justify-between `}>
          <Image src="/logo.png" width={50} height={50} alt="user Avatar" />
          <div className=" w-[150px]">
            <p className="font-extrabold text-[var(--text)]">{name}</p>
            <p className={!isRead ? 'text-[var(--text)] truncate' : 'truncate'}>
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
      ))}
    </Card>
  )
}
