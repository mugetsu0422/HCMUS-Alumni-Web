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
        .map(
          (
            {
              id,
              user,
              studentId,
              beginningYear,
              socialMediaLink,
              status,
              comment,
            },
            idx
          ) => (
            <div
              key={id}
              className="w-[100%] lg:w-[49%] py-3 px-2 border-2 border-slate-700 rounded-md">
              {/* First line include FullName MSSV and Year*/}
              <div className={`grid grid-cols-4  gap-5 ${inter} mb-2`}>
                <div className="flex-col col-span-2">
                  <p className="font-bold text-[var(--secondary)]   ">
                    Họ và tên
                  </p>
                  <p>{user?.fullName}</p>
                </div>
                <div className="flex-col ">
                  <p className="font-bold text-[var(--secondary)]">MSSV</p>
                  <p>{studentId}</p>
                </div>
                <div className="flex-col ">
                  <p className="font-bold text-[var(--secondary)]">
                    Năm nhập học
                  </p>
                  <p>{beginningYear}</p>
                </div>
              </div>
              {/* Second line include Email and link  */}
              <div
                className={`grid grid-cols-4  gap-5 ${inter.className} mb-2`}>
                <div className="flex-col col-span-2">
                  <p className=" font-bold text-[var(--secondary)]">Email</p>
                  <p>{user?.email}</p>
                </div>
                <div className="col-span-1 ">
                  <p className=" font-bold text-[var(--secondary)]">
                    Linkedin/Facebook
                  </p>
                  <Link
                    href={`${socialMediaLink}`}
                    target="_blank"
                    rel="noopener noreferrer">
                    {socialMediaLink}
                  </Link>
                </div>
              </div>
              {/* Final line for the profile image */}
              <div className="grid grid-cols-3 gap-3">
                <Image
                  src={user?.avatarUrl}
                  alt="profile image"
                  width={200}
                  height={200}
                  className="col-span-1 rounded-full"
                />
                <form className="col-span-2 py-8 my-auto">
                  <Input
                    disabled
                    crossOrigin={undefined}
                    className="w-full "
                    size="lg"
                    // label="Ghi chú"
                    value={comment}
                  />
                  <div className="flex justify-center gap-5 mt-3">
                    {status == 'APPROVED' ? (
                      <Button
                        disabled
                        placeholder={undefined}
                        className={`${nunito.className} w-52 bg-[var(--blue-02)] font-bold disabled:opacity-100`}>
                        Phê duyệt
                      </Button>
                    ) : (
                      <Button
                        disabled
                        placeholder={undefined}
                        className={`${nunito.className} w-52 bg-[#ff7373] text-black font-bold disabled:opacity-100`}>
                        Từ chối
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )
        )}
    </>
  )
}
