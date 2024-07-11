import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { inter, nunito } from '../../fonts'
import { Input, Button, Avatar } from '@material-tailwind/react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { JWT_COOKIE } from '../../../constant'
import { FieldValues, useForm } from 'react-hook-form'
import LinkIcon from './link-icon'
import toast from 'react-hot-toast'

export default function CardInformation({ offset, items, setItems }) {
  const { register, handleSubmit } = useForm()

  const onSubmit = (
    data: FieldValues,
    id: any,
    status: string,
    idx: number,
    fullName: string
  ) => {
    offset.current--
    setItems((items) => items.filter((e, i) => i != idx))

    axios
      .put(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/alumni-verification/${id}/verify`,
        {
          status: status,
          comment: data.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then((res) => {
        if (status == 'APPROVED') {
          toast.success(`Đã phê duyệt ${fullName}`)
        } else if (status == 'DENIED') {
          toast.success(`Đã từ chối ${fullName}`)
        }
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.error?.message || 'Lỗi không xác định'
        )
      })
  }

  return (
    <>
      {items.map(
        (
          {
            id,
            studentId,
            beginningYear,
            socialMediaLink,
            fullName,
            email,
            avatarUrl,
            facultyName,
          },
          idx
        ) => (
          <div
            key={id}
            className="w-[100%] lg:w-[49%] p-5 border border-gray-200 rounded-md break-words">
            {/* First line include FullName MSSV and Year*/}
            <div className={`grid grid-cols-4  gap-5 ${inter.className} mb-2`}>
              <div className="flex-col col-span-2 ">
                <p className="font-bold text-[var(--secondary)]">Họ và tên</p>
                <p>{fullName}</p>
              </div>
              <div className="flex-col">
                <p className="font-bold text-[var(--secondary)]">MSSV</p>
                <p>{studentId}</p>
              </div>
              <div className="flex-col">
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
                <p>{facultyName}</p>
              </div>
              <div className="col-span-1">
                <div className="w-fit">
                  <Link
                    className=""
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
              <Avatar
                placeholder={undefined}
                src={avatarUrl || ''}
                alt="profile image"
                className="col-span-1 w-full h-full aspect-square"
              />
              <form className="col-span-2 py-8 my-auto">
                <Input
                  crossOrigin={undefined}
                  className="w-full "
                  size="lg"
                  label="Ghi chú"
                  {...register('comment')}
                />
                <div className="flex justify-between gap-5 mt-3">
                  <Button
                    onClick={handleSubmit((data) =>
                      onSubmit(data, id, 'APPROVED', idx, fullName)
                    )}
                    placeholder={undefined}
                    className={`${nunito.className} w-52 bg-[var(--blue-02)] font-bold`}>
                    Phê duyệt
                  </Button>
                  <Button
                    onClick={handleSubmit((data) =>
                      onSubmit(data, id, 'DENIED', idx, fullName)
                    )}
                    placeholder={undefined}
                    className={`${nunito.className} w-52 bg-[var(--blue-04)] text-black font-bold`}>
                    Từ chối
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )
      )}
    </>
  )
}
