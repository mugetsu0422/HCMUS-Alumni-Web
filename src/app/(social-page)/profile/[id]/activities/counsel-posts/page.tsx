'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@material-tailwind/react'
import { Star, PencilFill, TagFill } from 'react-bootstrap-icons'
import PostListItem from '@/app/ui/social-page/counsel/post-list-item'
import { Spinner } from '@material-tailwind/react'
import InfiniteScroll from 'react-infinite-scroll-component'
import axios from 'axios'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Cookies from 'js-cookie'
import { JWT_COOKIE } from '@/app/constant'

export default function Page() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const curPage = useRef(0)
  const [totalPages, setTotalPages] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
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
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/counsel/users/${userId}page=${curPage.current}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { posts: loadedPosts } }) => {
        setPosts(posts.concat(loadedPosts))
      })
      .catch((err) => {})
  }

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/counsel/users/${userIdParams}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { totalPages, posts } }) => {
        if (!totalPages) setHasMore(false)
        setTotalPages(totalPages)
        setPosts(posts)
        console.log(posts)

        setIsLoading(false)
      })
      .catch((err) => {})
  }, [userIdParams])

  return (
    <div>
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-col gap-4">
          {posts.length > 0 && isProfileLoginUser ? (
            !isLoading && (
              <InfiniteScroll
                dataLength={posts.length}
                next={onFetchMore}
                hasMore={hasMore}
                loader={
                  <div className="h-10 flex justify-center ">
                    <Spinner className="h-8 w-8"></Spinner>
                  </div>
                }>
                {posts.map((post) => (
                  <PostListItem key={post.id} post={post} />
                ))}
              </InfiniteScroll>
            )
          ) : (
            <div className="flex items-center gap-2">
              <Star className="text-[24px]" /> Không có bài viết tư vấn để hiển
              thị
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
