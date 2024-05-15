'use client'
import React from 'react'
import { FACULTIES, TAGS } from '../../../constant'
import { Button, Input } from '@material-tailwind/react'
import { useForm } from 'react-hook-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons'

interface SearchAndFilterFacultyProps {
  name: string
  onFilterTag: (tagsId: string) => void
  onSearch: (keyword: string) => void
  onFilter: (facultyId: string) => void
  onResetFilter: () => void
  params: {
    title: string | null
    facultyId: string | null
    tagsId: string | null
  }
}

export default function SearchAndFilterFaculty({
  name,
  onSearch,
  onFilter,
  onResetFilter,
  onFilterTag,
  params,
}: SearchAndFilterFacultyProps) {
  const { register, reset } = useForm({
    defaultValues: {
      title: params.title,
      tagsId: params.tagsId || 0,
      facultyId: params.facultyId || 0,
    },
  })

  return (
    <div className="flex items-end gap-4 w-fit ml-5 lg:ml-0">
      <div className="flex flex-col gap-2">
        <p className="font-semibold text-md">Tìm kiếm {name}</p>
        <Input
          size="lg"
          crossOrigin={undefined}
          placeholder={undefined}
          containerProps={{ className: '!w-[500px]' }}
          {...register('title', {
            onChange: (e) => onSearch(e.target.value),
          })}
          labelProps={{
            className: 'before:content-none after:content-none',
          }}
          className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
        />
      </div>

      <div className="flex items-end gap-4">
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-md">Khoa</p>
          <select
            className="h-[2.8rem] hover:cursor-pointer pl-3 w-fit text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 rounded-md border-blue-gray-200 focus:border-gray-900"
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
            reset({ facultyId: 0 })
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
