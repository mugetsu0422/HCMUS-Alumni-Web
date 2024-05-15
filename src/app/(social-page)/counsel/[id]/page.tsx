'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState, useLayoutEffect, useRef } from 'react'
import {
  Avatar,
  Button,
  Textarea,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Spinner,
} from '@material-tailwind/react'
import {
  TagFill,
  SendFill,
  HandThumbsUpFill,
  HandThumbsUp,
  ThreeDots,
  Trash,
  Pencil,
} from 'react-bootstrap-icons'
import Link from 'next/link'
import Comments from '../../../ui/social-page/news/comments'
import { nunito } from '../../../ui/fonts'
import ImageGird from '../../../ui/counsel/image-grid'
import moment from 'moment'
import 'moment/locale/vi'
import { useForm } from 'react-hook-form'
import { COMMENT_PAGE_SIZE } from '../../../constant'
import ReactDialog from '../../../ui/counsel/counsel-react-dialog'
import { useRouter } from 'next/navigation'
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

const data = {
  id: '1',
  title: 'Tư vấn hỗ trợ giải đáp thắc mắc trong học tập',
  childrenCommentNumber: 10,
  updateAt: '02-05-2024',
  content:
    'Bài viết này sẽ giúp các bạn giải đáp thắc mắc trong quá trình học tập tại trường. Ai có thắc mắc gì thì commnet ở bên dưới để đươc hỗ trợ. Bài viết này sẽ giúp các bạn giải đáp thắc mắc trong quá trình học tập tại trường. Ai có thắc mắc gì thì commnet ở bên dưới để đươc hỗ trợ.Bài viết này sẽ giúp các bạn giải đáp thắc mắc trong quá trình học tập tại trường. Ai có thắc mắc gì thì commnet ở bên dưới để đươc hỗ trợ.',
  tags: [
    { id: '6', name: 'Học tập' },
    { id: '2', name: 'Trường học' },
  ],
  publishedAt: '01-05-2024',
  pictures: [
    { id: '1', pictureUrl: '/authentication.png' },
    { id: '2', pictureUrl: '/logo.png' },
    { id: '3', pictureUrl: '/demo.jpg' },
    { id: '4', pictureUrl: '/authentication.png' },
  ],
  creator: { id: '1', fullName: 'Trương Samuel', avatarUrl: '/demo.jpg' },
  status: { name: 'Bình thường' },
  isReacted: true,
  reactionCount: 10,
}

const useTruncatedElement = ({ ref }) => {
  const [isTruncated, setIsTruncated] = useState(false)
  const [isReadingMore, setIsReadingMore] = useState(false)
  const [openReactDialog, setOpenReactDialog] = useState(false)

  useLayoutEffect(() => {
    const { offsetHeight, scrollHeight } = ref.current || {}

    if (offsetHeight && scrollHeight && offsetHeight < scrollHeight) {
      setIsTruncated(true)
    } else {
      setIsTruncated(false)
    }
  }, [ref])

  return {
    isTruncated,
    isReadingMore,
    setIsReadingMore,
  }
}

