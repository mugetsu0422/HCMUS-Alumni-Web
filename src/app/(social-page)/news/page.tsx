/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react'
import Image from 'next/image'
import { Button } from '@material-tailwind/react'
import { ArrowRight, ArrowLeft } from 'react-bootstrap-icons'

const dataTemp = [
  {
    title: 'Thông báo về việc Sinh hoạt CLB Khoa học Tự nhiên lần thứ 19.',
    des: 'Kính thưa Quý Thầy Cô, các Nhà Khoa học, Thừa lệnh Hiệu trưởng và Ban điều hành CLB KHTN,  Phòng KHCN trân trọng kính mời Quý Thầy cô, các nhà khoa học đến dự Buổi sinh hoạt CLB KHTN lần thứ 19.',
    datePost: '30/04/2024',
    tag: [{ name: 'Khoa CNTT' }, { name: 'Giáo vụ' }],
    imgSrc: '/authentication.png',
  },
  {
    title: 'Thông báo về việc Sinh hoạt CLB Khoa học Tự nhiên lần thứ 19.',
    des: 'Kính thưa Quý Thầy Cô, các Nhà Khoa học, Thừa lệnh Hiệu trưởng và Ban điều hành CLB KHTN,  Phòng KHCN trân trọng kính mời Quý Thầy cô, các nhà khoa học đến dự Buổi sinh hoạt CLB KHTN lần thứ 19.',
    datePost: '30/04/2024',
    tag: [{ name: 'Khoa CNTT' }, { name: 'Giáo vụ' }],
    imgSrc: '/authentication.png',
  },
  {
    title: 'Thông báo về việc Sinh hoạt CLB Khoa học Tự nhiên lần thứ 19.',
    des: 'Kính thưa Quý Thầy Cô, các Nhà Khoa học, Thừa lệnh Hiệu trưởng và Ban điều hành CLB KHTN,  Phòng KHCN trân trọng kính mời Quý Thầy cô, các nhà khoa học đến dự Buổi sinh hoạt CLB KHTN lần thứ 19.',
    datePost: '30/04/2024',
    tag: [{ name: 'Khoa CNTT' }, { name: 'Giáo vụ' }],
    imgSrc: '/authentication.png',
  },
]

const mostViewed = [
  {
    name: ' Sinh viên Bùi Thị Khánh Linh giành giải nhất tại Cuộc thi Công nghệ chế biến sau thu hoạch năm 2019',
    view: 600,
  },
  {
    name: ' Sinh viên Bùi Thị Khánh Linh giành giải nhất tại Cuộc thi Công nghệ chế biến sau thu hoạch năm 2019',
    view: 600,
  },
  {
    name: ' Sinh viên Bùi Thị Khánh Linh giành giải nhất tại Cuộc thi Công nghệ chế biến sau thu hoạch năm 2019',
    view: 600,
  },
  {
    name: ' Sinh viên Bùi Thị Khánh Linh giành giải nhất tại Cuộc thi Công nghệ chế biến sau thu hoạch năm 2019',
    view: 600,
  },
  {
    name: ' Sinh viên Bùi Thị Khánh Linh giành giải nhất tại Cuộc thi Công nghệ chế biến sau thu hoạch năm 2019',
    view: 600,
  },
]

function NewsListItem({ title, des, datePost, tag, imgSrc }) {
  return (
    <div className="flex lg:flex-row flex-col  items-center gap-x-6">
      <div>
        <img
          src={imgSrc}
          alt="news image"
          className="w-[25rem] xl:w-[20rem] h-52 object-cover object-center rounded-xl"
        />
      </div>
      <div className="flex flex-col gap-y-2 text-black">
        <p className="font-extrabold w-[500px] md:w-[600px] text-[--blue-05] text-2xl cursor-pointer hover:text-[--secondary] hover:duration-300">
          {title}
        </p>
        <p className="w-[500px] md:w-[600px]">{des}</p>
        <p>{datePost}</p>
        <div className="flex gap-x-2">
          Thẻ:
          {tag.map(({ name }, idx) => (
            <p
              key={idx}
              className="font-extrabold text-[--blue-05] text-md hover:text-[--secondary] hover:duration-300">
              {name}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

function Pagination() {
  return (
    <div className="flex items-center gap-4 justify-center m-6">
      <Button
        placeholder={undefined}
        variant="text"
        className="flex items-center gap-2 font-bold normal-case text-base"
        // onClick={prev}
        // disabled={active === 1 || active === 0}
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>
      <p className="w-20 text-center font-bold">
        {/* {active} / {pages} */}
        0/0
      </p>
      <Button
        placeholder={undefined}
        variant="text"
        className="flex items-center gap-2  font-bold normal-case text-base"
        // onClick={next}
        // disabled={active === pages || pages === 0}
      >
        <ArrowRight strokeWidth={2} className="h-6 w-6" />
      </Button>
    </div>
  )
}

function MostViewed() {
  return (
    <div className="mt-20 xl:w-72 w-fit bg-gray-300 text-[--blue-05] font-medium py-6 px-4">
      <p className="my-6 text-xl font-extrabold text-[#008000]">
        Xem nhiều nhất
      </p>
      <ol className="flex sm:flex-wrap gap-y-4 list-disc">
        {mostViewed.map(({ view, name }, idx) => (
          <li className="ml-8" key={idx}>
            {name} <text className="text-[--text]">({view}).</text>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function Page() {
  return (
    <>
      <div className="flex flex-col xl:flex-row m-auto justify-center gap-x-8">
        <div className="flex flex-col gap-y-6 mt-[7.5rem] lg:mt-32">
          {dataTemp.map(({ title, des, datePost, tag, imgSrc }, idx) => (
            <NewsListItem
              key={idx}
              title={title}
              des={des}
              datePost={datePost}
              tag={tag}
              imgSrc={imgSrc}
            />
          ))}
        </div>
        <MostViewed />
      </div>
      <Pagination />
    </>
  )
}
