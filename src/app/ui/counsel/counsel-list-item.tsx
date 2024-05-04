/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react'
import { Avatar, Carousel, Button } from '@material-tailwind/react'
import { nunito } from '../fonts'
import { TagFill, Chat } from 'react-bootstrap-icons'
import Link from 'next/link'
import CommentsDialog from './counsel-comments-dialog'

export default function CounselListItem({
  id,
  title,
  content,
  tags,
  creator,
  publishedAt,
  pictures,
}) {
  const [openCommentsDialog, setOpenCommentsDialog] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  function handleOpenCommentDialog() {
    setOpenCommentsDialog((e) => !e)
  }

  return (
    <div className={`${nunito.className} flex flex-col w-full h-fit my-4`}>
      {/* this is the header of a post */}
      <div className="flex gap-2 items-center">
        <Link href="#">
          <Avatar placeholder={undefined} src={creator.avatarUrl} size="lg" />
        </Link>

        <div className="flex flex-col gap-1">
          <p className="font-bold text-lg">{creator.fullName}</p>
          <p className="text-sm text-[--secondary]">{publishedAt}</p>
        </div>
      </div>

      {/* this is the body of a post */}
      <div>
        {/* this is the header of the body */}
        <div className="mt-3">
          <p className="text-xl uppercase font-bold">{title}</p>
          <div className="flex items-center gap-2 text-[--secondary]">
            <TagFill className="text-[--blue-02]" />
            {tags.map(({ id, name }) => (
              <span key={id}>{name}</span>
            ))}
          </div>
        </div>

        {/* this is the content of the body */}
        <div className="flex flex-col gap-2 ">
          <div className="overflow-hidden">
            <div className={`${isExpanded ? 'block' : 'line-clamp-3'}`}>
              {content}
            </div>
            {!isExpanded && (
              <span
                className="text-black font-semibold hover:underline hover:cursor-pointer rounded text-nowrap inline-flex"
                onClick={toggleExpand}>
                Xem thêm
              </span>
            )}
          </div>
          <span className="border-b-[1px] border-[--secondary]"></span>
          <Carousel placeholder={undefined}>
            {pictures.map(({ id, pictureUrl }) => (
              <img
                key={id}
                src={pictureUrl}
                alt="image post"
                className="w-full h-[550px] object-cover object-center"
              />
            ))}
          </Carousel>
          <span className="border-t-[1px] border-[--secondary]"></span>
        </div>
        {/* this is the footer of the body */}
        <Button
          onClick={handleOpenCommentDialog}
          placeholder={undefined}
          variant="text"
          className="flex gap-1 py-2 px-4 normal-case">
          <Chat className="text-[16px]" />
          <span className="text-[14px]">Bình luận</span>
        </Button>

        <CommentsDialog
          openCommentsDialog={openCommentsDialog}
          handleOpenCommentDialog={handleOpenCommentDialog}
          id={id}
          key={id}
          title={title}
          content={content}
          tags={tags}
          publishedAt={publishedAt}
          creator={creator}
          pictures={pictures}
        />
      </div>
    </div>
  )
}
