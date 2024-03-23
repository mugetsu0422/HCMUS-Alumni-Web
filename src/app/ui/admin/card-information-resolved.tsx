import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { inter, nunito } from '../fonts'
import { Input, Button } from '@material-tailwind/react'
import LinkIcon from './link-icon'
import { CheckCircleFill, XCircleFill } from 'react-bootstrap-icons'

export default function CardInformation({ offset, items }) {
  return (
    <>
      {items.map(
        (
          {
            id,
            studentId,
            beginningYear,
            socialMediaLink,
            status,
            comment,
            fullName,
            email,
            avatarUrl,
          },
          idx
        ) => (
          <div
            key={id}
            className="w-[100%] lg:w-[49%] p-5 border border-gray-200 rounded-md break-words">
            {/* First line include FullName MSSV and Year*/}
            <div className={`grid grid-cols-4  gap-5 ${inter} mb-2`}>
              <div className="flex-col col-span-2">
                <p className="font-bold text-[var(--secondary)]   ">
                  Họ và tên
                </p>
                <p>{fullName}</p>
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
            <div className={`grid grid-cols-4  gap-5 ${inter.className} mb-2`}>
              <div className="flex-col col-span-2">
                <p className=" font-bold text-[var(--secondary)]">Email</p>
                <p>{email}</p>
              </div>
              <div className="col-span-1">
                <p className=" font-bold text-[var(--secondary)]">Khoa</p>
                <p>Công nghệ thông tin</p>
              </div>
              <div className="col-span-1">
                <div className="w-fit">
                  <Link
                    className="text-[2.5rem]"
                    href={`${socialMediaLink}`}
                    target="_blank"
                    rel="noopener noreferrer">
                    <LinkIcon link={socialMediaLink} />
                  </Link>
                </div>
              </div>
            </div>
            {/* Final line for the profile image */}
            <div className="grid grid-cols-3 gap-3">
              <Image
                src={avatarUrl || ''}
                alt="profile image"
                width={200}
                height={200}
                className="col-span-1 rounded-full"
              />
              <form className="col-span-2 py-8 my-auto">
                <Input
                  disabled
                  crossOrigin={undefined}
                  className="w-full"
                  size="lg"
                  // label="Ghi chú"
                  value={comment}
                />
                <div className="flex justify-center gap-5 mt-3">
                  {status == 'APPROVED' ? (
                    <CheckCircleFill className="text-[4rem] text-green-500" />
                  ) : (
                    <XCircleFill className="text-[4rem] text-red-500" />
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
