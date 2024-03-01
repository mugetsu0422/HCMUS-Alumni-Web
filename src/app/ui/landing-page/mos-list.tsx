/* eslint-disable @next/next/no-img-element */
'use client'
import Link from 'next/link'
import React from 'react'
import {
  Card,
  CardBody,
  CardFooter,
} from '@material-tailwind/react'
import Image from 'next/image'
import { nunito } from '../fonts'

const data = [
  {
    imgSrc:
      'https://alumni.hcmus.edu.vn/wp-content/uploads/2023/09/under30_2022_Le-Yen-Thanh-e1698137690375-1024x411.jpg',
    title:
      'Lê Yên Thanh',
    info: 'Khóa 2014 - Khoa Công nghệ thông tin ',
  },
  {
    imgSrc: 'https://alumni.hcmus.edu.vn/wp-content/uploads/2023/09/1-1024x896.jpg',
    title:
      'Nguyễn Thị Thanh Mai',
    info: 'Khóa 2006 - Khoa Hóa học',
  },
  {
    imgSrc:
      'https://alumni.hcmus.edu.vn/wp-content/uploads/2023/09/Thiet-ke-chua-co-ten-1024x896.jpg',
    title: 'Trần Thị Như Hoa',
    info: 'Khóa 2013 - Khoa Hóa học',
  },
]

function MirrorOfSuccessCard({
  imgSrc,
  title,
  info,
}: {
  imgSrc: string
  title: string
  info: string
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
          className="pt-0 text-[var(--text)] flex items-center gap-1">
          {info}
        </CardFooter>
      </Link>
    </Card>
  )
}

function MirrorOfSuccessList() {
  return (
    <div
      className={`${nunito.className} antialiased py-5 sm:py-10 flex flex-col justify-center items-center border-b-2 border-solid border-[var(--cocoa-brown-20)]`}>
      <div
        className={`font-bold text-[1.5rem] sm:text-[2.25rem] text-[var(--blue-02)]`}>
        CỰU SINH VIÊN TIÊU BIỂU
      </div>
      <div className="flex flex-row flex-wrap justify-center gap-6 pt-3 pb-8">
        {data.map((ele, idx) => {
          return (
            <MirrorOfSuccessCard
              key={idx}
              imgSrc={ele.imgSrc}
              title={ele.title}
              info={ele.info}
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

export default MirrorOfSuccessList
