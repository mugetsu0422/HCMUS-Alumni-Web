'use client'

import React from 'react'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GlobeAmericas } from 'react-bootstrap-icons'

export default function Introduce({ privacy, description }) {
  return (
    <div className="bg-[#ebeef0] w-[30%] h-fit flex flex-col gap-4 p-4 rounded-lg">
      <p className="font-bold text-lg">Giới thiệu</p>

      <p>{description}</p>

      {privacy === 'Nhóm kín' ? (
        <div className="flex flex-col gap-1">
          <p className="flex gap-1 items-center font-bold text-base">
            <FontAwesomeIcon icon={faLock} />
            Riêng tư
          </p>
          <p>
            Chỉ thành viên mới nhìn thấy mọi người trong nhóm và những gì họ
            đăng.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <p className="flex gap-1 items-center font-bold text-base">
            <GlobeAmericas /> Công Khai
          </p>
          <p>
            Bất kỳ ai cũng có thể nhìn thấy mọi người trong nhóm và những gì họ
            đăng.
          </p>
        </div>
      )}
    </div>
  )
}
