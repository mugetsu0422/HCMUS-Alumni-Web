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
    isApproved: false,
    LinkImg: '/demo.jpg',
  },
  {
    name: 'Trần Hồng Minh Phúc',
    MSSV: '20127610',
    Year: '2020',
    Email: 'tsamule@gmail.com',
    link: 'https://facebook.com/',
    isApproved: true,
    LinkImg: '/demo.jpg',
  },
  {
    name: 'Nguyễn Mai Hoàng Quang Huy',
    MSSV: '20127610',
    Year: '2020',
    Email: 'tsamule@gmail.com',
    link: 'https://facebook.com/',
    isApproved: false,
    LinkImg: '/demo.jpg',
  },
  {
    name: 'Trương Samule',
    MSSV: '20127610',
    Year: '2020',
    Email: 'tsamule@gmail.com',
    Link: 'https://facebook.com/',
    isApproved: true,
    LinkImg: '/demo.jpg',
  },
]

export default function page() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [items, setItems] = React.useState(tempData)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [visible, setVisible] = React.useState(2) //Coi lại và thống nhất để có số thích hợp hơn.

  function showMore() {
    setVisible((e) => e + 1) //Sau này thay số 1 thành số khác để linh hoạt hơn
  }

  return (
    <div className="m-auto w-[85vw] flex flex-col bg-[#fafcfe] mt-[3.5vw] gap-y-3 p-4">
      <p
        className={`text-gray-900 font-bold text-lg lg:text-[1.5vw] ${nunito}`}>
        Yêu cầu xét duyệt cựu sinh viên - #5
      </p>
      <Filter />
      <div className="flex flex-wrap gap-5 justify-between mt-5">
        {items
          .slice(0, visible)
          .map(
            ({ name, MSSV, Year, Email, link, LinkImg, isApproved }, idx) => (
              <div
                key={idx}
                className="w-[100%] lg:w-[49%] py-3 px-2 border-2 border-slate-700 rounded-md">
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
                    <div className="flex justify-center gap-5 mt-3">
                      {isApproved ? (
                        <Button
                          placeholder={undefined}
                          className={`${nunito.className} w-52 bg-[var(--blue-02)] font-bold`}>
                          Phê duyệt
                        </Button>
                      ) : (
                        <Button
                          placeholder={undefined}
                          className={`${nunito} w-52 bg-[#ff7373] text-black font-bold`}>
                          Từ chối
                        </Button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            )
          )}
      </div>
      {visible === items.length ? (
        ''
      ) : (
        <Button
          onClick={showMore}
          placeholder={undefined}
          size="lg"
          ripple={true}
          className={`${nunito} sm:[30vw] lg:w-[20vw] bg-[var(--blue-04)] text-black font-bold m-auto`}>
          Xem Thêm
        </Button>
      )}
    </div>
  )
}
