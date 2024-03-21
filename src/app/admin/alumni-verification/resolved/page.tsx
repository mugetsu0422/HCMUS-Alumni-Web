'use client'

import React, { useEffect, useState } from 'react'
import Filter from '../../../ui/admin/filter'
import { nunito } from '../../../ui/fonts'
import { Button } from '@material-tailwind/react'
import CardInformation from '../../../ui/admin/card-information-resolved'
import axios from 'axios'
import Cookies from 'js-cookie'
import { ADMIN_VERIFY_ALUMNI_PAGE_LIMIT, JWT_COOKIE } from '../../../constant'

export default function Page() {
  const [count, setCount] = useState(0)
  const [items, setItems] = useState([])
  const [page, setPage] = useState(0)

  useEffect(() => {
    // Get total number
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/alumni-verification/resolved/count`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then((res) => {
        setCount(res.data)
      })
      .catch((e) => {})
  }, [])

  useEffect(() => {
    // Get first page
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/alumni-verification/resolve?page=${page}&size=${ADMIN_VERIFY_ALUMNI_PAGE_LIMIT}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then((res) => {
        // setItems((items) => items.concat(res.data))
        setItems(items.concat(res.data))
      })
      .catch((e) => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  function showMore() {
    setPage((p) => p + 1)
  }

  return (
    <div className="m-auto max-w-[1280px] flex flex-col bg-[#fafcfe] mt-[3.5vw] gap-y-3 p-4">
      <p className={`text-gray-900 font-bold text-lg lg:text-xl ${nunito}`}>
        Đã xét duyệt cựu sinh viên - #{items.length}
      </p>
      {count === 0 ? null : <Filter />}
      <div className="flex flex-wrap gap-5 justify-between mt-5">
        <CardInformation items={items} />
      </div>
      {count === items.length ? null : (
        <Button
          onClick={showMore}
          placeholder={undefined}
          size="lg"
          ripple={true}
          className={`${nunito} sm:[30vw] lg:w-[20vw] bg-[var(--blue-04)] text-black font-bold m-auto`}>
          Xem Thêm
        </Button>
      )}
    </div>
  )
}
