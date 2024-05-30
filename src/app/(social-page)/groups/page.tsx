'use client'

import React, { useState, useEffect } from 'react'
import { roboto } from '../../ui/fonts'
import { Button } from '@material-tailwind/react'
import { JWT_COOKIE, POST_STATUS } from '../../constant'
import Cookies from 'js-cookie'
import Thumbnail from '../../ui/social-page/thumbnail-image'
import GroupsListItem from '../../ui/social-page/groups/groups-list-item'
import { useForm } from 'react-hook-form'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import axios from 'axios'
import SearchAndFilterGroups from '../../ui/social-page/groups/searchAndFilterGroup'
import { Plus } from 'react-bootstrap-icons'

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const [curPage, setCurPage] = useState(Number(params.get('page')) + 1 || 1)
  const [myParams, setMyParams] = useState(`?${params.toString()}`)
  const [totalPages, setTotalPages] = useState(1)
  const [groups, setGroups] = useState([])

  const resetCurPage = () => {
    params.delete('page')
    setCurPage(1)
  }

  useEffect(() => {
    // News groups
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups${myParams}&statusId=${POST_STATUS['Bình thường']}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { totalPages, groups } }) => {
        setTotalPages(totalPages)
        setGroups(groups)
      })
      .catch()
  }, [myParams])

  return (
    <>
      <Thumbnail />
      <div className="mt-4 max-w-[850px] min-w-[500px] w-[80%] m-auto flex flex-col gap-6 h-fit mb-12">
        <div className="flex justify-between">
          <p
            className={`${roboto.className} ml-5 lg:ml-0 text-3xl font-bold text-[var(--blue-02)]`}>
            NHÓM
          </p>
          <Button
            onClick={() => router.push('/groups/create')}
            placeholder={undefined}
            size="md"
            className="text-white bg-[--blue-05] px-4 normal-case flex items-center justify-center gap-2">
            <Plus className="text-xl font-semibold" />
            Tạo nhóm mới
          </Button>
        </div>
        <SearchAndFilterGroups />

        {groups.map((group) => (
          <GroupsListItem key={group.id} group={group} />
        ))}
      </div>
    </>
  )
}
