/* eslint-disable @next/next/no-img-element */
'use client'
import Link from 'next/link'
import React from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from '@material-tailwind/react'
import Image from 'next/image'
import { nunito } from '../fonts'

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
    <Card placeholder={undefined} className="max-w-[24rem] mx-3 group">
      <Link href={'#'}>
        <div className="h-56 shadow-lg rounded-xl">
          <img
            className="w-full h-full rounded-xl group-hover:opacity-80"
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
          className="pt-0 text-[var(--secondary)]">
          {date}
        </CardFooter>
      </Link>
    </Card>
  )
}

function NewsList() {
  return (
    <div
      className={`${nunito.className} antialiased flex flex-col justify-center items-center`}>
      <div className={`font-bold text-[2.25rem] text-[var(--blue-02)]`}>
        TIN TỨC & SỰ KIỆN
      </div>
      <div className="flex flex-row flex-wrap justify-center">
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
      <Link href={'#'}>Xem thêm</Link>
    </div>
  )
}

export default NewsList
