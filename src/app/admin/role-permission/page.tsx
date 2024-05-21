'use client'

import React, { useEffect, useState } from 'react'
import { CaretDownFill, XLg, CheckLg } from 'react-bootstrap-icons'
import { nunito } from '../../ui/fonts'
import { Input } from '@material-tailwind/react'
import axios from 'axios'
import { JWT_COOKIE } from '../../constant'
import Cookies from 'js-cookie'
import toast, { Toaster } from 'react-hot-toast'

// All permissions in the system
const permissionCategories = [
  {
    category: 'Quản lý người dùng',
    permissions: [
      { id: 1, name: 'Tạo tài khoản' },
      { id: 2, name: 'Chỉnh sửa tài khoản (gồm khoá tài khoản)' },
      { id: 3, name: 'Xóa tài khoản' },
      { id: 4, name: 'Tạo vai trò mới' },
      {
        id: 5,
        name: 'Chỉnh sửa vai trò. Phân quyền (gán các quyền cụ thể cho từng vai trò)',
      },
      { id: 6, name: 'Xoá vai trò' },
      { id: 7, name: 'Xem danh sách xác thực cựu sinh viên' },
      { id: 8, name: 'Phê duyệt cựu sinh viên' },
      { id: 9, name: 'Gửi xác thực cựu sinh viên' },
    ],
  },
  {
    category: 'Quản lý tin tức',
    permissions: [
      { id: 10, name: 'Tạo/Lên lịch đăng tin tức' },
      { id: 11, name: 'Chỉnh sức tin tức (Bao gồm ẩn)' },
      { id: 12, name: 'Xóa tin tức' },
      { id: 13, name: 'Viết bình luận' },
      { id: 14, name: 'Xoá bình luận của tất cả mọi người' },
    ],
  },
  {
    category: 'Quản lý sự kiện',
    permissions: [
      { id: 15, name: 'Tạo sự kiện' },
      { id: 16, name: 'Chỉnh sửa sự kiện (Bao gồm ẩn)' },
      { id: 17, name: 'Xóa sự kiện' },
      { id: 18, name: 'Tham gia sự kiện' },
      { id: 19, name: 'Hủy tham gia sự kiện' },
      { id: 20, name: 'Viết bình luận' },
      { id: 21, name: 'Xoá bình luận của tất cả mọi người' },
    ],
  },
  {
    category: 'Quản lý Gương thành công',
    permissions: [
      { id: 22, name: 'Tạo bài viết Gương thành công' },
      { id: 23, name: 'Chỉnh sửa bài viết Gương thành công (Bao gồm ẩn)' },
      { id: 24, name: 'Xóa bài viết Gương thành công' },
    ],
  },
  {
    category: 'Quản lý Tư vấn/Cố vấn',
    permissions: [
      { id: 25, name: 'Tạo bài viết tư vấn/cố vấn' },
      { id: 26, name: 'Xóa bài viết tư vấn/cố vấn của tất cả mọi người' },
      { id: 27, name: 'Thả cảm xúc bài viết' },
      { id: 28, name: 'Viết bình luận' },
      {
        id: 29,
        name: 'Xoá bình luận của tất cả mọi người trên tất cả các post',
      },
    ],
  },
  {
    category: 'Quản lý Nhóm',
    permissions: [
      { id: 30, name: 'Tạo nhóm' },
      { id: 31, name: 'Xoá nhóm' },
    ],
  },
  {
    category: 'Quản lý Hồ sơ cá nhân',
    permissions: [
      { id: 32, name: 'Chỉnh sửa thông tin cá nhân/Thay đổi mật khẩu' },
    ],
  },
  {
    category: 'Quản lý Tin nhắn',
    permissions: [{ id: 33, name: 'Gửi/Nhận tin nhắn' }],
  },
]
const getTotalPermissionsCount = () => {
  let totalPermissionsCount = 0
  permissionCategories.forEach((category) => {
    totalPermissionsCount += category.permissions.length
  })
  return totalPermissionsCount
}

