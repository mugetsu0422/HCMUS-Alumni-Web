'use client'

import React, { useEffect, useRef, useState } from 'react'
import { List, Spinner } from '@material-tailwind/react'
import { roboto } from '@/app/ui/fonts'
import { JWT_COOKIE } from '@/app/constant'
import axios from 'axios'
import Cookies from 'js-cookie'
import NotificationItem from '@/app/ui/common/notification-item'
import InfiniteScroll from 'react-infinite-scroll-component'

export default function Page() {
  const [notifications, setNotifications] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const page = useRef(0)

  const onFetchMore = () => {
    page.current++
    if (page.current >= totalPages) {
      setHasMore(false)
      return
    }
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/notification?page=${page.current}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { notifications } }) => {
        setNotifications((prev) => prev.concat(notifications))
      })
      .catch((error) => {})
  }

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/notification`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then(
        ({ data: { totalUnreadNotification, totalPages, notifications } }) => {
          // setNotifications(data)

          if (!totalPages) {
            setHasMore(false)
            return
          }
          setTotalPages(totalPages)
          setNotifications(notifications)
        }
      )
      .catch((error) => {})
  }, [])

  return (
    <div className="mt-4 max-w-[850px] min-w-[500px] w-[80%] m-auto flex flex-col gap-6 h-fit mb-12">
      <p
        className={`${roboto.className} ml-5 lg:ml-0 text-3xl font-bold text-[var(--blue-02)]`}>
        THÔNG BÁO
      </p>
      <List placeholder={undefined}>
        <InfiniteScroll
          className="flex flex-col"
          dataLength={notifications.length}
          next={onFetchMore}
          hasMore={hasMore}
          loader={
            <div className="h-10 my-5 flex justify-center">
              <Spinner className="h-8 w-8"></Spinner>
            </div>
          }>
          {notifications.map((notification) => (
            <NotificationItem
              notification={notification}
              key={notification.id}
            />
          ))}
        </InfiniteScroll>
      </List>
    </div>
  )
}