export default function Page() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [uploadComment, setUploadComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const commentPage = useRef(0)
  const [openReactDialog, setOpenReactDialog] = useState(false)
  const [post, setPost] = useState(data)
  const ref = useRef(null)
  const { isTruncated, isReadingMore, setIsReadingMore } = useTruncatedElement({
    ref,
  })
  const router = useRouter()

  function hanldeOpenReactDialog() {
    setOpenReactDialog((e) => !e)
  }
  //   // Function to handle changes in the textarea
  //   const handleUploadCommentChange = (event) => {
  //     setUploadComment(event.target.value)
  //   }
  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  //   //   const onShowMoreComments = (page: number, pageSize: number) => {
  //   //     setIsLoading(true)
  //   //     onFetchComments(page, pageSize).then(() => {
  //   //       setIsLoading(false)
  //   //     })
  //   //   }

  return (
    <div
      className={`${nunito.className} mt-4 max-w-[850px] min-w-[500px] w-[80%] flex flex-col h-fit mb-20 mx-auto`}>
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <Link href="#">
            <Avatar
              placeholder={undefined}
              src={post.creator.avatarUrl}
              size="lg"
            />
          </Link>

          <div className="flex flex-col gap-1">
            <p className="font-bold text-lg">{post.creator.fullName}</p>
            <Link
              href={`/counsel/${post.id}`}
              className="text-sm text-[--secondary] hover:underline">
              {moment(post.publishedAt).locale('vi').local().fromNow()}
            </Link>
          </div>
        </div>

        <Menu placement="bottom-end">
          <MenuHandler>
            <Button
              placeholder={undefined}
              variant="text"
              className="rounded-full px-2 py-1">
              <ThreeDots className="text-xl text-black" />
            </Button>
          </MenuHandler>
          <MenuList placeholder={undefined}>
            <MenuItem
              onClick={() => router.push(`/counsel/${post.id}/edit`)}
              placeholder={undefined}
              className={`${nunito.className} text-black text-base flex items-center gap-2`}>
              <Pencil />
              <p>Chỉnh sửa bài viết</p>
            </MenuItem>
            <MenuItem
              placeholder={undefined}
              className={`${nunito.className} text-black text-base flex items-center gap-2`}>
              <Trash />
              <p>Xóa bài viết</p>
            </MenuItem>
          </MenuList>
        </Menu>
      </div>

      <div>
        {/* this is the header of the body */}
        <div className="mt-3">
          <p className="text-xl uppercase font-bold text-black">{post.title}</p>
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
        <div className="flex flex-col gap-2 ">
          <div className="overflow-hidden">
            <div
              ref={ref}
              className={`${
                isExpanded ? 'block' : 'line-clamp-3'
              } whitespace-pre-line`}>
              {post.content}
            </div>
            {isTruncated && !isExpanded && (
              <span
                className="text-black font-semibold hover:underline hover:cursor-pointer rounded text-nowrap inline-flex"
                onClick={toggleExpand}>
                Xem thêm
              </span>
            )}
          </div>
          {post.pictures.length > 0 && <ImageGird pictures={post.pictures} />}
        </div>

        {/* this is the comment */}

        {post.reactionCount > 0 || post.childrenCommentNumber > 0 ? (
          <div className="flex flex-col">
            <div className="flex justify-between my-3 mx-1">
              {post.reactionCount > 0 ? (
                <div className="flex items-center gap-1">
                  <HandThumbsUpFill className="rounded-full p-[6px] bg-[--blue-02] text-[24px] text-white" />
                  <p
                    onClick={hanldeOpenReactDialog}
                    className="text-[16px] hover:underline hover:cursor-pointer">
                    {post.reactionCount}
                  </p>
                </div>
              ) : (
                <div> </div>
              )}

              {post.childrenCommentNumber > 0 && (
                <div>{post.childrenCommentNumber} Bình luận</div>
              )}
            </div>
          </div>
        ) : (
          ''
        )}
        <ReactDialog
          openReactDialog={openReactDialog}
          hanldeOpenReactDialog={hanldeOpenReactDialog}
        />
        <div className="flex flex-col gap-1">
          <span className="border-t-[1px] border-[--secondary]"></span>
          <Button
            //onClick={handleReactionClick}
            placeholder={undefined}
            variant="text"
            className="flex gap-1 py-2 px-1 normal-case w-fit">
            {post.isReacted ? (
              <HandThumbsUpFill className="text-[16px] text-[--blue-02]" />
            ) : (
              <HandThumbsUp className="text-[16px]" />
            )}
            <span
              className={
                post.isReacted ? 'text-[--blue-02] text-[14px]' : 'text-[14px]'
              }>
              Thích
            </span>
          </Button>
          <span className="border-t-[1px] border-[--secondary]"> </span>
        </div>

        <div className="h-fit py-3 bg-white">
          <form
            className="flex flex-start items-center w-full"
            //</div>onSubmit={(e) => onUploadComment(e, null, uploadComment)}
          >
            <Avatar
              placeholder={undefined}
              src={'/demo.jpg'}
              alt="avatar user"
            />
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
              //onChange={handleUploadCommentChange}
            />
            <Button
              type="submit"
              placeholder={undefined}
              variant="text"
              className="p-2">
              <SendFill className="text-xl" />
            </Button>
          </form>
        </div>
        <div className={`${nunito.className} mt-2`}>
          <p className="text-black font-bold text-lg">Bình luận</p>
          {/* <Comments
          comments={comments}
          onUploadComment={onUploadComment}
          onFetchChildrenComments={onFetchChildrenComments}
        />
        {comments.length != post.childrenCommentNumber && (
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
      </div> */}
        </div>
      </div>
    </div>
  )
}
