'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import Cookies from 'js-cookie'
import { Button, Input, Checkbox } from '@material-tailwind/react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import ErrorInput from '../../ui/error-input'
import { roboto } from '../../ui/fonts'
import axios from 'axios'
import { JWT_COOKIE } from '../../constant'
import CustomToaster from '@/app/ui/common/custom-toaster'
import SortHeader from '@/app/ui/admin/user/sort-header'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowCounterclockwise, Search } from 'react-bootstrap-icons'
import { useDebouncedCallback } from 'use-debounce'
import UserListItem from '@/app/ui/admin/user/user-list-item'
import FilterAdminUser from '@/app/ui/admin/user/filter-admin-user'

interface FunctionSectionProps {
  onSearch: (keyword: string) => void
  onFilterFaculties: (keyword: string) => void
  onResetAll: () => void
}

const users = [
  {
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
  },
  {
    id: '2',
    fullName: 'Huỳnh Cao Nguyên',
    email: 'hcnguyen@gmail.com',
    permissions: [
      { id: '1', name: 'Đăng bài tư vấn' },
      { id: '2', name: 'Tham gia sự kiện' },
      { id: '3', name: 'Bình luận bài tư vấn' },
      { id: '4', name: 'Xem tin tức' },
      { id: '5', name: 'Bình luận tin tức' },
    ],
    status: { id: 1, name: 'Bình thường' },
    isLock: false,
  },
  {
    id: '3',
    fullName: 'Trần Hồng Minh Phúc',
    email: 'thmphuc@gmail.com',
    permissions: [
      { id: '1', name: 'Đăng bài tư vấn' },
      { id: '2', name: 'Tham gia sự kiện' },
      { id: '3', name: 'Bình luận bài tư vấn' },
      { id: '4', name: 'Xem tin tức' },
      { id: '5', name: 'Bình luận tin tức' },
    ],
    status: { id: 1, name: 'Bình thường' },
    isLock: false,
  },
]

function FuntionSection({
  onSearch,
  onResetAll,
  onFilterFaculties,
}: FunctionSectionProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const { register, reset } = useForm({
    defaultValues: {
      title: params.get('title'),
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
            defaultValue={params.get('title')}
            {...register('title', {
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
          onFilterFaculties={onFilterFaculties}
          params={{
            facultyId: params.get('facultyId'),
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
  const [openCancelDialog, setOpenCancelDialog] = useState(false)
  const [roles, setRoles] = useState([])
  const [selectedRoles, setSelectedRoles] = useState(new Set())
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const [curPage, setCurPage] = useState(Number(params.get('page')) + 1 || 1)
  const [myParams, setMyParams] = useState(`?${params.toString()}`)
  const [selectedTags, setSelectedTags] = useState(() => {
    const tagNames = params.get('tagNames')
    if (!tagNames) return []
    return tagNames.split(',').map((tag) => ({ value: tag, label: tag }))
  })

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const resetCurPage = () => {
    params.delete('page')
    setCurPage(1)
  }
  const onSearch = useDebouncedCallback((keyword) => {
    if (keyword) {
      params.set('title', keyword)
    } else {
      params.delete('title')
    }
    resetCurPage()
    replace(`${pathname}?${params.toString()}`)
    setMyParams(`?${params.toString()}`)
  }, 500)

  const onResetAll = () => {
    resetCurPage()
    replace(pathname)
    setSelectedTags([])
    setMyParams(``)
  }

  const onFilterFaculties = (facultyId: string) => {
    if (facultyId != '0') {
      params.set('facultyId', facultyId)
    } else {
      params.delete('facultyId')
    }
    resetCurPage()
    replace(`${pathname}?${params.toString()}`)
    setMyParams(`?${params.toString()}`)
  }
  const onAddTags = useCallback(
    (newTag) => {
      const newTags = [...selectedTags, newTag]
      setSelectedTags(newTags)
      params.set('tagNames', newTags.map(({ value }) => value).join(','))
      resetCurPage()
      replace(`${pathname}?${params.toString()}`, { scroll: false })
      setMyParams(`?${params.toString()}`)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedTags]
  )
  const onDeleteTags = useCallback(
    (tagIndex) => {
      const newTags = selectedTags.filter((_, i) => i !== tagIndex)
      setSelectedTags(newTags)
      if (newTags.length == 0) {
        params.delete('tagNames')
      } else {
        params.set('tagNames', newTags.map(({ value }) => value).join(','))
      }
      resetCurPage()
      replace(`${pathname}?${params.toString()}`, { scroll: false })
      setMyParams(`?${params.toString()}`)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedTags]
  )

  //-------------

  const onClickRoleCheckbox = (roleId: number) => {
    if (selectedRoles.has(roleId)) {
      selectedRoles.delete(roleId)
    } else {
      selectedRoles.add(roleId)
    }
  }

  const onOrder = (name: string, order: string) => {
    params.delete('page')
    setCurPage(1)
    params.set('orderBy', name)
    params.set('order', order)
    replace(`${pathname}?${params.toString()}`)
    setMyParams(`?${params.toString()}`)
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
        toast.error(error.response?.data?.error?.message || 'Lỗi không xác định')
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
    <div className="flex flex-col sm:justify-center lg:justify-start m-auto max-w-[90%] w-[1000px] mt-[3vw]">
      <CustomToaster />
      <p
        className={`${roboto.className} mx-auto w-full max-w-[1220px] text-3xl font-bold text-[var(--blue-01)]`}>
        Quản lý người dùng
      </p>

      <FuntionSection
        onSearch={onSearch}
        onResetAll={onResetAll}
        onFilterFaculties={onFilterFaculties}
      />

      <div className="overflow-x-auto">
        <SortHeader onOrder={onOrder} />
        <div className="relative mb-10">
          {users.map(({ id, fullName, email, permissions, isLock }) => (
            <UserListItem
              key={id}
              id={id}
              fullName={fullName}
              email={email}
              permissions={permissions}
              isLock={isLock}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
