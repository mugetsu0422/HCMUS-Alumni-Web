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

interface HeaderFilterProps {
  onOrder: (name: string, order: string) => void
}

export default function SortHeader({ onOrder }: HeaderFilterProps) {
  return (
    <div className="w-[1650px] h-fit bg-[#f6f9ff] border border-[#CDCDCD] m-auto py-1 rounded-t-lg">
      <div className="flex w-fit justify-start items-center gap-x-1">
        <Menu>
          <MenuHandler>
            <Button
              placeholder={undefined}
              variant="text"
              className="w-[550px] text-[#000000]  ml-2 mr-2 text-center p-1 flex items-center justify-center gap-1 font-bold normal-case text-base ">
              Sự kiện
              <CaretDownFill />
            </Button>
          </MenuHandler>
          <MenuList placeholder={undefined}>
            <MenuItem
              placeholder={undefined}
              onClick={() => onOrder('title', 'asc')}
              className="text-center font-bold flex justify-center ">
              A tới Z
              <SortAlphaDown />
            </MenuItem>
            <MenuItem
              placeholder={undefined}
              onClick={() => onOrder('title', 'desc')}
              className="text-center font-bold flex justify-center">
              Z tới A
              <SortAlphaUp />
            </MenuItem>
          </MenuList>
        </Menu>

        <div className="w-[8rem] text-center mr-[10px] py-1 px-0 flex items-center justify-center gap-1 font-bold normal-case text-base text-[#000000]">
          Thẻ
        </div>
        <div className="w-[12rem] text-center mr-2 py-1 px-0 flex items-center justify-center gap-1 font-bold normal-case text-base text-[#000000]">
          Khoa
        </div>

        <Menu>
          <MenuHandler>
            <Button
              placeholder={undefined}
              variant="text"
              className="w-[9rem] text-center p-1 flex items-center justify-center gap-1 font-bold normal-case text-base text-[#000000] ">
              Ngày diễn ra
              <CaretDownFill />
            </Button>
          </MenuHandler>
          <MenuList placeholder={undefined}>
            <MenuItem
              placeholder={undefined}
              onClick={() => onOrder('organizationTime', 'desc')}
              className="text-center font-bold flex justify-center">
              Mới nhất
              <ArrowDown />
            </MenuItem>
            <MenuItem
              placeholder={undefined}
              onClick={() => onOrder('organizationTime', 'asc')}
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
              className="w-[9.8rem] text-center p-1 flex items-center justify-center gap-2 font-bold normal-case text-base text-[#000000] ">
              Địa điểm
              <CaretDownFill />
            </Button>
          </MenuHandler>
          <MenuList placeholder={undefined}>
            <MenuItem
              placeholder={undefined}
              onClick={() => onOrder('organizationLocation', 'asc')}
              className="text-center font-bold flex justify-center ">
              A tới Z
              <SortAlphaDown />
            </MenuItem>
            <MenuItem
              placeholder={undefined}
              onClick={() => onOrder('organizationLocation', 'desc')}
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
              className="w-[6.5rem] text-center p-1 flex items-center justify-center gap-2 font-bold normal-case text-base text-[#000000] ">
              Tối thiểu
              <CaretDownFill />
            </Button>
          </MenuHandler>
          <MenuList placeholder={undefined}>
            <MenuItem
              placeholder={undefined}
              onClick={() => onOrder('participants', 'desc')}
              className="text-center font-bold flex justify-center">
              Giảm dần
              <ArrowDown />
            </MenuItem>
            <MenuItem
              placeholder={undefined}
              onClick={() => onOrder('participants', 'asc')}
              className="text-center font-bold flex justify-center">
              Tăng dần
              <ArrowUp />
            </MenuItem>
          </MenuList>
        </Menu>

        <Menu>
          <MenuHandler>
            <Button
              placeholder={undefined}
              variant="text"
              className="w-[7rem] text-center p-1 flex items-center justify-center gap-2 font-bold normal-case text-base text-[#000000] ">
              Tham gia
              <CaretDownFill />
            </Button>
          </MenuHandler>
          <MenuList placeholder={undefined}>
            <MenuItem
              placeholder={undefined}
              onClick={() => onOrder('participants', 'desc')}
              className="text-center font-bold flex justify-center">
              Giảm dần
              <ArrowDown />
            </MenuItem>
            <MenuItem
              placeholder={undefined}
              onClick={() => onOrder('participants', 'asc')}
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
