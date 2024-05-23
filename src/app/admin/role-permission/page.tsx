'use client'

import React, { useEffect, useState } from 'react'
import { CaretDownFill, XLg, CheckLg } from 'react-bootstrap-icons'
import { nunito, roboto } from '../../ui/fonts'
import { Button, Input, Switch } from '@material-tailwind/react'
import axios from 'axios'
import { JWT_COOKIE } from '../../constant'
import Cookies from 'js-cookie'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'

// All permissions in the system
const a = [
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
  a.forEach((category) => {
    totalPermissionsCount += category.permissions.length
  })
  return totalPermissionsCount
}

const roleNameToCategoryName = (roleName) => {
  switch (roleName) {
    case 'User':
      return 'Quản lý người dùng'
    case 'AlumniVerify':
      return 'Quản lý xác thực cựu sinh viên'
    case 'News':
      return 'Quản lý tin tức'
    case 'Event':
      return 'Quản lý sự kiện'
    case 'Hof':
      return 'Quản lý Gương thành công'
    case 'Counsel':
      return 'Quản lý Tư vấn/Cố vấn'
    case 'Group':
      return 'Quản lý Nhóm'
    case 'Profile':
      return 'Quản lý Hồ sơ cá nhân'
    case 'Message':
      return 'Quản lý Tin nhắn'
    default:
      return null
  }
}

export default function Page() {
  const [permissionCategories, setPermissionCategories] = useState([])
  const [allRoles, setAllRoles] = useState([])
  const [selectedRoleId, setSelectedRoleId] = useState(0)
  const [selectedRole, setSelectedRole] = useState(null)
  const [selectedRolePermissionMap, setSelectedRolePermissionMap] =
    useState<Map<any, any>>()
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [permissionHeaderVisibility, setPermissionHeaderVisibility] =
    useState(null)

  const toggleCheckbox = (permissionIndex: number) => {
    const newMap = new Map(selectedRolePermissionMap)
    newMap.set(permissionIndex, !newMap.get(permissionIndex))
    setSelectedRolePermissionMap(newMap)
  }

  const toggleVisibility = (mainIndex: number) => {
    const newVisibility = [...permissionHeaderVisibility]
    newVisibility[mainIndex] = !newVisibility[mainIndex]
    setPermissionHeaderVisibility(newVisibility)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const putToast = toast.loading('Đang cập nhật quyền...')

    const updatedRoles = {
      ...selectedRole,
      permissions: Array.from(selectedRolePermissionMap.entries())
        .filter(([_, value]) => value === true)
        .map(([permissionIndex, _]) => ({
          id: permissionIndex,
        })),
    }

    axios
      .put(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/roles/${selectedRoleId}`,
        updatedRoles,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
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
  }

  useEffect(() => {
    const allRolesPromise = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/roles`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )

    const permissionPromise = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/roles/permissions`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )

    Promise.all([allRolesPromise, permissionPromise])
      .then(
        ([
          {
            data: { roles },
          },
          {
            data: { permissions },
          },
        ]) => {
          // Split the permissions into categories based on their names
          const splitPermissions = (permissions) => {
            const permissionMap = new Map()
            for (const permission of permissions) {
              const name = permission.name.split('.')[0]
              let categoryName = roleNameToCategoryName(name)

              // If the category already exists in the map, add the permission to it
              if (permissionMap.has(categoryName)) {
                permissionMap.get(categoryName).push(permission)
              } else {
                // If the category doesn't exist, create a new entry in the map
                permissionMap.set(categoryName, [permission])
              }
            }
            return permissionMap
          }

          const rolePermissionMap = new Map()
          permissions.forEach((permission) => {
            rolePermissionMap.set(permission.id, false)
          })
          setSelectedRolePermissionMap(rolePermissionMap)

          // Split the permissions into categories and update the state
          const permissionMap = splitPermissions(permissions)
          const permissionCategories = []
          permissionMap.forEach((val, key) => {
            permissionCategories.push({
              category: key,
              permissions: val,
            })
          })
          setPermissionCategories(permissionCategories)
          setPermissionHeaderVisibility(
            new Array(permissionCategories.length).fill(true)
          )

          setAllRoles(roles)

          // Set the loading state to false
          setIsInitialLoading(false)
        }
      )
      .catch((err) => {
        console.error(err)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!selectedRoleId) return

    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/roles/${selectedRoleId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then(({ data }) => {
        setSelectedRole(data)

        const newMap = new Map(selectedRolePermissionMap)
        newMap.forEach((_, key, map) => map.set(key, false))
        data.permissions.forEach(({ id }) => {
          newMap.set(id, true)
        })
        setSelectedRolePermissionMap(newMap)
      })
      .catch((err) => {
        console.error(err)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoleId])

  if (!isInitialLoading)
    return (
      <div
        className={`${nunito.className} container flex flex-col gap-5 mx-auto px-8 my-[3vw]`}>
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
        <p
          className={`${roboto.className} mx-auto w-full text-3xl font-bold text-[var(--blue-01)]`}>
          Quản lý vai trò
        </p>
        <div className="flex gap-5 h-[2.8rem]">
          <div>
            <label
              htmlFor="criteria"
              className="font-semibold self-center pr-3">
              Vai trò
            </label>
            <select
              className="h-full hover:cursor-pointer pl-3 w-fit text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 rounded-md border-blue-gray-200 focus:border-gray-900"
              onChange={(e) => setSelectedRoleId(parseInt(e.target.value))}>
              <option value="0">Không</option>
              {allRoles.map(({ id, name }) => {
                return (
                  <option key={id} value={id}>
                    {name}
                  </option>
                )
              })}
            </select>
          </div>

          <Link href={'/admin/role-permission/create'}>
            <Button
              placeholder={undefined}
              className="h-full font-bold normal-case text-base min-w-fit bg-[var(--blue-02)] text-white ">
              Tạo mới
            </Button>
          </Link>
        </div>
        <table className="table-auto w-full border-collapse border border-gray-400">
          <thead className="">
            <tr>
              <th className="border border-gray-400 p-2 w-40 bg-[--blue-02] text-white">
                Quyền
              </th>
            </tr>
          </thead>
          <tbody>
            {permissionCategories.map((category, categoryIdx) => (
              <React.Fragment key={categoryIdx}>
                <tr
                  onClick={() => toggleVisibility(categoryIdx)}
                  className="cursor-pointer w-full">
                  <td className="border border-gray-400 p-2 bg-[--blue-04] font-bold">
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
                    ({ description, id: permissionId }, subIndex) => (
                      <tr key={subIndex} className="text-base">
                        <td className="border font-semibold border-gray-400 p-2 pl-6 w-40 ">
                          {selectedRole ? (
                            <Switch
                              className="checked:bg-[var(--blue-02)]"
                              circleProps={{
                                className:
                                  'peer-checked:border-[var(--blue-02)]',
                              }}
                              labelProps={{
                                className: 'text-black font-normal',
                              }}
                              crossOrigin={undefined}
                              checked={selectedRolePermissionMap.get(
                                permissionId
                              )}
                              onChange={() => toggleCheckbox(permissionId)}
                              label={description}
                            />
                          ) : (
                            <p>{description}</p>
                          )}
                        </td>
                      </tr>
                    )
                  )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <form onSubmit={handleSubmit} className="flex justify-end">
          <Button
            disabled={!selectedRole}
            placeholder={undefined}
            size="lg"
            type="submit"
            className={`${nunito.className} bg-[var(--blue-05)] normal-case text-md`}>
            Lưu
          </Button>
        </form>
      </div>
    )
}
