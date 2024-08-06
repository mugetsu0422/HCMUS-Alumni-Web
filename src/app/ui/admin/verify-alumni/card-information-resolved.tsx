import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { inter, nunito } from '../../fonts'
import { Textarea, Badge, Avatar } from '@material-tailwind/react'
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
            userId,
            socialMediaLink,
            status,
            comment,
            fullName,
            email,
            avatarUrl,
            facultyName,
          },
          idx
        ) => (
          <div
            key={id}
            className="w-full min-w-full p-5 border border-gray-200 rounded-md break-words bg-white">
            <div className={`flex gap-4 ${inter.className} mb-2 items-stretch`}>
              <Link
                href={`/profile/${userId}/about`}
                target="blank"
                className="w-[20%] h-[20%] min-w-[104px] min-h-[104px] max-w-[116px] max-h-[116px] 2xl:w-[10%] 2xl:h-[10%]">
                <Badge
                  color="white"
                  content={
                    <div>
                      {status === 'APPROVED' ? (
                        <CheckCircleFill className="text-[2rem] text-[--blue-02]" />
                      ) : (
                        <XCircleFill className="text-[2rem] text-red-500" />
                      )}
                    </div>
                  }
                  overlap="circular"
                  placement="bottom-end">
                  <Avatar
                    placeholder={undefined}
                    src={avatarUrl || ''}
                    alt="profile image"
                    className="w-full h-full aspect-square"
                  />
                </Badge>
              </Link>

              <div className="flex flex-col gap-2 w-[600px] h-full">
                <div className="flex gap-2 items-start">
                  <div className="flex-col col-span-2 w-[280px]">
                    <p className="font-bold text-[var(--secondary)]">
                      Họ và tên
                    </p>
                    <div className="flex gap-1 justify-between items-center pr-12">
                      <p>{fullName} </p>
                      <Link
                        className="w-fit"
                        href={`${socialMediaLink}`}
                        target="_blank"
                        rel="noopener noreferrer">
                        <LinkIcon link={socialMediaLink} />
                      </Link>
                    </div>
                  </div>

                  <div className="flex-col w-[120px]">
                    <p className="font-bold text-[var(--secondary)]">MSSV</p>
                    <p>{studentId}</p>
                  </div>
                  <div className="flex-col w-[120px]">
                    <p className="font-bold text-[var(--secondary)]">
                      Năm nhập học
                    </p>
                    <p>{beginningYear}</p>
                  </div>
                </div>

                <div className="flex gap-2 items-start">
                  <div className="flex-col col-span-2 w-[280px]">
                    <p className="font-bold text-[var(--secondary)]">Email</p>
                    <p>{email}</p>
                  </div>

                  <div className="col-span-1 w-[250px]">
                    <p className="font-bold text-[var(--secondary)]">Khoa</p>
                    <p>{facultyName}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <Textarea
                  disabled
                  className="w-full flex-1 h-[50px]"
                  size="lg"
                  value={comment}
                  label="Ghi chú"
                />
              </div>
            </div>
          </div>
        )
      )}
    </>
  )
}
