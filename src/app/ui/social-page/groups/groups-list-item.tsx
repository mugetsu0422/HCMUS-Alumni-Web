'use client'
import React from 'react'
import { nunito } from '../../fonts'
import { Button, Avatar, Spinner } from '@material-tailwind/react'
import { Dot, TagsFill } from 'react-bootstrap-icons'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'

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
        toast.error(error.response?.data?.error?.message.error?.message || 'Lỗi không xác định')
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
    <div className="flex justify-between items-center gap-4 w-full">
      <div className="flex gap-4">
        <Avatar
          src={group.coverUrl}
          alt="group avatar"
          placeholder={undefined}
          size="lg"
          variant="rounded"
        />
        <div className="max-w-[600px] min-w-[350px] w-[80%]">
          <p className="text-[18px] font-[500] text-justify -mb-[2px]">{group.name}</p>
          {!group.isJoined && (
            <>
              <p className="flex items-center text-[#65676b]">
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
            <div className="flex text-[13px] items-center gap-1 text-[#65676b]">
              <TagsFill className="text-[--blue-05] " />
              {group.tags.map(({ id, name }) => (
                <span key={id}>{name}</span>
              ))}
            </div>
          )}
          <p className="text-[#65676b] text-[13px] line-clamp-2 w-[90%] xl:w-[100%]">
            {group.description}
          </p>
        </div>
      </div>

      {isRequestPending ? (
        <Button
          disabled={true}
          onClick={onClickJoinButton}
          size="sm"
          placeholder={undefined}
          className="h-fit text-white bg-[--blue-05] normal-case text-[14px] w-36 flex justify-center items-center gap-2">
          {isJoining && <Spinner className="h-[14px] w-[14px]" />}
          Đang chờ duyệt
        </Button>
      ) : isJoined ? (
        <Link href={`/groups/${group.id}`}>
          <Button
            size="sm"
            placeholder={undefined}
            className="h-fit bg-[#e4e6eb] text-black normal-case text-[14px] w-36 flex justify-center items-center gap-2">
            Xem nhóm
          </Button>
        </Link>
      ) : (
        <Button
          disabled={isJoining}
          onClick={onClickJoinButton}
          size="sm"
          placeholder={undefined}
          className="h-fit text-white bg-[--blue-05] normal-case text-[14px] w-36 flex justify-center items-center gap-2">
          {isJoining && <Spinner className="h-[14px] w-[14px]" />}
          Tham gia
        </Button>
      )}
    </div>
  )
}
