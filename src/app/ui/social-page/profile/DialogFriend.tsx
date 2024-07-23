'use client'

import React from 'react'
import {
  Dialog,
  DialogBody,
  DialogHeader,
  Button,
  Avatar,
  Spinner,
} from '@material-tailwind/react'
import Link from 'next/link'
import { XLg } from 'react-bootstrap-icons'
import InfiniteScroll from 'react-infinite-scroll-component'

export default function DialogFriend({
  friendList,
  openFriendDiaolog,
  handleOpenFriendDiaolog,
  userFullName,
  hasMore,
  onFetchMoreFriend,
}) {
  return (
    <Dialog
      placeholder={undefined}
      open={openFriendDiaolog}
      handler={handleOpenFriendDiaolog}
      size="xs">
      <DialogHeader placeholder={undefined}>
        <p className="m-auto text-xl text-black">
          Danh sách bạn bè của {userFullName}
        </p>
        <Button
          onClick={handleOpenFriendDiaolog}
          placeholder={undefined}
          className="rounded-full p-2"
          variant="text">
          <XLg className="text-lg" />
        </Button>
      </DialogHeader>
      <DialogBody placeholder={undefined} className="flex flex-col gap-2">
      <InfiniteScroll
            dataLength={friendList.length}
            next={onFetchMoreFriend}
            hasMore={hasMore}
            loader={
              <div className="h-10 flex justify-center ">
                <Spinner className="h-8 w-8"></Spinner>
              </div>
            }>
             {friendList.map(({ friend }) => (
          <Link
            key={friend.id}
            href={`/profile/${friend.id}/about`}
            className="flex gap-4 items-center hover:bg-gray-100 py-3 px-2 rounded-lg">
            <Avatar size="md" src={friend.avatarUrl} placeholder={undefined} />
            <p className="text-black">{friend.fullName}</p>
          </Link>
        ))}
          </InfiniteScroll>
       
      </DialogBody>
    </Dialog>
  )
}
