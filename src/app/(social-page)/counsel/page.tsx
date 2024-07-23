'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
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
import PostListItem from '../../ui/social-page/counsel/post-list-item'
import checkPermission from '@/app/ui/common/checking-permission'

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
  const [selectedTags, setSelectedTags] = useState(() => {
    const tagNames = params.get('tagNames')
    if (!tagNames) return []
    return tagNames.split(',').map((tag) => ({ value: tag, label: tag }))
  })
  const userId = Cookies.get('userId')
  
  const resetCurPage = () => {
    params.delete('page')
    curPage.current = 0
    setHasMore(true)
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
  const onAddTags = useCallback(
    (newTag) => {
      const newTags = [...selectedTags, newTag]
      setSelectedTags(newTags)
      params.set('tagNames', newTags.map(({ value }) => value).join(','))
      resetCurPage()
      replace(`${pathname}?${params.toString()}`, { scroll: false })
      setMyParams(`?${params.toString()}`)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedTags]
  )
  const onDeleteTags = useCallback(
    (tagIndex) => {
      const newTags = selectedTags.filter((_, i) => i !== tagIndex)
      setSelectedTags(newTags)
      if (newTags.length == 0) {
        params.delete('tagNames')
      } else {
        params.set('tagNames', newTags.map(({ value }) => value).join(','))
      }
      resetCurPage()
      replace(`${pathname}?${params.toString()}`, { scroll: false })
      setMyParams(`?${params.toString()}`)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedTags]
  )
  const onResetFilter = () => {
    resetCurPage()
    replace(pathname)
    setSelectedTags([])
    setMyParams(``)
  }
  const onFetchMore = () => {
    curPage.current++
    if (curPage.current >= totalPages) {
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
      .catch((err) => {})
  }

  useEffect(() => {
    // Posts list
    const postsPrmoise = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/counsel${myParams}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
    Promise.all([postsPrmoise])
      .then(([postsPromise]) => {
        setTotalPages(postsPromise.data.totalPages)
        setPosts(postsPromise.data.posts)
        setHasMore(totalPages > 1)
        setIsLoading(false)
      })
      .catch((err) => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myParams, userId])

  return (
    <>
      <div className="mt-4 mb-8 max-w-[850px] w-[80%] m-auto flex flex-col gap-6">
        <SearchAndFilter
          selectedTags={selectedTags}
          onAddTags={onAddTags}
          onDeleteTags={onDeleteTags}
          onSearch={onSearch}
          onResetFilter={onResetFilter}
          params={{
            title: params.get('title'),
          }}
        />
        {checkPermission('Counsel.Create') && (
          <CreatePost />
        )}
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
              <PostListItem key={post.id} post={post} />
            ))}
          </InfiniteScroll>
        )}
      </div>
    </>
  )
}
