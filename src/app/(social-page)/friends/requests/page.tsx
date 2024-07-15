'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Avatar, Button, Spinner } from '@material-tailwind/react'
import { useDebouncedCallback } from 'use-debounce'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import SearchAndFilterFriends from '../../../ui/social-page/friends/SearchAndFilterFriend'
import { JWT_COOKIE } from '@/app/constant'
import Cookies from 'js-cookie'

import toast from 'react-hot-toast'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component'

function FriendListItem({ friend }) {
  const onAccept = () => {
    const data = {
      friendId: friend.id,
      action: 'ACCEPT',
    }
    axios
      .put(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/friends/requests`,
        data,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(() => {
        toast.success('Chấp nhận lời mời kết bạn thành công')
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.error?.message || 'Lỗi không xác định'
        )
      })
  }

  const onDeny = () => {
    const data = {
      friendId: friend.id,
      action: 'DENY',
    }
    axios
      .put(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/friends/requests`,
        data,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(() => {
        toast.success('Hủy lời mời kết bạn thành công')
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.error?.message || 'Lỗi không xác định'
        )
      })
  }

  return (
    <div className="flex justify-between w-[80%] m-auto items-center mt-4">
      <div className="flex items-center gap-2">
        <Link href={`/profile/${friend.id}/about`}>
          <Avatar size="lg" src={friend.avatarUrl} placeholder={undefined} />
        </Link>
        <p>{friend.fullName}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={onDeny}
          placeholder={undefined}
          size="md"
          className="bg-[--delete-filter] text-black normal-case">
          Từ chối
        </Button>
        <Button
          onClick={onAccept}
          placeholder={undefined}
          size="md"
          className="bg-[var(--blue-05)] normal-case">
          Chấp nhận
        </Button>
      </div>
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

  const onFetchMore = () => {
    curPage.current++
    if (curPage.current >= totalPages) {
      setHasMore(false)
      return
    }

    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/friends/requests?page=${curPage.current}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { friendRequests } }) => {
        setListFriend(listFriend.concat(friendRequests))
      })
      .catch((err) => {})
  }

  useEffect(() => {
    // Friends list
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/user/friends/requests`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then(({ data: { totalPages, friendRequests } }) => {
        if (!totalPages) {
          setHasMore(false)
          return
        }
        setListFriend(friendRequests)
        setTotalPages(totalPages)
        setIsLoading(false)
      })
      .catch((error) => {})
  }, [myParams])

  return (
    <div>
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
          {listFriend.map(({ user }) => (
          <FriendListItem key={user.id} friend={user} />
        ))}
          </InfiniteScroll>
        )}
        
      </div>
    </div>
  )
}
