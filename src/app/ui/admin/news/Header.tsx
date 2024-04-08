'use client'
import React from 'react'
import {
  CaretDownFill,
  ArrowDown,
  ArrowUp,
  SortAlphaDown,
  SortAlphaUp,
} from 'react-bootstrap-icons'
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from '@material-tailwind/react'

export default function Header() {
  return (
    <div className="w-[1184px] h-fit bg-[--blue-02] border-2 border-[--blue-02] m-auto py-1 ">
      <div className="flex w-fit justify-evenly items-center ">
        <Menu>
          <MenuHandler>
            <Button
              placeholder={undefined}
              variant="text"
              className="w-[700px] ml-4 text-center p-1 flex items-center justify-center gap-1 font-bold normal-case text-base text-white">
              Bài viết
              <CaretDownFill />
            </Button>
          </MenuHandler>
          <MenuList placeholder={undefined}>
            <MenuItem
              placeholder={undefined}
              className="text-center font-bold flex justify-center ">
              A tới Z
              <SortAlphaDown />
            </MenuItem>
            <MenuItem
              placeholder={undefined}
              className="text-center font-bold flex justify-center">
              Z tới A
              <SortAlphaUp />
            </MenuItem>
          </MenuList>
        </Menu>

        <Menu>
          <MenuHandler>
            <Button
              placeholder={undefined}
              variant="text"
              className="w-[9rem] text-center ml-6 p-1 flex items-center justify-center gap-1 font-bold normal-case text-base text-white">
              Ngày đăng
              <CaretDownFill />
            </Button>
          </MenuHandler>
          <MenuList placeholder={undefined}>
            <MenuItem
              placeholder={undefined}
              className="text-center font-bold flex justify-center">
              Mới nhất
              <ArrowDown />
            </MenuItem>
            <MenuItem
              placeholder={undefined}
              className="text-center font-bold flex justify-center">
              Cũ nhất
              <ArrowUp />
            </MenuItem>
          </MenuList>
        </Menu>

        <Menu>
          <MenuHandler>
            <Button
              placeholder={undefined}
              variant="text"
              className="w-[7rem] text-center p-1 flex items-center justify-center gap-2 font-bold normal-case text-base text-white">
              Lượt xem
              <CaretDownFill />
            </Button>
          </MenuHandler>
          <MenuList placeholder={undefined}>
            <MenuItem
              placeholder={undefined}
              className="text-center font-bold flex justify-center">
              Giảm dần
              <ArrowDown />
            </MenuItem>
            <MenuItem
              placeholder={undefined}
              className="text-center font-bold flex justify-center">
              Tăng dần
              <ArrowUp />
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
    </div>
  )
}
