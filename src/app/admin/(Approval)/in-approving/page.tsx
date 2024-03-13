import React from 'react'
import Filter from '../../../ui/admin/filter'

const tempData = [
  {
    name: 'Trương Samule',
    MSSV: '20127610',
    Year: '2020',
    Email: 'tsamule@gmail.com',
    link: 'https://facebook.com/',
    linkImg: './demo.jpg',
  },
  {
    name: 'Trương Samule',
    MSSV: '20127610',
    Year: '2020',
    Email: 'tsamule@gmail.com',
    link: 'https://facebook.com/',
    linkImg: './demo.jpg',
  },
  {
    name: 'Trương Samule',
    MSSV: '20127610',
    Year: '2020',
    Email: 'tsamule@gmail.com',
    link: 'https://facebook.com/',
    linkImg: './demo.jpg',
  },
  {
    name: 'Trương Samule',
    MSSV: '20127610',
    Year: '2020',
    Email: 'tsamule@gmail.com',
    link: 'https://facebook.com/',
    linkImg: './demo.jpg',
  },
]

export default function page() {
  return (
    <div className="m-auto w-[78vw] flex flex-col bg-[#fafcfe] mt-[3.5vw] gap-y-3 p-4">
      <p className="text-gray-900 font-bold text-lg lg:text-[1.5vw]">
        Yêu cầu xét duyệt cựu sinh viên - #5
      </p>
      <Filter />
      <div></div>
    </div>
  )
}
