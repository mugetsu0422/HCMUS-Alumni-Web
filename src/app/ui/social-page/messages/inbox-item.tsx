import { MESSAGE_TYPE } from '@/app/constant'
import { Avatar } from '@material-tailwind/react'
import moment from 'moment'
import Link from 'next/link'
import React from 'react'
import { plusJakartaSans } from '@/app/ui/fonts'
import Cookies from 'js-cookie'
import clsx from 'clsx'

export default function InboxItem({ id, user, latestMessage, currentInboxId }) {
  const userID = Cookies.get('userId')

  return (
    <Link
      href={`/messages/inbox/${id.inboxId}`}
      key={id.inboxId}
      className={clsx(plusJakartaSans.className, {
        'p-3 pr-0 flex flex-0 h-fit rounded-lg hover:bg-blue-gray-50 hover:cursor-pointer w-full':
          true,
        'bg-[--highlight-bg]': id.inboxId === currentInboxId,
      })}>
      <Avatar
        placeholder={undefined}
        src={user.avatarUrl}
        size="lg"
        alt="user avatar"
      />
      {
        <div className="hidden ml-2 md:flex w-full items-center">
          <div className="max-w-[250px] flex flex-col">
            <p className="font-bold text-black text-base truncate">
              {user.fullName}
            </p>
            <div className="text-[14px] text-[--text-navbar]">
              <span className={`truncate shrink w-full`}>
                {latestMessage.messageType === MESSAGE_TYPE.TEXT
                  ? latestMessage.sender.id === userID
                    ? 'Bạn: ' + latestMessage.content
                    : latestMessage.content
                  : `${latestMessage.sender.fullName} đã gửi 1 phương tiện`}
              </span>
              <span> · </span>
              <span>
                {moment(latestMessage.createAt)
                  .locale('vi')
                  .local()
                  .fromNow(true)}
              </span>
            </div>
          </div>
        </div>
      }
    </Link>
  )
}
