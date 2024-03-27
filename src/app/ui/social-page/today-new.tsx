'use client'

import React from 'react'
import Image from 'next/image'
import { Chip } from '@material-tailwind/react'

function BigNews() {
  return (
    <figure className="relative w-[800px] h-[600px]">
      <Image
        className="h-[600px] w-[800px] rounded-xl object-cover object-center"
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
    <figure className="relative h-64 w-full">
      <Image
        className="h-60 w-full rounded-xl object-cover object-center"
        src="/authentication.png"
        alt="nature image"
        width={256}
        height={240}
      />
      <figcaption className="absolute bottom-0 left-2/4 flex w-full -translate-x-2/4 justify-between rounded-xl border border-white bg-white/75 py-2 px-4 saturate-200 backdrop-blur-sm">
        <div className={`text-base`}>
          Ethiopian runners took the top four spots.
        </div>
      </figcaption>
    </figure>
  )
}

export default function TodayNews() {
  return (
    <div className="flex gap-4 items-end my-1">
      <BigNews />
      <div className="flex flex-col w-72 gap-4 relative">
        <Chip value="Hôm nay" variant="ghost" className="w-fit rounded-sm " />
        <SmallNews />
        <SmallNews />
      </div>
    </div>
  )
}
