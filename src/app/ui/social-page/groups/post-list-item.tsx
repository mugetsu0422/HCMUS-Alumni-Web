/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react'
import {
  Avatar,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from '@material-tailwind/react'
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
import moment from 'moment'
import 'moment/locale/vi'
import axios, { AxiosResponse } from 'axios'

import Cookies from 'js-cookie'
import toast from 'react-hot-toast'
import { useTruncatedElement } from '../../../../hooks/use-truncated-element'
import {
  JWT_COOKIE,
  REACTION_TYPE,
  REACTION_PAGE_SIZE,
  COMMENT_PAGE_SIZE,
} from '../../../constant'
import CommentsDialog from '../../counsel/counsel-comments-dialog'
import ImageGird from '../../counsel/image-grid'
import { nunito } from '../../fonts'
import ReactionDialog from '../../common/reaction-dialog'
import Poll from '../../common/poll'

interface PostProps {
  id: string
  groupId: string
  title: string
  content: string
  childrenCommentNumber: number
  updateAt: string
  publishedAt: string
  tags: { id: string; name: string }[]
  status: { name: string }
  creator: { id: string; fullName: string; avatarUrl: string }
  pictures: { id: string; pictureUrl: string }[]
  votes: {
    id: { voteId: number }
    name: string
    voteCount: number
    isVoted: boolean
  }[]
  allowMultipleVotes: boolean
  allowAddOptions: boolean
  isReacted: boolean
  reactionCount: number
  permissions: {
    edit: boolean
    delete: boolean
  }
}

export default function PostListItem({ post }: { post: PostProps }) {
  const [openCommentsDialog, setOpenCommentsDialog] = useState(false)
  const [openReactDialog, setOpenReactDialog] = useState(false)
  const [isReacted, setIsReacted] = useState(post.isReacted)
  const [comments, setComments] = useState([])
  const [reactionCount, setReactionCount] = useState(post.reactionCount)
  const [reaction, setReaction] = useState([])
  const [isDeleted, setIsDeleted] = useState(false)
  const ref = React.useRef(null)
  const { isTruncated, isReadingMore, setIsReadingMore } = useTruncatedElement({
    ref,
  })
  const [totalVoteCount, setTotalVoteCount] = useState(() => {
    if (!post.votes) return 0
    return post.votes.reduce((acc, cur) => acc + cur.voteCount, 0)
  })
  const [votesCount, setVotesCount] = useState(() => {
    const map = new Map()
    if (!post.votes) return map
    post.votes.forEach(({ id: { voteId }, voteCount }) => {
      map.set(voteId, voteCount)
    })
    return map
  })
  const [selectedVoteIds, setSelectedVoteIds] = useState<Set<number>>(() => {
    const set = new Set<number>()
    post.votes.forEach(({ isVoted, id: { voteId } }) => {
      if (isVoted) set.add(voteId)
    })
    return set
  })
  const [votes, setVotes] = useState(post.votes)
  const [openDeletePostDialog, setOpenDeletePostDialog] = useState(false)

  const handleOpenDeletePostDialog = () => {
    setOpenDeletePostDialog((e) => !e)
  }

  const handleVote = async (allowMultipleVotes: boolean, voteId: number) => {
    try {
      if (selectedVoteIds.has(voteId)) {
        // Delete
        setTotalVoteCount((old) => old - 1)
        const temp = new Map(votesCount.set(voteId, votesCount.get(voteId) - 1))
        setVotesCount(temp)
        await onRemoveVote(voteId)

        selectedVoteIds.delete(voteId)
      } else {
        if (allowMultipleVotes) {
          // Add vote
          await onVote(voteId)
          setTotalVoteCount((old) => old + 1)
          const temp = new Map(
            votesCount.set(voteId, votesCount.get(voteId) + 1)
          )
          setVotesCount(temp)

          selectedVoteIds.add(voteId)
        } else {
          if (selectedVoteIds.size) {
            // Update vote
            const oldVoteId = Array.from(selectedVoteIds)[0]

            await onChangeVote(oldVoteId, voteId)
            votesCount.set(oldVoteId, votesCount.get(oldVoteId) - 1)
            votesCount.set(voteId, votesCount.get(voteId) + 1)
            const temp = new Map(votesCount)
            setVotesCount(temp)

            selectedVoteIds.clear()
            selectedVoteIds.add(voteId)
            setSelectedVoteIds(new Set(selectedVoteIds))
          } else {
            // Add vote
            await onVote(voteId)
            setTotalVoteCount((old) => old + 1)
            const temp = new Map(
              votesCount.set(voteId, votesCount.get(voteId) + 1)
            )
            setVotesCount(temp)

            selectedVoteIds.add(voteId)
          }
        }
      }
      setSelectedVoteIds(new Set(selectedVoteIds))
    } catch (error) {
      toast.error(error.response.data.error?.message || 'Lỗi không xác định')
    }
  }

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
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${post.id}/comments?page=${page}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )

      setComments(comments.concat(res.data.comments))
    } catch (error) {}
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
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${post.id}/comments`,
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
  const onFetchChildrenComments = async (
    parentId: string,
    page: number,
    pageSize: number
  ) => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/comments/${parentId}/children?page=${page}&pageSize=${pageSize}`,
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
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${post.id}/react`,
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
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${post.id}/react`,
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
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${post.id}/react?reactId=${reactId}&page=${page}&pageSize=${pageSize}`,
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
      .delete(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/posts/${post.id}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(() => {
        setIsDeleted(true)
        toast.success('Xoá bài viết thành công')
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
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/comments/${commentId}`,
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
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/comments/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
  }
  const onVote = (voteId: number) => {
    return axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${post.id}/votes/${voteId}`,
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
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${post.id}/votes/${oldVoteId}`,
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
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${post.id}/votes/${voteId}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
  }
  const onAddVoteOption = (vote: string) => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${post.id}/votes`,
        vote,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { vote } }) => {
        setVotes((old) => [...old, vote])

        votesCount.set(vote.id.voteId, 0)
        setVotesCount(new Map(votesCount))
      })
      .catch((error) => {
        toast.error(error.response.data.error.message || 'Lỗi không xác định')
      })
  }
  const onFetchUserVotes = (
    postId: string,
    voteId: number,
    page: number = 0,
    pageSize: number = 50
  ) => {
    return axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${postId}/votes/${voteId}?page=${page}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
  }

  return (
    !isDeleted && (
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
              <Link
                href={`/groups/${post.groupId}/posts/${post.id}`}
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
              {post.permissions.edit && (
                <MenuItem
                  disabled={post.votes.length ? true : false}
                  placeholder={undefined}
                  className={'text-black text-base'}>
                  <Link
                    href={`/groups/${post.groupId}/posts/${post.id}/edit`}
                    className=" flex items-center gap-2">
                    <div>
                      <Pencil />
                    </div>
                    <div>
                      <p>Chỉnh sửa bài viết</p>
                      {post.votes.length ? (
                        <p className="text-sm text-wrap">
                          Không thể chỉnh sửa bài viết có cuộc thăm dò ý kiến
                        </p>
                      ) : null}
                    </div>
                  </Link>
                </MenuItem>
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

          {votes.length !== 0 && (
            <Poll
              allowMultipleVotes={post.allowMultipleVotes}
              allowAddOptions={post.allowAddOptions}
              votes={votes}
              totalVoteCount={totalVoteCount}
              selectedVoteIds={selectedVoteIds}
              votesCount={votesCount}
              handleVote={handleVote}
              onAddVoteOption={onAddVoteOption}
              postId={post.id}
              onFetchUserVotes={onFetchUserVotes}
            />
          )}

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
            onEditComment={onEditComment}
            onDeleteComment={onDeleteComment}
            onFetchChildrenComments={onFetchChildrenComments}
            onFetchComments={onFetchComments}
          />
        </div>
      </div>
    )
  )
}
