'use client'
import React, { useState } from 'react'
import { Input, Avatar, Button } from '@material-tailwind/react'
import { Search, Dot } from 'react-bootstrap-icons'

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

export default function MemberRequest() {
  const [listMember, setListMember] = useState([])

  return (
    <div className="mt-8 w-full xl:w-[60%] m-auto">
      <p className="font-bold text-[20px] mb-4 flex items-center">
        Thành viên cần được xét duyệt <Dot /> 500
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
        {members.map(({ id, fullName, avararUrl }) => (
          <div key={id} className="flex gap-2 items-center justify-between">
            <div className="flex gap-2 items-center">
              <Avatar
                placeholder={undefined}
                src={avararUrl}
                alt="user avatar"
              />
              <div>
                <p>{fullName}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                placeholder={undefined}
                size="md"
                className=" bg-[--delete-filter] text-black normal-case">
                Từ chối
              </Button>
              <Button
                placeholder={undefined}
                size="md"
                type="submit"
                className="bg-[var(--blue-05)] normal-case">
                Chấp nhận
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
