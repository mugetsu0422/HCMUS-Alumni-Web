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

interface HeaderProps {
  onOrder: (name: string, order: string) => void
}

export default function SortHeader({ onOrder }: HeaderProps) {
  return (
    <div className="w-[1220px] h-fit bg-[#f6f9ff] border border-[#CDCDCD] m-auto py-1 rounded-t-lg">
      <div className="flex w-fit justify-evenly items-center">
        <Menu>
          <MenuHandler>
            <Button
              placeholder={undefined}
              variant="text"
              className="w-[250px] text-center ml-2 p-2 flex items-center justify-center gap-1 font-bold normal-case text-base text-[#000000]">
              Vai trò
              <CaretDownFill />
            </Button>
          </MenuHandler>
          <MenuList placeholder={undefined}>
            <MenuItem
              placeholder={undefined}
              onClick={() => onOrder('name', 'asc')}
              className="text-center font-bold flex justify-center ">
              A tới Z
              <SortAlphaDown />
            </MenuItem>
            <MenuItem
              placeholder={undefined}
              onClick={() => onOrder('name', 'desc')}
              className="text-center font-bold flex justify-center">
              Z tới A
              <SortAlphaUp />
            </MenuItem>
          </MenuList>
        </Menu>
        <div className="w-[500px] text-center py-1 px-0 flex items-center justify-center gap-1 font-bold normal-case text-base text-[#000000]">
          Mô tả
        </div>

        <Menu>
          <MenuHandler>
            <Button
              placeholder={undefined}
              variant="text"
              className="w-[200px] text-center p-1 flex items-center justify-center gap-1 font-bold normal-case text-base text-[#000000]">
              Lần cuối cập nhật
              <CaretDownFill />
            </Button>
          </MenuHandler>
          <MenuList placeholder={undefined}>
            <MenuItem
              placeholder={undefined}
              onClick={() => onOrder('updateAt', 'desc')}
              className="text-center font-bold flex justify-center">
              Mới nhất
              <ArrowDown />
            </MenuItem>
            <MenuItem
              placeholder={undefined}
              onClick={() => onOrder('updateAt', 'asc')}
              className="text-center font-bold flex justify-center">
              Cũ nhất
              <ArrowUp />
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
    </div>
  )
}
