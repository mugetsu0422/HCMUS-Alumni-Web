'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ClockFill, EyeFill, TagFill } from 'react-bootstrap-icons'
import { Textarea, Button } from '@material-tailwind/react'
import axios, { AxiosResponse } from 'axios'
import Cookies from 'js-cookie'
import moment from 'moment'
import toast from 'react-hot-toast'
import CustomToaster from '@/app/ui/common/custom-toaster'
import { JWT_COOKIE } from '@/app/constant'
import Comments from '@/app/ui/common/comments'
import { nunito } from '@/app/ui/fonts'
import RelatedNews from '@/app/ui/social-page/news/related-news'
import { useRouter } from 'next/navigation'
import NotFound404 from '@/app/ui/common/not-found-404'
import SingleCommentIndicator from '@/app/ui/common/single-comment-indicator'

export default function Page({
  params,
}: {
  params: { id: string; slug: string[] }
}) {
  const router = useRouter()
  const [news, setNews] = useState(null)
  const [relatedNews, setRelatedNews] = useState([])
  const [notFound, setNotFound] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [uploadComment, setUploadComment] = useState('')
  const [comments, setComments] = useState([])
  const [commentPage, setCommentPage] = useState(0)
  const [isSingleComment, setIsSingleComment] = useState(false)

  const singleCommentRef = useRef(null)

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
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/news/${params.id}/comments`,
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
        toast.error(
          error.response?.data?.error?.message || 'Lỗi không xác định',
          {
            id: postCommentToast,
          }
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
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/news/comments/${commentId}`,
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
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/news/comments/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
  }
  const onFetchChildrenComments = async (
    parentId: string,
    page: number,
    pageSize: number
  ) => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/news/comments/${parentId}/children?page=${page}&pageSize=${pageSize}`,
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

    const news = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/news/${params.id}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
    const comments = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/news/${params.id}/comments${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
    const relatedNews = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/news/${params.id}/related`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )

    Promise.all([news, comments, relatedNews])
      .then(([newsRes, commentRes, relatedNewsRes]) => {
        const { data: news } = newsRes
        const {
          data: { comments, comment },
        } = commentRes
        const {
          data: { news: relatedNews },
        } = relatedNewsRes

        setNews(news)
        if (comment) setComments([comment])
        else setComments(comments)
        setRelatedNews(relatedNews)
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
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/news/${params.id}/comments?page=${commentPage}&pageSize=50`,
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
      <div className="flex flex-col xl:flex-row m-auto max-w-[1000px] w-[80%]">
        <CustomToaster />
        <div className={`mt-10 flex flex-col gap-y-8 mx-0 md:mx-auto w-full`}>
          <div className="flex justify-between items-start">
            {news?.faculty ? (
              <p className="font-medium text-lg text-[--secondary]">
                Khoa {news?.faculty.name}
              </p>
            ) : (
              <p></p>
            )}

            <p className="font-medium text-lg flex items-center gap-x-1 text-[--secondary]">
              <ClockFill className="text-[--blue-01]" />
              {moment(news?.publsihedAt).format('DD/MM/YYYY')}
              <span className="flex ml-2 items-center gap-x-2">
                <EyeFill className="text-[--blue-01]" />
                {news?.views}
              </span>
            </p>
          </div>
          <div>
            <div className="text-left text-[1.8rem] font-bold text-[--blue-01]">
              {news?.title}
            </div>
          </div>

          <div className="flex gap-x-2 items-center">
            <TagFill className="text-[--blue-01] text-md" />
            {news?.tags.map(({ name }) => {
              return (
                <span
                  className="text-[--blue-02] font-semibold text-md"
                  key={name}>
                  {name}
                </span>
              )
            })}
          </div>

          <div
            className="w-full h-auto ql-editor"
            dangerouslySetInnerHTML={{ __html: news?.content }}></div>

          <div className="flex flex-col gap-y-1 text-black text-base">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-x-2">
                <ClockFill />
                Lần cuối cập nhật:{' '}
                {moment(news?.updateAt)
                  .local()
                  .format('DD/MM/YYYY')}
              </div>
              <div>{news?.creator.fullName}</div>
            </div>
          </div>
          <div className="flex flex-col gap-y-2  mb-8">
            <form onSubmit={(e) => onUploadComment(e, null, uploadComment)}>
              <Textarea
                onChange={handleUploadCommentChange}
                placeholder={undefined}
                label="Chia sẻ ý kiến của bạn"
              />
              <div className="flex justify-end gap-x-4 pt-2 mr-2">
                <Button
                  placeholder={undefined}
                  size="md"
                  disabled={!uploadComment.trim()}
                  type="submit"
                  className={`${nunito.className} py-2 px-4 bg-[var(--blue-05)] normal-case text-md`}>
                  Đăng
                </Button>
              </div>
            </form>

            <p className="text-xl font-semibold">
              Bình luận{' '}
              <span className="font-normal">
                ({news?.childrenCommentNumber})
              </span>
            </p>
            {isSingleComment && (
              <SingleCommentIndicator
                ref={singleCommentRef}
                parentCommentUrl={comments[0]?.parentId}
                fullPostUrl={`/news/${params.id}`}
              />
            )}
            <Comments
              comments={comments}
              onUploadComment={onUploadComment}
              onEditComment={onEditComment}
              onDeleteComment={onDeleteComment}
              onFetchChildrenComments={onFetchChildrenComments}
            />

            {!isSingleComment &&
              comments.length < news?.childrenCommentNumber && (
                <Button
                  onClick={onFetchComments}
                  className="bg-[--blue-02] normal-case text-sm gap-1"
                  placeholder={undefined}>
                  Tải thêm
                </Button>
              )}

            <RelatedNews news={relatedNews} />
          </div>
        </div>
      </div>
    )
}
