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

const groups = [
  {
    id: '1',
    name: 'Sinh viên lớp 20CLC11',
    creator: {
      id: '1',
      name: 'Đặng Nguyễn Duy',
      avatarUrl: '/demo.jpg',
    },
    privacy: 'Công khai',
    avatarUrl: '/authentication.png',
    coverUrl: '/authentication.png',
    website: '',
    status: 'Bình thường',
    publicAt: '05-04-2023',
    numberMember: 500,
    isJoined: true,
    description:
      'Nhóm lớp 20CLC11. Nơi mà sinh viên lớp 20CLC11 chia sẻ kiến thức và sự kiện của nhà trường.',
  },
  {
    id: '23',
    name: 'Sinh viên lớp 20CLC11',
    creator: {
      id: '1',
      name: 'Đặng Nguyễn Duy',
      avatarUrl: '/demo.jpg',
    },
    privacy: 'Công khai',
    avatarUrl: '/authentication.png',
    coverUrl: '/authentication.png',
    website: '',
    status: 'Bình thường',
    publicAt: '05-04-2023',
    numberMember: 500,
    isJoined: false,
    description:
      'Nhóm lớp 20CLC11. Nơi mà sinh viên lớp 20CLC11 chia sẻ kiến thức và sự kiện của nhà trường.',
  },
  {
    id: '3',
    name: 'Sinh viên lớp 20CLC11',
    creator: {
      id: '1',
      name: 'Đặng Nguyễn Duy',
      avatarUrl: '/demo.jpg',
    },
    privacy: 'Công khai',
    avatarUrl: '/authentication.png',
    coverUrl: '/authentication.png',
    website: '',
    status: 'Bình thường',
    publicAt: '05-04-2023',
    numberMember: 500,
    isJoined: false,
    description:
      'Nhóm lớp 20CLC11. Nơi mà sinh viên lớp 20CLC11 chia sẻ kiến thức và sự kiện của nhà trường.',
  },
  {
    id: '4',
    name: 'Sinh viên lớp 20CLC11',
    creator: {
      id: '1',
      name: 'Đặng Nguyễn Duy',
      avatarUrl: '/demo.jpg',
    },
    privacy: 'Công khai',
    avatarUrl: '/authentication.png',
    coverUrl: '/authentication.png',
    website: '',
    status: 'Bình thường',
    publicAt: '05-04-2023',
    numberMember: 500,
    isJoined: true,
    description:
      'Nhóm lớp 20CLC11. Nơi mà sinh viên lớp 20CLC11 chia sẻ kiến thức và sự kiện của nhà trường.',
  },
  {
    id: '5',
    name: 'Sinh viên lớp 20CLC11 Sinh viên lớp 20CLC11 Sinh viên lớp 20CLC11 Sinh viên lớp 20CLC11',
    creator: {
      id: '1',
      name: 'Đặng Nguyễn Duy',
      avatarUrl: '/demo.jpg',
    },
    privacy: 'Công khai',
    avatarUrl: '/authentication.png',
    coverUrl: '/authentication.png',
    website: '',
    status: 'Bình thường',
    publicAt: '05-04-2023',
    numberMember: 500,
    isJoined: false,
    description:
      'Nhóm lớp 20CLC11. Nơi mà sinh viên lớp 20CLC11 chia sẻ kiến thức và sự kiện của nhà trường.',
  },
]

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const [curPage, setCurPage] = useState(Number(params.get('page')) + 1 || 1)
  const [myParams, setMyParams] = useState(`?${params.toString()}`)
  const [totalPages, setTotalPages] = useState(1)
  //const [groups, setGroups] = useState([])

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
        //setGroups(groups)
      })
      .catch()
  }, [myParams])

  return (
    <>
      <Thumbnail />
      <div className="mt-4 max-w-[850px] min-w-[500px] w-[80%] m-auto flex flex-col gap-6 h-fit mb-12">
        <p
          className={`${roboto.className} ml-5 lg:ml-0 text-3xl font-bold text-[var(--blue-02)]`}>
          NHÓM
        </p>
        <SearchAndFilterGroups />
        <Button
          onClick={() => router.push('/groups/create')}
          placeholder={undefined}
          size="md"
          className="bg-[--blue-03] text-[--blue-05] normal-case flex items-center justify-center gap-2">
          <Plus className="text-xl" />
          Tạo nhóm mới
        </Button>
        {groups.map((group) => (
          <GroupsListItem key={group.id} group={group} />
        ))}
      </div>
    </>
  )
}
