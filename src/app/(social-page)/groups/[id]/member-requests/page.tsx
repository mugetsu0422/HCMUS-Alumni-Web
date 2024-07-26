'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Input, Avatar, Button, Spinner } from '@material-tailwind/react'
import { Search, Dot } from 'react-bootstrap-icons'
import { useGroupContext } from '../layout'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { JWT_COOKIE } from '../../../../constant'
import Cookies from 'js-cookie'
import { useDebouncedCallback } from 'use-debounce'
import toast from 'react-hot-toast'
import InfiniteScroll from 'react-infinite-scroll-component'

export default function Page({ params }: { params: { id: string } }) {
  const group = useGroupContext()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const curPage = useRef(0)
  const [totalPages, setTotalPages] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [requests, setRequests] = useState([])
  const [searchParams, setSearchParams] = useState('')

  const onFetchMore = () => {
    curPage.current++
    if (curPage.current >= totalPages) {
      setHasMore(false)
      return
    }

    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${params.id}/requests?${searchParams}&page=${curPage.current}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { requests: newRequests } }) => {
        setRequests(requests.concat(newRequests))
      })
      .catch((error) => {})
  }
  const onSearchRequests = useDebouncedCallback((query) => {
    if (query) {
      setSearchParams(`name=${query}`)
    } else {
      setSearchParams('')
    }
  }, 500)
  const onChangeRequestStatus = (
    userId: string,
    fullName: string,
    status: 'APPROVED' | 'DENIED'
  ) => {
    axios
      .putForm(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${params.id}/requests/${userId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(() => {
        if (status === 'APPROVED') {
          toast.success(`Đã phê duyệt ${fullName}`)
        } else if (status === 'DENIED') {
          toast.success(`Đã từ chối ${fullName}`)
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?.error?.message.error?.message || 'Lỗi không xác định')
      })
  }

  // Initial fetch
  useEffect(() => {
    if (group.userRole !== 'CREATOR' && group.userRole !== 'ADMIN') {
      router.push(`/groups/${params.id}`)
      return
    }

    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${params.id}/requests?${searchParams}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { totalPages, requests } }) => {
        if (!totalPages) {
          setHasMore(false)
        }
        setTotalPages(totalPages)
        setRequests(requests)
        setIsLoading(false)
      })
      .catch((error) => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  if (!isLoading)
    return (
      <div className="mt-8 w-full xl:w-[60%] m-auto">
        <p className="font-bold text-[20px] mb-4 flex items-center">
          Thành viên cần được xét duyệt
          {/* <Dot /> 500 */}
        </p>
        {/* <Input
        size="lg"
        crossOrigin={undefined}
        variant="outlined"
        label="Tìm thành viên"
        type="text"
        icon={<Search />}
        className="bg-white w-full rounded-full"
        onChange={(e) => onSearchRequests(e.target.value)}
      /> */}

        <div className="flex flex-col gap-4 mt-4">
          <InfiniteScroll
            dataLength={requests.length}
            next={onFetchMore}
            hasMore={hasMore}
            loader={
              <div className="h-10 flex justify-center">
                <Spinner className="h-8 w-8"></Spinner>
              </div>
            }>
            {requests.map(({ user }) => (
              <Request
                key={user.id}
                user={user}
                onChangeRequestStatus={onChangeRequestStatus}
              />
            ))}
          </InfiniteScroll>
        </div>
      </div>
    )
}

function Request({ user, onChangeRequestStatus }) {
  const [isHandled, setIsHandled] = useState(false)

  if (!isHandled)
    return (
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <Avatar
            placeholder={undefined}
            src={user.avatarUrl}
            alt="user avatar"
          />
          <div>
            <p>{user.fullName}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => {
              onChangeRequestStatus(user.id, user.fullName, 'DENIED')
              setIsHandled(true)
            }}
            placeholder={undefined}
            size="md"
            className="bg-[--delete-filter] text-black normal-case">
            Từ chối
          </Button>
          <Button
            onClick={() => {
              onChangeRequestStatus(user.id, user.fullName, 'APPROVED')
              setIsHandled(true)
            }}
            placeholder={undefined}
            size="md"
            type="submit"
            className="bg-[var(--blue-05)] normal-case">
            Phê duyệt
          </Button>
        </div>
      </div>
    )
}
