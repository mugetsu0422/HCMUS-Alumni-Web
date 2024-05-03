'use client'
/* eslint-disable @next/next/no-img-element */

import React from 'react'
import {
  Avatar,
  Carousel,
  Button,
  Textarea,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogFooter,
} from '@material-tailwind/react'
import { TagFill, SendFill, XLg } from 'react-bootstrap-icons'
import Link from 'next/link'
import { nunito } from '../fonts'
import Comments from '../social-page/news/comments'

export default function CommentsDialog({
  openCommentsDialog,
  handleOpenCommentDialog,
  id,
  title,
  content,
  tags,
  creator,
  publishedAt,
  pictures,
}) {
  return (
    <Dialog
      placeholder={undefined}
      open={openCommentsDialog}
      handler={handleOpenCommentDialog}>
      <DialogHeader
        placeholder={undefined}
        className={`${nunito.className} sticky top-0 flex items-center`}>
        <p className="m-auto text-xl text-black">
          Bài viết của {creator.fullName}
        </p>
        <Button
          onClick={handleOpenCommentDialog}
          placeholder={undefined}
          className="rounded-full p-2"
          variant="text">
          <XLg className="text-lg" />
        </Button>
      </DialogHeader>

      <DialogBody
        placeholder={undefined}
        className={`${nunito.className} h-[700px] overflow-y-auto scrollbar-webkit-main`}>
        <div className="flex gap-2 items-center">
          <Link href="#">
            <Avatar placeholder={undefined} src={creator.avatarUrl} size="lg" />
          </Link>
          <div className="flex flex-col gap-1">
            <p className="font-bold text-lg text-black">{creator.fullName}</p>
            <p className="text-sm text-[--secondary]">{publishedAt}</p>
          </div>
        </div>

        <div>
          {/* this is the header of the body */}
          <div className="mt-3">
            <p className="text-xl uppercase font-bold text-black">{title}</p>
            <div className="flex items-center gap-2 text-[--secondary]">
              <TagFill className="text-[--blue-02]" />
              {tags.map(({ id, name }) => (
                <span key={id}>{name}</span>
              ))}
            </div>
          </div>

          {/* this is the content of the body */}
          <div className="flex flex-col gap-2">
            <p className="py-2 text-black">{content}</p>
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
        </div>

        {/* this is the comment */}
        <div className={`${nunito.className} mt-2`}>
          <p className="text-black font-bold text-lg">Bình luận</p>
          {/* <Comments
            comments={comments}
            onUploadComment={onUploadComment}
            onFetchChildrenComments={onFetchChildrenComments}
          /> */}
        </div>
      </DialogBody>

      <DialogFooter
        placeholder={undefined}
        className="sticky bottom-0 h-fit py-3">
        <div className="flex flex-start items-center w-full">
          <Avatar placeholder={undefined} src={'/demo.jpg'} alt="avatar user" />
          <Textarea
            rows={1}
            resize={true}
            placeholder="Bình luận của bạn"
            className="min-h-full !border-0 focus:border-transparent w-full"
            containerProps={{
              className: 'grid h-full',
            }}
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
          />
          <Button placeholder={undefined} variant="text" className="p-2">
            <SendFill className="text-xl" />
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  )
}
