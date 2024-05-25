'use client'

import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
} from '@material-tailwind/react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { Toaster } from 'react-hot-toast'
import ErrorInput from '../../../ui/error-input'
import { nunito } from '../../../ui/fonts'

function CancelDialog({ open, handleOpen }) {
  const router = useRouter()

  return (
    <Dialog placeholder={undefined} size="xs" open={open} handler={handleOpen}>
      <DialogHeader placeholder={undefined}>Huỷ</DialogHeader>
      <DialogBody placeholder={undefined}>
        Bạn có muốn huỷ tạo bài viết?
      </DialogBody>
      <DialogFooter placeholder={undefined}>
        <Button
          className={`${nunito.className} mr-4 bg-[--delete-filter] text-black normal-case text-md`}
          placeholder={undefined}
          onClick={handleOpen}>
          Không
        </Button>
        <Button
          className={`${nunito.className} bg-[--delete] text-white normal-case text-md`}
          placeholder={undefined}
          onClick={() => {
            router.push('/admin/news')
          }}>
          Hủy
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

export default function Page() {
  const [openCancelDialog, setOpenCancelDialog] = useState(false)
  const [roles, setRoles] = useState([])

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm()

  const onSubmit = (data) => {
    console.log(data)
  }

  useEffect(() => {
    // Fetch roles
  }, [])

  return (
    <div
      className={`${nunito.className} max-w-[1200px] w-[81.25%] h-fit m-auto bg-[#f7fafd] mt-8 rounded-lg`}>
      <Toaster
        containerStyle={{ zIndex: 99999 }}
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
      <header className="font-extrabold text-2xl h-16 py-3 px-8 bg-[var(--blue-02)] flex items-center text-white rounded-tl-lg rounded-tr-lg">
        Thông tin tài khoản
      </header>
      <div className="px-8 py-10 overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xl font-bold">Email</label>
            <Input
              size="lg"
              crossOrigin={undefined}
              variant="outlined"
              type="text"
              {...register('email', {
                required: 'Vui lòng nhập email',
                pattern: {
                  value:
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  message:
                    'Hãy nhập đúng định dạng email. Ví dụ: test@gmail.com',
                },
              })}
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
            />
            <ErrorInput
              // This is the error message
              errors={errors?.email?.message}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xl font-bold">Họ tên</label>
            <Input
              size="lg"
              crossOrigin={undefined}
              variant="outlined"
              type="text"
              {...register('fullName', {
                required: 'Vui lòng nhập họ tên',
              })}
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
            />
            <ErrorInput
              // This is the error message
              errors={errors?.fullName?.message}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xl font-bold">Vai trò</label>
            <select
              className="h-full hover:cursor-pointer pl-3 w-fit text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 p-3 rounded-md border-blue-gray-200 focus:border-gray-900"
              {...register('roleId', {
                required: 'Vui lòng chọn vai trò',
              })}>
              <option value="">Không</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            <ErrorInput
              // This is the error message
              errors={errors?.roleId?.message}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xl font-bold text-red-500">
              Mật khẩu sẽ được tạo ngẫu nhiên và được gửi đến mail người dùng.
              <br />
              Người dùng đăng nhập lần đầu sẽ được yêu cầu đổi mật khẩu.
            </label>
          </div>
          <div className="flex justify-end gap-x-4 pt-6 ">
            <Button
              placeholder={undefined}
              size="lg"
              type="submit"
              className={`${nunito.className} bg-[var(--blue-05)] normal-case text-md`}>
              Cấp tài khoản
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
