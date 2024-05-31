'use client'

import React, { useState } from 'react'
import { Input, Select, Option, Button } from '@material-tailwind/react'
import { useForm } from 'react-hook-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons'

const filterPrivacy = [
  { id: '0', name: 'Tất cả', value: '' },
  { id: '1', name: 'Công khai', value: 'PUBLIC' },
  { id: '2', name: 'Nhóm kín', value: 'PRIVATE' },
]
const filterIsJoined = [
  { id: '0', name: 'Tất cả', value: '' },
  { id: '1', name: 'Đã tham gia', value: 'true' },
  { id: '2', name: 'Khám phá', value: 'false' },
]

interface SearchAndFilterGroupProps {
  onSearch: (keyword: string) => void
  onFilterPrivacy: (privacy: string) => void
  onFilterMyGroup: (privacy: string) => void
  onResetFilter: () => void
  params: {
    name: string | null
    privacy: string | null
    isJoined: string | null
  }
}

export default function SearchAndFilterGroups({
  onSearch,
  onFilterPrivacy,
  onResetFilter,
  onFilterMyGroup,
  params,
}: SearchAndFilterGroupProps) {
  const { register, reset } = useForm({
    defaultValues: {
      name: params.name,
      privacy: params.privacy,
      isJoined: params.isJoined,
    },
  })

  const [valueIsJoined, setValueIsJoined] = React.useState('')

  return (
    <div className="flex items-end gap-4 w-full flex-wrap xl:flex-nowrap">
      <div className="flex flex-col gap-2 lg:basis-1/2">
        <p className="font-semibold text-md">Tìm kiếm nhóm</p>
        <Input
          crossOrigin={undefined}
          placeholder={undefined}
          //containerProps={{ className: 'max-w-[80%]' }}
          {...register('name', {
            onChange: (e) => onSearch(e.target.value),
          })}
          labelProps={{
            className: 'before:content-none after:content-none',
          }}
          className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900 "
        />
      </div>

      <div className="flex flex-col gap-2 w-[130px] xl:w-[150px]">
        <p className="font-semibold text-md">Quyền riêng tư</p>
        <Select
          placeholder={undefined}
          style={{
            position: 'relative',
          }}
          className="bg-white !border-blue-gray-200 focus:!border-gray-900 hover:cursor-pointer pl-3 text-black w-[130px] xl:w-[150px]"
          labelProps={{
            className: 'before:content-none after:content-none',
          }}
          onChange={(value) => {
            const event = { target: { value } }
            register('privacy').onChange(event)
            onFilterPrivacy(value)
          }}>
          {filterPrivacy.map(({ id, name, value }) => (
            <Option key={id} value={value} className="text-[14px]">
              {name}
            </Option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-2 w-[130px] xl:w-[150px]">
        <p className="font-semibold text-md">Nhóm của tôi</p>
        <Select
          placeholder={undefined}
          style={{
            position: 'relative',
          }}
          className="bg-white !border-blue-gray-200 focus:!border-gray-900 hover:cursor-pointer text-black w-[130px] xl:w-[150px]"
          labelProps={{
            className: 'before:content-none after:content-none',
          }}
          value={valueIsJoined}
          onChange={(value) => {
            const event = { target: { value } }
            register('isJoined').onChange(event)
            onFilterMyGroup(value)
            setValueIsJoined(value)
          }}>
          {filterIsJoined.map(({ id, name, value }) => {
            return (
              <Option key={id} value={value} className="text-[14px] text-black">
                {name}
              </Option>
            )
          })}
        </Select>
      </div>

      <Button
        onClick={() => {
          onResetFilter()
          setValueIsJoined('')
        }}
        placeholder={undefined}
        className="bg-[--blue-02] w-fit text-nowrap normal-case text-sm flex items-center gap-1">
        <p className="text-white">Xóa bộ lọc</p>
        <FontAwesomeIcon
          icon={faFilterCircleXmark}
          className="text-lg text-white"
        />
      </Button>
    </div>
  )
}
