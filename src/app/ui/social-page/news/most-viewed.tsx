'use client'
import React from 'react'

const mostViewed = [
  {
    name: ' Sinh viên Bùi Thị Khánh Linh giành giải nhất tại Cuộc thi Công nghệ chế biến sau thu hoạch năm 2019',
    view: 600,
  },
  {
    name: ' Sinh viên Bùi Thị Khánh Linh giành giải nhất tại Cuộc thi Công nghệ chế biến sau thu hoạch năm 2019',
    view: 600,
  },
  {
    name: ' Sinh viên Bùi Thị Khánh Linh giành giải nhất tại Cuộc thi Công nghệ chế biến sau thu hoạch năm 2019',
    view: 600,
  },
  {
    name: ' Sinh viên Bùi Thị Khánh Linh giành giải nhất tại Cuộc thi Công nghệ chế biến sau thu hoạch năm 2019',
    view: 600,
  },
  {
    name: ' Sinh viên Bùi Thị Khánh Linh giành giải nhất tại Cuộc thi Công nghệ chế biến sau thu hoạch năm 2019',
    view: 600,
  },
]

export default function MostViewed() {
  return (
    <div className="mt-20 xl:w-72 w-fit bg-gray-300 text-[--blue-05] font-medium py-6 px-4">
      <p className="my-6 text-xl font-extrabold text-[#008000]">
        Xem nhiều nhất
      </p>
      <ol className="flex sm:flex-wrap gap-y-4 list-disc">
        {mostViewed.map(({ view, name }, idx) => (
          <li className="ml-8" key={idx}>
            {name} <text className="text-[--text]">({view}).</text>
          </li>
        ))}
      </ol>
    </div>
  )
}
