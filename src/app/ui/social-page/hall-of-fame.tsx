import React from 'react'
import Image from 'next/image'

const tempData = [
  { name: 'Trương Samuel' },
  { name: 'Đặng Nguyễn Duy' },
  { name: 'Nguyễn Mai Hoàng Quang Huy' },
]

export default function HallOfFame() {
  return (
    <div className=" flex flex-col sm:justify-center sm:items-center xl:items-start m-auto sm:w-[500px] xl:w-full max-w-[1150px] h-fit mb-10 gap-y-6 p-6">
      <p className="text-3xl font-bold">Gương thành công tiêu biểu</p>
      <div className="flex sm:flex-col xl:flex-row sm:items-center xl:items-start xl:justify-evenly w-full">
        {tempData.map(({ name }, idx) => (
          <div
            className="flex flex-col justify-start items-start gap-2"
            key={idx}>
            <Image
              src="/authentication.png"
              width={320}
              height={0}
              alt="avatar"
              className="object-cover object-center rounded-md"
            />
            <p className="text-2xl font-bold text-pretty text-center w-[320px]">
              {name}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
