'use client'

import React, { useCallback, useEffect, useState } from 'react'
import {
  Avatar,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from '@material-tailwind/react'
import Link from 'next/link'
import SearchAndFilterFriends from '@/app/ui/social-page/friends/SearchAndFilterFriend'
import { useDebouncedCallback } from 'use-debounce'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'

const PAGE_SIZE = 9

const friends = [
  {
    id: '1',
    fullName: 'Trương Samuel',
    avatarUrl: 'demo.jpg',
  },
  {
    id: '2',
    fullName: 'Trần Hồng Minh Phúc',
    avatarUrl: 'demo.jpg',
  },
  {
    id: '3',
    fullName: 'Huỳnh Cao Nguyên',
    avatarUrl: 'demo.jpg',
  },
  {
    id: '4',
    fullName: 'Đặng Nguyễn Duy',
    avatarUrl: 'demo.jpg',
  },
]

function FriendListItem({ id, fullName, avatarUrl }) {
  return (
    <div className="flex justify-between w-[80%] m-auto items-center">
      <div className="flex items-center gap-2">
        <Link href={`/profile/${id}/about`}>
          <Avatar size="lg" src={avatarUrl} placeholder={undefined} />
        </Link>
        <p>{fullName}</p>
      </div>
      <Menu placement="bottom-end">
        <MenuHandler>
          <Button
            placeholder={undefined}
            className="h-fit bg-[--blue-05] text-white normal-case">
            Bạn bè
          </Button>
        </MenuHandler>
        <MenuList placeholder={undefined}>
          <MenuItem
            placeholder={undefined}
            className="flex items-center gap-1 text-black py-3 bg-white">
            Hủy bạn bè
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  )
}

export default function Page() {
  const router = useRouter()
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const [curPage, setCurPage] = useState(Number(params.get('page')) + 1 || 1)
  const [myParams, setMyParams] = useState(`?${params.toString()}`)

  const onChangeMyParams = () => {
    setMyParams(`?pageSize=${PAGE_SIZE}&${params.toString()}`)
  }

  const resetCurPage = () => {
    params.delete('page')
    setCurPage(1)
  }

  const onSearch = useDebouncedCallback((keyword) => {
    if (keyword) {
      params.set('title', keyword)
    } else {
      params.delete('title')
    }
    resetCurPage()
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    setMyParams(`?${params.toString()}`)
  }, 500)

  const onFilterFaculties = (facultyId: string) => {
    if (facultyId != '0') {
      params.set('facultyId', facultyId)
    } else {
      params.delete('facultyId')
    }
    resetCurPage()
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    setMyParams(`?${params.toString()}`)
  }

  const onResetFilter = () => {
    params.delete('facultyId')
    params.delete('tagNames')
    resetCurPage()
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    setMyParams(`?${params.toString()}`)
  }

  const onFilterBeginningYear = useDebouncedCallback((beginningYear) => {
    if (beginningYear) {
      params.set('beginningYear', beginningYear)
    } else {
      params.delete('beginningYear')
    }
    resetCurPage()
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    onChangeMyParams()
  }, 500)

  return (
    <div>
      <SearchAndFilterFriends
        onSearch={onSearch}
        onFilter={onFilterFaculties}
        onResetFilter={onResetFilter}
        onFilterBeginningYear={onFilterBeginningYear}
        params={{
          name: params.get('name'),
          facultyId: params.get('facultyId'),
          beginningYear: params.get('beginningYear'),
        }}
      />

      <div className="flex flex-col gap-4 mt-6">
        {friends.map(({ id, fullName, avatarUrl }) => (
          <FriendListItem
            id={id}
            key={id}
            fullName={fullName}
            avatarUrl={avatarUrl}
          />
        ))}
      </div>
    </div>
  )
}
