'use client'
import React from 'react'
import { nunito } from '../../fonts'
import { Button, Avatar } from '@material-tailwind/react'
import { Dot } from 'react-bootstrap-icons'
import { useRouter } from 'next/navigation'

export default function GroupsListItem({ group }) {
  const router = useRouter()
  return (
    <div className="flex justify-between items-center gap-4 w-full">
      <div className="flex gap-4">
        <Avatar
          src={group.avatarUrl}
          alt="group avatar"
          placeholder={undefined}
          size="lg"
        />
        <div className="max-w-[600px] min-w-[350px] w-[80%]">
          <p className="text-[18px] font-[500] text-justify">{group.name}</p>
          {!group.isJoined && (
            <>
              <p className="flex items-center text-[#65676b]">
                {group.privacy} <Dot className="text-black" />{' '}
                {group.numberMember} thành viên
              </p>
            </>
          )}
          <p className="text-[#65676b] text-[13px] line-clamp-2">
            {group.description}
          </p>
          {!group.isJoined && (
            <>
              <p className="flex items-center text-[#65676b]">
                {group.friendsInGroup
                  .slice(0, 3)
                  .map(({ id, avatarUrl }, idx) => (
                    <Avatar
                      key={id}
                      src={avatarUrl}
                      alt="avatar user"
                      placeholder={undefined}
                      size="xs"
                      className={`border border-white relative -mr-2 last:mr-1`}
                    />
                  ))}
                {group.friendsInGroup.length > 3
                  ? `${group.friendsInGroup.length - 3} người bạn là thành viên`
                  : 'người bạn là thành viên'}
              </p>
            </>
          )}
        </div>
      </div>

      {group.isJoined ? (
        <Button
          onClick={() => router.push(`/groups/${group.id}`)}
          size="sm"
          placeholder={undefined}
          className="h-fit bg-[#e4e6eb] text-black normal-case text-[14px]">
          Xem nhóm
        </Button>
      ) : (
        <Button
          onClick={() => router.push(`/groups/${group.id}`)}
          size="sm"
          placeholder={undefined}
          className="h-fit bg-[--blue-04] text-[--blue-05] normal-case text-[14px]">
          Tham gia
        </Button>
      )}
    </div>
  )
}
