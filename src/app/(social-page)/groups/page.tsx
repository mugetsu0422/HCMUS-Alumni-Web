'use client'

import React, { useState, useEffect, useRef } from 'react'
import { roboto } from '../../ui/fonts'
import { Button, Spinner } from '@material-tailwind/react'
import { JWT_COOKIE } from '../../constant'
import Cookies from 'js-cookie'
import Thumbnail from '../../ui/social-page/thumbnail-image'
import GroupsListItem from '../../ui/social-page/groups/groups-list-item'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import axios, { AxiosResponse } from 'axios'
import SearchAndFilterGroups from '../../ui/social-page/groups/searchAndFilterGroup'
import { Plus } from 'react-bootstrap-icons'
import Link from 'next/link'
import InfiniteScroll from 'react-infinite-scroll-component'
import CustomToaster from '@/app/ui/common/custom-toaster'

export default function Page() {
  const pathname = usePathname()
  const { replace } = useRouter()
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const curPage = useRef(0)
  const [myParams, setMyParams] = useState(`?${params.toString()}`)
  const [totalPages, setTotalPages] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [groups, setGroups] = useState([])

  const onSearch = useDebouncedCallback((keyword) => {
    if (keyword) {
      params.set('name', keyword)
    } else {
      params.delete('name')
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    setMyParams(`?${params.toString()}`)
  }, 500)
  const onResetFilter = () => {
    params.delete('privacy')
    params.delete('isJoined')
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    setMyParams(`?${params.toString()}`)
  }
  const onFilterPrivacy = (privacy: string) => {
    if (privacy != '0') {
      params.set('privacy', privacy)
    } else {
      params.delete('privacy')
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    setMyParams(`?${params.toString()}`)
  }
  const onFilterMyGroup = (isJoined: string) => {
    if (isJoined != '0') {
      params.set('isJoined', isJoined)
    } else {
      params.delete('isJoined')
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    setMyParams(`?${params.toString()}`)
  }

  const onFetchMore = () => {
    curPage.current++
    if (curPage.current >= totalPages) {
      setHasMore(false)
      return
    }

    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups${myParams}&page=${curPage.current}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { totalPages, groups: addedGroups } }) => {
        setGroups(groups.concat(addedGroups))
      })
      .catch((error) => {
        console.log(error.response?.data?.error?.message || 'Lỗi không xác định')
      })
  }
  const onJoinGroup = (groupId: string): Promise<AxiosResponse<any, any>> => {
    return axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${groupId}/requests`,
      {},
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
  }

  useEffect(() => {
    curPage.current = 0
    setHasMore(true)
    // Fetch groups
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/groups${myParams}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then(({ data: { totalPages, groups } }) => {
        setTotalPages(totalPages)
        setGroups(groups)
        setHasMore(totalPages > 1)
      })
      .catch((error) => {
        console.log(error.response?.data?.error?.message || 'Lỗi không xác định')
      })
  }, [myParams])

  return (
    <>
      <CustomToaster />
      <Thumbnail />
      <div className="mt-4 max-w-[850px] min-w-[500px] w-[80%] m-auto flex flex-col gap-6 h-fit mb-12">
        <div className="flex justify-between">
          <p
            className={`${roboto.className} ml-5 lg:ml-0 text-3xl font-bold text-[var(--blue-02)]`}>
            NHÓM
          </p>
          <Link href={'/groups/create'}>
            <Button
              placeholder={undefined}
              size="md"
              className="text-white bg-[--blue-05] px-4 normal-case text-sm flex items-center justify-center gap-2">
              <Plus className="text-xl font-semibold" />
              Tạo nhóm mới
            </Button>
          </Link>
        </div>
        <SearchAndFilterGroups
          onSearch={onSearch}
          onFilterPrivacy={onFilterPrivacy}
          onResetFilter={onResetFilter}
          onFilterMyGroup={onFilterMyGroup}
          params={{
            name: params.get('name'),
            privacy: params.get('privacy'),
            isJoined: params.get('isJoined'),
          }}
        />
        <InfiniteScroll
          className="flex flex-col gap-6"
          dataLength={groups.length}
          next={onFetchMore}
          hasMore={hasMore}
          loader={
            <div className="h-10 my-5 flex justify-center">
              <Spinner className="h-8 w-8"></Spinner>
            </div>
          }>
          {groups.map((group) => (
            <GroupsListItem
              key={group.id}
              group={group}
              onJoinGroup={onJoinGroup}
            />
          ))}
        </InfiniteScroll>
      </div>
    </>
  )
}
