'use client'
import React from 'react'
import { nunito } from '../../fonts'
import { Button, Avatar, Spinner } from '@material-tailwind/react'
import { Dot, TagsFill } from 'react-bootstrap-icons'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import checkPermission from '@/app/ui/common/checking-permission'
import Cookies from 'js-cookie'
import JoinGroupButton from './join-group-button'

export default function GroupsListItem({ group, onJoinGroup }) {
  const router = useRouter()
  const [isJoining, setIsJoining] = React.useState(false)
  const [isJoined, setIsJoined] = React.useState(group.userRole ? true : false)
  const [isRequestPending, setIsRequestPending] = React.useState(
    group.isRequestPending
  )

  const onClickJoinButton = () => {
    setIsJoining(true)
    onJoinGroup(group.id)
      .then((data) => {})
      .catch((error) => {
        toast.error(
          error.response?.data?.error?.message ||
            'Lỗi không xác định'
        )
      })
      .finally(() => {
        setIsJoining(false)
        if (group.privacy === 'PUBLIC') {
          setIsJoined(true)
        } else if (group.privacy === 'PRIVATE') {
          setIsRequestPending(true)
        }
      })
  }

  return (
    <div
      className={`${nunito.className} flex justify-between items-center gap-4 w-full`}>
      <Link className="flex gap-4" href={`/groups/${group.id}`}>
        <Avatar
          src={group.coverUrl}
          alt="group avatar"
          placeholder={undefined}
          size="lg"
          variant="rounded"
        />
        <div className="max-w-[600px] min-w-[350px] w-[80%]">
          <p className="text-xl font-[500] text-justify -mb-[2px]">
            {group.name}
          </p>
          {!group.isJoined && (
            <>
              <p className="flex items-center text-[--secondary]">
                {group.privacy === 'PUBLIC' ? 'Công khai' : 'Riêng tư'}
                {group.numberMember > 0 && (
                  <>
                    <Dot className="text-black" />
                    {group.numberMember} thành viên
                  </>
                )}
              </p>
            </>
          )}
          {group.tags.length > 0 && (
            <div className="flex items-center gap-1 text-[--secondary]">
              <TagsFill className="text-[--blue-05] " />
              {group.tags.map(({ id, name }) => (
                <span key={id}>{name}</span>
              ))}
            </div>
          )}
          <p className="text-[--secondary] line-clamp-2 w-[90%] xl:w-[100%]">
            {group.description}
          </p>
        </div>
      </Link>

      <JoinGroupButton
        isRequestPending={isRequestPending}
        isJoining={isJoining}
        isJoined={isJoined}
        onClickJoinButton={onClickJoinButton}
        groupId={group.id}
      />
    </div>
  )
}
