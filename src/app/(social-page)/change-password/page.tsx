'use client'

import React from 'react'
import { roboto } from '../../ui/fonts'
import { useForm } from 'react-hook-form'
import { Input, Button, Typography } from '@material-tailwind/react'
import ErrorInput from '@/app/ui/error-input'
import axios from 'axios'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Page() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useForm()

  const router = useRouter()

  const onSubmit = (data) => {
    // Verify email activation code
    axios
      .post(`${process.env.NEXT_PUBLIC_SERVER_HOST}/auth/reset-password`, {
        email: data.email,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      })
      .then(() => {
        // Back to signin page
        toast.success('Đổi mật khẩu thành công')
        router.push('/home-page')
      })
      .catch((error) => {
        // failed
        toast.error(
          error.response?.data?.error?.message || 'Lỗi không xác định'
        )
      })
  }

  return (
    <>
      <div className="max-w-[600px] m-auto mb-8">
        <div className="w-full flex flex-col gap-y-6 mt-10">
          <p
            className={`${roboto.className} text-3xl font-bold text-[var(--blue-02)]`}>
            ĐỔI MẬT KHẨU
          </p>

          <form
            //summit form
            onSubmit={handleSubmit(onSubmit)}
            className="mb-2 w-80 max-w-screen-lg sm:w-96 m-auto">
            <div className="mb-1 flex flex-col gap-6 mx-auto">
              <Typography
                placeholder={undefined}
                variant="h6"
                color="blue-gray"
                className={` -mb-3`}>
                Email <span className="text-red-700 font-bold text-lg">*</span>
              </Typography>

              <div className="flex relative w-full max-w-[24rem]">
                <Input
                  size="lg"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pr-20"
                  labelProps={{
                    className: 'before:content-none after:content-none',
                  }}
                  {...register('email', {
                    required: 'Vui lòng nhập email',
                    pattern: {
                      value:
                        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                      message:
                        'Hãy nhập đúng định dạng email. Ví dụ: test@gmail.com',
                    },
                  })}
                  containerProps={{
                    className: 'min-w-0',
                  }}
                  crossOrigin={undefined}
                />
              </div>
              <ErrorInput errors={errors?.email?.message} />
            </div>

            <div className="mb-1 flex flex-col gap-6">
              <Typography
                placeholder={undefined}
                variant="h6"
                color="blue-gray"
                className={` -mb-3`}>
                Mật khẩu cũ
                <span className="text-red-700 font-bold text-lg">*</span>
              </Typography>

              <div className="flex relative w-full max-w-[24rem]">
                <Input
                  size="lg"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pr-20"
                  type="password"
                  labelProps={{
                    className: 'before:content-none after:content-none',
                  }}
                  {...register('oldPassword', {
                    required: 'Vui lòng nhập mã xác thực',
                  })}
                  containerProps={{
                    className: 'min-w-0',
                  }}
                  crossOrigin={undefined}
                />
              </div>
              <ErrorInput errors={errors?.oldPassword?.message} />
            </div>

            <div className="mb-1 flex flex-col gap-6">
              <Typography
                placeholder={undefined}
                variant="h6"
                color="blue-gray"
                className={` -mb-3`}>
                Mật khẩu mới{' '}
                <span className="text-red-700 font-bold text-lg">*</span>
              </Typography>

              <div className="flex relative w-full max-w-[24rem]">
                <Input
                  size="lg"
                  type="password"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pr-20"
                  labelProps={{
                    className: 'before:content-none after:content-none',
                  }}
                  {...register('newPassword', {
                    required: 'Vui lòng nhập mật khẩu mới',
                  })}
                  containerProps={{
                    className: 'min-w-0',
                  }}
                  crossOrigin={undefined}
                />
              </div>
              <ErrorInput errors={errors?.newPassword?.message} />
            </div>

            <Button
              type="submit"
              placeholder={undefined}
              ripple={true}
              className={`mt-[3rem] w-full bg-blue-800 text-white rounded-md py-4`}>
              Đổi mật khẩu
            </Button>

            <Button
              placeholder={undefined}
              ripple={true}
              className={`mt-[1rem] w-full bg-[#e4e6eb] text-[#4b4f56]  rounded-md py-4`}>
              <Link href="/home-page">Hủy</Link>
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
