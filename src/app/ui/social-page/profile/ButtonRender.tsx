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

  return (
    !isProfileLoginUser && (
      <div className="flex gap-2">
        <RenderButton
          onHandleRequest={onHandleRequest}
          handledeletefriend={handledeletefriend}
          stateFriend={user?.isFriendStatus}
          setStateFriend={setStateFriend}
        />

        <Button placeholder={undefined} className="bg-[--blue-05] normalcase">
          Nhắn tin
        </Button>
      </div>
    )
  )
}
