import { JWT_COOKIE } from '@/app/constant'
import {
  NotificationProps,
  NotificationUrlBuilder,
} from '@/helper/notification-url-builder'
import { Avatar } from '@material-tailwind/react'
import axios from 'axios'
import moment from 'moment'
import Link from 'next/link'
import React, { useState } from 'react'
import Cookies from 'js-cookie'

export default function NotificationToast({
  notification,
  onDismiss,
}: {
  notification: NotificationProps
  onDismiss: (id: number) => void
}) {
  const [url, setUrl] = useState(() => {
    const builder = new NotificationUrlBuilder(notification)
    return builder.constructUrl(
      notification.entityTable,
      notification.notificationType
    )
  })

  const onReadNotification = () => {
    onDismiss(notification.id)
    axios.put(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/notification/${notification.id}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
  }

  return (
    <Link
      onClick={() => onReadNotification()}
      href={url}
      className={`w-[400px] bg-white border-solid border-2 border-[--blue-05] flex gap-2 p-3 rounded-lg`}>
      <div>
        <Avatar
          className="w-[56px] h-[56px]"
          placeholder={undefined}
          src={notification.notificationImageUrl}
        />
      </div>
      <div className="flex-1">
        <p className={`text-black line-clamp-3`}>
          {notification.notificationMessage}
        </p>
        <p className={`text-sm text-[--blue-05]`}>
          {moment(notification.createAt).locale('vi').local().fromNow(true)}
        </p>
      </div>
    </Link>
  )
}
