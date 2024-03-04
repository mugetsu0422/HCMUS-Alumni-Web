'use client'
import React from 'react'
import Link from 'next/link'
import { Card, Input, Button, Typography } from '@material-tailwind/react'
import { roboto } from '../../ui/fonts'
import { useForm } from 'react-hook-form'
import ErrorInput from '../../ui/Error-input'

import { useRouter } from 'next/navigation'

export default function page() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter()
  const onSubmit = (data) => {
    console.log(data) // Submit form data
  }

  function hanldeClick() {
    router.push('/verify-email')
  }

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
      className={`${roboto} w-[20rem] m-auto -pt-[10rem]  `}>
      <Typography variant="h2" color="blue-gray" placeholder={undefined}>
        ĐĂNG KÝ
      </Typography>

      <div
        className={` text-blue-400	 ${roboto} italic text-nowrap w-[450px]	mt-[2rem] -mb-[1rem] `}>
        Mã đăng ký đã được gửi đến nnquynh20@clc.fitus.edu.vn
      </div>

      <form
        //summit form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
        <div className="mb-1 flex flex-col gap-6">
          <Typography
            placeholder={undefined}
            variant="h6"
            color="blue-gray"
            className={` ${roboto} -mb-3`}>
            Mã đăng ký <span className="text-red-700 font-bold text-lg">*</span>
          </Typography>

          <div className="flex relative w-full max-w-[24rem]">
            <Input
              size="lg"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pr-20"
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              {...register('confirmPassword', {
                required: 'Vui lòng xác nhận lại mật khẩu',
                validate: (value) =>
                  value === getValues().password || 'Mật khẩu không trùng lặp', // có gì chỉnh lại sao cho câu từ hợp lý xíu
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
              //loading={}
            >
              Gửi lại
            </Button>
          </div>
          <ErrorInput
            // This is the error message
            errors={errors?.confirmPassword?.message}
          />
        </div>

        <Button
          onClick={hanldeClick}
          type="submit"
          placeholder={undefined}
          ripple={true}
          className={` ${roboto} mt-[3rem] w-full bg-blue-800 text-white rounded-md py-4`}>
          Tiếp tục
        </Button>

        <div className=" mt-[3rem] flex items-center justify-between md:mt-[5rem] lg:mt[5rem] xl:mt-[10rem]">
          <Typography
            placeholder={undefined}
            color="gray"
            className={`${roboto} text-center font-normal`}>
            Bạn đã có tài khoản ?
          </Typography>
          <Link href="/signin">
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
