'use client'
import Link from 'next/link'
import React from 'react'

interface MostViewedProps {
  className?: string
  news?: {
    id: string
    title: string
    views: number
  }[]
}

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

export default function MostViewed({ className, news }: MostViewedProps) {
  return (
    <div className={className}>
      <p className="my-6 text-xl font-extrabold text-[#008000]">
        Xem nhiều nhất
      </p>
      <ol className="flex sm:flex-wrap gap-y-4 list-disc">
        {news?.map(({ id, views, title }) => (
          <li className="ml-8 w-full" key={id}>
            <Link href={`/news/${id}`}>{title}{' '}</Link>
            <span className="text-[var(--text)]">({views}).</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
