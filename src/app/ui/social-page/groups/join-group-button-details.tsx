import React from 'react'
import checkPermission from '../../common/checking-permission'
import {
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Spinner,
} from '@material-tailwind/react'
import Link from 'next/link'
import useAuth from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { BoxArrowInRight } from 'react-bootstrap-icons'

export default function JoinGroupButtonDetails({
  isRequestPending,
  isJoining,
  isJoined,
  onClickJoinButton,
  handleOpenLeaveGroupDialog,
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
          <Menu placement="bottom-end">
            <MenuHandler>
              <Button
                placeholder={undefined}
                className="normal-case px-4 py-2 text-[14px] h-fit bg-[--blue-04] text-[--blue-05] ">
                Đã tham gia
              </Button>
            </MenuHandler>
            <MenuList placeholder={undefined}>
              <MenuItem
                placeholder={undefined}
                onClick={handleOpenLeaveGroupDialog}
                className="flex items-center gap-1 text-black py-3">
                <BoxArrowInRight className="text-lg" />
                Rời khỏi nhóm
              </MenuItem>
            </MenuList>
          </Menu>
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
