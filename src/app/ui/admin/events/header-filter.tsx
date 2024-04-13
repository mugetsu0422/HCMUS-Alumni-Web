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

export default function HeaderFilter({ setParams, setCurPage }) {
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
    <div className="w-[1500px] h-fit bg-[--blue-02] border-2 border-[--blue-02] m-auto py-1 ">
      <div className="flex w-fit justify-start items-center gap-x-1">
        <Menu>
          <MenuHandler>
            <Button
              placeholder={undefined}
              variant="text"
              className="w-[650px] ml-4 text-center p-1 flex items-center justify-center gap-1 font-bold normal-case text-base text-white">
              Bài viết
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
              className="w-[9rem] text-center p-1 flex items-center justify-center gap-1 font-bold normal-case text-base text-white">
              Ngày diễn ra
              <CaretDownFill />
            </Button>
          </MenuHandler>
          <MenuList placeholder={undefined}>
            <MenuItem
              placeholder={undefined}
              onClick={() => handleClick('organizationTime', 'desc')}
              className="text-center font-bold flex justify-center">
              Mới nhất
              <ArrowDown />
            </MenuItem>
            <MenuItem
              placeholder={undefined}
              onClick={() => handleClick('organizationTime', 'asc')}
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
              className="ml-2 w-[20rem] text-center p-1 flex items-center justify-center gap-2 font-bold normal-case text-base text-white">
              Địa chỉ
              <CaretDownFill />
            </Button>
          </MenuHandler>
          <MenuList placeholder={undefined}>
            <MenuItem
              placeholder={undefined}
              onClick={() => handleClick('organizationLocation', 'asc')}
              className="text-center font-bold flex justify-center ">
              A tới Z
              <SortAlphaDown />
            </MenuItem>
            <MenuItem
              placeholder={undefined}
              onClick={() => handleClick('organizationLocation', 'desc')}
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
              className="w-[12rem] text-center p-1 flex items-center justify-center gap-2 font-bold normal-case text-base text-white">
              Số người tham gia
              <CaretDownFill />
            </Button>
          </MenuHandler>
          <MenuList placeholder={undefined}>
            <MenuItem
              placeholder={undefined}
              onClick={() => handleClick('views', 'desc')}
              className="-ml-2 text-center font-bold flex justify-center">
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
