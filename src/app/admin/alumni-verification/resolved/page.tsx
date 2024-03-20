'use client'

import React, { useEffect } from 'react'
import Filter from '../../../ui/admin/filter'
import { nunito } from '../../../ui/fonts'
import { Button } from '@material-tailwind/react'
import CardInformation from '../../../ui/admin/card-information-resolved'
import axios from 'axios'
import Cookies from 'js-cookie'
import { JWT_COOKIE } from '../../../constant'

export default function Page() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [items, setItems] = React.useState([])
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [visible, setVisible] = React.useState(2) //Coi lại và thống nhất để có số thích hợp hơn.

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/alumni-verification/resolved`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then((res) => {
        setItems(res.data)
      })
      .catch((e) => {})
  }, [])

  function showMore() {
    setVisible((e) => e + 1) //Sau này thay số 1 thành số khác để linh hoạt hơn
  }

  return (
    <div className="m-auto w-[85vw] flex flex-col bg-[#fafcfe] mt-[3.5vw] gap-y-3 p-4">
      <p
        className={`text-gray-900 font-bold text-lg lg:text-[1.5vw] ${nunito}`}>
        Đã xét duyệt cựu sinh viên - #{items.length}
      </p>
      <Filter />
      <div className="flex flex-wrap gap-5 justify-between mt-5">
        <CardInformation items={items} visible={visible} />
      </div>
      {visible === items.length ? (
        ''
      ) : (
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
