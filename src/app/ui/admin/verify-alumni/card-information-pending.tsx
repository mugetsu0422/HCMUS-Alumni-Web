'use client'

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
import useHasAnyPermission from '@/hooks/use-has-any-permission'

export default function CardInformation({
  offset,
  items,
  setItems,
  setTotalCount,
}) {
  const { register, handleSubmit } = useForm()
  const hasAnyPermission = useHasAnyPermission(
    ['AlumniVerify.Edit'],
    Cookies.get('permissions') ? Cookies.get('permissions').split(',') : []
  )
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
            userId,
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
            className=" w-[100%] p-5 border border-gray-200 rounded-md break-words bg-white">
            <div className={`flex gap-4 ${inter.className} mb-2 items-center`}>
              <Link
                href={`/profile/${userId}/about`}
                target="blank"
                className="w-[20%] h-[20%] min-w-[104px] min-h-[104px] max-w-[116px] max-h-[116px] 2xl:w-[10%] 2xl:h-[10%]">
                <Avatar
                  placeholder={undefined}
                  src={avatarUrl || ''}
                  alt="profile image"
                  className="w-full h-full aspect-square"
                />
              </Link>
              <div className="flex flex-col gap-2 w-[600px]">
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
                    <p className=" font-bold text-[var(--secondary)]">Email</p>
                    <p>{email}</p>
                  </div>

                  <div className="col-span-1 w-[250px]">
                    <p className=" font-bold text-[var(--secondary)]">Khoa</p>
                    <p>{facultyName}</p>
                  </div>
                </div>
              </div>

              <form className="flex flex-col gap-2">
                <Input
                  crossOrigin={undefined}
                  size="lg"
                  label="Ghi chú"
                  {...register('comment')}
                />
                <div className="flex justify-between gap-5 mt-3">
                  <Button
                    disabled={!hasAnyPermission}
                    onClick={handleSubmit((data) => {
                      onSubmit(data, id, 'APPROVED', idx, fullName)
                      setTotalCount((e) => e - 1)
                    })}
                    placeholder={undefined}
                    className={`${nunito.className} w-52 bg-[var(--blue-02)] font-bold`}>
                    Phê duyệt
                  </Button>
                  <Button
                    disabled={!hasAnyPermission}
                    onClick={handleSubmit((data) => {
                      onSubmit(data, id, 'DENIED', idx, fullName)
                      setTotalCount((e) => e - 1)
                    })}
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
