'use client'
import React from 'react'
import { nunito } from '../../fonts'
import { Button, Avatar, Spinner } from '@material-tailwind/react'
import { Dot } from 'react-bootstrap-icons'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function GroupsListItem({ group, onJoinGroup }) {
  const router = useRouter()
  const [isJoining, setIsJoining] = React.useState(false)
  const [isJoined, setIsJoined] = React.useState(group.userRole ? true : false)

  const onClickJoinButton = () => {
    setIsJoining(true)
    onJoinGroup(group.id)
      .then((data) => {
        setIsJoined(true)
      })
      .catch((error) => {
        console.error(error)
        toast.error(error.response.data.error?.message || 'Lỗi không xác định')
      })
      .finally(() => {
        setIsJoining(false)
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
        />
        <div className="max-w-[600px] min-w-[350px] w-[80%]">
          <p className="text-[18px] font-[500] text-justify">{group.name}</p>
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
          <p className="text-[#65676b] text-[13px] line-clamp-2 w-[90%] xl:w-[100%]">
            {group.description}
          </p>
        </div>
      </div>

      {isJoined ? (
        <Button
          onClick={() => router.push(`/groups/${group.id}`)}
          size="sm"
          placeholder={undefined}
          className="h-fit bg-[#e4e6eb] text-black normal-case text-[14px] w-32 flex justify-center items-center gap-2">
          Xem nhóm
        </Button>
      ) : (
        <Button
          disabled={isJoining}
          onClick={onClickJoinButton}
          size="sm"
          placeholder={undefined}
          className="h-fit text-white bg-[--blue-05] normal-case text-[14px] w-32 flex justify-center items-center gap-2">
          {isJoining && <Spinner className="h-[14px] w-[14px]" />}
          Tham gia
        </Button>
      )}
    </div>
  )
}
