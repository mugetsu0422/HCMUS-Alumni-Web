'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useRef, useState } from 'react'
import {
  Avatar,
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  Spinner,
} from '@material-tailwind/react'
import { XLg, HandThumbsUpFill } from 'react-bootstrap-icons'
import { nunito } from '../fonts'
import 'moment/locale/vi'
import InfiniteScroll from 'react-infinite-scroll-component'
import Link from 'next/link'

export default function ReactionDialog({
  users,
  reactionCount,
  onFetchReation,
  openReactDialog,
  hanldeOpenReactDialog,
}) {
  const reactionPage = useRef(0)
  const [hasMore, setHasMore] = useState(true)

  const onFetchMore = () => {
    if (users.length >= reactionCount) {
      setHasMore(false)
      return
    }
    reactionPage.current++
    onFetchReation(reactionPage.current)
  }

  return (
    <Dialog
      size="xs"
      placeholder={undefined}
      open={openReactDialog}
      handler={hanldeOpenReactDialog}>
      <DialogHeader
        placeholder={undefined}
        className={`${nunito.className} sticky top-0 flex items-center`}>
        <p className="m-auto text-xl text-black">Người đã bày tỏ cảm xúc</p>
        <Button
          onClick={hanldeOpenReactDialog}
          placeholder={undefined}
          className="rounded-full p-2"
          variant="text">
          <XLg className="text-lg" />
        </Button>
      </DialogHeader>

      <DialogBody
        id="scrollableReaction"
        placeholder={undefined}
        className={`${nunito.className} flex flex-col gap-4 h-[50dvh] overflow-y-auto scrollbar-webkit-main`}>
        <InfiniteScroll
          className="flex flex-col gap-2"
          dataLength={users.length}
          next={onFetchMore}
          hasMore={hasMore}
          loader={
            <div className="h-10 my-5 flex justify-center">
              <Spinner className="h-8 w-8"></Spinner>
            </div>
          }
          scrollableTarget="scrollableReaction">
          {users.map(({ creator: { id, fullName, avatarUrl } }) => (
            <Link
              href={`/profile/${id}/about`}
              key={id}
              className="flex items-center justify-between hover:bg-gray-400/[.25] p-2 rounded-lg">
              <div className="flex gap-3 items-center">
                <Avatar
                  placeholder={undefined}
                  src={avatarUrl} 
                  alt="user-avatar"
                />
                <p className="text-base text-black font-semibold">{fullName}</p>
              </div>
              <HandThumbsUpFill className="rounded-full p-[6px] bg-[--blue-02] text-[24px] text-white" />
            </Link>
          ))}
        </InfiniteScroll>
      </DialogBody>
    </Dialog>
  )
}
