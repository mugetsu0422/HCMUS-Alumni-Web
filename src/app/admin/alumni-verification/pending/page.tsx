'use client'

import React from 'react'
import Filter from '../../../ui/admin/filter'
import { nunito } from '../../../ui/fonts'
import CardInformation from '../../../ui/admin/card-information-not-approved'
import { Button } from '@material-tailwind/react'

const tempData = [
  {
    name: 'Trương Samule',
    MSSV: '20127610',
    Year: '2020',
    Email: 'tsamule@gmail.com',
    link: 'https://facebook.com/',
    LinkImg: '/demo.jpg',
  },
  {
    name: 'Trần Hồng Minh Phúc',
    MSSV: '20127610',
    Year: '2020',
    Email: 'tsamule@gmail.com',
    link: 'https://facebook.com/',
    LinkImg: '/demo.jpg',
  },
  {
    name: 'Nguyễn Mai Hoàng Quang Huy',
    MSSV: '20127610',
    Year: '2020',
    Email: 'tsamule@gmail.com',
    link: 'https://facebook.com/',
    LinkImg: '/demo.jpg',
  },
  {
    name: 'Trương Samule',
    MSSV: '20127610',
    Year: '2020',
    Email: 'tsamule@gmail.com',
    Link: 'https://facebook.com/',
    LinkImg: '/demo.jpg',
  },
]

export default function Page() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [items, setItems] = React.useState(tempData)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [visible, setVisible] = React.useState(2) //Coi lại và thống nhất để có số thích hợp hơn.

  function showMore() {
    setVisible((e) => e + 1) //Sau này thay số 1 thành số khác để linh hoạt hơn
  }

  return (
    <div className="m-auto w-[85vw] flex flex-col bg-[#fafcfe] mt-[3.5vw] gap-y-3 p-4">
      <p
        className={`text-gray-900 font-bold text-lg lg:text-[1.5vw] ${nunito}`}>
        Yêu cầu xét duyệt cựu sinh viên - #5
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
          className={`${nunito.className} sm:[30vw] lg:w-[20vw] bg-[var(--blue-04)] text-black font-bold m-auto`}>
          Xem Thêm
        </Button>
      )}
    </div>
  )
}
