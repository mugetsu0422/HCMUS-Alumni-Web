'use client'

import React, { useState } from 'react'
import { Input, Select, Option, Button } from '@material-tailwind/react'
import { useForm } from 'react-hook-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons'

const filterPrivacy = [
  { id: '0', name: 'Tất cả', value: '0' },
  { id: '1', name: 'Công khai', value: 'PUBLIC' },
  { id: '2', name: 'Riêng tư', value: 'PRIVATE' },
]
const filterIsJoined = [
  { id: '0', name: 'Tất cả', value: '0' },
  { id: '1', name: 'Đã tham gia', value: 'true' },
  { id: '2', name: 'Chưa tham gia', value: 'false' },
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
    },
  })
  const [privacy, setPrivacy] = useState(params.privacy || '0')
  const [isJoined, setIsJoined] = useState(params.isJoined || '0')

  return (
    <div className="flex items-end gap-4 w-full flex-wrap xl:flex-nowrap">
      <div className="flex flex-col gap-2 lg:basis-1/2">
        <Input
          crossOrigin={undefined}
          placeholder={undefined}
          //containerProps={{ className: 'max-w-[80%]' }}
          label="Tìm kiếm nhóm"
          {...register('name', {
            onChange: (e) => onSearch(e.target.value),
          })}
        />
      </div>

      <div className="flex flex-col gap-2 w-[130px] xl:w-[150px]">
        <Select
          placeholder={undefined}
          label="Quyền riêng tư"
          className="text-black w-[130px] xl:w-[150px] relative"
          labelProps={{
            className: 'w-[130px] xl:w-[150px]',
          }}
          value={privacy}
          onChange={(value) => {
            setPrivacy(value)
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
        <Select
          placeholder={undefined}
          label="Trạng thái"
          className="text-black w-[130px] xl:w-[150px] relative"
          labelProps={{
            className: 'w-[130px] xl:w-[150px]',
          }}
          value={isJoined}
          onChange={(value) => {
            setIsJoined(value)
            onFilterMyGroup(value)
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
          setPrivacy('0')
          setIsJoined('0')
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
