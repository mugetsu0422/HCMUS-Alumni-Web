'use client'

import { Input, Select, Option } from '@material-tailwind/react'
import React from 'react'

const filterPrivacy = [
  { id: '0', name: 'Tất cả' },
  { id: '1', name: 'Công khai' },
  { id: '2', name: 'Nhóm kín' },
]
const filterIsJoined = [
  { id: '0', name: 'Tất cả' },
  { id: '1', name: 'Đã tham gia' },
  { id: '2', name: 'Khám phá' },
]

export default function SearchAndFilterGroups() {
  // const onSearch = useDebouncedCallback((keyword) => {
  //   if (keyword) {
  //     params.set('name', keyword)
  //   } else {
  //     params.delete('name')
  //   }
  //   resetCurPage()
  //   replace(`${pathname}?${params.toString()}`, { scroll: false })
  //   setMyParams(`?${params.toString()}`)
  // }, 500)

  // const { register, reset } = useForm({
  //   defaultValues: {
  //     name: params.get('name'),
  //   },
  // })

  return (
    <div className="flex items-end gap-4">
      <div className="flex flex-col gap-2">
        <p className="font-semibold text-md">Tìm kiếm nhóm</p>
        <Input
          crossOrigin={undefined}
          placeholder={undefined}
          containerProps={{ className: '!w-[420px]' }}
          // {...register('name', {
          //   onChange: (e) => onSearch(e.target.value),
          // })}
          labelProps={{
            className: 'before:content-none after:content-none',
          }}
          className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-semibold text-md">Quyền riêng tư</p>
        <Select
          placeholder={undefined}
          className="bg-white !border-blue-gray-200 focus:!border-gray-900 hover:cursor-pointer pl-3 text-black"
          labelProps={{
            className: 'before:content-none after:content-none',
          }}
          // {...register('facultyId', {
          //   onChange: (e) => onFilter(e.target.value),
          // })}
        >
          {filterPrivacy.map(({ id, name }) => {
            return (
              <Option key={id} value={id} className="text-[14px]">
                {name}
              </Option>
            )
          })}
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-semibold text-md">Nhóm của tôi</p>
        <Select
          placeholder={undefined}
          className="bg-white !border-blue-gray-200 focus:!border-gray-900 hover:cursor-pointer pl-3 text-black"
          labelProps={{
            className: 'before:content-none after:content-none',
          }}
          // {...register('facultyId', {
          //   onChange: (e) => onFilter(e.target.value),
          // })}
        >
          {filterIsJoined.map(({ id, name }) => {
            return (
              <Option key={id} value={id} className="text-[14px]">
                {name}
              </Option>
            )
          })}
        </Select>
      </div>
    </div>
  )
}
