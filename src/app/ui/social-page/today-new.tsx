'use client'

import React from 'react'
import Image from 'next/image'
import { Chip } from '@material-tailwind/react'

function BigNews() {
  return (
    <figure className="relative sm:w-[500px] sm:h-[300px] xl:w-[600px] 2xl:w-[800px] xl:h-[600px]">
      <Image
        className="sm:w-[500px] sm:h-[300px] xl:h-[600px] xl:w-[600px] 2xl:w-[800px] rounded-xl object-cover object-center"
        src="/authentication.png"
        alt="nature image"
        width={800}
        height={600}
      />
      <figcaption className="absolute bottom-0 left-2/4 flex w-full -translate-x-2/4 justify-between rounded-xl border border-white bg-white/75 py-2 px-4 saturate-200 backdrop-blur-sm">
        <div className={`text-2xl`}>
          Ethiopian runners took the top four spots.
        </div>
      </figcaption>
    </figure>
  )
}

function SmallNews() {
  return (
    <figure className="relative h-64 sm:w-[500px] xl:w-[300px] ">
      <Image
        className="h-60 lg:w-full rounded-xl object-cover object-center"
        src="/authentication.png"
        alt="nature image"
        width={256}
        height={240}
      />
      <figcaption className="absolute  bottom-0 left-2/4 flex w-full -translate-x-2/4 justify-between rounded-xl border border-white bg-white/75 py-2 px-4 saturate-200 backdrop-blur-sm">
        <div className={`text-base`}>
          Ethiopian runners took the top four spots.
        </div>
      </figcaption>
    </figure>
  )
}

export default function TodayNews() {
  return (
    <div className="sm:flex-col xl:flex-row justify-center flex gap-4 items-end my-1 ">
      <BigNews />
      <div className="flex xl:flex-col sm:w-[500px] xl:w-[300px]  gap-4 relative ">
        <Chip
          value="Hôm nay"
          variant="ghost"
          className="sm:hidden xl:block lg w-fit rounded-sm "
        />
        <SmallNews />
        <SmallNews />
      </div>
    </div>
  )
}
