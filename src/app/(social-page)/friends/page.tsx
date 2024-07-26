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

import toast from 'react-hot-toast'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component'

function FriendListItem({ friend }) {
  const [isDeleted, setIsDeleted] = useState(false)

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
        setIsDeleted(true)
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.error?.message || 'Lỗi không xác định'
        )
      })
  }
  return (
    !isDeleted && (
      <div className="flex w-[80%] m-auto items-center mt-1">
        <Link
          href={`/profile/${friend.id}/about`}
          className="flex items-center gap-2 w-full hover:bg-gray-400/[.25] p-2 rounded-lg">
          <Avatar size="lg" src={friend.avatarUrl} placeholder={undefined} />
          <p>{friend.fullName}</p>
        </Link>
      </div>
    )
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
    replace(`${pathname}?${params.toString()}`, { scroll: true })
    setMyParams(`?${params.toString()}`)
  }, 500)

  const onFetchMore = () => {
    curPage.current++
    console.log(curPage.current >= totalPages)
    if (curPage.current >= totalPages) {
      setHasMore(false)
      return
    }

    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user${myParams}&page=${curPage.current}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { users } }) => {
        setListFriend(listFriend.concat(users))
      })
      .catch((err) => {})
  }

  useEffect(() => {
    // Friends list
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/user${myParams}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then(({ data: { totalPages, users } }) => {
        setHasMore(totalPages > 1)
        setListFriend(users)
        setTotalPages(totalPages)
        setIsLoading(false)
      })
      .catch((error) => {})
  }, [myParams])

  return (
    <div>
      <SearchAndFilterFriends
        onSearch={onSearch}
        params={{
          fullName: params.get('fullName'),
        }}
      />
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
          <div className="flex flex-col gap-4 mt-6">
            {listFriend.map((friend) => (
              <FriendListItem key={friend.id} friend={friend} />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  )
}
