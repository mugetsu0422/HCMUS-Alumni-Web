'use client'
import React from 'react'
import { Input, Button } from '@material-tailwind/react'

const filerBtn = [
  { name: 'Mới nhất', filter: [{ sub: 'Mới nhất' }, { sub: 'Cũ nhất' }] },
  { name: 'MSSV', filter: [{ sub: 'A tới Z' }, { sub: 'Z tới A' }] },
  { name: 'Họ tên', filter: [{ sub: 'A tới Z' }, { sub: 'Z tới A' }] },
  { name: 'Năm tốt nghiệp', filter: [{ sub: 'A tới Z' }, { sub: 'Z tới A' }] },
]

const Icon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-caret-down-fill"
      viewBox="0 0 16 16">
      <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
    </svg>
  )
}

export default function Filter() {
  const [message, setMessage] = React.useState('')

  return (
    <>
      <Input
        placeholder="Tìm kiếm theo email ..."
        crossOrigin={undefined}
        size="md"
        className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pr-20 w-full"
        labelProps={{
          className: 'before:content-none after:content-none',
        }}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            alert(message)
          }
        }}
        type="text"
      />
      <div className="flex mt-3 gap-2">
        <Button variant="outlined" placeholder={undefined} size="sm">
          Xóa bộ lọc
        </Button>
        {filerBtn.map(({ name, filter }) => (
          <Button
            variant="outlined"
            placeholder={undefined}
            size="sm"
            className="flex gap-2"
            key={name}>
            {name}
            <Icon />
          </Button>
        ))}
      </div>
    </>
  )
}
