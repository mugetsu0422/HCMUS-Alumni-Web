'use client'
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react'
import {
  ClockFill,
  GeoAltFill,
  BarChartFill,
  TagFill,
} from 'react-bootstrap-icons'
import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  Avatar,
  Spinner,
} from '@material-tailwind/react'
import axios, { AxiosResponse } from 'axios'
import Cookies from 'js-cookie'
import moment from 'moment'
import { XLg } from 'react-bootstrap-icons'
import Link from 'next/link'
import toast from 'react-hot-toast'
import InfiniteScroll from 'react-infinite-scroll-component'
import { JWT_COOKIE } from '@/app/constant'
import Comments from '@/app/ui/common/comments'
import { nunito } from '@/app/ui/fonts'
import NotFound404 from '@/app/ui/common/not-found-404'
import SingleCommentIndicator from '@/app/ui/common/single-comment-indicator'
import CommentInput from '@/app/ui/social-page/common/comment-input'
import ParticipateButton from '@/app/ui/social-page/events/participate-button'

const PARTICIPANT_FETCH_LIMIT = 50

function ParticipantsDialog({
  openDialog,
  handleOpenParticipantsDialog,
  participants,
  participantCount,
  onLoadParticipants,
}) {
  const participantPage = useRef(0)
  const [hasMore, setHasMore] = useState(true)

  const onFetchMore = () => {
    if (participants.length >= participantCount) {
      setHasMore(false)
      return
    }
    participantPage.current++
    onLoadParticipants(participantPage.current)
  }

  return (
    <Dialog
      size="xs"
      placeholder={undefined}
      open={openDialog}
      handler={handleOpenParticipantsDialog}
      className="p-4 w-[350px]">
      <DialogHeader className="flex" placeholder={undefined}>
        <p className={`${nunito.className} m-auto font-semibold`}>
          Danh sách tham gia
        </p>
        <Button
          className="p-2"
          placeholder={undefined}
          variant="text"
          onClick={handleOpenParticipantsDialog}>
          <XLg className="text-lg" />
        </Button>
      </DialogHeader>
      <DialogBody
        id="scrollableParticipants"
        placeholder={undefined}
        className="flex flex-col h-[400px] overflow-y-auto scrollbar-webkit-main">
        {participants.length > 0 ? (
          <InfiniteScroll
            className="flex flex-col gap-2"
            dataLength={participants.length}
            next={onFetchMore}
            hasMore={hasMore}
            loader={
              <div className="h-10 my-5 flex justify-center">
                <Spinner className="h-8 w-8"></Spinner>
              </div>
            }
            scrollableTarget="scrollableParticipants">
            {participants.map(({ id, fullName, avatarUrl }) => (
              <Link
                href={`/profile/${id}`}
                key={id}
                className="flex items-center gap-3 hover:bg-gray-100 rounded-lg p-3">
                <Avatar placeholder={undefined} src={avatarUrl} alt="avatar" />
                <p>{fullName}</p>
              </Link>
            ))}
          </InfiniteScroll>
        ) : (
          <p className="text-black">Hiện không có người tham gia</p>
        )}
      </DialogBody>
    </Dialog>
  )
}

