'use client'

import React from 'react'
import MostViewed from '../../../ui/social-page/news/most-viewed'
import { Clock, BarChartFill, TagFill } from 'react-bootstrap-icons'
import { Textarea } from '@material-tailwind/react'

import { nunito } from '../../../ui/fonts'

export default function Page() {
  return (
    <div className="flex m-auto w-[80%]">
      <div
        className={`${nunito.className} mt-32 flex flex-col gap-y-8 mx-auto w-[70%]`}>
        <div className="flex justify-between">
          <p className="font-medium text-lg text-[--blue-02]">Khoa</p>
          <p className="font-medium text-lg flex items-center gap-x-1">
            <Clock />
            Ngày đăng
          </p>
        </div>
        <div className="text-left text-[1.8rem] font-bold text-[--blue-02]">
          Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và
          công nghệ bán dẫn
        </div>
        <div className="w-full h-[800px] bg-[--blue-05] ql-editor">content</div>

        <div className="flex flex-col gap-y-1 text-black text-base">
          <div className="flex items-center gap-x-2">
            <BarChartFill />
            Lượt xem: <text>000</text>
          </div>
          <div className="flex gap-x-2 items-center">
            <TagFill />
            Thẻ:
            {/* Xem thêm ở user news */}
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-x-2">
              <Clock />
              Lần cuối cập nhật: <text>(ngày cập nhật)</text>
            </div>
            <div>React icon</div>
          </div>
        </div>
        <div className="flex flex-col gap-y-2  mb-8">
          <p className="text-xl">Ý kiến</p>
          <Textarea placeholder={undefined} label="Chia sẻ ý kiến của bạn" />
        </div>
      </div>

      <MostViewed />
    </div>
  )
}
