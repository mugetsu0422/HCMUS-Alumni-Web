'use client'
import React from 'react'
import { nunito } from '../../fonts'
import { Button, Avatar } from '@material-tailwind/react'
import { Dot } from 'react-bootstrap-icons'

export default function GroupsListItem({
  id,
  name,
  creator,
  type,
  avatarUrl,
  coverUrl,
  website,
  status,
  numberMember,
  isJoined,
}) {
  return (
    <div className="flex justify-between items-center gap-4 w-full">
      <div className="flex gap-4">
        <Avatar
          src={avatarUrl}
          alt="group avatar"
          placeholder={undefined}
          size="lg"
        />
        <div className="max-w-[600px] min-w-[350px] w-[80%]">
          <p className="text-[18px] font-[500] text-justify">{name}</p>
          <p className="flex items-center text-[#65676b]">
            {type} <Dot className="text-black" /> {numberMember} thành viên
          </p>
        </div>
      </div>
      {isJoined ? (
        <Button
          size="sm"
          placeholder={undefined}
          className="h-fit bg-[#e4e6eb] text-black normal-case text-[14px]">
          Truy cập
        </Button>
      ) : (
        <Button
          size="sm"
          placeholder={undefined}
          className="h-fit bg-[--blue-04] text-[--blue-05] normal-case text-[14px]">
          Tham gia
        </Button>
      )}
    </div>
  )
}
