'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useRef, useState } from 'react'
import {
  Avatar,
  Carousel,
  Button,
  Textarea,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogFooter,
  Spinner,
} from '@material-tailwind/react'
import { TagFill, SendFill, XLg, HandThumbsUpFill } from 'react-bootstrap-icons'
import Link from 'next/link'
import { nunito } from '../fonts'
import Comments from '../common/comments'
import ImageGrid from './image-grid'
import moment from 'moment'
import 'moment/locale/vi'
import { COMMENT_PAGE_SIZE } from '../../constant'
import TextareaAutosize from 'react-textarea-autosize'

// interface CounselPostProps {
//   id: string
//   title: string
//   content: string
//   childrenCommentNumber: number
//   updateAt: string
//   publishedAt: string
//   tags: { id: string; name: string }[]
//   status: { name: string }
//   creator: { id: string; fullName: string; avatarUrl: string }
//   pictures: { id: string; pictureUrl: string }[]
//   isReacted: boolean
//   reactionCount: number
// }
// interface CommentProps {
//   id: string
//   creator: {
//     id: string
//     fullName: string
//     avatarUrl: string
//   }
//   content: string
//   childrenCommentNumber: number
//   createAt: string
//   updateAt: string
// }
// type UploadCommentHandler = (
//   e: React.FormEvent<HTMLFormElement>,
//   parentId: string | null,
//   content: string
// ) => any
// type FetchChildrenCommentsHandler = (parentId: string) => any

// interface CommentsDialogProps {
//   post: CounselPostProps
//   comments: CommentProps[]
//   openCommentsDialog: boolean
//   handleOpenCommentDialog: () => void
//   onUploadComment: UploadCommentHandler
//   onFetchChildrenComments: FetchChildrenCommentsHandler
// }

export default function CommentsDialog({
  post,
  comments,
  openCommentsDialog,
  handleOpenCommentDialog,
  onUploadComment,
  onEditComment,
  onDeleteComment,
  onFetchChildrenComments,
  onFetchComments,
}) {
  const [uploadComment, setUploadComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const commentPage = useRef(0)

  // Function to handle changes in the textarea
  const handleUploadCommentChange = (event) => {
    setUploadComment(event.target.value)
  }
  const onShowMoreComments = (page: number, pageSize: number) => {
    setIsLoading(true)
    onFetchComments(page, pageSize).then(() => {
      setIsLoading(false)
    })
  }

  return (
    <Dialog
      size="lg"
      className="h-[90dvh] flex flex-col"
      placeholder={undefined}
      open={openCommentsDialog}
      handler={handleOpenCommentDialog}>
      <DialogHeader
        placeholder={undefined}
        className={`${nunito.className} sticky top-0 flex items-center`}>
        <p className="m-auto text-xl text-black">
          Bài viết của {post.creator.fullName}
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
        className={`${nunito.className} flex-1 overflow-y-auto scrollbar-webkit-main`}>
        <div className="flex gap-2 items-center">
          <Link href="#">
            <Avatar
              placeholder={undefined}
              src={post.creator.avatarUrl}
              size="lg"
            />
          </Link>
          <div className="flex flex-col gap-1">
            <p className="font-bold text-lg text-black">
              {post.creator.fullName}
            </p>
            <p className="text-sm text-[--secondary]">
              {moment(post.publishedAt).locale('vi').local().fromNow(true)}
            </p>
          </div>
        </div>

        <div>
          {/* this is the header of the body */}
          <div className="mt-3">
            <p className="text-xl uppercase font-bold text-black">
              {post.title}
            </p>
            <div className="flex items-center gap-2 text-[--secondary]">
              {post.tags.length != 0 && (
                <>
                  <TagFill className="text-[--blue-02]" />
                  {post.tags.map(({ id, name }) => (
                    <span key={id}>{name}</span>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* this is the content of the body */}
          <div className="flex flex-col gap-2">
            <div className="overflow-hidden">
              <div className={` whitespace-pre-line text-black font-normal`}>
                {post.content}
              </div>

              {/* <span
                className="text-black font-semibold hover:underline hover:cursor-pointer rounded text-nowrap inline-flex"
                onClick={toggleExpand}>
                Xem thêm
              </span> */}
            </div>
            {post.pictures.length > 0 && <ImageGrid pictures={post.pictures} />}
          </div>
        </div>

        {/* this is the comment */}

        {post.reactionCount > 0 || post.childrenCommentNumber > 0 ? (
          <div className="flex flex-col">
            <div className="flex justify-between my-3 mx-1">
              {post.reactionCount > 0 ? (
                <div className="flex items-center gap-1">
                  <HandThumbsUpFill className="rounded-full p-[6px] bg-[--blue-02] text-[24px] text-white" />
                  <p className="text-[16px]">{post.reactionCount}</p>
                </div>
              ) : (
                <div> </div>
              )}

              {post.childrenCommentNumber > 0 && (
                <div>{post.childrenCommentNumber} Bình luận</div>
              )}
            </div>
            <span className="border-t-[1px] border-[--secondary]"></span>
          </div>
        ) : (
          ''
        )}

        <div className={`${nunito.className} mt-2`}>
          <p className="text-black font-bold text-lg">Bình luận</p>
          <Comments
            comments={comments}
            onUploadComment={onUploadComment}
            onEditComment={onEditComment}
            onDeleteComment={onDeleteComment}
            onFetchChildrenComments={onFetchChildrenComments}
          />
          {comments.length < post.childrenCommentNumber && (
            <div
              onClick={() => {
                onShowMoreComments(++commentPage.current, COMMENT_PAGE_SIZE)
              }}
              className="group w-full flex gap-2 text-[--secondary] justify-between">
              <span className="group-hover:underline group-hover:cursor-pointer flex gap-3">
                Xem thêm bình luận
                {isLoading && <Spinner className="w-4" />}
              </span>
              <span>
                {comments.length}/{post.childrenCommentNumber}
              </span>
            </div>
          )}
        </div>
      </DialogBody>

      <DialogFooter placeholder={undefined} className="h-fit py-3 bg-white">
        <form
          className="h-full flex flex-start items-start w-full gap-2"
          onSubmit={(e) => {
            onUploadComment(e, null, uploadComment)
            setUploadComment('')
          }}>
          <Avatar placeholder={undefined} src={'/demo.jpg'} alt="avatar user" />
          <TextareaAutosize
            spellCheck="false"
            minRows={1}
            maxRows={8}
            placeholder="Bình luận của bạn"
            className="focus:border-transparent w-full bg-[var(--comment-input)] scrollbar-webkit-main resize-none p-2 px-3 rounded-xl outline-none text-black"
            value={uploadComment}
            onChange={handleUploadCommentChange}
          />
          <Button
            type="submit"
            placeholder={undefined}
            variant="text"
            className="p-2">
            <SendFill className="text-xl" />
          </Button>
        </form>
      </DialogFooter>
    </Dialog>
  )
}
