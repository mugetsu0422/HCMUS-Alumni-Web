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
        href={`/groups/${groupId}/create-post`}
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

export default function Discuss({ group, posts, onFetchMore, hasMore }) {
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
        <CreatePost groupId={group.id} />
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
            <PostListItem key={post.id} post={post} name={`groups`} />
          ))}
        </InfiniteScroll>
      </div>
      <Introduce privacy={group.privacy} description={group.description} />
    </div>
  )
}
