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
  List,
  Radio,
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
import DeletePostDialog from '../../../ui/social-page/counsel/delete-post-dialog'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import CustomToaster from '@/app/ui/common/custom-toaster'

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter()
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
  const [totalVoteCount, setTotalVoteCount] = useState(0)
  const [votesCount, setVotesCount] = useState(new Map())
  const [selectedVoteId, setSelectedVoteId] = useState(null)
  const [openDeletePostDialog, setOpenDeletePostDialog] = useState(false)

  const handleOpenDeletePostDialog = () => {
    setOpenDeletePostDialog((e) => !e)
  }

  const handleVote = async (voteId: number) => {
    try {
      if (selectedVoteId === null) {
        // Post
        await onVote(voteId)
        setTotalVoteCount((old) => old + 1)
        const temp = new Map(votesCount.set(voteId, votesCount.get(voteId) + 1))
        setVotesCount(temp)
      } else if (selectedVoteId !== voteId) {
        // Update
        await onChangeVote(selectedVoteId, voteId)
        votesCount.set(selectedVoteId, votesCount.get(selectedVoteId) - 1)
        votesCount.set(voteId, votesCount.get(voteId) + 1)
        const temp = new Map(votesCount)
        setVotesCount(temp)
      } else {
        // Delete
        setTotalVoteCount((old) => old - 1)
        const temp = new Map(votesCount.set(voteId, votesCount.get(voteId) - 1))
        setVotesCount(temp)
        await onRemoveVote(selectedVoteId)
      }
      setSelectedVoteId(voteId === selectedVoteId ? null : voteId)
    } catch (error) {
      toast.error(error.response.data.error?.message || 'Lỗi không xác định')
    }
  }
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
      .catch((error) => {
        toast.error(error.response.data.error.message || 'Lỗi không xác định', {
          id: postCommentToast,
        })
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
      .catch((error) => {
        toast.error(error.response.data.error.message || 'Lỗi không xác định')
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
      .catch((error) => {
        toast.error(error.response.data.error.message || 'Lỗi không xác định')
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
    } catch (error) {}
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
        router.push('/counsel')
      })
      .catch((error) => {
        toast.error(error.response.data.error.message || 'Lỗi không xác định')
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
  const onVote = (voteId: number) => {
    return axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/counsel/${post.id}/votes/${voteId}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
  }
  const onChangeVote = (oldVoteId: number, newVoteId: number) => {
    return axios.put(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/counsel/${post.id}/votes/${oldVoteId}`,
      { updatedVoteId: newVoteId },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
  }
  const onRemoveVote = (voteId: number) => {
    return axios.delete(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/counsel/${post.id}/votes/${voteId}`,
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

        setTotalVoteCount(() => {
          if (!postRes.data.votes) return 0
          return postRes.data.votes.reduce((acc, cur) => acc + cur.voteCount, 0)
        })
        setVotesCount(() => {
          const map = new Map()
          if (!postRes.data.votes) return map
          postRes.data.votes.forEach(({ id: { voteId }, voteCount }) => {
            map.set(voteId, voteCount)
          })
          return map
        })
        setSelectedVoteId(() => {
          if (!postRes.data.votes) return null
          const vote = postRes.data.votes.find(({ isVoted }) => isVoted)
          return vote ? vote.id.voteId : null
        })

        setIsLoading(false)
      })
      .catch((error) => {
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
      .catch((error) => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentPage])

  if (noData) {
    return <NoData />
  }

  if (!isLoading)
    return (
      <div
        className={`${nunito.className} mt-4 max-w-[850px] min-w-[500px] w-[80%] flex flex-col h-fit mb-20 mx-auto`}>
        <CustomToaster />
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
            <MenuList
              placeholder={undefined}
              className={`${nunito.className} max-w-[250px]`}>
              {post.permissions.edit && (
                <MenuItem
                  disabled={post.votes.length ? true : false}
                  placeholder={undefined}
                  className={'text-black text-base'}>
                  <Link
                    href={`/counsel/${post.id}/edit`}
                    className="flex items-center gap-2">
                    <div>
                      <Pencil />
                    </div>
                    <div>
                      <p>Chỉnh sửa bài viết</p>
                      <p className="text-sm text-wrap">
                        Không thể chỉnh sửa bài viết có cuộc thăm dò ý kiến
                      </p>
                    </div>
                  </Link>
                </MenuItem>
              )}
              {post.permissions.delete && (
                <MenuItem
                  onClick={handleOpenDeletePostDialog}
                  placeholder={undefined}
                  className={`text-black text-base flex items-center gap-2`}>
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

          <List
            placeholder={undefined}
            className="w-full flex flex-col bg-[#f8fafc] p-4 my-2 rounded-lg">
            {post.votes &&
              post.votes.map(({ name, id: { voteId } }) => (
                <div
                  key={voteId}
                  className="p-0 mb-2 border-2 rounded-lg relative">
                  <div
                    style={{
                      transform: `scaleX(${
                        totalVoteCount
                          ? votesCount.get(voteId) / totalVoteCount
                          : 0
                      })`,
                    }}
                    className={`bg-[var(--highlight-bg)] w-full h-full absolute top-0 bottom-0 left-0 transition-transform duration-300 origin-left`}></div>
                  <label
                    htmlFor={`option-${post.title}-${voteId}`}
                    className="flex justify-between w-full cursor-pointer px-6 py-4 gap-2 rounded-lg shadow relative">
                    <div className="flex w-full gap-2">
                      <Radio
                        color="blue"
                        crossOrigin={undefined}
                        name={`option-${post.title}`}
                        id={`option-${post.title}-${voteId}`}
                        ripple={false}
                        className="hover:before:opacity-0"
                        containerProps={{
                          className: 'p-0',
                        }}
                        onClick={() => handleVote(voteId)}
                        onChange={() => {}}
                        checked={selectedVoteId === voteId}
                      />
                      <span className="text-black">{name}</span>
                    </div>
                    <span className="text-[var(--blue-02)]">
                      {totalVoteCount
                        ? (votesCount.get(voteId) / totalVoteCount) * 100
                        : votesCount.get(voteId)}
                      %
                    </span>
                  </label>
                </div>
              ))}
          </List>

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
        <DeletePostDialog
          postId={post.id}
          openDeletePostDialog={openDeletePostDialog}
          handleOpenDeletePostDialog={handleOpenDeletePostDialog}
          onDelete={onDeletePost}
        />
      </div>
    )
}
