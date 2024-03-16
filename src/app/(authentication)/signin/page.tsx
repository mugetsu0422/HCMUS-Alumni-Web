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
import { roboto } from '../../ui/fonts'
import toast, { Toaster } from 'react-hot-toast'

export default function page() {
  // sau này sẽ xử lý thêm dữ kiện đăng nhập ở đây
  const notify = () => toast.success('Đăng nhập thành công')
  const error = () => toast.error('Đăng nhập thất bại')

  return (
    <Card
      color="transparent"
      shadow={false}
      placeholder={undefined}
      className={`${roboto} w-[20rem] m-auto mt-[10rem]`}>
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
          {/* Input email */}
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
          {/* Input password */}
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
          onClick={notify}
          placeholder={undefined}
          ripple={true}
          className={` ${roboto} mt-6 w-full bg-blue-800 text-white rounded-md py-4`}>
          Đăng nhập
        </Button>

        <Toaster
          toastOptions={{
            success: {
              style: {
                background: '#00a700',
                color: 'white',
              },
            },
            error: {
              style: {
                background: '#ea7b7b',
                color: 'white',
              },
            },
          }}
        />
        <div className=" mt-[9.5rem] flex items-center justify-between ">
          <Typography
            placeholder={undefined}
            color="gray"
            className={`${roboto} text-center font-normal`}>
            Bạn chưa có tài khoản ?
          </Typography>
          <Link href="/signup">
            <Button
              placeholder={undefined}
              size="lg"
              variant="outlined"
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
