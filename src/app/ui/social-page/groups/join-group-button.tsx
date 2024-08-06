import React from 'react'
import checkPermission from '../../common/checking-permission'
import { Button, Spinner } from '@material-tailwind/react'
import Link from 'next/link'
import useAuth from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'

export default function JoinGroupButton({
  isRequestPending,
  isJoining,
  isJoined,
  onClickJoinButton,
  groupId,
}) {
  const { userId } = useAuth()
  const router = useRouter()

  return (
    <>
      {checkPermission('Group.Join') ? (
        isRequestPending ? (
          <Button
            disabled={true}
            onClick={onClickJoinButton}
            size="sm"
            placeholder={undefined}
            className="h-fit text-white bg-[--blue-02] normal-case text-[14px] w-36 flex justify-center items-center gap-2">
            {isJoining && <Spinner className="h-[14px] w-[14px]" />}
            Đang chờ duyệt
          </Button>
        ) : isJoined ? (
          <Link href={`/groups/${groupId}`}>
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
            className="h-fit text-white bg-[--blue-02] normal-case text-[14px] w-36 flex justify-center items-center gap-2">
            {isJoining && <Spinner className="h-[14px] w-[14px]" />}
            Tham gia
          </Button>
        )
      ) : (
        <Button
          onClick={() => router.push(`/profile/${userId}`)}
          size="sm"
          placeholder={undefined}
          className="h-fit bg-[#e4e6eb] text-[#4b4f56] normal-case text-[14px] w-fit flex justify-center items-center gap-2">
          {isJoining && <Spinner className="h-[14px] w-[14px]" />}
          Xét duyệt để tham gia
        </Button>
      )}
    </>
  )
}
