import { Avatar } from '@material-tailwind/react'
import Link from 'next/link'
import 'moment/locale/vi'
import clsx from 'clsx'
import { NOTIFICATION_STATUS } from '@/app/constant'
import moment from 'moment'
import { useState } from 'react'
import {
  NotificationEntityTable,
  NotificationProps,
  NotificationType,
  NotificationUrlBuilder,
} from '@/helper/notification-url-builder'

export default function NotificationItem({
  notification,
  lineClamp = 2,
}: {
  notification: NotificationProps
  lineClamp?: number
}) {
  const [url, setUrl] = useState(() => {
    const builder = new NotificationUrlBuilder(notification)
    return builder.constructUrl(
      notification.entityTable,
      notification.notificationType
    )
  })

  console.log(url)
  return (
    <Link
      href={url}
      className={`flex gap-2 px-2 py-3 hover:rounded-lg hover:bg-[var(--highlight-bg)]`}>
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
            'text-[--blue-05]': NOTIFICATION_STATUS[notification.status.name],
          })}>
          {moment(notification.createAt).locale('vi').local().fromNow()}
        </p>
      </div>
      <div className="flex justify-center items-center">
        <span
          className={clsx({
            'mx-auto block h-[12px] w-[12px] rounded-full': true,
            'bg-[--blue-05]': NOTIFICATION_STATUS[notification.status.name],
          })}
        />
      </div>
    </Link>
  )
}
