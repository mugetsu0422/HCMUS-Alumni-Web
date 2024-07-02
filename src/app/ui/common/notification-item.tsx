import { Avatar } from '@material-tailwind/react'
import Link from 'next/link'
import 'moment/locale/vi'
import clsx from 'clsx'
import { JWT_COOKIE, NOTIFICATION_STATUS } from '@/app/constant'
import moment from 'moment'
import { useState } from 'react'
import {
  NotificationProps,
  NotificationUrlBuilder,
} from '@/helper/notification-url-builder'
import axios from 'axios'
import Cookies from 'js-cookie'

export default function NotificationItem({
  notification,
  lineClamp = 2,
}: {
  notification: NotificationProps
  lineClamp?: number
}) {
  const [isRead, setIsRead] = useState(
    NOTIFICATION_STATUS[notification.status.name] ==
      NOTIFICATION_STATUS['Đã xem']
  )
  const [url, setUrl] = useState(() => {
    const builder = new NotificationUrlBuilder(notification)
    return builder.constructUrl(
      notification.entityTable,
      notification.notificationType
    )
  })

  const onReadNotification = () => {
    setIsRead(true)
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
      onAuxClick={() => onReadNotification()}
      onClick={() => onReadNotification()}
      href={url}
      className={`flex gap-2 px-2 py-3 hover:rounded-lg hover:bg-[--highlight-bg]`}>
      <div>
        <Avatar
          className="w-[56px] h-[56px]"
          placeholder={undefined}
          src={notification.notificationImageUrl}
        />
      </div>
      <div className="flex-1">
        <p className={`text-black line-clamp-${lineClamp}`}>
          {notification.notificationMessage}
        </p>
        <p
          className={clsx({
            'text-sm': true,
            'text-[--blue-05]': !isRead,
            'text-gray-600': isRead,
          })}>
          {moment(notification.createAt).locale('vi').local().fromNow()}
        </p>
      </div>
      <div className="flex justify-center items-center">
        <span
          className={clsx({
            'mx-auto block h-[12px] w-[12px] rounded-full': true,
            'bg-[--blue-05]': !isRead,
          })}
        />
      </div>
    </Link>
  )
}
