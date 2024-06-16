'use client'
import React, { useState } from 'react'
import { roboto, nunito } from '@/app/ui/fonts'
import CustomToaster from '@/app/ui/common/custom-toaster'
import { Input, Switch, Button } from '@material-tailwind/react'
import { useRouter } from 'next/navigation'

const user = {
  id: '1',
  fullName: 'Trương Samuel',
  email: 'tsamuel@gmail.com',
  permissions: [
    { id: '1', name: 'Đăng bài tư vấn' },
    { id: '2', name: 'Tham gia sự kiện' },
    { id: '3', name: 'Bình luận bài tư vấn' },
    { id: '4', name: 'Xem tin tức' },
    { id: '5', name: 'Bình luận tin tức' },
  ],
  status: { id: 1, name: 'Bình thường' },
  isLock: true,
}

const roles = [
  {
    id: 1,
    name: 'Admin',
  },
  {
    id: 2,
    name: 'Cựu sinh viên',
  },
  {
    id: 3,
    name: 'Khách vãng lai',
  },
  {
    id: 4,
    name: 'Quản lý khoa',
  },
]

export default function Page() {
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const router = useRouter()

  return (
    <div className="mt-10 mb-4 w-full max-w-[1000px] gap-5 m-auto bg-[#f7fafd] h-fit">
      <CustomToaster />
      {isInitialLoading && (
        <>
          <header
            className={`${roboto.className} mx-auto w-full max-w-[1000px] text-2xl h-16 py-3 px-8 font-bold text-[var(--blue-01)] bg-[var(--blue-02)] text-white rounded-tl-lg rounded-tr-lg`}>
            Chỉnh sửa vai trò người dùng
          </header>
          <form className="px-8 py-10 overflow-y-auto">
            <div className="flex flex-col gap-2 ">
              <label className="text-lg font-bold">Họ và tên</label>
              <Input
                size="lg"
                disabled
                crossOrigin={undefined}
                variant="outlined"
                type="text"
                value={user.fullName}
                labelProps={{
                  className: 'before:content-none after:content-none',
                }}
                className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
              />
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <label className="text-lg font-bold">Email</label>
              <Input
                size="lg"
                disabled
                crossOrigin={undefined}
                variant="outlined"
                value={user.email}
                type="text"
                labelProps={{
                  className: 'before:content-none after:content-none',
                }}
                className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
              />
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <label className="text-xl font-bold">Vai trò</label>
              {roles.map(({ id, name }) => (
                <tr key={id} className="text-base w-full">
                  <td className="font-semibold p-2 pl-6 w-full ">
                    <Switch
                      className="checked:bg-[var(--blue-02)]"
                      circleProps={{
                        className: 'peer-checked:border-[var(--blue-02)]',
                      }}
                      labelProps={{
                        className: 'text-black font-normal',
                      }}
                      crossOrigin={undefined}
                      //checked={selectedRolePermissionMap.get(permissionId)}
                      //onChange={() => toggleCheckbox(permissionId)}
                      label={name}
                    />
                  </td>
                </tr>
              ))}
            </div>
            <div className="flex justify-end gap-x-4 pt-6 ">
              <Button
                onClick={() => router.push('/admin/users')}
                placeholder={undefined}
                size="lg"
                className={`${nunito.className} bg-[--delete-filter] text-black normal-case text-md`}>
                Hủy
              </Button>

              <Button
                placeholder={undefined}
                size="lg"
                type="submit"
                className={`${nunito.className} bg-[var(--blue-05)] normal-case text-md`}>
                Cập nhật
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}
