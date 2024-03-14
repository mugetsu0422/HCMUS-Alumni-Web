'use client'
import React from 'react'
import Filter from '../../../ui/admin/filter'
import { inter, nunito } from '../../../ui/fonts'
import Link from 'next/link'
import Image from 'next/image'
import { Input, Button } from '@material-tailwind/react'

const tempData = [
  {
    name: 'Trương Samule',
    MSSV: '20127610',
    Year: '2020',
    Email: 'tsamule@gmail.com',
    link: 'https://facebook.com/',
    LinkImg: '/demo.jpg',
  },
  {
    name: 'Trần Hồng Minh Phúc',
    MSSV: '20127610',
    Year: '2020',
    Email: 'tsamule@gmail.com',
    link: 'https://facebook.com/',
    LinkImg: '/demo.jpg',
  },
  {
    name: 'Nguyễn Mai Hoàng Quang Huy',
    MSSV: '20127610',
    Year: '2020',
    Email: 'tsamule@gmail.com',
    link: 'https://facebook.com/',
    LinkImg: '/demo.jpg',
  },
  {
    name: 'Trương Samule',
    MSSV: '20127610',
    Year: '2020',
    Email: 'tsamule@gmail.com',
    Link: 'https://facebook.com/',
    LinkImg: '/demo.jpg',
  },
]

export default function page() {
  return (
    <div className="m-auto w-[78vw] flex flex-col bg-[#fafcfe] mt-[3.5vw] gap-y-3 p-4">
      <p
        className={`text-gray-900 font-bold text-lg lg:text-[1.5vw] ${nunito}`}>
        Yêu cầu xét duyệt cựu sinh viên - #5
      </p>
      <Filter />
      <div className="flex flex-wrap gap-2 justify-between">
        {tempData.map(({ name, MSSV, Year, Email, link, LinkImg }, idx) => (
          <div
            key={idx}
            className="w-[100%] lg:w-[49.5%] py-3 px-2 border-2 border-slate-700 rounded-md">
            {/* First line include FullName MSSV and Year*/}
            <div className={`grid grid-cols-4  gap-5 ${inter} mb-2`}>
              <div className="flex-col col-span-2">
                <p className="font-bold text-[var(--secondary)]   ">
                  Họ và tên
                </p>
                <p>{name}</p>
              </div>
              <div className="flex-col ">
                <p className="font-bold text-[var(--secondary)]">MSSV</p>
                <p>{MSSV}</p>
              </div>
              <div className="flex-col ">
                <p className="font-bold text-[var(--secondary)]">
                  Năm nhập học
                </p>
                <p>{Year}</p>
              </div>
            </div>
            {/* Second line include Email and link  */}
            <div className={`grid grid-cols-4  gap-5 ${inter} mb-2`}>
              <div className="flex-col col-span-2">
                <p className=" font-bold text-[var(--secondary)]">Email</p>
                <p>{Email}</p>
              </div>
              <div className="col-span-1 ">
                <p className=" font-bold text-[var(--secondary)]">
                  Linkedin/Facebook
                </p>
                <Link href={`${link}`}>{link}</Link>
              </div>
            </div>
            {/* Final line for the profile image */}
            <div className="grid grid-cols-3 gap-3">
              <Image
                src={LinkImg}
                alt="profile image"
                width={200}
                height={200}
                className="col-span-1 rounded-full"
              />
              <form className="col-span-2 py-8 my-auto">
                <Input
                  placeholder="Ghi chú"
                  crossOrigin={undefined}
                  className="w-full "
                  size="lg"
                />
                <div className="flex justify-between gap-5 mt-3">
                  <Button
                    placeholder={undefined}
                    className={`${nunito} w-52 bg-[var(--blue-02)] font-bold`}>
                    Phê duyệt
                  </Button>
                  <Button
                    placeholder={undefined}
                    className={`${nunito} w-52 bg-[var(--blue-04)] text-black font-bold`}>
                    Từ chối
                  </Button>
                </div>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
