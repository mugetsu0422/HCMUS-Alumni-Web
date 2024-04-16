'use client'

import React, { useState, useRef } from 'react'
import { Button, Input, Radio } from '@material-tailwind/react'
import { useDebouncedCallback } from 'use-debounce'
import { useForm } from 'react-hook-form'
import { nunito } from '../../ui/fonts'
import { FACULTIES } from '../../constant'
import { useSearchParams } from 'next/navigation'
import Filter from '../../ui/social-page/hof/filter'

export default function Page() {
  //   const status = 'pending'
  //const searchParams = useSearchParams()
  const [myParams, setMyParams] = useState() //`?status=${status}`
  //   const [totalCount, setTotalCount] = useState(0)
  //   const [items, setItems] = useState([])
  //   const isShowMore = useRef(false)
  //   const itemNumber = useRef(0)
  //   const offset = useRef(0)

  return (
    <div className="flex flex-col w-[80%] max-w-[65rem] m-auto mt-10">
      <p
        className={`text-gray-900 font-bold text-lg lg:text-xl ${nunito.className}`}>
        Gương thành công
      </p>
      <Filter setMyParams={setMyParams} />
      {/* status={status} */}
      Page
    </div>
  )
}
