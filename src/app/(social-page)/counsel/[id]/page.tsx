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
import Comments from '../../../ui/common/comments'
import { nunito } from '../../../ui/fonts'
import ImageGird from '../../../ui/counsel/image-grid'
import moment from 'moment'
import 'moment/locale/vi'
import {
  COMMENT_PAGE_SIZE,
  JWT_COOKIE,
  REACTION_PAGE_SIZE,
  REACTION_TYPE,
} from '../../../constant'
import ReactionDialog from '../../../ui/common/reaction-dialog'
import axios, { AxiosResponse } from 'axios'
import Cookies from 'js-cookie'
import NoData from '../../../ui/no-data'
import toast, { Toaster } from 'react-hot-toast'

export default function Page({ params }: { params: { id: string } }) {
  const [post, setPost] = useState(null)
  const [noData, setNoData] = useState(false)
  const [comments, setComments] = useState([])
  const [commentPage, setCommentPage] = useState(0)
  const [uploadComment, setUploadComment] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [openReactDialog, setOpenReactDialog] = useState(false)
  const [isReacted, setIsReacted] = useState(null)
  const [reactionCount, setReactionCount] = useState(null)
  const [reaction, setReaction] = useState([])
  const ref = useRef(null)

  function hanldeOpenReactDialog() {
    setOpenReactDialog((e) => !e)
  }
  // Function to handle changes in the textarea
  const handleUploadCommentChange = (event) => {
    setUploadComment(event.target.value)
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
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/counsel/${post.id}/comments`,
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
  const onShowMoreComments = () => {
    setCommentPage((commentPage) => commentPage + 1)
  }
  const onFetchChildrenComments = async (
    parentId: string,
    page: number,
    pageSize: number
  ) => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/counsel/comments/${parentId}/children?page=${page}&pageSize=${pageSize}`,
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
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/counsel/${post.id}/react`,
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
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/counsel/${post.id}/react`,
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
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/counsel/${params.id}/react?reactId=${reactId}&page=${page}&pageSize=${pageSize}`,
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
      .delete(`${process.env.NEXT_PUBLIC_SERVER_HOST}/counsel/${post.id}`, {
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
  const onEditComment = (
    e: React.FormEvent<HTMLFormElement>,
    commentId: string,
    content: string
  ): Promise<AxiosResponse<any, any>> => {
    e.preventDefault()
    const comment = {
      content: content,
    }

    return axios.put(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/counsel/comments/${commentId}`,
      comment,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
  }
  const onDeleteComment = (
    e: React.FormEvent<HTMLFormElement>,
    commentId: string
  ): Promise<AxiosResponse<any, any>> => {
    e.preventDefault()

    return axios.delete(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/counsel/comments/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
  }

  useEffect(() => {
    const postPromise = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/counsel/${params.id}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
    const commentPromise = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/counsel/${params.id}/comments?page=0&pageSize=${COMMENT_PAGE_SIZE}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )

    Promise.all([postPromise, commentPromise])
      .then(([postRes, commentRes]) => {
        setPost(postRes.data)
        setComments(commentRes.data.comments)
        setReactionCount(postRes.data.reactionCount)
        setIsReacted(postRes.data.isReacted)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setNoData(true)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fetch more comments
  useEffect(() => {
    if (!commentPage) return

    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/counsel/${params.id}/comments?page=${commentPage}&pageSize=${COMMENT_PAGE_SIZE}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { comments: fetchedComments } }) => {
        setComments(comments.concat(fetchedComments))
      })
      .catch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentPage])

  if (noData) {
    return <NoData />
  }

  if (!isLoading)
    return (
      <div
        className={`${nunito.className} mt-4 max-w-[850px] min-w-[500px] w-[80%] flex flex-col h-fit mb-20 mx-auto`}>
        <Toaster
          containerStyle={{ zIndex: 99999 }}
          toastOptions={{
            success: {
              style: {
                background: '#00a700',
                color: 'white',
              },
            },
            error: {
              style: {
                background: '#ea7b7b',
                color: 'white',
              },
            },
          }}
        />
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
              <p className="text-sm text-[--secondary]">
                {moment(post.publishedAt).locale('vi').local().fromNow()}
              </p>
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
              {post.permissions.edit && (
                <Link href={`/counsel/${post.id}/edit`}>
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
          <div className="flex flex-col gap-2 ">
            {post.content}
            {post.pictures.length > 0 && <ImageGird pictures={post.pictures} />}
          </div>

          {/* this is the comment */}

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
                  <div>{post.childrenCommentNumber} Bình luận</div>
                )}
              </div>
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
          <div className="flex flex-col gap-1">
            <span className="border-t-[1px] border-[--secondary]"></span>
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
            <span className="border-t-[1px] border-[--secondary]"> </span>
          </div>

          <div className="h-fit py-3 bg-white">
            <form
              className="flex flex-start items-start w-full gap-2"
              onSubmit={(e) => onUploadComment(e, null, uploadComment)}>
              <Avatar
                placeholder={undefined}
                src={'/demo.jpg'}
                alt="avatar user"
              />
              <Textarea
                rows={1}
                resize={true}
                placeholder="Bình luận của bạn"
                className="min-h-full !border-0 focus:border-transparent w-full !bg-[var(--comment-input)]"
                containerProps={{
                  className: 'grid h-full',
                }}
                labelProps={{
                  className: 'before:content-none after:content-none',
                }}
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
          </div>
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
                onClick={onShowMoreComments}
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
        </div>
      </div>
    )
}
