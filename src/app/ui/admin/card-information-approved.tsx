import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { inter, nunito } from '../fonts'
import { Input, Button } from '@material-tailwind/react'

export default function CardInformation({ items, visible }) {
  return (
    <>
      {items
        .slice(0, visible)
        .map(({ name, MSSV, Year, Email, link, LinkImg, isApproved }, idx) => (
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
            <div className={`grid grid-cols-4  gap-5 ${inter.className} mb-2`}>
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
                      className={`${nunito.className} w-52 bg-[#ff7373] text-black font-bold`}>
                      Từ chối
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>
        ))}
    </>
  )
}
