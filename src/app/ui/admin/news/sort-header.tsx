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
    <div className="w-[1220px] h-fit bg-[#f6f9ff] border-2 border-[--secondary] m-auto py-1 rounded-t-lg">
      <div className="flex w-fit justify-evenly items-center">
        <Menu>
          <MenuHandler>
            <Button
              placeholder={undefined}
              variant="text"
              className="w-[460px] ml-2 mr-1 text-center p-1 flex items-center justify-center gap-1 font-bold normal-case text-base text-[#000000]">
              Bài viết
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
        <div className="w-[7rem] text-center mr-1 py-1 px-0 flex items-center justify-center gap-1 font-bold normal-case text-base text-[#000000]">
          Thẻ
        </div>
        <div className="w-[10.5rem] text-center py-1 px-0 flex items-center justify-center gap-1 font-bold normal-case text-base text-[#000000]">
          Khoa{' '}
        </div>

        <Menu>
          <MenuHandler>
            <Button
              placeholder={undefined}
              variant="text"
              className="w-[8rem] text-center p-1 flex items-center justify-center gap-1 font-bold normal-case text-base text-[#000000]">
              Ngày đăng
              <CaretDownFill />
            </Button>
          </MenuHandler>
          <MenuList placeholder={undefined}>
            <MenuItem
              placeholder={undefined}
              onClick={() => onOrder('publishedAt', 'desc')}
              className="text-center font-bold flex justify-center">
              Mới nhất
              <ArrowDown />
            </MenuItem>
            <MenuItem
              placeholder={undefined}
              onClick={() => onOrder('publishedAt', 'asc')}
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
              className="w-[10rem] text-center p-1 flex items-center justify-center gap-2 font-bold normal-case text-base text-[#000000]">
              Lượt xem
              <CaretDownFill />
            </Button>
          </MenuHandler>
          <MenuList placeholder={undefined}>
            <MenuItem
              placeholder={undefined}
              onClick={() => onOrder('views', 'desc')}
              className="text-center font-bold flex justify-center">
              Giảm dần
              <ArrowDown />
            </MenuItem>
            <MenuItem
              placeholder={undefined}
              onClick={() => onOrder('views', 'asc')}
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
