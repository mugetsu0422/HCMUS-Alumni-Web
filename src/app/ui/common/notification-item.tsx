import { MenuItem, Avatar } from '@material-tailwind/react'
import Link from 'next/link'
import 'moment/locale/vi'
import clsx from 'clsx'
import { nunito } from '../fonts'

export default function NotificationItem({ notification }) {
  return (
    <Link
      href={notification.link}
      className={`flex gap-2 px-2 py-3 hover:rounded-lg hover:bg-[var(--highlight-bg)]`}>
      <div>
        <Avatar
          className="w-[56px] h-[56px]"
          placeholder={undefined}
          src={notification.imageUrl}
        />
      </div>
      <div className="flex-1">
        <p className="text-black ">{notification.content}</p>
        <p
          className={clsx({
            // 'font-semibold': true,
            'text-[--blue-05]': !notification.isRead,
          })}>
          {notification.time}
        </p>
      </div>
      <div className="flex justify-center items-center">
        <span
          className={`mx-auto block h-[10px] w-[10px] rounded-full ${
            !notification.isRead ? 'bg-[--blue-05]' : ''
          } `}
        />
      </div>
    </Link>
  )
}
