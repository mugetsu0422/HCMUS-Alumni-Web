'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from '@material-tailwind/react'
import { roboto } from '../../ui/fonts'
import toast, { Toaster } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import ErrorInput from '../../ui/error-input'
import axios from 'axios'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation'
import CustomToaster from '@/app/ui/common/custom-toaster'

function ForceChangePasswordForm({
  forceChangePasswordForm,
  onForceChangePasswordSubmit,
}) {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm()
  return (
    <>
      <Typography
        variant="h2"
        color="blue-gray"
        placeholder={undefined}
        className="my-8">
        ĐỔI MẬT KHẨU
      </Typography>
      <form
        onSubmit={handleSubmit(onForceChangePasswordSubmit)}
        className="mb-2 w-80 max-w-screen-lg sm:w-96">
        <div>
          <div className="mb-4 flex flex-col gap-3">
            <Typography
              placeholder={undefined}
              variant="h6"
              color="blue-gray"
              className={`${roboto.className}`}>
              Mật khẩu hiện tại{' '}
              <span className="text-red-700 font-bold text-lg">*</span>
            </Typography>
            <Input
              type="password"
              size="lg"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900 w-96"
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              crossOrigin={undefined}
              {...register('currentPassword', {
                required: 'Vui lòng nhập mật khẩu hiện tại',
              })}
            />
            <ErrorInput errors={errors?.currentPassword?.message} />
          </div>

          <div className="mb-4 flex flex-col gap-3">
            <Typography
              placeholder={undefined}
              variant="h6"
              color="blue-gray"
              className={` ${roboto.className}`}>
              Mật khẩu mới{' '}
              <span className="text-red-700 font-bold text-lg">*</span>
            </Typography>
            <Input
              type="password"
              size="lg"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              crossOrigin={undefined}
              {...register('newPassword', {
                required: 'Vui lòng nhập mật khẩu',
              })}
            />
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
            <Input
              type="password"
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
            <ErrorInput errors={errors?.confirmNewPassword?.message} />
          </div>
        </div>

        <Button
          type="submit"
          placeholder={undefined}
          ripple={true}
          className={` ${roboto.className} mt-6 w-full bg-blue-800 text-white rounded-md py-4`}>
          Đổi mật khẩu
        </Button>
      </form>
    </>
  )
}

function SigninForm({ signinForm, onSigninFormSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = signinForm
  return (
    <>
      <Typography
        variant="h2"
        color="blue-gray"
        placeholder={undefined}
        className="my-8">
        ĐĂNG NHẬP
      </Typography>

      <form
        onSubmit={handleSubmit(onSigninFormSubmit)}
        className="mb-2 w-80 max-w-screen-lg sm:w-96">
        <div>
          <div className="mb-4 flex flex-col gap-3">
            <Typography
              placeholder={undefined}
              variant="h6"
              color="blue-gray"
              className={`${roboto.className}`}>
              Email <span className="text-red-700 font-bold text-lg">*</span>
            </Typography>
            {/* Input email */}
            <Input
              size="lg"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900 w-96"
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              crossOrigin={undefined}
              {...register('email', {
                required: 'Vui lòng nhập email',
                pattern: {
                  value:
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  message:
                    'Hãy nhập đúng định dạng email. Ví dụ: test@gmail.com',
                },
              })}
            />
            <ErrorInput
              // This is the error message
              errors={errors?.email?.message}
            />
          </div>

          <div className="mb-4 flex flex-col gap-3">
            <Typography
              placeholder={undefined}
              variant="h6"
              color="blue-gray"
              className={` ${roboto.className}`}>
              Mật khẩu <span className="text-red-700 font-bold text-lg">*</span>
            </Typography>
            {/* Input password */}
            <Input
              type="password"
              size="lg"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              crossOrigin={undefined}
              {...register('pass', {
                required: 'Vui lòng nhập mật khẩu',
              })}
            />
            <ErrorInput
              // This is the error message
              errors={errors?.pass?.message}
            />
          </div>
        </div>

        <div className="flex justify-between pt-2">
          <Checkbox
            label={
              <Typography
                variant="small"
                className={` ${roboto.className} flex items-center font-normal`}
                placeholder={undefined}>
                Ghi nhớ đăng nhập
              </Typography>
            }
            color="blue"
            containerProps={{ className: '-ml-2.5' }}
            crossOrigin={undefined}
          />
          <Typography
            variant="small"
            className={` ${roboto.className} flex items-center font-normal`}
            placeholder={undefined}>
            <Link href={'#'}>Quên mật khẩu ?</Link>
          </Typography>
        </div>

        <Button
          type="submit"
          placeholder={undefined}
          ripple={true}
          className={` ${roboto.className} mt-6 w-full bg-blue-800 text-white rounded-md py-4`}>
          Đăng nhập
        </Button>

        <div className=" mt-[2rem] flex items-center justify-between ">
          <Typography
            placeholder={undefined}
            color="gray"
            className={`${roboto.className} text-center font-normal`}>
            Bạn chưa có tài khoản ?
          </Typography>
          <Link href="/signup">
            <Button
              placeholder={undefined}
              size="lg"
              variant="outlined"
              className={` ${roboto.className} font-bold text-blue-700 `}
              ripple={true}>
              Đăng ký
            </Button>
          </Link>
        </div>
      </form>
    </>
  )
}

export default function Page() {
  const router = useRouter()
  const [isForceChangePassword, setIsForceChangePassword] = useState(false)
  const [email, setEmail] = useState('')

  // sau này sẽ xử lý thêm dữ kiện đăng nhập ở đây
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const signinForm = useForm()
  const forceChangePasswordForm = useForm()

  const onSigninFormSubmit = (data) => {
    axios
      .postForm(`${process.env.NEXT_PUBLIC_SERVER_HOST}/auth/login`, data)
      .then(({ data: { jwt, permissions, forcePasswordChange = null } }) => {
        if (forcePasswordChange) {
          setEmail(data.email)
          setIsForceChangePassword(true)
        } else {
          const decoded: { sub: string } = jwtDecode(jwt)

          Cookies.set('userId', decoded.sub, { expires: 3 })
          Cookies.set('jwt', jwt, { expires: 3 })
          Cookies.set('permissions', permissions, { expires: 3 })
          router.push('/home-page')
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?.error?.message || 'Lỗi không xác định')
      })
  }

  const onForceChangePasswordSubmit = async (data) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/auth/reset-password`,
        {
          email: email,
          oldPassword: data.currentPassword,
          newPassword: data.newPassword,
        }
      )

      const {
        data: { jwt, permissions },
      } = await axios.postForm(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/auth/login`,
        {
          email: email,
          pass: data.newPassword,
        }
      )
      const decoded: { sub: string } = jwtDecode(jwt)

      Cookies.set('userId', decoded.sub, { expires: 3 })
      Cookies.set('jwt', jwt, { expires: 3 })
      Cookies.set('permissions', permissions, { expires: 3 })
      router.push('/home-page')
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Lỗi không xác định')
    }
  }

  return (
    <div
      className={`${roboto.className} w-auto h-auto m-auto xl:m-0 xl:ml-[5rem] sm:pt-[10rem] 2xl:pt-0`}>
      <CustomToaster />
      {isForceChangePassword ? (
        <ForceChangePasswordForm
          forceChangePasswordForm={forceChangePasswordForm}
          onForceChangePasswordSubmit={onForceChangePasswordSubmit}
        />
      ) : (
        <SigninForm
          signinForm={signinForm}
          onSigninFormSubmit={onSigninFormSubmit}
        />
      )}
    </div>
  )
}
