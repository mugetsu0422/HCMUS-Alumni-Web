'use client'

import React, { useState, useEffect } from 'react'
import { roboto } from '../../ui/fonts'
import { Input } from '@material-tailwind/react'
import { JWT_COOKIE, POST_STATUS } from '../../constant'
import Cookies from 'js-cookie'
import Thumbnail from '../../ui/social-page/thumbnail-image'
import GroupsListItem from '../../ui/social-page/groups/groups-list-item'
import { useForm } from 'react-hook-form'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import axios from 'axios'

const groups = [
  {
    id: '1',
    name: 'Sinh viên lớp 20CLC11',
    creator: {
      id: '1',
      name: 'Đặng Nguyễn Duy',
      avatarUrl: '/demo.jpg',
    },
    type: 'Công khai',
    avatarUrl: '/authentication.png',
    coverUrl: '/authentication.png',
    website: '',
    status: 'Bình thường',
    publicAt: '05-04-2023',
    numberMember: 500,
    isJoined: true,
  },
  {
    id: '23',
    name: 'Sinh viên lớp 20CLC11',
    creator: {
      id: '1',
      name: 'Đặng Nguyễn Duy',
      avatarUrl: '/demo.jpg',
    },
    type: 'Công khai',
    avatarUrl: '/authentication.png',
    coverUrl: '/authentication.png',
    website: '',
    status: 'Bình thường',
    publicAt: '05-04-2023',
    numberMember: 500,
    isJoined: false,
  },
  {
    id: '3',
    name: 'Sinh viên lớp 20CLC11',
    creator: {
      id: '1',
      name: 'Đặng Nguyễn Duy',
      avatarUrl: '/demo.jpg',
    },
    type: 'Công khai',
    avatarUrl: '/authentication.png',
    coverUrl: '/authentication.png',
    website: '',
    status: 'Bình thường',
    publicAt: '05-04-2023',
    numberMember: 500,
    isJoined: false,
  },
  {
    id: '4',
    name: 'Sinh viên lớp 20CLC11',
    creator: {
      id: '1',
      name: 'Đặng Nguyễn Duy',
      avatarUrl: '/demo.jpg',
    },
    type: 'Công khai',
    avatarUrl: '/authentication.png',
    coverUrl: '/authentication.png',
    website: '',
    status: 'Bình thường',
    publicAt: '05-04-2023',
    numberMember: 500,
    isJoined: true,
  },
  {
    id: '5',
    name: 'Sinh viên lớp 20CLC11 Sinh viên lớp 20CLC11 Sinh viên lớp 20CLC11 Sinh viên lớp 20CLC11',
    creator: {
      id: '1',
      name: 'Đặng Nguyễn Duy',
      avatarUrl: '/demo.jpg',
    },
    type: 'Công khai',
    avatarUrl: '/authentication.png',
    coverUrl: '/authentication.png',
    website: '',
    status: 'Bình thường',
    publicAt: '05-04-2023',
    numberMember: 500,
    isJoined: false,
  },
]

export default function Page() {
  const pathname = usePathname()
  const { replace } = useRouter()
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

  const onSearch = useDebouncedCallback((keyword) => {
    if (keyword) {
      params.set('name', keyword)
    } else {
      params.delete('name')
    }
    resetCurPage()
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    setMyParams(`?${params.toString()}`)
  }, 500)

  const { register, reset } = useForm({
    defaultValues: {
      name: params.get('name'),
    },
  })

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

        <div className="flex flex-col gap-2">
          <p className="font-semibold text-md">Tìm kiếm nhóm</p>
          <Input
            size="lg"
            crossOrigin={undefined}
            placeholder={undefined}
            containerProps={{ className: '!w-[500px]' }}
            {...register('name', {
              onChange: (e) => onSearch(e.target.value),
            })}
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
            className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
          />
        </div>

        {groups.map(
          ({
            id,
            name,
            creator,
            type,
            avatarUrl,
            coverUrl,
            website,
            status,
            numberMember,
            isJoined,
          }) => (
            <GroupsListItem
              key={id}
              id={id}
              name={name}
              creator={creator}
              type={type}
              avatarUrl={avatarUrl}
              coverUrl={coverUrl}
              website={website}
              status={status}
              numberMember={numberMember}
              isJoined={isJoined}
            />
          )
        )}
      </div>
    </>
  )
}
