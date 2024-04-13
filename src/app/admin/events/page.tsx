'use client'
import React, { useState } from 'react'
import { Input, Button } from '@material-tailwind/react'
import { ArrowCounterclockwise } from 'react-bootstrap-icons'
import { roboto } from '../../ui/fonts'
import Pagination from '../../ui/common/pagination'
import EventsListItem from '../../ui/admin/events/events-list-item'
import FilterHeader from '../../ui/admin/events/header-filter'
import { useRouter } from 'next/navigation'

const events = [
  {
    id: '1',
    title: 'Khai mạc Trường hè Khoa học Dữ liệu 2024',
    thumbnail: '/authentication.png',
    views: 100,
    organizationLocation: '227 Nguyễn Văn Cừ, P4, Q5 ',
    organizationTime: 'DD/MM/YYYY HH:mm:ss',
    status: { name: 'Ẩn' },
  },
]

function FuntionSection() {
  const router = useRouter()
  // const searchParams = useSearchParams()
  // const params = new URLSearchParams(searchParams)
  // const { register, reset } = useForm({
  //   defaultValues: {
  //     title: params.get('title'),
  //   },
  // })

  return (
    <div className="my-5 w-[1500px] m-auto flex items-center gap-5">
      <div className="h-full w-[500px] mr-auto">
        <Input
          size="lg"
          crossOrigin={undefined}
          label="Tìm kiếm sự kiện..."
          placeholder={undefined}
          // defaultValue={params.get('title')}
          // {...register('title', {
          //   onChange: (e) => onSearch(e.target.value),
          // })}
        />
      </div>
      <Button
        onClick={() => router.push('/admin/events/create')}
        placeholder={undefined}
        className="h-full font-bold normal-case text-base min-w-fit bg-[var(--blue-02)] text-white ">
        Tạo mới
      </Button>
      <Button
        // onClick={() => {
        //   onResetSearchAndFilter()
        //   reset()
        // }}
        placeholder={undefined}
        className="rounded-full p-3 h-full font-bold normal-case text-base min-w-fit bg-[var(--blue-02)] text-white ">
        <ArrowCounterclockwise className="text-2xl font-bold" />
      </Button>
    </div>
  )
}

export default function Page() {
  const [totalPages, setTotalPages] = useState(0)
  const [curPage, setCurPage] = useState(0) //* Number(params.get('page')) + 1 || 1
  const [myParams, setMyParams] = useState()

  const onNextPage = () => {}
  const onPrevPage = () => {}
  return (
    <div className="flex flex-col sm:justify-center lg:justify-start m-auto max-w-[90%] mt-[3vw] overflow-x-auto">
      <p
        className={`${roboto.className} mx-auto w-[1500px] text-3xl font-bold text-[var(--blue-02)]`}>
        Quản lý sự kiện
      </p>
      <FuntionSection
      // onSearch={onSearch}
      // onResetSearchAndFilter={onResetSearchAndFilter}
      />
      <FilterHeader setParams={setMyParams} setCurPage={setCurPage} />
      <div className="relative mb-10">
        {events.map(
          ({
            id,
            title,
            thumbnail,
            views,
            organizationLocation,
            organizationTime,
            status,
          }) => (
            <EventsListItem
              key={id}
              id={id}
              title={title}
              thumbnail={thumbnail}
              views={views}
              organizationLocation={organizationLocation}
              organizationTime={organizationTime}
              status={status}
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
