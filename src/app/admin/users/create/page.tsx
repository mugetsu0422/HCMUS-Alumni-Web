'use client'

import React, { useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie'
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Checkbox,
} from '@material-tailwind/react'
import { useRouter } from 'next/router'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import ErrorInput from '../../../ui/error-input'
import { nunito } from '../../../ui/fonts'
import axios from 'axios'
import { JWT_COOKIE } from '../../../constant'
import CustomToaster from '@/app/ui/common/custom-toaster'

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
  const [selectedRoles, setSelectedRoles] = useState(new Set())

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onClickRoleCheckbox = (roleId: number) => {
    if (selectedRoles.has(roleId)) {
      selectedRoles.delete(roleId)
    } else {
      selectedRoles.add(roleId)
    }
  }

  const onSubmit = (data) => {
    const user = {
      email: data.email,
      fullName: data.fullName,
      roles: Array.from(selectedRoles).map((roleId) => ({ id: roleId })),
    }

    axios
      .post(`${process.env.NEXT_PUBLIC_SERVER_HOST}/user`, user, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then((data) => {
        toast.success('Cấp tài khoản thành công')
      })
      .catch((error) => {
        toast.error(error.response.data.error.message || 'Lỗi không xác định')
      })
  }

  useEffect(() => {
    // Fetch roles
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/roles?pageSize=50`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then(({ data: { totalPages, roles } }) => {
        setRoles(roles)
      })
      .catch((error) => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className={`${nunito.className} max-w-[1200px] w-[81.25%] h-fit m-auto bg-[#f7fafd] mt-8 rounded-lg`}>
      <CustomToaster />
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
            {roles.map((role, index) => (
              <div key={role.id} className="flex items-center mb-2">
                <Checkbox
                  crossOrigin={undefined}
                  type="checkbox"
                  className="shadow appearance-none border rounded w-5 h-5 leading-tight focus:outline-none focus:shadow-outline"
                  label={role.name}
                  value={role.id}
                  onChange={(e) => onClickRoleCheckbox(role.id)}
                  labelProps={{ className: 'text-black' }}
                />
              </div>
            ))}
            <Controller
              name="dummy"
              control={control}
              render={() => <input type="text" className="hidden" />}
              rules={{
                validate: {
                  checkRoleCheckboxGroup: () => {
                    if (selectedRoles.size === 0) {
                      return 'Vui lòng chọn ít nhất 1 vai trò'
                    }
                    return true
                  },
                },
              }}
            />

            <ErrorInput
              // This is the error message
              errors={errors?.dummy?.message}
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
