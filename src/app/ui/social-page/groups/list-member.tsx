'use client'
import React, { useState } from 'react'
import { Input, Avatar } from '@material-tailwind/react'
import { Search, Dot } from 'react-bootstrap-icons'

const admingroups = [
  {
    id: '1',
    fullName: 'Trương Sammuel',
    avararUrl: '/demo.jpg',
  },
  {
    id: '2',
    fullName: 'Đặng Nguyễn Duy',
    avararUrl: '/demo.jpg',
  },
  {
    id: '3',
    fullName: 'Huỳnh Cao Nguyên',
    avararUrl: '/demo.jpg',
  },
]

const members = [
  {
    id: '1',
    fullName: 'Trương Sammuel',
    avararUrl: '/demo.jpg',
  },
  {
    id: '2',
    fullName: 'Đặng Nguyễn Duy',
    avararUrl: '/demo.jpg',
  },
  {
    id: '3',
    fullName: 'Huỳnh Cao Nguyên',
    avararUrl: '/demo.jpg',
  },
  {
    id: '4',
    fullName: 'Trương Sammuel',
    avararUrl: '/demo.jpg',
  },
  {
    id: '5',
    fullName: 'Đặng Nguyễn Duy',
    avararUrl: '/demo.jpg',
  },
  {
    id: '6',
    fullName: 'Huỳnh Cao Nguyên',
    avararUrl: '/demo.jpg',
  },
  {
    id: '7',
    fullName: 'Trương Sammuel',
    avararUrl: '/demo.jpg',
  },
  {
    id: '8',
    fullName: 'Đặng Nguyễn Duy',
    avararUrl: '/demo.jpg',
  },
  {
    id: '9',
    fullName: 'Huỳnh Cao Nguyên',
    avararUrl: '/demo.jpg',
  },
]

export default function ListMember() {
  const [listMember, setListMember] = useState([])

  return (
    <div className="mt-8 w-full xl:w-[60%] m-auto">
      <p className="font-bold text-[20px] mb-4 flex items-center">
        Thành viên <Dot /> 500
      </p>
      <Input
        size="lg"
        crossOrigin={undefined}
        variant="outlined"
        label="Tìm thành viên"
        type="text"
        icon={<Search />}
        // {...register('name', {
        //   onChange: (e) => {
        //     const newVal = e.target.value
        //   },
        // })}
        className="bg-white w-full rounded-full"
      />
      <div className="flex flex-col gap-4 mt-4">
        <p className="font-bold">Quản trị viên</p>
        {admingroups.map(({ id, fullName, avararUrl }) => (
          <div key={id} className="flex gap-2 items-center">
            <Avatar placeholder={undefined} src={avararUrl} alt="user avatar" />
            <div>
              <p>{fullName}</p>
              <p className="text-xs p-1 text-[--blue-05] bg-[--blue-03] font-semibold w-fit">
                Quản trị viên
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <p className="font-bold">Thành viên trong nhóm</p>
        {members.map(({ id, fullName, avararUrl }) => (
          <div key={id} className="flex gap-2 items-center">
            <Avatar placeholder={undefined} src={avararUrl} alt="user avatar" />
            <div>
              <p>{fullName}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
