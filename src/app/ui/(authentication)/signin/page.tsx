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
        ĐĂNG NHẬP
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
            Mật Khẩu <span className="text-red-700 font-bold text-lg">*</span>
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
        <div className="flex justify-between pt-2">
          <Checkbox
            label={
              <Typography
                variant="small"
                className={` ${roboto} flex items-center font-normal`}
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
            className={` ${roboto} flex items-center font-normal`}
            placeholder={undefined}>
            <Link href={'#'}>Quên mật khẩu ?</Link>
          </Typography>
        </div>

        <Button
          placeholder={undefined}
          ripple={true}
          className={` ${roboto} mt-6 w-full bg-blue-800 text-white rounded-md`}>
          Đăng nhập
        </Button>

        <div className=" mt-[3rem] flex items-center justify-between md:mt-[5rem] lg:mt[5rem] xl:mt-[13rem]">
          <Typography
            placeholder={undefined}
            color="gray"
            className={`${roboto} text-center font-normal`}>
            Bạn chưa có tài khoản ?
          </Typography>
          <Link href="#">
            <Button
              placeholder={undefined}
              color="white"
              size="lg"
              className={` ${roboto} font-bold text-blue-700 `}
              ripple={true}>
              Đăng ký
            </Button>
          </Link>
        </div>
      </form>
    </Card>
  )
}
