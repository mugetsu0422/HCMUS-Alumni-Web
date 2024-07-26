import { JWT_COOKIE } from '@/app/constant'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Badge,
  Button,
  Popover,
  PopoverContent,
  PopoverHandler,
  Spinner,
  Typography,
} from '@material-tailwind/react'
import axios from 'axios'
import Link from 'next/link'
import React, { useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Cookies from 'js-cookie'
import NotificationItem from '@/app/ui/common/notification-item'
import { reset } from '@/lib/features/notification/notification-counter'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'

export default function NotificationPopover() {
  const [openNotification, setOpenNotification] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const page = useRef(0)

  const onHandleOpenNotification = () => {
    setOpenNotification((prev) => !prev)
  }

  const notificationCount = useAppSelector(
    (state) => state.notificationCounter.value
  )
  const dispatch = useAppDispatch()

  const popoverHandler = () => {
    const isNewNoti = !openNotification && notificationCount
    const notOpened = !openNotification && !notifications.length && hasMore

    if (isNewNoti || notOpened) {
      if (isNewNoti) {
        localStorage.setItem('notificationCount', '0')
        dispatch(reset())
        page.current = 0
        setHasMore(true)
      }

      axios
        .get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/notification`, {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        })
        .then(
          ({
            data: { totalUnreadNotification, totalPages, notifications },
          }) => {
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
    }
    setOpenNotification((prev) => !prev)
  }

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

  return (
    <Popover
      placement="bottom-end"
      open={openNotification}
      handler={popoverHandler}>
      <PopoverHandler>
        <Button
          placeholder={undefined}
          variant="text"
          size="sm"
          className="group">
          <Badge
            invisible={!notificationCount}
            content={notificationCount}
            className="bg-[var(--blue-05)]">
            <div className="h-[24px] w-[24px]">
              <FontAwesomeIcon
                icon={faBell}
                className="text-[24px] text-[--text-navbar] group-hover:text-[--blue-05]"
              />
            </div>
          </Badge>
        </Button>
      </PopoverHandler>
      <PopoverContent
        id="notification-popover"
        placeholder={undefined}
        className="max-h-[calc(100vh-var(--navbar-height)-15px)] w-[360px] max-w-[calc(100vw-24px)] overflow-y-auto scrollbar-webkit-main">
        <div className="flex items-center justify-between">
          <Typography
            placeholder={undefined}
            variant="h4"
            color="blue-gray"
            className="my-5">
            Thông báo
          </Typography>

          <Link href="/notifications">
            <Button
              onClick={onHandleOpenNotification}
              placeholder={undefined}
              variant="text"
              className="normal-case text-[14px] py-2 px-4">
              Xem tất cả
            </Button>
          </Link>
        </div>

        <InfiniteScroll
          className="flex flex-col"
          dataLength={notifications.length}
          next={onFetchMore}
          hasMore={hasMore}
          loader={
            <div className="h-10 my-5 flex justify-center">
              <Spinner className="h-8 w-8"></Spinner>
            </div>
          }
          scrollableTarget="notification-popover">
          {notifications.map((notification) => (
            <NotificationItem
              notification={notification}
              lineClamp={3}
              onHandleOpenNotification={onHandleOpenNotification}
              key={notification.id}
            />
          ))}
        </InfiniteScroll>
      </PopoverContent>
    </Popover>
  )
}
