'use client'
import React from 'react'
import Link from 'next/link'
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from '@material-tailwind/react'
import { roboto } from '../../fonts'

export default function page() {
  return (
    <Card
      color="transparent"
      shadow={false}
      placeholder={undefined}
      className={`${roboto} w-[20rem] m-auto pt-[10rem] `}>
      <Typography variant="h2" color="blue-gray" placeholder={undefined}>
        ĐĂNG KÝ
      </Typography>

      <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
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
            Mật khẩu <span className="text-red-700 font-bold text-lg">*</span>
          </Typography>
          <Input
            type="password"
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
            crossOrigin={undefined}
          />
        </div>

        <Button
          placeholder={undefined}
          ripple={true}
          className={` ${roboto} mt-[3rem] w-full bg-blue-800 text-white rounded-md py-4`}>
          Đăng Ký
        </Button>

        <div className=" mt-[3rem] flex items-center justify-between md:mt-[5rem] lg:mt[5rem] xl:mt-[12rem]">
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
