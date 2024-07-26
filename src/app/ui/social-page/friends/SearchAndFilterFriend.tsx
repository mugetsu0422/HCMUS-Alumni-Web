'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input } from '@material-tailwind/react'
import { FACULTIES } from '../../../constant'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons'

interface SearchAndFilterProps {
  onSearch: (keyword: string) => void

  params: {
    fullName: string | null
  }
}

export default function SearchAndFilterFriends({
  onSearch,

  params,
}: SearchAndFilterProps) {
  const { register } = useForm({
    defaultValues: {
      fullName: params.fullName,
    },
  })

  return (
    <div className="flex gap-4 flex-wrap w-full">
      <div className="h-fit w-full flex flex-col gap-2">
        <p className="font-semibold text-md">Tìm kiếm</p>
        <Input
          size="lg"
          crossOrigin={undefined}
          placeholder={undefined}
          containerProps={{ className: 'h-[50px] w-full' }}
          labelProps={{
            className: 'before:content-none after:content-none',
          }}
          className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
          {...register('fullName', {
            onChange: (e) => onSearch(e.target.value),
          })}
        />
      </div>
    </div>
  )
}
