/* eslint-disable @next/next/no-img-element */
'use client'
import Link from 'next/link'
import React from 'react'
import {
  Card,
  CardBody,
  CardFooter,
} from '@material-tailwind/react'
import { nunito } from '../fonts'
import { Calendar } from 'react-bootstrap-icons'

const data = [
  {
    imgSrc:
      'https://alumni.hcmus.edu.vn/wp-content/uploads/2023/10/Screenshot-2023-10-24-135118.jpg',
    title:
      'Hội nghị Liên ban Cộng đồng Cựu sinh viên Khoa học lần 1 - Nhiệm kỳ 2022 - 2025',
    date: '12/12/2023',
  },
  {
    imgSrc: 'https://alumni.hcmus.edu.vn/wp-content/uploads/2023/10/CSV.jpg',
    title:
      'Thư mời tham gia diễn đàn Khoa học – Doanh nghiệp và Đổi mới Sáng tạo',
    date: '12/12/2023',
  },
  {
    imgSrc:
      'https://vcdn-vnexpress.vnecdn.net/2023/10/13/image001-7172-1697179567.jpg',
    title: 'Trường Đại học Khoa học tự nhiên mở diễn đàn đổi mới sáng tạo',
    date: '12/12/2023',
  },
]

function NewsCard({
  imgSrc,
  title,
  date,
}: {
  imgSrc: string
  title: string
  date: string
}) {
  return (
    <Card placeholder={undefined} className="w-[18rem] sm:w-[24rem] group">
      <Link href={'#'}>
        <div className="h-[10rem] sm:h-[14rem] shadow-lg rounded-xl">
          <img
            className="object-cover w-full h-full rounded-xl group-hover:opacity-80"
            src={imgSrc}
            alt="thumbnail"
          />
        </div>
        <CardBody placeholder={undefined} className="pb-1">
          <div
            // placeholder={undefined}
            className="group-hover:text-[var(--blue-05)] font-bold text-lg text-[var(--text)] line-clamp-2">
            {title}
          </div>
        </CardBody>
        <CardFooter
          placeholder={undefined}
          className="pt-0 text-[var(--secondary)] flex items-center gap-1">
          <Calendar />
          {date}
        </CardFooter>
      </Link>
    </Card>
  )
}

function NewsList() {
  return (
    <div
      className={`${nunito.className} antialiased py-5 sm:py-10 flex flex-col justify-center items-center border-b-2 border-solid border-[var(--cocoa-brown-20)]`}>
      <div
        className={`font-bold text-[1.5rem] sm:text-[2.25rem] text-[var(--blue-02)] text-center`}>
        TIN TỨC & SỰ KIỆN
      </div>
      <div className="flex flex-row flex-wrap justify-center gap-6 pt-3 pb-8">
        {data.map((ele, idx) => {
          return (
            <NewsCard
              key={idx}
              imgSrc={ele.imgSrc}
              title={ele.title}
              date={ele.date}
            />
          )
        })}
      </div>
      <Link
        className="w-fit text-white bg-[var(--blue-02)] hover:opacity-90 py-4 px-7 font-bold rounded-2xl text-base"
        href={'#'}>
        Xem thêm
      </Link>
    </div>
  )
}

export default NewsList
