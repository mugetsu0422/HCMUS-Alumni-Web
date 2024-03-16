import React from 'react'
import { koho } from '../fonts'
import Image from 'next/image'

export default function Heading() {
  return (
    <div className="w-full 2xl:h-[650px] xl:h-[400px] sm:h-[300px] px-3 flex flex-wrap justify-center md:px-10 py-16 bg-gradient-to-r from-[var(--blue-05-10)] to-[#00000000] overflow-visible ">
      <div
        className={`${koho.className} font-bold text-slate-700 xl:text-[3.3vw] sm:text-[4vw] w-fit h-fit text-nowrap`}>
        LỊCH SỬ PHÁT TRIỂN NHÀ TRƯỜNG
      </div>
      <Image
        src="/about-school/heading.png"
        alt="principal generation"
        width={1536}
        height={864}
        className="m-auto rounded-md mt-[2vw] "
      />
    </div>
  )
}