export default function Page({
  params,
}: {
  params: { id: string; slug: string[] }
}) {
  const [event, setEvent] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [openParticipantsDialog, setOpenParticipantsDialog] = useState(false)
  const [isParticipated, setIsParticipated] = useState(null)
  const [isDisabled, setIsDisabled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [participants, setParticipants] = useState([])
  const [uploadComment, setUploadComment] = useState('')
  const [comments, setComments] = useState([])
  const [commentPage, setCommentPage] = useState(0)
  const [isSingleComment, setIsSingleComment] = useState(false)
  const singleCommentRef = useRef(null)
  const [participant, setParticipant] = useState(0)
  const [numberComments, setNumberComments] = useState(0)
  const [firstLoadComment, setFirstLoadComment] = useState(false)
  const [numberCommnets, setNumberCommnets] = useState(5)
  // Event's participants
  const onParticipate = async (eventId) => {
    setIsDisabled(true)
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/events/${eventId}/participants`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      setParticipant((e) => e + 1)
      setIsParticipated((isParticipated) => !isParticipated)
      setIsDisabled(false)
      toast.success('Tham gia sự kiện thành công')
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Lỗi không xác định')
    }
  }
  const onCancelParticipation = async (eventId) => {
    setIsDisabled(true)
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/events/${eventId}/participants`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      setParticipant((e) => e - 1)
      setIsParticipated((isParticipated) => !isParticipated)
      setIsDisabled(false)
      toast.success('Hủy tham gia sự kiện thành công')
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Lỗi không xác định')
    }
  }
  // Fetch event participants
  const onInitialLoadParticipants = () => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/events/${params.id}/participants?limit=${PARTICIPANT_FETCH_LIMIT}&page=0`,
        {
          headers: Cookies.get(JWT_COOKIE)
            ? {
                Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
              }
            : null,
        }
      )
      .then(({ data }) => {
        setParticipants(participants.concat(data.participants))
      })
      .catch((e) => {})
  }
  // Fetch more participants
  const onLoadMoreParticipants = async (page: number) => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/events/${params.id}/participants?limit=${PARTICIPANT_FETCH_LIMIT}&page=${page}`,
      {
        headers: Cookies.get(JWT_COOKIE)
          ? {
              Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
            }
          : null,
      }
    )
    const { data } = res
    setParticipants(participants.concat(data.participants))
  }

  // Events' comments
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
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/events/${params.id}/comments`,
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
      setNumberComments((e) => e + 1)
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
  const onFetchChildrenComments = async (
    parentId: string,
    page: number,
    pageSize: number
  ) => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/events/comments/${parentId}/children?page=${page}&pageSize=${pageSize}`,
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
  const onFetchComments = () => {
    setCommentPage((commentPage) => commentPage + 1)
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
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/events/comments/${commentId}`,
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
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/events/comments/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
  }
  const handleOpenParticipantsDialog = () => {
    setOpenParticipantsDialog((e) => !e)
  }

  // Initial fetch
  useEffect(() => {
    let commentId = ''

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

    const detailsPromise = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/events/${params.id}`,
      {
        headers: Cookies.get(JWT_COOKIE)
          ? {
              Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
            }
          : null,
      }
    )
    const commentsPromise = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/events/${params.id}/comments${commentId}`,
      {
        headers: Cookies.get(JWT_COOKIE)
          ? {
              Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
            }
          : null,
      }
    )
    Promise.all([detailsPromise, commentsPromise])
      .then(([detailsRes, commentsRes]) => {
        const { data: event } = detailsRes
        const { comments, comment } = commentsRes.data

        setNumberComments(event.childrenCommentNumber)
        setIsParticipated(event.isParticipated)
        setEvent(event)
        setParticipant(event.participants)
        if (comment) setComments([comment])
        else setComments(comments)
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
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/events/${params.id}/comments?page=${commentPage}`,
        {
          headers: Cookies.get(JWT_COOKIE)
            ? {
                Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
              }
            : null,
        }
      )
      .then(({ data: { comments: fetchedComments } }) => {
        setComments(comments.concat(fetchedComments))
      })
      .catch((error) => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentPage])

  const FirstLoadMoreComments = () => {
    setFirstLoadComment(true)
    setNumberCommnets(event?.childrenCommentNumber)
  }

  if (notFound) {
    return <NotFound404 />
  }

  if (!isLoading)
    return (
      <>
        <div
          className={`${nunito.className} flex flex-col gap-6 w-[75%] max-w-[1366px] bg-[--blue-04] rounded-lg m-auto lg:px-10 lg:py-10 mt-16 mb-16`}>
          <div className="flex flex-col xl:flex-row items-center justify-center m-auto gap-x-10">
            <img
              src={event?.thumbnail}
              alt="image event"
              className="sm:min-w-[410px] sm:h-[250px] md:min-w-[500px] md:h-[350px]  xl:min-w-[550px] xl:h-[350px]  2xl:min-w-[40vw] 2xl:h-[400px] max-w-[1000px] object-cover object-center rounded-lg"
            />
            <div className="flex flex-col gap-4 w-full">
              <div>
                <p className="text-left sm:text-[1.5rem] 2xl:text-[1.9rem] font-extrabold ">
                  {event?.title}
                </p>
                {event?.faculty && (
                  <p className="text-left sm:text-[1.1rem] 2xl:text-[1.5rem] font-semibold">
                    Khoa {event.faculty.name}
                  </p>
                )}
              </div>

              <div className="w-full flex flex-col xl:gap-y-6 2xl:gap-y-10 items-start">
                <div>
                  <p className="flex text-nowrap items-start gap-2 sm:text-[16px] 2xl:text-[20px]">
                    <GeoAltFill className="text-[--blue-02]" />{' '}
                    <span>Địa điểm:</span>
                    <span className="text-wrap w-[60%]">
                      {event?.organizationLocation}
                    </span>
                  </p>
                  <p className="flex items-center gap-2 sm:text-[16px] 2xl:text-[20px]">
                    <ClockFill className="text-[--blue-02]" />
                    <span className="w-fit">Thời gian:</span>
                    <span className="text-wrap w-[60%]">
                      {event &&
                        moment(event?.organizationTime).format(
                          'DD-MM-YYYY HH:mm:ss'
                        )}
                    </span>
                  </p>

                  {event?.tags && (
                    <p className="flex items-center gap-2 sm:text-[16px] 2xl:text-[20px]">
                      <TagFill className="text-[--blue-02]" />
                      <span className="text-wrap w-[85%]">
                        {event.tags.map((tag) => tag.name + ' ')}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <div className="w-full flex flex-col justify-center items-center lg:items-start gap-6 ">
                <div
                  className="flex gap-3 hover:cursor-pointer"
                  onClick={() => {
                    if (participants.length === 0) {
                      onInitialLoadParticipants()
                    }
                    handleOpenParticipantsDialog()
                  }}>
                  <BarChartFill className="text-[--blue-02] text-[4.1rem]" />
                  <div className="flex flex-col">
                    <p className="text-[20px] 2xl:text-[30px] font-extrabold">
                      {participant}
                    </p>
                    <p className="text-lg">người tham gia</p>
                  </div>
                </div>
                <ParticipantsDialog
                  openDialog={openParticipantsDialog}
                  handleOpenParticipantsDialog={handleOpenParticipantsDialog}
                  participants={participants}
                  participantCount={event?.participants}
                  onLoadParticipants={onLoadMoreParticipants}
                />
                <ParticipateButton
                  requiredPermission={'Event.Participant.Create'}
                  isParticipated={isParticipated}
                  isDisabled={isDisabled}
                  onParticipate={onParticipate}
                  onCancelParticipation={onCancelParticipation}
                  eventId={params.id}
                  participateBtnClassName={`flex justify-center items-center gap-2 bg-[--blue-02] font-bold w-full max-w-[300px] text-[16px]`}
                  cancelPartcipateBtnClassName={`flex justify-center items-center gap-2 bg-[#e4e6eb] text-[#4b4f56] font-bold w-full max-w-[300px] text-[16px]`}
                  requiredBtnClassName={`py-3 px-6 bg-[#e4e6eb] text-[#4b4f56] normal-case w-full max-w-[300px] text-[16px]`}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <p className="lg:text-[26px] sm:text-lg font-extrabold">
              Thông tin chi tiết
            </p>
            <p className="text-pretty text-base whitespace-pre-line">
              {event?.content}
            </p>
          </div>
          <div className="text-right w-full">{event?.creator?.fullName}</div>
        </div>

        <div className="flex flex-col gap-y-2 w-[75%] max-w-[1366px] m-auto mb-10">
          <CommentInput
            requiredPermission={'News.Comment.Create'}
            uploadComment={uploadComment}
            handleUploadCommentChange={handleUploadCommentChange}
            onHandleUploadComment={onHandleUploadComment}
          />

          <p className="text-xl font-semibold">
            Bình luận <span className="font-normal">({numberComments})</span>
          </p>
          {isSingleComment && (
            <SingleCommentIndicator
              ref={singleCommentRef}
              parentCommentUrl={comments[0]?.parentId}
              fullPostUrl={`/events/${params.id}`}
            />
          )}
          {
            <Comments
              comments={comments}
              onUploadComment={onUploadComment}
              onEditComment={onEditComment}
              onDeleteComment={onDeleteComment}
              onFetchChildrenComments={onFetchChildrenComments}
              numberCommnets={numberCommnets}
            />
          }

          {((!isSingleComment &&
            comments.length < event?.childrenCommentNumber) ||
            (!firstLoadComment && 5 < event?.childrenCommentNumber)) && (
            <Button
              onClick={() => {
                onFetchComments()
                FirstLoadMoreComments()
              }}
              className="bg-[--blue-02] normal-case text-sm gap-1"
              placeholder={undefined}>
              Tải thêm
            </Button>
          )}
        </div>
      </>
    )
}
