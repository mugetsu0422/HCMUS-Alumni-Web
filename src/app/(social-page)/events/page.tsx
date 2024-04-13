'use client'

import React, { useState } from 'react'
import EventsListItem from '../../ui/social-page/events/events-list-item'
import Pagination from '../../ui/common/pagination'
import { Button } from '@material-tailwind/react'
import { FACULTIES } from '../../constant'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons'

const dataTemp = [
  {
    id: '1',
    title: 'Khai mạc Trường hè Khoa học Dữ liệu 2024',
    thumbnail: '/authentication.png',
    views: 100,
    organizationLocation: '227 Nguyễn Văn Cừ, P4, Q5',
    organizationTime: 'DD-MM-YYYY HH:mm:ss',
    status: '',
    faculty_id: 'Công Nghệ Thông Tin',
  },
  {
    id: '2',
    title: 'Khai mạc Trường hè Khoa học Dữ liệu 2025',
    thumbnail: '/authentication.png',
    views: 100,
    organizationLocation: '227 Nguyễn Văn Cừ, P4, Q5',
    organizationTime: 'DD-MM-YYYY HH:mm:ss',
    status: '',
    faculty_id: 'Sinh học – Công nghệ Sinh học',
  },
  {
    id: '3',
    title: 'Khai mạc Trường hè Khoa học Dữ liệu 2026',
    thumbnail: '/authentication.png',
    views: 100,
    organizationLocation: '227 Nguyễn Văn Cừ, P4, Q5',
    organizationTime: 'DD-MM-YYYY HH:mm:ss',
    status: '',
    faculty_id: 'CNTT',
  },
]

function FilterFaculty() {
  return (
    <div className="flex items-end gap-x-2 w-fit">
      <Button placeholder={undefined} className="bg-[--blue-05]">
        <FontAwesomeIcon icon={faFilterCircleXmark} className="text-lg mr-2" />
        Xóa bộ lọc
      </Button>

      <div className="flex flex-col gap-1">
        <p className="font-semibold text-md">Khoa</p>
        <select
          className="h-[2.8rem] hover:cursor-pointer pl-3 w-fit text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 p-3 rounded-md border-blue-gray-200 focus:border-gray-900"
          //{...register('facultyId')}
        >
          <option value={0}>Không</option>
          {FACULTIES.map(({ id, name }) => {
            return (
              <option key={id} value={id}>
                {name}
              </option>
            )
          })}
        </select>
      </div>
    </div>
  )
}

export default function Page() {
  const [curPage, setCurPage] = useState(0)
  //* Number(params.get('page')) + 1 || 1
  const [totalPages, setTotalPages] = useState(0)

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

  return (
    <div className="mt-8 flex flex-col justify-center gap-8 w-[70%] m-auto max-w-[1248px]">
      <FilterFaculty />
      <div className="flex w-full flex-wrap gap-6 justify-center mt-4">
        {dataTemp.map(
          ({
            id,
            title,
            thumbnail,
            views,
            organizationLocation,
            organizationTime,
            faculty_id,
          }) => (
            <EventsListItem
              key={id}
              id={id}
              title={title}
              thumbnail={thumbnail}
              views={views}
              organizationLocation={organizationLocation}
              organizationTime={organizationTime}
              faculty_id={faculty_id}
            />
          )
        )}
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
