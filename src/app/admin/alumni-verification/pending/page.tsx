'use client'

import React, { useEffect, useRef, useState } from 'react'
import Filter from '../../../ui/admin/verify-alumni/filter-for-pending'
import CardInformation from '../../../ui/admin/verify-alumni/card-information-pending'
import { nunito } from '../../../ui/fonts'
import { Button } from '@material-tailwind/react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { ADMIN_VERIFY_ALUMNI_PAGE_LIMIT, JWT_COOKIE } from '../../../constant'
import { useSearchParams } from 'next/navigation'
import { Toaster } from 'react-hot-toast'

export default function Page() {
  const status = 'pending'
  const searchParams = useSearchParams()
  const [myParams, setMyParams] = useState(`?status=${status}`)
  const [totalCount, setTotalCount] = useState(0)
  const [items, setItems] = useState([])
  const isShowMore = useRef(false)
  const itemNumber = useRef(0)
  const offset = useRef(0)

  useEffect(() => {
    // Get total number
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/alumni-verification/count?status=${status}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then((res) => {
        setTotalCount(res.data)
      })
      .catch((error) => {})
  }, [])

  useEffect(() => {
    // Get first page
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/alumni-verification${myParams}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then((res) => {
        // Load more data
        if (isShowMore.current) {
          setItems(items.concat(res.data.items))
          isShowMore.current = false
        } else {
          // Get new data
          setItems(res.data.items)
          itemNumber.current = res.data.itemNumber
          offset.current = 0
        }
      })
      .catch((error) => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myParams])

  function showMore() {
    offset.current += ADMIN_VERIFY_ALUMNI_PAGE_LIMIT
    isShowMore.current = true
    const p = new URLSearchParams(searchParams)
    p.set('offset', offset.current.toString())
    p.set('limit', ADMIN_VERIFY_ALUMNI_PAGE_LIMIT.toString())
    setMyParams(`?status=${status}&${p.toString()}`)
  }

  return (
    <div className="m-auto max-w-[1280px] flex flex-col bg-[#fafcfe] mt-[3.5vw] gap-y-3 py-4 px-10">
      <p
        className={`text-gray-900 font-bold text-lg lg:text-xl ${nunito.className}`}>
        Yêu cầu xét duyệt cựu sinh viên
      </p>
      {totalCount === 0 ? null : (
        <Filter setMyParams={setMyParams} status={status} />
      )}
      <div className="flex flex-col gap-5 justify-between mt-5 overflow-x-auto">
        <CardInformation
          offset={offset}
          items={items}
          setItems={setItems}
          setTotalCount={setTotalCount}
        />
      </div>
      {offset.current + ADMIN_VERIFY_ALUMNI_PAGE_LIMIT >= itemNumber.current ||
      itemNumber.current == 0 ? null : (
        <Button
          onClick={showMore}
          placeholder={undefined}
          size="lg"
          ripple={true}
          className={`${nunito.className} sm:[30vw] lg:w-[20vw] bg-[var(--blue-04)] text-black font-bold m-auto`}>
          Xem Thêm
        </Button>
      )}
    </div>
  )
}
