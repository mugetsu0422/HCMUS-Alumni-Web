import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { inter, nunito } from '../fonts'
import { Input, Button } from '@material-tailwind/react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { JWT_COOKIE } from '../../constant'
import { useForm } from 'react-hook-form'
import { Facebook, Linkedin } from 'react-bootstrap-icons'
import LinkIcon from './link-icon'

export default function CardInformation({ items }) {
  const { register, handleSubmit } = useForm()

  const onSubmit = (data, id, status) => {
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
        console.log('thành công')
      })
      .catch((e) => {})
  }

  return (
    <>
      {items.map(
        ({ id, user, studentId, beginningYear, socialMediaLink }, idx) => (
          <div
            key={id}
            className="w-[100%] lg:w-[49%] py-3 px-2 border-2 border-slate-700 rounded-md break-words">
            {/* First line include FullName MSSV and Year*/}
            <div className={`grid grid-cols-4  gap-5 ${inter.className} mb-2`}>
              <div className="flex-col col-span-2 ">
                <p className="font-bold text-[var(--secondary)]">Họ và tên</p>
                <p>{user?.fullName}</p>
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
                <p>{user?.email}</p>
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
                src={user?.avatarUrl}
                alt="profile image"
                width={200}
                height={200}
                className="col-span-1 rounded-full"
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
                      onSubmit(data, id, 'APPROVED')
                    )}
                    placeholder={undefined}
                    className={`${nunito.className} w-52 bg-[var(--blue-02)] font-bold`}>
                    Phê duyệt
                  </Button>
                  <Button
                    onClick={handleSubmit((data) =>
                      onSubmit(data, id, 'DENIED')
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