'use client'

import React, { useState } from 'react'
import { roboto } from '../../ui/fonts'
import { useForm } from 'react-hook-form'
import { Input, Button, Typography } from '@material-tailwind/react'
import ErrorInput from '@/app/ui/error-input'
import axios from 'axios'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { JWT_COOKIE } from '@/app/constant'
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons'

export default function Page() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useForm()
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword((e) => !e)
  }

  const togglePasswordConfirmVisibility = () => {
    setShowPasswordConfirm((e) => !e)
  }

  const togglePasswordVisibility = () => {
    setShowPassword((e) => !e)
  }
  const router = useRouter()

  const onSubmit = (data) => {
    // Verify email activation code
    axios
      .post(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/auth/change-password`,
        {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
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
                  type={showCurrentPassword ? 'text' : 'password'}
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
                <Button
                  placeholder={undefined}
                  size="sm"
                  color="blue"
                  variant="text"
                  className="!absolute right-1 top-1.5 rounded"
                  onClick={toggleCurrentPasswordVisibility}>
                  {showCurrentPassword ? (
                    <EyeFill className="hover:cursor-pointer text-[--blue-02] text-lg" />
                  ) : (
                    <EyeSlashFill className="hover:cursor-pointer text-[--blue-02] text-lg" />
                  )}
                </Button>
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
                  crossOrigin={undefined}
                  type={showPassword ? 'text' : 'password'}
                  {...register('newPassword', {
                    required: 'Vui lòng nhập mật khẩu',
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&*!]).{8,20}$/,
                      message:
                        'Mật khẩu phải chứa ít nhất một chữ thường, một chữ hoa, một ký tự đặc biệt và có độ dài từ 8 đến 20 ký tự',
                    },
                  })}
                  size="lg"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900 w-full"
                  labelProps={{
                    className: 'before:content-none after:content-none',
                  }}
                />
                <Button
                  placeholder={undefined}
                  size="sm"
                  color="blue"
                  variant="text"
                  className="!absolute right-1 top-1.5 rounded"
                  onClick={togglePasswordVisibility}>
                  {showPassword ? (
                    <EyeFill className="hover:cursor-pointer text-[--blue-02] text-lg" />
                  ) : (
                    <EyeSlashFill className="hover:cursor-pointer text-[--blue-02] text-lg" />
                  )}
                </Button>
              </div>
              <ErrorInput errors={errors?.newPassword?.message} />
            </div>
            <div className="mb-4 flex flex-col gap-3">
              <Typography
                placeholder={undefined}
                variant="h6"
                color="blue-gray"
                className={` ${roboto.className}`}>
                Nhập lại mật khẩu mới{' '}
                <span className="text-red-700 font-bold text-lg">*</span>
              </Typography>
              <div className="flex relative w-full max-w-[24rem]">
                <Input
                  type={showPasswordConfirm ? 'text' : 'password'}
                  size="lg"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: 'before:content-none after:content-none',
                  }}
                  crossOrigin={undefined}
                  {...register('confirmNewPassword', {
                    required: 'Vui lòng xác nhận lại mật khẩu',
                    validate: (value) =>
                      value === getValues('newPassword') ||
                      'Xác nhận mật khẩu mới không khớp',
                  })}
                />
                <Button
                  placeholder={undefined}
                  size="sm"
                  color="blue"
                  variant="text"
                  className="!absolute right-1 top-1.5 rounded"
                  onClick={togglePasswordConfirmVisibility}>
                  {showPasswordConfirm ? (
                    <EyeFill className="hover:cursor-pointer text-[--blue-02] text-lg" />
                  ) : (
                    <EyeSlashFill className="hover:cursor-pointer text-[--blue-02] text-lg" />
                  )}
                </Button>
              </div>
              <ErrorInput errors={errors?.confirmNewPassword?.message} />
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
