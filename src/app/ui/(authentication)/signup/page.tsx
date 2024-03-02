'use client'
import React from 'react'
import Link from 'next/link'
import { Card, Input, Button, Typography } from '@material-tailwind/react'
import { roboto } from '../../fonts'
import { useForm } from 'react-hook-form'
import ErrorInput from './ErrorInput'

export default function page() {
  const onSubmit = (data) => {
    console.log(data) // Submit form data
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useForm()

  return (
    <Card
      color="transparent"
      shadow={false}
      placeholder={undefined}
      className={`${roboto} w-[20rem] m-auto pt-[10rem] `}>
      <Typography variant="h2" color="blue-gray" placeholder={undefined}>
        ĐĂNG KÝ
      </Typography>

      <form
        //summit form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
        <div className="mb-1 flex flex-col gap-6">
          <Typography
            placeholder={undefined}
            variant="h6"
            color="blue-gray"
            className={`${roboto} -mb-3`}>
            Email <span className="text-red-700 font-bold text-lg">*</span>
          </Typography>
          <Input
            size="lg"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900 w-96"
            {...register('email', {
              required: 'Bạn cần phải nhập email',
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: 'Hãy nhập đúng định dạng email',
              },
            })}
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
            crossOrigin={undefined}
          />

          <ErrorInput
            // This is the error message
            errors={errors?.email?.message}
          />

          <Typography
            placeholder={undefined}
            variant="h6"
            color="blue-gray"
            className={` ${roboto} -mb-3`}>
            Mật khẩu <span className="text-red-700 font-bold text-lg">*</span>
          </Typography>

          <Input
            type="password"
            {...register('password', {
              required: 'Bạn cần phải nhập mật khẩu',
            })}
            size="lg"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
            crossOrigin={undefined}
          />

          <ErrorInput
            // This is the error message
            errors={errors?.password?.message}
          />

          <Typography
            placeholder={undefined}
            variant="h6"
            color="blue-gray"
            className={` ${roboto} -mb-3`}>
            Nhập lại mật khẩu{' '}
            <span className="text-red-700 font-bold text-lg">*</span>
          </Typography>

          <Input
            type="password"
            size="lg"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
            {...register('confirmPassword', {
              required: 'Vui lòng xác nhận lại mật khẩu',
              validate: (value) =>
                value === getValues().password || 'Mật khẩu không trùng lặp', // có gì chỉnh lại sao cho câu từ hợp lý xíu
            })}
            crossOrigin={undefined}
          />

          <ErrorInput
            // This is the error message
            errors={errors?.confirmPassword?.message}
          />
        </div>

        <Button
          type="submit"
          placeholder={undefined}
          ripple={true}
          className={` ${roboto} mt-[3rem] w-full bg-blue-800 text-white rounded-md py-4`}>
          Đăng Ký
        </Button>

        <div className=" mt-[3rem] flex items-center justify-between md:mt-[5rem] lg:mt[5rem] xl:mt-[10rem]">
          <Typography
            placeholder={undefined}
            color="gray"
            className={`${roboto} text-center font-normal`}>
            Bạn đã có tài khoản ?
          </Typography>
          <Link href="http://localhost:3000/ui/signin">
            <Button
              placeholder={undefined}
              size="lg"
              variant="outlined"
              className={` ${roboto} font-bold text-blue-700 `}
              ripple={true}>
              Đăng Nhập
            </Button>
          </Link>
        </div>
      </form>
    </Card>
  )
}
