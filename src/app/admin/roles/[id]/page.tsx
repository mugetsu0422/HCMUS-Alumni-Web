'use client'

import React, { useEffect, useState } from 'react'
import { CaretDownFill, XLg, CheckLg } from 'react-bootstrap-icons'
import { nunito, roboto } from '../../../ui/fonts'
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Switch,
  Textarea,
} from '@material-tailwind/react'
import axios from 'axios'
import { JWT_COOKIE } from '../../../constant'
import Cookies from 'js-cookie'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import ErrorInput from '../../../ui/error-input'
import { useRouter } from 'next/navigation'
import NotFound404 from '@/app/ui/common/not-found-404'

import CancelChangesDialog from '@/app/ui/admin/common/CancelChangesDialog'

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

export default function Page({ params }: { params: { id: string } }) {
  const [permissionCategories, setPermissionCategories] = useState([])
  const [selectedRolePermissionMap, setSelectedRolePermissionMap] =
    useState<Map<any, any>>()
  const [notFound, setNotFound] = useState(false)
  const [permissionHeaderVisibility, setPermissionHeaderVisibility] =
    useState(null)
  const [descriptionCharCount, setDescriptionCharCount] = useState(0)
  const descriptionMaxCharCount = 100
  const [openCancelDialog, setOpenCancelDialog] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  const handleOpenCancelDialog = () => {
    setOpenCancelDialog(!openCancelDialog)
  }
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

  const onSubmit = (data) => {
    const putToast = toast.loading('Đang cập nhật vai trò...')

    const updatedRole = {
      ...data,
      permissions: Array.from(selectedRolePermissionMap.entries())
        .filter(([_, value]) => value === true)
        .map(([permissionIndex, _]) => ({
          id: permissionIndex,
        })),
    }

    axios
      .put(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/roles/${params.id}`,
        updatedRole,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then((res) => {
        toast.success('Cập nhật vai trò thành công', {
          id: putToast,
        })
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.error?.message || 'Lỗi không xác định',
          {
            id: putToast,
          }
        )
      })
  }

  useEffect(() => {
    const rolePromise = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/roles/${params.id}`,
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

    Promise.all([rolePromise, permissionPromise])
      .then(
        ([
          { data: role },
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

          setValue('name', role.name)
          setValue('description', role.description)
          setDescriptionCharCount(role.description?.length || 0)
          const newMap = new Map(selectedRolePermissionMap)
          newMap.forEach((_, key, map) => map.set(key, false))
          role.permissions.forEach(({ id }) => {
            newMap.set(id, true)
          })
          setSelectedRolePermissionMap(newMap)
        }
      )
      .catch((err) => {
        console.error(err)
        return setNotFound(true)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (notFound) {
    return <NotFound404 />
  }
  return (
    <div
      className={`${nunito.className} max-w-[1200px] w-[81.25%] h-fit m-auto bg-[#f7fafd] mt-8 rounded-lg`}>
      
      <header className="font-extrabold text-2xl h-16 py-3 px-8 bg-[var(--blue-02)] flex items-center text-white rounded-tl-lg rounded-tr-lg">
        Thông tin chi tiết
      </header>
      <div className="px-8 py-10 overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xl font-bold">Tên vai trò</label>
            <Input
              size="lg"
              crossOrigin={undefined}
              variant="outlined"
              type="text"
              {...register('name', {
                required: 'Vui lòng nhập tên vai trò',
                pattern: {
                  value: /^[A-Za-z]+$/,
                  message:
                    'Tên vai trò chỉ chấp nhận các chữ cái không dấu và không khoảng trắng',
                },
              })}
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
            />
            <ErrorInput
              // This is the error message
              errors={errors?.name?.message}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="relative w-full text-xl font-bold">
              Mô tả
              <p className="absolute right-0 bottom-0 font-normal text-base">
                {descriptionCharCount}/{descriptionMaxCharCount}
              </p>
            </label>
            <Textarea
              maxLength={descriptionMaxCharCount}
              size="lg"
              variant="outlined"
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
              {...register('description', {
                onChange: (e) => setDescriptionCharCount(e.target.value.length),
              })}
            />
            <ErrorInput
              // This is the error message
              errors={errors?.description?.message}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xl font-bold">Quyền</label>
            <table className="table-auto w-full border-collapse border border-gray-400">
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
                            </td>
                          </tr>
                        )
                      )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-x-4 pt-6 ">
            <Button
              onClick={handleOpenCancelDialog}
              placeholder={undefined}
              size="lg"
              className={`${nunito.className} bg-[--delete-filter] text-black normal-case text-md`}>
              Hủy
            </Button>
            <CancelChangesDialog
              open={openCancelDialog}
              handleOpen={handleOpenCancelDialog}
              backUrl={'/admin/roles'}
            />
            <Button
              placeholder={undefined}
              size="lg"
              type="submit"
              className={`${nunito.className} bg-[var(--blue-05)] normal-case text-md`}>
              Cập nhật
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
