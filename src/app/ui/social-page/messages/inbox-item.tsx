import { MESSAGE_TYPE } from '@/app/constant'
import { Avatar } from '@material-tailwind/react'
import moment from 'moment'
import Link from 'next/link'
import React from 'react'
import { plusJakartaSans } from '@/app/ui/fonts'
import Cookies from 'js-cookie'
import clsx from 'clsx'

export default function InboxItem({
  id,
  user,
  latestMessage,
  currentInboxId,
  hasRead,
}) {
  const userID = Cookies.get('userId')

  return (
    <Link
      href={`/messages/inbox/${id.inboxId}`}
      key={id.inboxId}
      className={clsx(plusJakartaSans.className, {
        'p-3 flex flex-0 h-fit rounded-lg hover:cursor-pointer w-fit lg:w-full justify-center':
          true,
        'bg-[--highlight-bg]': id.inboxId === currentInboxId,
        'hover:bg-blue-gray-50': id.inboxId !== currentInboxId,
      })}>
      <Avatar
        placeholder={undefined}
        src={user.avatarUrl}
        size="lg"
        alt="user avatar"
        className="grow-0 shrink-0"
      />
      {
        <div className="hidden ml-2 lg:flex flex-1 items-center">
          <div className="flex flex-col">
            <p className="max-w-[200px] font-bold text-black text-[15px] truncate">
              {user.fullName}
            </p>
            <div
              className={clsx('max-w-[200px] flex gap-[2px] text-[13px]', {
                'text-[--text-navbar]': hasRead === null || hasRead === true,
                'font-bold': hasRead === false,
              })}>
              <span className={`max-w-[150px] truncate`}>
                {latestMessage.messageType === MESSAGE_TYPE.TEXT
                  ? latestMessage.sender.id === userID
                    ? 'Bạn: ' + latestMessage.content
                    : latestMessage.content
                  : `${latestMessage.sender.fullName.substring(
                      latestMessage.sender.fullName.lastIndexOf(' ') + 1
                    )} đã gửi 1 phương tiện`}
              </span>
              <span className="grow-0 shrink-0">·</span>
              <span className="grow-0 shrink-0 text-[--text-navbar] font-normal">
                {moment(latestMessage.createAt)
                  .locale('vi')
                  .local()
                  .fromNow(true)}
              </span>
            </div>
          </div>
        </div>
      }
      <div className="flex justify-center items-center">
        <span
          className={clsx({
            'mx-auto block h-[12px] w-[12px] rounded-full': true,
            'bg-[--blue-05]': hasRead === false,
          })}
        />
      </div>
    </Link>
  )
}
