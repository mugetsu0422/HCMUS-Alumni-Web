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

const data = [
  {
    id: '1',
    imageUrl: '/demo.jpg',
    content: 'Trương Samuel đã phản hồi bình luận của bạn.',
    time: '2 phút trước',
    link: '#',
    isRead: false,
  },
  {
    id: '2',
    imageUrl: '/demo.jpg',
    content: 'Trần Phúc đã bình luận bài viết của bạn của bạn.',
    time: '2 phút trước',
    link: '#',
    isRead: true,
  },
  {
    id: '3',
    imageUrl: '/demo.jpg',
    content: 'Trương Samuel đã phản hồi bình luận của bạn.',
    time: '2 phút trước',
    link: '#',
    isRead: true,
  },
  {
    id: '4',
    imageUrl: '/demo.jpg',
    content: 'Trương Samuel đã phản hồi bình luận của bạn.',
    time: '2 phút trước',
    link: '#',
    isRead: true,
  },
  {
    id: '5',
    imageUrl: '/demo.jpg',
    content: 'Trương Samuel đã phản hồi bình luận của bạn.',
    time: '2 phút trước',
    link: '#',
    isRead: true,
  },
  {
    id: '6',
    imageUrl: '/demo.jpg',
    content: 'Trương Samuel đã phản hồi bình luận của bạn.',
    time: '2 phút trước',
    link: '#',
    isRead: false,
  },
  {
    id: '7',
    imageUrl: '/demo.jpg',
    content: 'Trần Phúc đã bình luận bài viết của bạn của bạn.',
    time: '2 phút trước',
    link: '#',
    isRead: true,
  },
  {
    id: '8',
    imageUrl: '/demo.jpg',
    content: 'Trương Samuel đã phản hồi bình luận của bạn.',
    time: '2 phút trước',
    link: '#',
    isRead: true,
  },
  {
    id: '9',
    imageUrl: '/demo.jpg',
    content: 'Trương Samuel đã phản hồi bình luận của bạn.',
    time: '2 phút trước',
    link: '#',
    isRead: true,
  },
  {
    id: '10',
    imageUrl: '/demo.jpg',
    content: 'Trương Samuel đã phản hồi bình luận của bạn.',
    time: '2 phút trước',
    link: '#',
    isRead: true,
  },
]

export default function NotificationPopover() {
  const [openNotification, setOpenNotification] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const page = useRef(0)

  const popoverHandler = () => {
    if (!openNotification && !notifications.length && hasMore) {
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
        <Button placeholder={undefined} variant="text" size="sm">
          <Badge content={2} color="blue" className="">
            <FontAwesomeIcon
              icon={faBell}
              className="text-2xl text-[--text-navbar]"
            />
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
              onClick={() => setOpenNotification(false)}
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
              key={notification.id}
            />
          ))}
        </InfiniteScroll>
      </PopoverContent>
    </Popover>
  )
}
