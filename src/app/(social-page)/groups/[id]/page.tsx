/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useEffect, useRef, useState } from 'react'
import {
  Button,
  Tabs,
  TabsHeader,
  Tab,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from '@material-tailwind/react'
import { Dot, BoxArrowInRight, Gear, PencilSquare } from 'react-bootstrap-icons'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Discuss from '../../../ui/social-page/groups/discuss'
import ListMember from '../../../ui/social-page/groups/list-member'
import { nunito } from '../../../ui/fonts'
import { GlobeAmericas } from 'react-bootstrap-icons'
import MemberRequest from '../../../ui/social-page/groups/member-request'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import axios, { AxiosResponse } from 'axios'
import { JWT_COOKIE } from '../../../constant'
import Cookies from 'js-cookie'
import NoData from '../../../ui/no-data'

const tabs = [
  {
    label: 'Thảo luận',
  },
  {
    label: 'Thành viên',
  },
  {
    label: 'Xét duyệt',
  },
]

const PRIVACY = {
  PUBLIC: 'Công khai',
  PRIVATE: 'Riêng tư',
}

export default function Page({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = React.useState('Thảo luận')

  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  const [group, setGroup] = useState(null)
  const [noData, setNoData] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Diccussion
  const curPostPage = useRef(0)
  const [postTotalPage, setPostTotalPage] = useState(1)
  const [posts, setPosts] = useState([])
  const [postsAreLoading, setPostsAreLoading] = useState(true)
  const [postsHasMore, setPostsHasMore] = useState(true)

  const onFetchMorePosts = () => {
    curPostPage.current++
    if (curPostPage.current >= postTotalPage) {
      setPostsHasMore(false)
      return
    }

    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${group.id}/posts?page=${curPostPage.current}`,
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

  // Members

  // Member requests

  useEffect(() => {
    const detailsPromise = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${params.id}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
    const postsPromise = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${params.id}/posts`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
    Promise.all([detailsPromise, postsPromise])
      .then(([detailsRes, postsRes]) => {
        const { data: groups } = detailsRes
        const {
          data: { totalPages, posts },
        } = postsRes
        setGroup(groups)
        setPostTotalPage(totalPages)
        setPosts(posts)
        setPostsAreLoading(false)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setNoData(true)
      })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (noData) return <NoData />

  if (!isLoading)
    return (
      <div
        className={`${nunito.className} max-w-[1350px] min-w-[480px] w-[80%] m-auto mb-10`}>
        <div className="relative">
          <img
            src={group.coverUrl}
            alt="group cover"
            className="w-full h-60 object-cover object-center"
          />
          <div className="flex items-center justify-between mt-4">
            <div>
              <p className="flex items-center text-[22px] xl:text-[26px] font-bold ">
                {group.name}
              </p>

              <p className="flex items-center">
                {group.privacy != 'PUBLIC' ? (
                  <FontAwesomeIcon icon={faLock} className="mr-2" />
                ) : (
                  <GlobeAmericas className="mr-2" />
                )}
                {PRIVACY[group.privacy]} <Dot /> {group.participantCount} thành
                viên tham gia
              </p>
            </div>

            {group.userRole ? (
              <Button
                placeholder={undefined}
                className="normal-case px-4 py-2 text-[14px] h-fit bg-[#e4e6eb] text-black ">
                Đã tham gia
              </Button>
            ) : (
              <Button
                placeholder={undefined}
                className="normal-case px-4 py-2 text-[14px] bg-[--blue-04] text-[--blue-05]">
                Tham gia
              </Button>
            )}
          </div>
          {/*  */}

          <div className="flex flex-col gap-1 mt-6">
            <div className="border border-[--delete-filter]"></div>
            <div className="flex justify-between items-center">
              <div>
                <Tabs value="Thảo luận" className="bg-white z-0">
                  <TabsHeader
                    placeholder={undefined}
                    className="rounded-none border-b border-blue-gray-50 bg-transparent p-0 z-0"
                    indicatorProps={{
                      className:
                        'bg-transparent border-b-2 border-[--blue-05] shadow-none rounded-none z-0',
                    }}>
                    {tabs.map(({ label }) => (
                      <Tab
                        key={label}
                        placeholder={undefined}
                        value={label}
                        onClick={() => setActiveTab(label)}
                        className={
                          activeTab === label
                            ? 'text-gray-900 text-nowrap w-fit px-6 py-4 text-[--blue-05]'
                            : 'text-nowrap w-fit px-6 py-4'
                        }>
                        {label}
                      </Tab>
                    ))}
                  </TabsHeader>
                </Tabs>
              </div>
              {group.userRole && (
                <Menu placement="bottom-end">
                  <MenuHandler>
                    <Button
                      placeholder={undefined}
                      variant="text"
                      className="py-2 px-4 flex gap-1 items-center text-black">
                      <Gear className="text-xl" />
                    </Button>
                  </MenuHandler>
                  <MenuList placeholder={undefined}>
                    <MenuItem
                      placeholder={undefined}
                      className="flex items-center gap-1 text-black py-3">
                      <BoxArrowInRight className="text-lg" />
                      Rời khỏi nhóm
                    </MenuItem>

                    <MenuItem placeholder={undefined}>
                      <Link
                        href={`/groups/${group.id}/edit-group`}
                        className="flex items-center gap-1 text-black py-1">
                        <PencilSquare className="text-lg" />
                        Chỉnh sửa thông tin nhóm
                      </Link>
                    </MenuItem>
                  </MenuList>
                </Menu>
              )}
            </div>
          </div>
        </div>
        {activeTab === 'Thảo luận' && (
          <Discuss
            group={group}
            posts={posts}
            onFetchMore={onFetchMorePosts}
            hasMore={postsHasMore}
          />
        )}
        {activeTab === 'Thành viên' && <ListMember />}
        {activeTab === 'Xét duyệt' && <MemberRequest />}
      </div>
    )
}
