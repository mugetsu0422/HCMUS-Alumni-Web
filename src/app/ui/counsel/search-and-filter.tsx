'use client'
import React from 'react'
import { Button, Input } from '@material-tailwind/react'
import { useForm } from 'react-hook-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { TAGS } from '../../constant'

interface SearchAndFilterProps {
  onFilterTag: (tagsId: string) => void
  onSearch: (keyword: string) => void
  onResetFilter: () => void
  params: {
    title: string | null
    tagsId: string | null
  }
}

export default function SearchAndFilter({
  onSearch,
  onResetFilter,
  onFilterTag,
  params,
}: SearchAndFilterProps) {
  const { register, reset } = useForm({
    defaultValues: {
      title: params.title,
      tagsId: params.tagsId || 0,
    },
  })

  return (
    <div className="flex items-end gap-4 w-fit ml-5 lg:ml-0">
      <div className="flex flex-col gap-2">
        <p className="font-semibold text-md">Tìm kiếm</p>
        <Input
          size="lg"
          crossOrigin={undefined}
          placeholder={undefined}
          containerProps={{ className: '!w-[500px]' }}
          {...register('title', {
            onChange: (e) => onSearch(e.target.value),
          })}
          className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
          labelProps={{
            className: 'before:content-none after:content-none',
          }}
        />
      </div>

      <div className="flex items-end gap-4">
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-md">Thẻ</p>
          <select
            className="h-[2.8rem] hover:cursor-pointer pl-3 w-fit text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 rounded-md border-blue-gray-200 focus:border-gray-900"
            {...register('tagsId', {
              onChange: (e) => onFilterTag(e.target.value),
            })}>
            <option value={0}>Tất cả</option>
            {TAGS.map(({ value, label }) => {
              return (
                <option key={value} value={value}>
                  {label}
                </option>
              )
            })}
          </select>
        </div>

        <Button
          onClick={() => {
            onResetFilter()
            reset({ tagsId: 0 })
          }}
          placeholder={undefined}
          className="bg-[--blue-02] w-fit normal-case text-sm flex items-center gap-1">
          Xóa bộ lọc
          <FontAwesomeIcon icon={faFilterCircleXmark} className="text-lg" />
        </Button>
      </div>
    </div>
  )
}
