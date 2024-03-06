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
    //getValues,
    formState: { errors },
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useForm()

  return (
    <Card
      color="transparent"
      shadow={false}
      placeholder={undefined}
      className={`${roboto} w-[20rem] m-auto sm:pt-[10rem]  2xl:pt-0`}>
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
            Họ và tên <span className="text-red-700 font-bold text-lg">*</span>
          </Typography>

          <Input
            size="lg"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900 w-96"
            {...register('name', {
              required: 'Bạn cần phải nhập họ và tên',
              pattern: {
                value: /[a-zA-Z]/,
                message: 'Hãy nhập đúng định dạng tên',
              },
            })}
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
            crossOrigin={undefined}
          />

          <ErrorInput
            // This is the error message
            errors={errors?.name?.message}
          />

          <Typography
            placeholder={undefined}
            variant="h6"
            color="blue-gray"
            className={` ${roboto} -mb-3`}>
            Mã số sinh viên
          </Typography>

          <Input
            {...register('MSSV', {
              pattern: {
                value: /[0-9]/,
                message: 'Hãy nhập đúng định dạng MSSV',
              },
            })}
            size="lg"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
            crossOrigin={undefined}
          />

          <Typography
            placeholder={undefined}
            variant="h6"
            color="blue-gray"
            className={` ${roboto} -mb-3`}>
            Năm tốt nghiệp{' '}
          </Typography>

          <Input
            {...register('Year', {
              pattern: {
                value: /[0-9]/,
                message: 'Hãy nhập đúng định dạng năm',
              },
            })}
            size="lg"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
            crossOrigin={undefined}
          />
        </div>

        <Button
          //onClick={hanldeClick}
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
