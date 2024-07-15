'use client'
import React, { useEffect, useRef, useState } from 'react'
import { roboto, nunito } from '@/app/ui/fonts'

import { Input, Switch, Button } from '@material-tailwind/react'
import { useRouter } from 'next/navigation'
import { JWT_COOKIE } from '@/app/constant'
import axios from 'axios'
import Cookies from 'js-cookie'
import CancelChangesDialog from '@/app/ui/admin/common/CancelChangesDialog'
import { Controller, useForm } from 'react-hook-form'
import ErrorInput from '@/app/ui/error-input'
import NotFound404 from '@/app/ui/common/not-found-404'
import toast from 'react-hot-toast'

export default function Page({ params }: { params: { id: string } }) {
  const [user, setUser] = useState(null)
  const [roles, setRoles] = useState([])
  const [userRoles, setUserRoles] = useState<Set<number>>()
  const [openCancelChangesDialog, setOpenCancelChangesDialog] = useState(false)
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const handleOpenCancelChangesDialog = () => {
    setOpenCancelChangesDialog((prev) => !prev)
  }
  const toogleRole = (id: number) => {
    const set = new Set(userRoles)
    if (set.has(id)) set.delete(id)
    else set.add(id)
    setUserRoles(set)
  }

  const onSubmit = (event) => {
    event.preventDefault()

    const body = {
      roleIds : Array.from(userRoles).join(',')
    }

    axios
      .putForm(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/${params.id}/role`,
        body,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(() => {
        toast.success('Cập nhật thành công')
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.error?.message || 'Lỗi không xác định'
        )
      })
  }

  useEffect(() => {
    const rolesPromise = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/roles?pageSize=50`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
    const userPromise = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/${params.id}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )

    Promise.all([rolesPromise, userPromise])
      .then(([rolesRes, userRes]) => {
        const {
          data: { roles },
        } = rolesRes
        const {
          data: { user },
        } = userRes

        setUser(user)
        setRoles(roles)

        const set = new Set<number>()
        user.roles.forEach((role) => set.add(role.id))
        setUserRoles(set)

        setIsLoading(false)
      })
      .catch((err) => {
        return setNotFound(true)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (notFound) return <NotFound404 />

  if (!isLoading)
    return (
      <div
        className={`${nunito.className} max-w-[1200px] w-[81.25%] h-fit m-auto bg-[#f7fafd] mt-8 rounded-lg`}>
        
        <>
          <header className="font-extrabold text-2xl h-16 py-3 px-8 bg-[var(--blue-02)] flex items-center text-white rounded-tl-lg rounded-tr-lg">
            Thông tin chi tiết
          </header>
          <form
            onSubmit={(e) => onSubmit(e)}
            className="px-8 py-10 overflow-y-auto">
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
                <div key={id} className="font-semibold w-full ">
                  <Switch
                    className="checked:bg-[var(--blue-02)]"
                    circleProps={{
                      className: 'peer-checked:border-[var(--blue-02)]',
                    }}
                    labelProps={{
                      className: 'text-black font-normal',
                    }}
                    crossOrigin={undefined}
                    checked={userRoles.has(id)}
                    onChange={() => toogleRole(id)}
                    label={name}
                  />
                </div>
              ))}
              {userRoles.size === 0 && (
                <ErrorInput errors={`Người dùng phải có ít nhất 1 vai trò`} />
              )}
            </div>
            <div className="flex justify-end gap-x-4 pt-6 ">
              <Button
                onClick={handleOpenCancelChangesDialog}
                placeholder={undefined}
                size="lg"
                className={`${nunito.className} bg-[--delete-filter] text-black normal-case text-md`}>
                Hủy
              </Button>
              <CancelChangesDialog
                open={openCancelChangesDialog}
                handleOpen={handleOpenCancelChangesDialog}
                backUrl={'/admin/users'}
              />

              <Button
                disabled={userRoles.size === 0}
                placeholder={undefined}
                size="lg"
                type="submit"
                className={`${nunito.className} bg-[var(--blue-05)] normal-case text-md`}>
                Cập nhật
              </Button>
            </div>
          </form>
        </>
      </div>
    )
}
