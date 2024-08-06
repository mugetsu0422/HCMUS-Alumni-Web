'use client'
import React, { useEffect, useState } from 'react'
import SortHeader from '../../ui/admin/roles/sort-header'
import { Input, Button } from '@material-tailwind/react'
import { ArrowCounterclockwise, Search } from 'react-bootstrap-icons'
import { JWT_COOKIE } from '../../constant'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useDebouncedCallback } from 'use-debounce'
import { roboto } from '../../ui/fonts'
import { useForm } from 'react-hook-form'
import Pagination from '../../ui/common/pagination'
import FilterAdmin from '../../ui/common/filter'
import Link from 'next/link'
import RolesListItem from '../../ui/admin/roles/roles-list-item'
import useHasAnyPermission from '@/hooks/use-has-any-permission'

interface FunctionSectionProps {
  onSearch: (keyword: string) => void
  onResetAll: () => void
}

function FuntionSection({ onSearch, onResetAll }: FunctionSectionProps) {
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const hasAnyPermission = useHasAnyPermission(
    ['User.Role.Create'],
    Cookies.get('permissions') ? Cookies.get('permissions').split(',') : []
  )
  const { register, reset } = useForm({
    defaultValues: {
      name: params.get('name'),
    },
  })

  return (
    <div className="my-5 w-full max-w-[1220px] justify-between flex flex-wrap items-end gap-5 m-auto">
      <div className="w-[500px] flex gap-5 justify-start flex-wrap">
        <div className="h-full w-full mr-auto flex flex-col gap-2">
          <p className="font-semibold text-md">Tìm kiếm vai trò</p>

          <Input
            size="lg"
            crossOrigin={undefined}
            placeholder={undefined}
            icon={<Search />}
            defaultValue={params.get('name')}
            {...register('name', {
              onChange: (e) => onSearch(e.target.value),
            })}
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
            className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
          />
        </div>
      </div>
      <div className="flex gap-5">
    
          <Button
            disabled={!hasAnyPermission}
            placeholder={undefined}
            className="h-full font-bold normal-case text-base min-w-fit bg-[var(--blue-02)] text-white ">
            <Link href={'/admin/roles/create'}>
              Tạo mới
            </Link>
          </Button>
      

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
  const [roles, setRoles] = useState([])

  const resetCurPage = () => {
    params.delete('page')
    setCurPage(1)
  }
  const onSearch = useDebouncedCallback((keyword) => {
    if (keyword) {
      params.set('name', keyword)
    } else {
      params.delete('name')
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

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/roles${myParams}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then(({ data: { totalPages, roles } }) => {
        setTotalPages(totalPages)
        setRoles(roles)
      })
      .catch((error) => {})
  }, [myParams])

  return (
    <div className="flex flex-col sm:justify-center lg:justify-start m-auto max-w-[90%] mt-[3vw]">
      <p
        className={`${roboto.className} mx-auto w-full max-w-[1220px] text-3xl font-bold text-[var(--blue-01)]`}>
        Quản lý vai trò
      </p>
      <FuntionSection onSearch={onSearch} onResetAll={onResetAll} />

      <div className="overflow-x-auto">
        <SortHeader onOrder={onOrder} />
        <div className="relative mb-10">
          {roles.map((role) => (
            <RolesListItem key={role.id} role={role} />
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
