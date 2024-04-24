/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useRef } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { useForm } from 'react-hook-form'
import { nunito } from '../../ui/fonts'
import { FACULTIES } from '../../constant'
import { useSearchParams } from 'next/navigation'
import Filter from '../../ui/social-page/hof/filter'
import Pagination from '../../ui/common/pagination'
import { useRouter } from 'next/navigation'

const hof = [
  {
    id: '1',
    thumbnail: '/authentication.png',
    faculty_id: 'Sinh học - công nghệ sinh học',
    title: 'Nguyễn Mai Hoàng Quang Huy',
    beginning_year: '2016',
  },
  {
    id: '2',
    thumbnail: '/authentication.png',
    faculty_id: 'Sinh học - công nghệ sinh học',
    title: 'Nguyễn Mai Hoàng Quang Huy',
    beginning_year: '2016',
  },
  {
    id: '3',
    thumbnail: '/authentication.png',
    faculty_id: 'Sinh học - công nghệ sinh học',
    title: 'Nguyễn Mai Hoàng Quang Huy',
    beginning_year: '2016',
  },
  {
    id: '4',
    thumbnail: '/authentication.png',
    faculty_id: 'Sinh học - công nghệ sinh học',
    title: 'Nguyễn Mai Hoàng Quang Huy',
    beginning_year: '2016',
  },
  {
    id: '5',
    thumbnail: '/authentication.png',
    faculty_id: 'Sinh học - công nghệ sinh học',
    title: 'Nguyễn Mai Hoàng Quang Huy',
    beginning_year: '2016',
  },
  {
    id: '6',
    thumbnail: '/authentication.png',
    faculty_id: 'Sinh học - công nghệ sinh học',
    title: 'Nguyễn Mai Hoàng Quang Huy',
    beginning_year: '2016',
  },
  {
    id: '7',
    thumbnail: '/authentication.png',
    faculty_id: 'Sinh học - công nghệ sinh học',
    title: 'Nguyễn Mai Hoàng Quang Huy',
    beginning_year: '2016',
  },
  {
    id: '8',
    thumbnail: '/authentication.png',
    faculty_id: 'Sinh học - công nghệ sinh học',
    title: 'Nguyễn Mai Hoàng Quang Huy',
    beginning_year: '2016',
  },
  {
    id: '9',
    thumbnail: '/authentication.png',
    faculty_id: 'Sinh học - công nghệ sinh học',
    title: 'Nguyễn Mai Hoàng Quang Huy',
    beginning_year: '2016',
  },
]

function HofListItem({ id, thumbnail, faculty_id, title, beginning_year }) {
  const router = useRouter()
  return (
    <div className="max-w-[400px] flex flex-col gap-1">
      <img
        src={thumbnail}
        alt="Hall of fame image"
        className="w-full h-64 object-cover object-center rounded-xl hover:cursor-pointer"
        onClick={() => router.push(`/hof/${id}`)}
      />
      <p className="w-full text-center text-xl text-black font-bold">{title}</p>
      <p>
        Khóa {beginning_year} - Khoa {faculty_id}
      </p>
    </div>
  )
}

export default function Page() {
  const [curPage, setCurPage] = useState() //Number(params.get('page')) + 1 || 1
  const [totalPages, setTotalPages] = useState(1)
  const onNextPage = () => {
    // if (curPage == totalPages) return
    // params.set('page', curPage.toString())
    // replace(`${pathname}?${params.toString()}`)
    // setMyParams(`?${params.toString()}`)
    // setCurPage((curPage) => {
    //   return curPage + 1
    // })
  }
  const onPrevPage = () => {
    // if (curPage == 1) return
    // params.set('page', (curPage - 2).toString())
    // replace(`${pathname}?${params.toString()}`)
    // setMyParams(`?${params.toString()}`)
    // setCurPage((curPage) => {
    //   return curPage - 1
    // })
  }

  //   const status = 'pending'
  //const searchParams = useSearchParams()
  const [myParams, setMyParams] = useState() //`?status=${status}`
  //   const [totalCount, setTotalCount] = useState(0)
  //   const [items, setItems] = useState([])
  //   const isShowMore = useRef(false)
  //   const itemNumber = useRef(0)
  //   const offset = useRef(0)

  return (
    <div className="flex flex-col w-[80%] gap-6 max-w-[80rem] m-auto mt-10">
      <p
        className={`text-gray-900 font-bold text-lg lg:text-xl ${nunito.className}`}>
        Gương thành công
      </p>
      <Filter setMyParams={setMyParams} />
      {/* status={status} */}
      <div className="mt-4 max-w-[80rem] flex flex-wrap justify-center gap-x-10 gap-y-6">
        {hof.map(({ id, thumbnail, faculty_id, title, beginning_year }) => (
          <HofListItem
            key={id}
            id={id}
            thumbnail={thumbnail}
            faculty_id={faculty_id}
            title={title}
            beginning_year={beginning_year}
          />
        ))}
      </div>
      <Pagination
        totalPages={totalPages}
        curPage={curPage}
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
      />
    </div>
  )
}
