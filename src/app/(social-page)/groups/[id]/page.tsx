'use client'

import { Avatar, Button, Spinner } from '@material-tailwind/react'
import { group } from 'console'
import Link from 'next/link'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import InfiniteScroll from 'react-infinite-scroll-component'
import axios from 'axios'
import Cookies from 'js-cookie'
import { JWT_COOKIE } from '../../../constant'
import PostListItem from '../../../ui/social-page/groups/post-list-item'
import Introduce from '../../../ui/social-page/groups/introduce'
import { usePathname } from 'next/navigation'
import { useGroupContext } from './layout'

function CreatePost({ groupId }) {
  return (
    <div className="flex gap-4 items-center">
      <Avatar
        src="/authentication.png"
        alt="user avatar"
        size="lg"
        placeholder={undefined}
      />
      <Link
        href={`/groups/${groupId}/posts/create`}
        className=" w-full bg-blue-gray-50 rounded-full">
        <Button
          placeholder={undefined}
          size="sm"
          variant="text"
          className="p-3 normal-case text-left rounded-full w-full text-md font-normal">
          Bạn viết gì đi
        </Button>
      </Link>
    </div>
  )
}

export default function Page({ params }) {
  const group = useGroupContext()
  const curPage = useRef(0)
  const [postTotalPage, setPostTotalPage] = useState(1)
  const [posts, setPosts] = useState([])
  const [hasMore, setHasMore] = useState(true)

  const onFetchMore = () => {
    curPage.current++
    if (curPage.current >= postTotalPage) {
      setHasMore(false)
      return
    }

    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${params.id}/posts?page=${curPage.current}`,
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
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${params.id}/posts`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then(({ data: { totalPages, posts } }) => {
        if (!totalPages) {
          setHasMore(false)
        }
        setPosts(posts)
      })
      .catch((error) => {})
  }, [params.id])

  return (
    <div className="mt-8 flex">
      <div className="w-[70%] mr-4">
        <CreatePost groupId={params.id} />
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
      </div>
      <Introduce privacy={group.privacy} description={group.description} />
    </div>
  )
}
