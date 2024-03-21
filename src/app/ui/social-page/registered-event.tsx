'use client'

import React from 'react'
import { Button, Card } from '@material-tailwind/react'
import { plusJakartaSans, inter } from '../fonts'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const dataTemp = [
  {
    imgSrc: '/logo.png',
    nameEvent: 'Lễ tốt nghiệp tiến sĩ 1',
  },
  {
    imgSrc: '/logo.png',
    nameEvent:
      'Nhìn lại hội nghị Liên ban Cộng đồng Cựu sinh viên Khoa học lần 1 2',
  },
  {
    imgSrc: '/logo.png',
    nameEvent: 'Lễ tốt nghiệp tiến sĩ 3',
  },
  {
    imgSrc: '/logo.png',
    nameEvent:
      'Nhìn lại hội nghị Liên ban Cộng đồng Cựu sinh viên Khoa học lần 1 4',
  },
  {
    imgSrc: '/logo.png',
    nameEvent: 'Lễ tốt nghiệp tiến sĩ 5',
  },
  {
    imgSrc: '/logo.png',
    nameEvent:
      'Nhìn lại hội nghị Liên ban Cộng đồng Cựu sinh viên Khoa học lần 1 6',
  },
]

export default function RegisteredEvent() {
  const router = useRouter()

  function handleSeeMore() {
    router.push('home-page/see-more-event')
  }

  return (
    <div className=" mt-8 w-full">
      <div className="flex justify-between items-center">
        <p className={`${plusJakartaSans.className} font-bold`}>
          Sự kiện đã đăng ký
        </p>
        <Button
          onClick={handleSeeMore}
          placeholder={undefined}
          variant="outlined">
          Xem thêm
        </Button>
      </div>

      <ul className="flex overflow-x-scroll w-full h-fit overflow-y-hidden  scrollbar-webkit mt-2">
        {dataTemp.map(({ imgSrc, nameEvent }, idx) => (
          <li key={idx} className={`flex flex-col items-center w-[420px] `}>
            <Image
              src={imgSrc}
              alt="Event image"
              width={550}
              height={0}
              className="object-cover"
            />
            <div
              className={`${inter.className} font-bold text-xl flex -mt-24 w-[400px] justify-center rounded-xl py-4 px-2 saturate-200 backdrop-blur-sm`}>
              {nameEvent}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
