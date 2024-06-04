'use client'
import React, { useState } from 'react'
import {
  Input,
  Avatar,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from '@material-tailwind/react'
import { Search, Dot, ThreeDots, Pencil, Trash } from 'react-bootstrap-icons'
import { useForm } from 'react-hook-form'

export default function ListMember({
  members,
  adminMembers,
  onSearchMember,
  params,
}) {
  // const { register, reset } = useForm({
  //   defaultValues: {
  //     name: params.get('name'),
  //   },
  // })

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
        {adminMembers.map(({ user }) => (
          <div key={user.id} className="flex gap-2 items-center">
            <Avatar
              placeholder={undefined}
              src={user.avatarUrl}
              alt="user avatar"
            />
            <div>
              <p>{user.fullName}</p>
              <p className="text-xs p-1 text-[--blue-05] bg-[--blue-03] font-semibold w-fit">
                Quản trị viên
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <p className="font-bold">Thành viên trong nhóm</p>
        {members.map(({ user }) => (
          <div key={user.id} className="flex justify-between">
            <div className="flex gap-2 items-center">
              <Avatar
                placeholder={undefined}
                src={user.avatarUrl}
                alt="user avatar"
              />
              <p>{user.fullName}</p>
            </div>

            <Menu placement="bottom-end">
              <MenuHandler>
                <Button
                  placeholder={undefined}
                  variant="text"
                  className="rounded-full h-fit p-2">
                  <ThreeDots className="text-lg text-black" />
                </Button>
              </MenuHandler>
              <MenuList placeholder={undefined}>
                <MenuItem
                  //onClick={() => setOpenEditComment((e) => !e)}
                  placeholder={undefined}
                  className={`text-black text-base flex items-center gap-2`}>
                  <Pencil />
                  <p>Chỉnh sửa quyền</p>
                </MenuItem>
                <MenuItem
                  //onClick={onDeletePost}
                  placeholder={undefined}
                  className={`text-black text-base flex items-center gap-2`}>
                  <Trash />
                  <p>Xóa thành viên</p>
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        ))}
      </div>
    </div>
  )
}