export default function Page() {
  const [roles, setRoles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  // Create a board which rows are roles and columns are permissions
  //          Permission 1  Permission 2  Permission 3
  // Role 1   true          false         true
  // Role 2   false         true          false
  const [board, setBoard] = useState(null)
  const [permissionHeaderVisibility, setPermissionHeaderVisibility] = useState(
    new Array(permissionCategories.length).fill(false)
  )

  const toggleCheckbox = (roleIndex: number, permissionIndex: number) => {
    const newBoard = [...board]
    newBoard[roleIndex][permissionIndex] = !newBoard[roleIndex][permissionIndex]
    setBoard(newBoard)
  }

  const toggleVisibility = (mainIndex: number) => {
    const newVisibility = [...permissionHeaderVisibility]
    newVisibility[mainIndex] = !newVisibility[mainIndex]
    setPermissionHeaderVisibility(newVisibility)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const putToast = toast.loading('Đang cập nhật quyền...')

    const updatedRoles = roles.map((role) => {
      return {
        id: role.id,
        name: role.name,
        permissions: board[role.id - 1]
          .map((val: boolean, idx: number) => {
            if (val) {
              return { id: idx + 1 }
            }
          })
          .filter((val: any) => val),
      }
    })

    axios
      .put(`${process.env.NEXT_PUBLIC_SERVER_HOST}/roles`, updatedRoles, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then((res) => {
        toast.success('Cập nhật quyền thành công', {
          id: putToast,
        })
      })
      .catch((err) => {
        console.error(err)
        toast.error('Có lỗi xảy ra', {
          id: putToast,
        })
      })

    // Do whatever you want with the selected values here
  }

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/roles`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then((res) => {
        setRoles(res.data.roles)

        const tempBoard = new Array(res.data.roles.length)
        const permissionsCount = getTotalPermissionsCount()
        for (let i = 0; i < tempBoard.length; i++) {
          tempBoard[i] = new Array(permissionsCount).fill(false)
        }
        for (const role of res.data.roles) {
          for (const permission of role.permissions) {
            tempBoard[role.id - 1][permission.id - 1] = true
          }
        }
        setBoard(tempBoard)

        setIsLoading(false)
      })
      .catch((err) => {
        console.log(err)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!isLoading)
    return (
      <div className={`${nunito.className} container mx-auto p-4 z-50`}>
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
        <table className="table-auto w-full border-collapse border border-gray-400">
          <thead className="sticky top-0">
            <tr>
              <th className="border border-gray-400 p-2 w-40 bg-[--blue-02] text-white">
                Quyền
              </th>
              {roles.map((role, index) => (
                <th
                  key={index}
                  className="border border-gray-400 p-2 w-40 bg-[--blue-02] text-white">
                  {role.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissionCategories.map((category, categoryIdx) => (
              <React.Fragment key={categoryIdx}>
                <tr
                  onClick={() => toggleVisibility(categoryIdx)}
                  className="cursor-pointer w-full">
                  <td
                    className="border border-gray-400 p-2 bg-[--blue-04] font-bold"
                    colSpan={roles.length + 1}>
                    <p className="flex items-center gap-1">
                      {category.category}
                      <CaretDownFill
                        className={
                          permissionHeaderVisibility[categoryIdx]
                            ? ''
                            : ' rotate-180'
                        }
                      />
                    </p>
                  </td>
                </tr>
                {permissionHeaderVisibility[categoryIdx] &&
                  category.permissions.map(
                    ({ name, id: permissionIndex }, subIndex) => (
                      <tr key={subIndex} className="text-base">
                        <td className="border font-semibold border-gray-400 p-2 pl-6 w-40 ">
                          {name}
                        </td>
                        {roles.map((role, roleIndex) => (
                          <td
                            key={roleIndex}
                            className="border border-gray-400 p-2 text-center w-40  ">
                            <label className="flex items-center justify-center cursor-pointer">
                              <input
                                type="checkbox"
                                value={board[roleIndex][permissionIndex - 1]}
                                onChange={() =>
                                  toggleCheckbox(roleIndex, permissionIndex - 1)
                                }
                                className="hidden"
                              />
                              <div
                                className={`w-6 h-6 rounded bg-white flex items-center justify-center`}>
                                {!board[roleIndex][permissionIndex - 1] ? (
                                  <XLg className="text-[#ee1b24] text-xl" />
                                ) : (
                                  <CheckLg className="text-[#03a751] text-xl" />
                                )}
                              </div>
                            </label>
                          </td>
                        ))}
                      </tr>
                    )
                  )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <form onSubmit={handleSubmit} className="flex justify-end">
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-[var(--blue-02)] text-white rounded font-bold text-xl">
            Lưu
          </button>
        </form>
      </div>
    )
}
