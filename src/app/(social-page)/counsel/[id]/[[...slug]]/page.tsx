'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useRef, useState } from 'react'
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
import moment from 'moment'
import 'moment/locale/vi'
import axios, { AxiosResponse } from 'axios'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

import Poll from '@/app/ui/common/poll'
import {
  JWT_COOKIE,
  REACTION_TYPE,
  REACTION_PAGE_SIZE,
  COMMENT_PAGE_SIZE,
} from '@/app/constant'
import Comments from '@/app/ui/common/comments'
import ReactionDialog from '@/app/ui/common/reaction-dialog'
import ImageGrid from '@/app/ui/counsel/image-grid'
import { nunito } from '@/app/ui/fonts'
import NotFound404 from '@/app/ui/common/not-found-404'
import DeletePostDialog from '@/app/ui/social-page/counsel/delete-post-dialog'
import SingleCommentIndicator from '@/app/ui/common/single-comment-indicator'
import ReactTextareaAutosize from 'react-textarea-autosize'
import AvatarUser from '@/app/ui/common/avatar-user'

export default function Page({
  params,
}: {
  params: { id: string; slug: string[] }
}) {
  const router = useRouter()
  const [post, setPost] = useState(null)
  const [notFound, setNotFound] = useState(false)
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
  const [selectedVoteIds, setSelectedVoteIds] = useState<Set<number>>(null)
  const [votes, setVotes] = useState([])
  const [openDeletePostDialog, setOpenDeletePostDialog] = useState(false)
  const [isSingleComment, setIsSingleComment] = useState(false)

  const singleCommentRef = useRef(null)

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
      toast.error(
        error.response?.data?.error?.message.error?.message ||
          'Lỗi không xác định'
      )
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
  ): Promise<any> => {
    e.preventDefault()
    const comment = {
      parentId: parentId,
      content: content,
    }

    return axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/counsel/${post.id}/comments`,
      comment,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
  }
  const onHandleUploadComment = async (e, parentId, content) => {
    const postCommentToast = toast.loading('Đang đăng')
    try {
      const {
        data: { comment },
      } = await onUploadComment(e, parentId, content)
      toast.success('Đăng thành công', { id: postCommentToast })
      setComments((prev) => [comment].concat(prev))
      // setPost((prev) => {
      //   return {
      //     ...prev,
      //     childrenCommentNumber: prev.childrenCommentNumber + 1,
      //   }
      // })
      setUploadComment('')
    } catch (error) {
      toast.error(
        error.response?.data?.error?.message || 'Lỗi không xác định',
        {
          id: postCommentToast,
        }
      )
    }
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
        toast.error(
          error.response?.data?.error?.message || 'Lỗi không xác định'
        )
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
        toast.error(
          error.response?.data?.error?.message || 'Lỗi không xác định'
        )
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
        toast.error(
          error.response?.data?.error?.message || 'Lỗi không xác định'
        )
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
  const onAddVoteOption = (vote: string) => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/counsel/${post.id}/votes`,
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
        toast.error(
          error.response?.data?.error?.message || 'Lỗi không xác định'
        )
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

  useEffect(() => {
    let commentId = `?pageSize=${COMMENT_PAGE_SIZE}`

    if (params.slug) {
      const [firstSlug, secondSlug] = params.slug

      if (params.slug.length === 1) {
        if (firstSlug !== 'comments') {
          return setNotFound(true)
        }
      } else if (params.slug.length === 2) {
        if (firstSlug === 'comments') {
          // Fetch specific comment
          commentId = `/${secondSlug}`
          setIsSingleComment(true)
          // return
        }
      } else {
        // Return 404
        return setNotFound(true)
      }
    }

    const postPromise = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/counsel/${params.id}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
    const commentPromise = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/counsel/${params.id}/comments${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )

    Promise.all([postPromise, commentPromise])
      .then(([postRes, commentsRes]) => {
        const { data: post } = postRes
        const { votes, reactionCount, isReacted } = post
        const { comments, comment } = commentsRes.data

        setPost(post)
        setVotes(votes)
        if (comment) setComments([comment])
        else setComments(comments)
        setReactionCount(reactionCount)
        setIsReacted(isReacted)

        setTotalVoteCount(() => {
          if (!votes) return 0
          return votes.reduce((acc, cur) => acc + cur.voteCount, 0)
        })
        setVotesCount(() => {
          const map = new Map()
          if (!votes) return map
          votes.forEach(({ id: { voteId }, voteCount }) => {
            map.set(voteId, voteCount)
          })
          return map
        })
        setSelectedVoteIds(() => {
          const set = new Set<number>()
          votes.forEach(({ isVoted, id: { voteId } }) => {
            if (isVoted) set.add(voteId)
          })
          return set
        })

        setIsLoading(false)
      })
      .catch((error) => {
        setNotFound(true)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Scroll to the single comment
  useEffect(() => {
    if (singleCommentRef.current) {
      singleCommentRef.current.scrollIntoView({
        behavior: 'instant',
      })
    }
  }, [isLoading])

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

  if (notFound) {
    return <NotFound404 />
  }

  if (!isLoading)
    return (
      <div
        className={`${nunito.className} mt-4 max-w-[850px] min-w-[500px] w-[80%] flex flex-col h-fit mb-20 mx-auto`}>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Link href={`profile/${post.creator.id}/about`}>
              <Avatar
                placeholder={undefined}
                src={post.creator.avatarUrl}
                size="lg"
              />
            </Link>

            <div className="flex flex-col gap-1">
              <p className="font-bold text-lg">{post.creator.fullName}</p>
              <p className="text-sm text-[--secondary]">
                {moment(post.publishedAt).locale('vi').local().fromNow(true)}
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

          <div className="flex flex-col gap-2 whitespace-pre-line">
            {post.content}
            {post.pictures.length > 0 && <ImageGrid pictures={post.pictures} />}
          </div>

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
              className="h-full flex flex-start items-start w-full gap-2"
              onSubmit={(e) => onHandleUploadComment(e, null, uploadComment)}>
              <AvatarUser />
              <ReactTextareaAutosize
                spellCheck="false"
                minRows={1}
                maxRows={8}
                placeholder="Bình luận của bạn"
                className="focus:border-transparent w-full bg-[var(--comment-input)] scrollbar-webkit-main resize-none p-2 px-3 rounded-xl outline-none text-black"
                value={uploadComment}
                onChange={handleUploadCommentChange}
              />
              <Button
                disabled={!uploadComment.trim()}
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
            {isSingleComment && (
              <SingleCommentIndicator
                ref={singleCommentRef}
                parentCommentUrl={comments[0]?.parentId}
                fullPostUrl={`/counsel/${params.id}`}
              />
            )}
            <Comments
              comments={comments}
              onUploadComment={onUploadComment}
              onEditComment={onEditComment}
              onDeleteComment={onDeleteComment}
              onFetchChildrenComments={onFetchChildrenComments}
              numberCommnets={comments.length}
            />
            {!isSingleComment &&
              comments.length < post.childrenCommentNumber && (
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
