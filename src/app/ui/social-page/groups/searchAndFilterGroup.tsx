'use client'

import { Input } from '@material-tailwind/react'
import React from 'react'

const filterPrivacy = [
  { id: '1', name: 'Public' },
  { id: '2', name: 'Private' },
]
const filterIsJoined = [
  { id: '1', name: true },
  { id: '2', name: false },
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
          size="lg"
          crossOrigin={undefined}
          placeholder={undefined}
          containerProps={{ className: '!w-[500px]' }}
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
        <p className="font-semibold text-md">Sự riêng tư</p>
        <select
          className="h-[2.8rem] hover:cursor-pointer pl-3 w-fit text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 rounded-md border-blue-gray-200 focus:border-gray-900"
          // {...register('facultyId', {
          //   onChange: (e) => onFilter(e.target.value),
          // })}
        >
          <option value={0}>Tất cả</option>
          {filterPrivacy.map(({ id, name }) => {
            return (
              <option key={id} value={id}>
                {name == 'Public' ? 'Công khai' : 'Nhóm kín'}
              </option>
            )
          })}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-semibold text-md">Nhóm của tôi</p>
        <select
          className="h-[2.8rem] hover:cursor-pointer pl-3 w-fit text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 rounded-md border-blue-gray-200 focus:border-gray-900"
          // {...register('facultyId', {
          //   onChange: (e) => onFilter(e.target.value),
          // })}
        >
          <option value={0}>Tất cả</option>
          {filterIsJoined.map(({ id, name }) => {
            return (
              <option key={id} value={id}>
                {name ? 'Đã tham gia' : 'Khám phá'}
              </option>
            )
          })}
        </select>
      </div>
    </div>
  )
}
