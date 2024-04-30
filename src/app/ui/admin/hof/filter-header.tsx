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
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
export default function FilterHeader({ setParams, setCurPage }) {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)

  function handleClick(name, order) {
    params.delete('page')
    setCurPage(1)
    params.set('orderBy', name)
    params.set('order', order)
    replace(`${pathname}?${params.toString()}`)
    setParams(`?${params.toString()}`)
  }

  return (
    <div className="w-[1184px] h-fit bg-[#f6f9ff] border-2 border-[--secondary] m-auto py-1 ">
      <div className="flex w-fit justify-evenly items-center ">
        <Menu>
          <MenuHandler>
            <Button
              placeholder={undefined}
              variant="text"
              className="w-[520px] ml-4 text-center mr-2 p-1 flex items-center justify-center gap-1 font-bold normal-case text-base text-[#000000]">
              Gương thành công
              <CaretDownFill />
            </Button>
          </MenuHandler>
          <MenuList placeholder={undefined}>
            <MenuItem
              placeholder={undefined}
              onClick={() => handleClick('title', 'asc')}
              className="text-center font-bold flex justify-center ">
              A tới Z
              <SortAlphaDown />
            </MenuItem>
            <MenuItem
              placeholder={undefined}
              onClick={() => handleClick('title', 'desc')}
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
              className="w-[9rem] text-center ml-2 mr-5 p-1 flex items-center justify-center gap-1 font-bold normal-case text-base text-[#000000]">
              Khoa
              <CaretDownFill />
            </Button>
          </MenuHandler>
          <MenuList placeholder={undefined}>
            <MenuItem
              placeholder={undefined}
              onClick={() => handleClick('publishedAt', 'desc')}
              className="text-center font-bold flex justify-center">
              A tới Z
              <SortAlphaDown />
            </MenuItem>
            <MenuItem
              placeholder={undefined}
              onClick={() => handleClick('publishedAt', 'asc')}
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
              className="w-[9rem] text-center p-1 mr-2 flex items-center justify-center gap-1 font-bold normal-case text-base text-[#000000]">
              Niên khóa
              <CaretDownFill />
            </Button>
          </MenuHandler>
          <MenuList placeholder={undefined}>
            <MenuItem
              placeholder={undefined}
              onClick={() => handleClick('views', 'desc')}
              className="text-center font-bold flex justify-center">
              Giảm dần
              <ArrowDown />
            </MenuItem>
            <MenuItem
              placeholder={undefined}
              onClick={() => handleClick('views', 'asc')}
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
              className="w-[7rem] text-center p-1 flex items-center justify-center gap-2 font-bold normal-case text-base text-[#000000]">
              Lượt xem
              <CaretDownFill />
            </Button>
          </MenuHandler>
          <MenuList placeholder={undefined}>
            <MenuItem
              placeholder={undefined}
              onClick={() => handleClick('views', 'desc')}
              className="text-center font-bold flex justify-center">
              Giảm dần
              <ArrowDown />
            </MenuItem>
            <MenuItem
              placeholder={undefined}
              onClick={() => handleClick('views', 'asc')}
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
