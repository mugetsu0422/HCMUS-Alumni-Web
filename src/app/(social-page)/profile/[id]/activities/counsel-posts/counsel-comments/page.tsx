'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Spinner, Avatar } from '@material-tailwind/react'
import InfiniteScroll from 'react-infinite-scroll-component'
import axios from 'axios'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Cookies from 'js-cookie'
import { JWT_COOKIE } from '@/app/constant'
import { Star } from 'react-bootstrap-icons'
import moment from 'moment'
import clsx from 'clsx'
import Link from 'next/link'

function CommentListItem({ comment }) {
  return (
    <div>
      <Link
        href={`/${comment.postAdvise.id}/comments/${comment.id}`}
        className="">
        <div className="flex gap-2">
        <Avatar placeholder={undefined} src={comment.creator.avatarUrl} />
        <div>
          <div
            className={clsx({
              'h-fit bg-[var(--comment-input)] p-3 rounded-lg': true,
            })}>
            <p className="text-lg text-black">
              <span className="font-bold">{comment.creator.fullName}</span> đã bình luận trong bài viết <span className="font-bold">{comment.postAdvise.title}</span>
            </p>

            <p className="text-black font-normal whitespace-pre-line">
              {comment.content}
            </p>
          </div>
          <p className="text-[var(--secondary)]">
            {moment(comment.createAt).locale('vi').local().fromNow()}
          </p>
        </div>
      </div>
      </Link>

    </div>
  )
}

export default function Page() {
  const [hasMore, setHasMore] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [comments, setComments] = useState([])
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const curPage = useRef(0)
  const pathname = usePathname()
  const parts = pathname.split('/')
  const userIdParams = parts[2]
  const userId = Cookies.get('userId')
  const isProfileLoginUser = userId === userIdParams

  const onFetchMore = () => {
    curPage.current++
    if (curPage.current >= totalPages) {
      setHasMore(false)
      return
    }

    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/counsel/users/${userIdParams}/comments?page=${curPage.current}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { comments } }) => {
        setComments((prev) => prev.concat(comments))
        setIsLoading(false)
      })
      .catch((err) => {})
  }

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/counsel/users/${userId}/comments`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { totalPages, comments } }) => {
        if (!totalPages) setHasMore(false)
        setTotalPages(totalPages)
        setComments(comments)
        setIsLoading(false)
      })
      .catch((err) => {})
  }, [userId])

  return (
    <div>
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-col gap-4">
          {(comments?.length > 0 && isProfileLoginUser) ? (
            !isLoading && (
              <InfiniteScroll
                dataLength={comments.length}
                next={onFetchMore}
                hasMore={hasMore}
                loader={
                  <div className="h-10 flex justify-center ">
                    <Spinner className="h-8 w-8"></Spinner>
                  </div>
                }>
                {comments?.map((comment) => (
                  <CommentListItem key={comment.id} comment={comment} />
                ))}
              </InfiniteScroll>
            )
          ) : (
            <div className="flex items-center gap-2">
              <Star className="text-[24px]" /> Không có bình luận tư vấn để hiển
              thị
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
