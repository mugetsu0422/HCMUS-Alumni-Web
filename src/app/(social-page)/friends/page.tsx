'use client'

import React, { useCallback, useEffect, useState, useRef } from 'react'
import {
  Avatar,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Spinner,
} from '@material-tailwind/react'
import Link from 'next/link'
import SearchAndFilterFriends from '@/app/ui/social-page/friends/SearchAndFilterFriend'
import { useDebouncedCallback } from 'use-debounce'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { JWT_COOKIE } from '@/app/constant'
import Cookies from 'js-cookie'
import CustomToaster from '@/app/ui/common/custom-toaster'
import toast from 'react-hot-toast'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component'

function FriendListItem({ friend }) {
  const handleDeleteFriend = () => {
    axios
      .delete(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/friends/${friend.id}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(() => {
        toast.success('Xóa bạn bè thành công')
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.error?.message || 'Lỗi không xác định'
        )
      })
  }
  return (
    <div className="flex justify-between w-[80%] m-auto items-center">
      <div className="flex items-center gap-2">
        <Link href={`/profile/${friend.id}/about`}>
          <Avatar size="lg" src={friend.avatarUrl} placeholder={undefined} />
        </Link>
        <p>{friend.fullName}</p>
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
            className="flex items-center gap-1 text-black py-3 bg-white"
            onClick={handleDeleteFriend}>
            Hủy bạn bè
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  )
}

export default function Page() {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const curPage = useRef(0)
  const [myParams, setMyParams] = useState(`?${params.toString()}`)
  const [listFriend, setListFriend] = useState([])
  const userId = Cookies.get('userId')
  const [totalPages, setTotalPages] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  const resetCurPage = () => {
    params.delete('page')
    curPage.current = 0
    setHasMore(true)
  }

  const onSearch = useDebouncedCallback((keyword) => {
    if (keyword) {
      params.set('fullName', keyword)
    } else {
      params.delete('fullName')
    }
    resetCurPage()
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    setMyParams(`?${params.toString()}`)
  }, 500)

  const onFetchMore = () => {
    curPage.current++
    if (curPage.current >= totalPages) {
      setHasMore(false)
      return
    }

    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/${userId}/friends${myParams}&page=${curPage.current}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { friends } }) => {
        setListFriend(listFriend.concat(friends))
      })
      .catch((err) => {})
  }

  useEffect(() => {
    // Friends list
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/${userId}/friends${myParams}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { totalPages, friends } }) => {
        if (!totalPages) {
          setHasMore(false)
          return
        }
        setListFriend(friends)
        setTotalPages(totalPages)
        setIsLoading(false)
      })
      .catch((error) => {})
  }, [myParams])

  return (
    <div>
      <CustomToaster />
      <SearchAndFilterFriends
        onSearch={onSearch}
        params={{
          fullName: params.get('fullName'),
        }}
      />
      <div className="flex flex-col gap-4 mt-6">
        {!isLoading && (
          <InfiniteScroll
            dataLength={listFriend.length}
            next={onFetchMore}
            hasMore={hasMore}
            loader={
              <div className="h-10 flex justify-center ">
                <Spinner className="h-8 w-8"></Spinner>
              </div>
            }>
            {listFriend.map(({ friend }) => (
              <FriendListItem key={friend.id} friend={friend} />
            ))}
          </InfiniteScroll>
        )}
      </div>
    </div>
  )
}
