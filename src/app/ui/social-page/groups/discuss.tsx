'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Avatar, Button } from '@material-tailwind/react'
import Link from 'next/link'
import Introduce from './introduce'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import { JWT_COOKIE } from '../../../constant'
import Cookies from 'js-cookie'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Spinner } from '@material-tailwind/react'
import { Toaster } from 'react-hot-toast'
import PostListItem from '../../common/post-list-item'

const group = {
  id: '1',
  name: 'Sinh viên lớp 20CLC11',
  creator: {
    id: '1',
    name: 'Đặng Nguyễn Duy',
    avatarUrl: '/demo.jpg',
  },
  privacy: 'Công Khai',
  avatarUrl: '/authentication.png',
  coverUrl: '/authentication.png',
  website: '',
  status: 'Bình thường',
  publicAt: '05-04-2023',
  numberMember: 500,
  isJoined: true,
  description:
    'Nhóm lớp 20CLC11. Nơi mà sinh viên lớp 20CLC11 chia sẻ kiến thức và sự kiện của nhà trường.',

  friendsInGroup: [
    {
      id: '1',
      fullName: 'Trương Sammuel',
      avatarUrl: '/demo.jpg',
    },
    {
      id: '2',
      fullName: 'Đặng Nguyễn Duy',
      avatarUrl: '/demo.jpg',
    },
    {
      id: '3',
      fullName: 'Huỳnh Cao Nguyên',
      avatarUrl: '/demo.jpg',
    },
  ],
}

function CreatePost() {
  return (
    <div className="flex gap-4 items-center">
      <Avatar
        src="/authentication.png"
        alt="user avatar"
        size="lg"
        placeholder={undefined}
      />
      <Link
        href={`/groups/${group.id}/create-post`}
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

export default function Discuss() {
  // const pathname = usePathname()
  // const { replace } = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)

  const [myParams, setMyParams] = useState(`?${params.toString()}`)
  const curPage = useRef(0)
  const [totalPages, setTotalPages] = useState(1)
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)

  const onFetchMore = () => {
    curPage.current++
    if (curPage.current + 1 >= totalPages) {
      setHasMore(false)
      return
    }

    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${group.id}/${myParams}&page=${curPage.current}`,
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
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${group.id}/${myParams}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
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
    <div className="mt-8 flex">
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
      <div className="w-[70%] mr-4">
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
              <PostListItem
                key={post.id}
                post={post}
                name={`groups/${group.id}`}
              />
            ))}
          </InfiniteScroll>
        )}
      </div>
      <Introduce privacy={group.privacy} description={group.description} />
    </div>
  )
}
