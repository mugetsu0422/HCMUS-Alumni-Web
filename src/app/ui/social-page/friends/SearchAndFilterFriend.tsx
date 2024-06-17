'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input } from '@material-tailwind/react'
import { FACULTIES } from '../../../constant'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons'

interface SearchAndFilterProps {
  onSearch: (keyword: string) => void
  onFilter: (facultyId: string) => void
  onFilterBeginningYear: (beginningYear: string) => void
  onResetFilter: () => void
  params: {
    name: string | null
    facultyId: string | null
    beginningYear: string | null
  }
}

export default function SearchAndFilterFriends({
  onSearch,
  onFilter,
  onFilterBeginningYear,
  onResetFilter,
  params,
}: SearchAndFilterProps) {
  const { register, reset, setValue } = useForm({
    defaultValues: {
      name: params.name,
      facultyId: params.facultyId || 0,
      beginningYear: params.beginningYear || null,
    },
  })

  return (
    <div className="flex gap-4 w-fit flex-wrap">
      <div className="h-fit w-full sm:!w-[350px] flex flex-col gap-2">
        <p className="font-semibold text-md">Tìm kiếm bạn bè</p>
        <Input
          size="lg"
          crossOrigin={undefined}
          placeholder={undefined}
          containerProps={{ className: 'h-[50px] w-full' }}
          labelProps={{
            className: 'before:content-none after:content-none',
          }}
          className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
          {...register('name', {
            onChange: (e) => onSearch(e.target.value),
          })}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-semibold text-md">Khoa</p>
        <select
          className="h-[50px] hover:cursor-pointer pl-3 w-fit text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 rounded-md border-blue-gray-200 focus:border-gray-900"
          {...register('facultyId', {
            onChange: (e) => onFilter(e.target.value),
          })}>
          <option value={0}>Tất cả</option>
          {FACULTIES.map(({ id, name }) => {
            return (
              <option key={id} value={id}>
                {name}
              </option>
            )
          })}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-semibold text-md">Khóa</p>
        <Input
          size="lg"
          crossOrigin={undefined}
          variant="outlined"
          type="number"
          {...register('beginningYear', {
            pattern: {
              value: /^\d{4}$/,
              message: 'Vui lòng nhập đúng 4 chữ số',
            },
          })}
          onInput={(e) => {
            const input = e.target as HTMLInputElement
            input.value = input.value.trim().slice(0, 4)
          }} //
          labelProps={{
            className: 'before:content-none after:content-none',
          }}
          containerProps={{
            className: 'h-[50px] !min-w-[100px] !w-[100px]',
          }}
          className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
        />
      </div>

      <div className="flex items-end">
        <Button
          onClick={() => {
            onResetFilter()
            reset({ facultyId: 0, beginningYear: null })
          }}
          placeholder={undefined}
          className="bg-[--blue-02] w-fit h-[50px] normal-case text-sm flex items-center gap-1">
          Xóa bộ lọc
          <FontAwesomeIcon icon={faFilterCircleXmark} className="text-lg" />
        </Button>
      </div>
    </div>
  )
}
