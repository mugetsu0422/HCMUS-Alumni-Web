'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import Cookies from 'js-cookie'
import { Button, Input, Checkbox } from '@material-tailwind/react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import ErrorInput from '../../ui/error-input'
import { roboto } from '../../ui/fonts'
import axios, { AxiosResponse } from 'axios'
import { JWT_COOKIE, USER_GROUP_STATUS } from '../../constant'
import CustomToaster from '@/app/ui/common/custom-toaster'
import SortHeader from '@/app/ui/admin/user/sort-header'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowCounterclockwise, Search } from 'react-bootstrap-icons'
import { useDebouncedCallback } from 'use-debounce'
import UserListItem from '@/app/ui/admin/user/user-list-item'
import FilterAdminUser from '@/app/ui/admin/user/filter-admin-user'
import Pagination from '@/app/ui/common/pagination'

interface FunctionSectionProps {
  onSearch: (keyword: string) => void
  onFilterRole: (keyword: string) => void
  onResetAll: () => void
  roles: any[]
}

function FuntionSection({
  onSearch,
  onResetAll,
  onFilterRole,
  roles,
}: FunctionSectionProps) {
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const { register, reset } = useForm({
    defaultValues: {
      fullName: params.get('fullName'),
    },
  })

  return (
    <div className="my-5 w-full max-w-[1220px] justify-between flex items-end gap-5 m-auto">
      <div className="w-[1000px] flex gap-5 justify-start">
        <div className="h-full w-full mr-auto flex flex-col gap-2">
          <p className="font-semibold text-md">Tìm kiếm người dùng</p>

          <Input
            crossOrigin={undefined}
            placeholder={undefined}
            icon={<Search />}
            defaultValue={params.get('fullName')}
            {...register('fullName', {
              onChange: (e) => onSearch(e.target.value),
            })}
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
            containerProps={{
              className: 'h-[50px]',
            }}
            className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
          />
        </div>

        <FilterAdminUser
          onFilterRole={onFilterRole}
          roles={roles}
          params={{
            roleIds: params.get('roleIds'),
          }}
        />
      </div>

      <Button
        onClick={() => {
          onResetAll()
          reset()
        }}
        placeholder={undefined}
        className="rounded-full p-3 h-full font-bold normal-case text-base min-w-fit bg-[#E4E4E7]">
        <ArrowCounterclockwise className="text-2xl font-bold text-[#3F3F46]" />
      </Button>
    </div>
  )
}

export default function Page() {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)

  const [myParams, setMyParams] = useState(`?${params.toString()}`)
  const [curPage, setCurPage] = useState(Number(params.get('page')) + 1 || 1)
  const [totalPages, setTotalPages] = useState(1)
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const resetCurPage = () => {
    params.delete('page')
    setCurPage(1)
  }
  const onSearch = useDebouncedCallback((keyword) => {
    if (keyword) {
      params.set('fullName', keyword)
    } else {
      params.delete('fullName')
    }
    resetCurPage()
    replace(`${pathname}?${params.toString()}`)
    setMyParams(`?${params.toString()}`)
  }, 500)
  const onResetAll = () => {
    resetCurPage()
    replace(pathname)
    setMyParams(``)
  }
  const onNextPage = () => {
    if (curPage == totalPages) return
    params.set('page', curPage.toString())
    replace(`${pathname}?${params.toString()}`)
    setMyParams(`?${params.toString()}`)
    setCurPage((curPage) => {
      return curPage + 1
    })
  }
  const onPrevPage = () => {
    if (curPage == 1) return
    params.set('page', (curPage - 2).toString())
    replace(`${pathname}?${params.toString()}`)
    setMyParams(`?${params.toString()}`)
    setCurPage((curPage) => {
      return curPage - 1
    })
  }
  const onOrder = (name: string, order: string) => {
    params.delete('page')
    setCurPage(1)
    params.set('orderBy', name)
    params.set('order', order)
    replace(`${pathname}?${params.toString()}`)
    setMyParams(`?${params.toString()}`)
  }
  const onFilterRole = (roleIds: string) => {
    if (roleIds != '0') {
      params.set('roleIds', roleIds)
    } else {
      params.delete('roleIds')
    }
    resetCurPage()
    replace(`${pathname}?${params.toString()}`)
    setMyParams(`?${params.toString()}`)
  }

  const onLockUser = (userId: string): Promise<AxiosResponse<any, any>> => {
    return axios.putForm(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/${userId}/status`,
      { statusId: USER_GROUP_STATUS['Khóa'] },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
  }
  const onUnlockUser = (userId: string): Promise<AxiosResponse<any, any>> => {
    return axios.putForm(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/${userId}/status`,
      { statusId: USER_GROUP_STATUS['Bình thường'] },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
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

    const usersPromise = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/user${myParams}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )

    Promise.all([rolesPromise, usersPromise])
      .then(([rolesRes, usersRes]) => {
        const {
          data: { roles },
        } = rolesRes
        const {
          data: { totalPages, users },
        } = usersRes

        setTotalPages(totalPages)
        setUsers(users)
        setRoles(roles)
        setIsLoading(false)
      })
      .catch((err) => {})
  }, [myParams])

  if (!isLoading)
    return (
      <div className="flex flex-col sm:justify-center lg:justify-start m-auto max-w-[90%] w-[1000px] mt-[3vw]">
        
        <p
          className={`${roboto.className} mx-auto w-full max-w-[1220px] text-3xl font-bold text-[var(--blue-01)]`}>
          Quản lý người dùng
        </p>

        <FuntionSection
          onSearch={onSearch}
          onResetAll={onResetAll}
          onFilterRole={onFilterRole}
          roles={roles}
        />

        <div className="overflow-x-auto">
          <SortHeader onOrder={onOrder} />
          <div className="relative mb-10">
            {users.map((user) => (
              <UserListItem
                key={user.id}
                user={user}
                onLockUser={onLockUser}
                onUnlockUser={onUnlockUser}
              />
            ))}
          </div>
        </div>

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            curPage={curPage}
            onNextPage={onNextPage}
            onPrevPage={onPrevPage}
          />
        )}
      </div>
    )
}
