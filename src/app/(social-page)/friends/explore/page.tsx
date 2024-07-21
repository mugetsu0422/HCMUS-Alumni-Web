'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Avatar, Button, Spinner } from '@material-tailwind/react'
import { useDebouncedCallback } from 'use-debounce'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import SearchAndFilterFriends from './../../../ui/social-page/friends/SearchAndFilterFriend'
import toast from 'react-hot-toast'
import axios from 'axios'
import Cookies from 'js-cookie'
import { JWT_COOKIE } from '@/app/constant'
import InfiniteScroll from 'react-infinite-scroll-component'

function FriendListItem({ users }) {
  const [isDelete, setIsDelete] = useState(false)

  const onRequest = () => {
    const data = {
      friendId: users.id,
    }
    axios
      .post(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/friends/requests`,
        data,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(() => {
        toast.success('Gửi lời mời bạn thành công')
        setIsDelete(true)
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.error?.message || 'Lỗi không xác định'
        )
      })
  }

  return (
    !isDelete && (
      <div className="flex justify-between w-[80%] m-auto items-center mt-4">
        <div className="flex items-center gap-2">
          <Link href={`/profile/${users.id}/about`}>
            <Avatar size="lg" src={users.avatarUrl} placeholder={undefined} />
          </Link>
          <p>{users.fullName}</p>
        </div>

        <Button
          onClick={onRequest}
          placeholder={undefined}
          className="h-fit bg-[--blue-05] text-white normal-case">
          Thêm bạn bè
        </Button>
      </div>
    )
  )
}

export default function Page() {
  const router = useRouter()
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

  const onFetchMore = () => {
    curPage.current++
    if (curPage.current >= totalPages) {
      setHasMore(false)
      return
    }

    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/suggestion${myParams}&page=${curPage.current}`,
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

  useEffect(() => {
    // Friends list
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/suggestion${myParams}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { totalPages, users } }) => {
        if (!totalPages) {
          setHasMore(false)
          return
        }
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
            {listFriend.map((users) => (
              <FriendListItem key={users.id} users={users} />
            ))}
          </InfiniteScroll>
        )}
      </div>
    </div>
  )
}
