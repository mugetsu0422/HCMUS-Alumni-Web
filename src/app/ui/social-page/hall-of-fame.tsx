import React from 'react'
import Image from 'next/image'
/* eslint-disable @next/next/no-img-element */

export default function HallOfFame({ hof }) {
  return (
    <div className=" flex flex-col sm:justify-center sm:items-center xl:items-start m-auto sm:w-[500px] xl:w-full h-fit mb-10 gap-y-6 ">
      <p className="text-3xl font-bold">Gương thành công</p>
      <div className="flex sm:flex-col xl:flex-row sm:items-center xl:items-start xl:justify-center w-full ">
        {hof.slice(0, 4).map(({ title, thumbnail, id }) => (
          <div
            className="flex flex-col justify-center items-center gap-2"
            key={id}>
            <img
              src={thumbnail}
              alt="avatar"
              className="object-cover object-center rounded-md w-[200px] h-[200px]"
            />
            <p className="text-2xl font-bold text-pretty text-center w-[320px]">
              {title}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
