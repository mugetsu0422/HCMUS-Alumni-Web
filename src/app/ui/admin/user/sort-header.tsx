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
export default function SortHeader({ onOrder }) {
  return (
    <div className="w-[1000px] h-fit bg-[#f6f9ff] border border-[#CDCDCD] m-auto py-1 rounded-t-lg">
      <div className="flex w-fit justify-evenly items-center ">
        <Menu>
          <MenuHandler>
            <Button
              placeholder={undefined}
              variant="text"
              className="w-[250px] ml-2 text-left mr-1 p-1 flex items-center justify-center gap-1 font-bold normal-case text-base text-[#000000]">
              Tên người dùng
              <CaretDownFill />
            </Button>
          </MenuHandler>
          <MenuList placeholder={undefined}>
            <MenuItem
              placeholder={undefined}
              onClick={() => onOrder('fullName', 'asc')}
              className="text-center font-bold flex justify-center ">
              A tới Z
              <SortAlphaDown />
            </MenuItem>
            <MenuItem
              placeholder={undefined}
              onClick={() => onOrder('fullName', 'desc')}
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
              className="w-[250px] ml-[20px] text-center p-1 flex items-center justify-center gap-1 font-bold normal-case text-base text-[#000000]">
              Email
              <CaretDownFill />
            </Button>
          </MenuHandler>
          <MenuList placeholder={undefined}>
          <MenuItem
              placeholder={undefined}
              onClick={() => onOrder('email', 'asc')}
              className="text-center font-bold flex justify-center ">
              A tới Z
              <SortAlphaDown />
            </MenuItem>
            <MenuItem
              placeholder={undefined}
              onClick={() => onOrder('email', 'desc')}
              className="text-center font-bold flex justify-center">
              Z tới A
              <SortAlphaUp />
            </MenuItem>
          </MenuList>
        </Menu>

        <div className="w-[250px] ml-[20px] text-center mr-2 p-1 flex items-center justify-center gap-1 font-bold normal-case text-base text-[#000000]">
          Vai trò
        </div>
      </div>
    </div>
  )
}
