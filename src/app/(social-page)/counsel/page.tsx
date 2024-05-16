'use client'
import React, { useEffect, useRef, useState } from 'react'
import CounselListItem from '../../ui/counsel/counsel-list-item'
import Thumbnail from '../../ui/social-page/thumbnail-image'

import CreatePost from '../../ui/counsel/create-post'
import axios from 'axios'
import { JWT_COOKIE, POST_STATUS } from '../../constant'
import Cookies from 'js-cookie'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import SearchAndFilter from '../../ui/counsel/search-and-filter'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Spinner } from '@material-tailwind/react'
import { Toaster } from 'react-hot-toast'

// const data = [
//   {
//     id: '1',
//     title: 'Tư vấn hỗ trợ giải đáp thắc mắc trong học tập',
//     childrenCommentNumber: 10,
//     updateAt: '02-05-2024',
//     content:
//       'Bài viết này sẽ giúp các bạn giải đáp thắc mắc trong quá trình học tập tại trường. Ai có thắc mắc gì thì commnet ở bên dưới để đươc hỗ trợ. Bài viết này sẽ giúp các bạn giải đáp thắc mắc trong quá trình học tập tại trường. Ai có thắc mắc gì thì commnet ở bên dưới để đươc hỗ trợ.Bài viết này sẽ giúp các bạn giải đáp thắc mắc trong quá trình học tập tại trường. Ai có thắc mắc gì thì commnet ở bên dưới để đươc hỗ trợ.',
//     tags: [
//       { id: '6', name: 'Học tập' },
//       { id: '2', name: 'Trường học' },
//     ],
//     publishedAt: '01-05-2024',
//     pictures: [
//       { id: '1', pictureUrl: '/authentication.png' },
//       { id: '2', pictureUrl: '/logo.png' },
//       { id: '3', pictureUrl: '/demo.jpg' },
//       { id: '4', pictureUrl: '/authentication.png' },
//     ],
//     creator: { id: '1', fullName: 'Trương Samuel', avatarUrl: '/demo.jpg' },
//     status: { name: 'Bình thường' },
//     isReacted: true,
//     reactionCount: 10,
//   },
// ]

export default function Page() {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)

  const [myParams, setMyParams] = useState(`?${params.toString()}`)
  const curPage = useRef(0)
  const [totalPages, setTotalPages] = useState(1)
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)

  const resetCurPage = () => {
    params.delete('page')
  }
  const onSearch = useDebouncedCallback((keyword) => {
    if (keyword) {
      params.set('title', keyword)
    } else {
      params.delete('title')
    }
    resetCurPage()
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    setMyParams(`?${params.toString()}`)
  }, 500)
  const onFilterTag = (tag: string) => {
    if (tag != '0') {
      params.set('tagsId', tag)
    } else {
      params.delete('tagsId')
    }
    resetCurPage()
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    setMyParams(`?${params.toString()}`)
  }
  const onResetFilter = () => {
    params.delete('facultyId')
    params.delete('tagsId')
    resetCurPage()
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    setMyParams(`?${params.toString()}`)
  }
  const onFetchMore = () => {
    curPage.current++
    if (curPage.current + 1 >= totalPages) {
      setHasMore(false)
      return
    }

    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/counsel${myParams}&page=${curPage.current}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { posts: loadedPosts } }) => {
        setPosts(posts.concat(loadedPosts))
      })
      .catch((err) => {
        console.error(err)
      })
  }

  useEffect(() => {
    // Posts list
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/counsel${myParams}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then(({ data: { totalPages, posts } }) => {
        setTotalPages(totalPages)
        setPosts(posts)

        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [myParams])

  return (
    <>
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
      <Thumbnail />
      <div className="mt-4 max-w-[850px] min-w-[500px] w-[80%] m-auto flex flex-col gap-6">
        <SearchAndFilter
          onSearch={onSearch}
          onFilterTag={onFilterTag}
          onResetFilter={onResetFilter}
          params={{
            title: params.get('title'),
            tagsId: params.get('tagsId'),
          }}
        />
        <CreatePost />
        {!isLoading && (
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
              <CounselListItem key={post.id} post={post} />
            ))}
          </InfiniteScroll>
        )}
      </div>
    </>
  )
}
