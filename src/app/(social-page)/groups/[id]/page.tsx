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
import AvatarUser from '@/app/ui/common/avatar-user'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'

function CreatePost({ groupId }) {
  return (
    <div className="flex gap-4 items-center">
      <AvatarUser />
      <Link
        href={`/groups/${groupId}/posts/create`}
        className=" w-full bg-blue-gray-50 rounded-full">
        <Button
          placeholder={undefined}
          size="sm"
          variant="text"
          className="p-3 px-5 normal-case text-left rounded-full w-full text-md font-normal">
          Bạn viết gì đi
        </Button>
      </Link>
    </div>
  )
}

export default function Page({ params }) {
  const group = useGroupContext()
  const curPage = useRef(0)
  const [isLoading, setIsLoading] = useState(true)
  const [postTotalPage, setPostTotalPage] = useState(1)
  const [posts, setPosts] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [isPrivatedView, setIsPrivatedView] = useState(false)

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
    if (!group.userRole && group.privacy === 'PRIVATE') {
      setIsLoading(false)
      setHasMore(false)
      setIsPrivatedView(true)
      return
    }

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
        setPostTotalPage(totalPages)
        setPosts(posts)
        setIsLoading(false)
      })
      .catch((error) => {})
  }, [group, params.id])

  if (!isLoading) {
    return isPrivatedView ? (
      <PrivatedView description={group.description} />
    ) : (
      <div className="mt-8 flex">
        <div className="w-[70%] mr-4">
          {group.userRole && <CreatePost groupId={params.id} />}
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
}

function PrivatedView({ description }) {
  return (
    <div className="flex items-center justify-center w-full my-6">
      <div className="bg-[#ebeef0] w-[80%] h-fit flex flex-col gap-4 p-4 rounded-lg">
        <p className="font-bold text-lg">Giới thiệu</p>
        <p>{description}</p>
        <div className="flex flex-col gap-1">
          <p className="flex gap-1 items-center font-bold text-base">
            <FontAwesomeIcon icon={faLock} />
            Riêng tư
          </p>
          <p>
            Chỉ thành viên mới nhìn thấy mọi người trong nhóm và những gì họ
            đăng.
          </p>
        </div>
      </div>
    </div>
  )
}
