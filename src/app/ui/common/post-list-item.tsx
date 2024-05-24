/* eslint-disable @next/next/no-img-element */
'use client'

import React, {
  useEffect,
  useReducer,
  useRef,
  useState,
  useLayoutEffect,
} from 'react'
import {
  Avatar,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from '@material-tailwind/react'
import { nunito } from '../fonts'
import {
  TagFill,
  Chat,
  HandThumbsUp,
  HandThumbsUpFill,
  ThreeDots,
  Pencil,
  Trash,
} from 'react-bootstrap-icons'
import Link from 'next/link'
import CommentsDialog from '../counsel/counsel-comments-dialog'
import ImageGird from '../counsel/image-grid'
import moment from 'moment'
import 'moment/locale/vi'
import axios from 'axios'
import {
  COMMENT_PAGE_SIZE,
  JWT_COOKIE,
  REACTION_PAGE_SIZE,
  REACTION_TYPE,
} from '../../constant'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'
import ReactionDialog from '../counsel/counsel-react-dialog'
import { useRouter } from 'next/navigation'
import { useTruncatedElement } from '../../../hooks/use-truncated-element'

interface PostProps {
  id: string
  title: string
  content: string
  childrenCommentNumber: number
  updateAt: string
  publishedAt: string
  tags: { id: string; name: string }[]
  status: { name: string }
  creator: { id: string; fullName: string; avatarUrl: string }
  pictures: { id: string; pictureUrl: string }[]
  isReacted: boolean
  reactionCount: number
  permissions: {
    edit: boolean
    delete: boolean
  }
}

export default function PostListItem({
  post,
  name,
}: {
  post: PostProps
  name: string
}) {
  const [openCommentsDialog, setOpenCommentsDialog] = useState(false)
  const [openReactDialog, setOpenReactDialog] = useState(false)
  const [isReacted, setIsReacted] = useState(post.isReacted)
  const [comments, setComments] = useState([])
  const [reactionCount, setReactionCount] = useState(post.reactionCount)
  const [reaction, setReaction] = useState([])
  const ref = React.useRef(null)
  const { isTruncated, isReadingMore, setIsReadingMore } = useTruncatedElement({
    ref,
  })

  function hanldeOpenReactDialog() {
    setOpenReactDialog((e) => !e)
  }
  function handleOpenCommentDialog() {
    setOpenCommentsDialog((e) => !e)
  }
  const toggleExpand = () => {
    setIsReadingMore((e) => !e)
  }
  const onFetchComments = async (page: number, pageSize: number) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/${name}/${post.id}/comments?page=${page}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )

      setComments(comments.concat(res.data.comments))
    } catch (error) {
      console.error(error)
    }
  }
  const onUploadComment = (
    e: React.FormEvent<HTMLFormElement>,
    parentId: string | null = null,
    content: string
  ): void => {
    e.preventDefault()
    const comment = {
      parentId: parentId,
      content: content,
    }

    const postCommentToast = toast.loading('Đang đăng')
    axios
      .post(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/${name}/${post.id}/comments`,
        comment,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(() => {
        toast.success('Đăng thành công', { id: postCommentToast })
      })
      .catch(() => {
        toast.error('Đăng thất bại', { id: postCommentToast })
      })
  }
  const onFetchChildrenComments = async (
    parentId: string,
    page: number,
    pageSize: number
  ) => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/${name}/comments/${parentId}/children?page=${page}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
    const {
      data: { comments },
    } = res
    return comments
  }
  const onReactPost = () => {
    setReactionCount((old) => old + 1)
    axios
      .post(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/${name}/${post.id}/react`,
        { reactId: REACTION_TYPE['Like'] },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then()
      .catch((err) => {
        console.error(err)
      })
  }
  const onCancelReactPost = () => {
    setReactionCount((old) => old - 1)
    axios
      .delete(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/${name}/${post.id}/react`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then()
      .catch((err) => {
        console.error(err)
      })
  }
  function handleReactionClick() {
    if (isReacted) {
      onCancelReactPost()
    } else {
      onReactPost()
    }
    setIsReacted((e) => !e)
  }
  const onFetchReaction = async (
    reactId: number = REACTION_TYPE['Like'],
    page: number = 0,
    pageSize: number = REACTION_PAGE_SIZE
  ) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/${name}/${post.id}/react?reactId=${reactId}&page=${page}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      setReaction(reaction.concat(res.data.users))
    } catch (error) {
      console.error(error)
    }
  }
  const onDeletePost = () => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_SERVER_HOST}/${name}/${post.id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then(() => {
        toast.success('Xóa bài viết thành công')
      })
      .catch((err) => {
        console.error(err)
        toast.error('Xóa bài viết thất bại')
      })
  }

  return (
    <div
      className={`${nunito.className} flex flex-col w-full h-fit mt-4 mb-20`}>
      {/* this is the header of a post */}
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
            {/* Change link href  */}
            <Link
              href={`/${name}/${post.id}`}
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
            {/*  */}
            {post.permissions.edit && (
              <Link href={`/${name}/${post.id}/edit`}>
                <MenuItem
                  placeholder={undefined}
                  className={`${nunito.className} text-black text-base flex items-center gap-2`}>
                  <Pencil />
                  <p>Chỉnh sửa bài viết</p>
                </MenuItem>
              </Link>
            )}
            {post.permissions.delete && (
              <MenuItem
                onClick={onDeletePost}
                placeholder={undefined}
                className={`${nunito.className} text-black text-base flex items-center gap-2`}>
                <Trash />
                <p>Xóa bài viết</p>
              </MenuItem>
            )}
          </MenuList>
        </Menu>
      </div>

      {/* this is the body of a post */}
      <div>
        {/* this is the header of the body */}
        <div className="mt-3">
          <p className="text-xl uppercase font-bold">{post.title}</p>
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
                isReadingMore ? 'block' : 'line-clamp-3'
              } whitespace-pre-line`}>
              {post.content}
            </div>
            {isTruncated && !isReadingMore && (
              <span
                className="text-black font-semibold hover:underline hover:cursor-pointer rounded text-nowrap inline-flex"
                onClick={toggleExpand}>
                Xem thêm
              </span>
            )}
          </div>
          {post.pictures.length > 0 && <ImageGird pictures={post.pictures} />}
        </div>

        {/* this is the footer of the body */}

        {reactionCount > 0 || post.childrenCommentNumber > 0 ? (
          <div className="flex flex-col">
            <div className="flex justify-between my-3 mx-1">
              {reactionCount > 0 ? (
                <div
                  className="flex items-center gap-1 group hover:cursor-pointer"
                  onClick={() => {
                    if (!reaction.length) {
                      onFetchReaction()
                    }
                    hanldeOpenReactDialog()
                  }}>
                  <HandThumbsUpFill className="rounded-full p-[6px] bg-[--blue-02] text-[24px] text-white" />
                  <p className="text-[16px] group-hover:underline">
                    {reactionCount}
                  </p>
                </div>
              ) : (
                <div> </div>
              )}

              {post.childrenCommentNumber > 0 && (
                <div
                  onClick={() => {
                    if (
                      comments.length === 0 &&
                      post.childrenCommentNumber != 0
                    ) {
                      onFetchComments(0, COMMENT_PAGE_SIZE)
                    }

                    handleOpenCommentDialog()
                  }}
                  className="hover:underline hover:cursor-pointer">
                  {post.childrenCommentNumber} Bình luận
                </div>
              )}
            </div>
            <span className="border-t-[1px] border-[--secondary]"></span>
          </div>
        ) : (
          ''
        )}

        <ReactionDialog
          users={reaction}
          reactionCount={reactionCount}
          onFetchReation={onFetchReaction}
          openReactDialog={openReactDialog}
          hanldeOpenReactDialog={hanldeOpenReactDialog}
        />

        <div className="flex gap-2">
          <Button
            onClick={handleReactionClick}
            placeholder={undefined}
            variant="text"
            className="flex gap-1 py-2 px-1 normal-case w-fit">
            {isReacted ? (
              <HandThumbsUpFill className="text-[16px] text-[--blue-02]" />
            ) : (
              <HandThumbsUp className="text-[16px]" />
            )}
            <span
              className={
                isReacted ? 'text-[--blue-02] text-[14px]' : 'text-[14px]'
              }>
              Thích
            </span>
          </Button>

          <Button
            onClick={() => {
              if (comments.length === 0 && post.childrenCommentNumber != 0) {
                onFetchComments(0, COMMENT_PAGE_SIZE)
              }

              handleOpenCommentDialog()
            }}
            placeholder={undefined}
            variant="text"
            className="flex gap-1 py-2 px-4 normal-case w-fit">
            <Chat className="text-[16px]" />
            <span className="text-[14px]">Bình luận</span>
          </Button>
        </div>

        <CommentsDialog
          post={post}
          comments={comments}
          openCommentsDialog={openCommentsDialog}
          handleOpenCommentDialog={handleOpenCommentDialog}
          onUploadComment={onUploadComment}
          onFetchChildrenComments={onFetchChildrenComments}
          onFetchComments={onFetchComments}
        />
      </div>
    </div>
  )
}
