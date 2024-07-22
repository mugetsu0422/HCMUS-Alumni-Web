'use client'

import React from 'react'
import {
  PersonCheckFill,
  PersonXFill,
  PersonPlusFill,
} from 'react-bootstrap-icons'
import {
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from '@material-tailwind/react'
import { usePathname, useRouter } from 'next/navigation'
import { getDataUser } from '@/lib/features/new-message/new-message'
import { useDispatch } from 'react-redux'
import { JWT_COOKIE, MESSAGE_TYPE } from '@/app/constant'
import axios from 'axios'
import Cookies from 'js-cookie'

function RenderButton({
  onHandleRequest,
  handledeletefriend,
  stateFriend,
  setStateFriend,
}) {
  switch (stateFriend) {
    case 'Pending':
      return (
        <Button
          onClick={() => {
            onHandleRequest()
            setStateFriend('Not Friend')
          }}
          placeholder={undefined}
          className="text-black bg-[#d8dadf] normalcase flex items-center gap-2">
          <PersonXFill className="text-lg" />
          Hủy lời mời
        </Button>
      )
    case 'true':
      return (
        <Menu placement="bottom-end">
          <MenuHandler>
            <Button
              placeholder={undefined}
              className="text-white bg-[--blue-05] normalcase flex items-center gap-2">
              <PersonCheckFill className="text-lg" />
              Bạn bè
            </Button>
          </MenuHandler>
          <MenuList placeholder={undefined}>
            <MenuItem
              placeholder={undefined}
              className="flex items-center gap-1 text-black py-3 bg-white"
              onClick={() => {
                handledeletefriend()
                setStateFriend('Not Friend')
              }}>
              Hủy bạn bè
            </MenuItem>
          </MenuList>
        </Menu>
      )
    case 'Not Friend':
      return (
        <Button
          onClick={() => {
            onHandleRequest()
            setStateFriend('Pending')
          }}
          placeholder={undefined}
          className="text-white bg-[--blue-05] normalcase flex items-center gap-2">
          <PersonPlusFill className="text-lg" />
          Thêm bạn bè
        </Button>
      )
    default:
      return null
  }
}

export default function ButtonRedering({
  isProfileLoginUser,
  user,
  onHandleRequest,
  handledeletefriend,
}) {
  const [stateFriend, setStateFriend] = React.useState(user?.isFriendStatus)
  const pathname = usePathname()
  const part = pathname.split('/')
  const router = useRouter()
  const dispatch = useDispatch()

  const onMessage = () => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/messages/inbox/individual/${part[2]}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { inboxId } }) => {
        router.push(`/messages/inbox/${inboxId}`)
      })
      .catch((error) => {
        // Handle the error if the request fails
        router.push(`/messages/inbox/new`)
        dispatch(getDataUser({
          id: user.user.id,
          fullName: user.user.fullName,
          avatarUrl: user.user.avatarUrl,
        }))
      })
  }

  return (
    !isProfileLoginUser && (
      <div className="flex gap-2">
        <RenderButton
          onHandleRequest={onHandleRequest}
          handledeletefriend={handledeletefriend}
          stateFriend={user?.isFriendStatus}
          setStateFriend={setStateFriend}
        />

        <Button
          onClick={onMessage}
          placeholder={undefined}
          className="bg-[--blue-05] normalcase">
          Nhắn tin
        </Button>
      </div>
    )
  )
}
