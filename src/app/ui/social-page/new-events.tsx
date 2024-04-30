'use client'

import React from 'react'
import Image from 'next/image'

function BigEvent() {
  return (
    <figure className="relative sm:w-[500px] sm:h-[300px] xl:w-[500px] 2xl:w-[650px] xl:h-[528px]">
      <Image
        className="sm:w-[500px] sm:h-[300px] xl:h-[528px] xl:w-[600px] 2xl:w-[650px] rounded-xl object-cover object-center"
        src="/authentication.png"
        alt="nature image"
        width={650}
        height={528}
      />
      <figcaption className="absolute bottom-0 left-2/4 flex w-full -translate-x-2/4 justify-between rounded-xl border border-[--layer] bg-[--layer] py-2 px-4 saturate-200 backdrop-blur-sm">
        <div className={`text-2xl text-white`}>
          Ethiopian runners took the top four spots.
        </div>
      </figcaption>
    </figure>
  )
}

function SmallEvent() {
  return (
    <figure className="relative h-64 sm:w-[500px] xl:w-[300px] ">
      <Image
        className="h-60 lg:w-full rounded-xl object-cover object-center"
        src="/authentication.png"
        alt="nature image"
        width={256}
        height={240}
      />
      <figcaption className="absolute  bottom-0 left-2/4 flex w-full -translate-x-2/4 justify-between rounded-xl border border-[--layer] bg-[--layer] py-2 px-4 saturate-200 backdrop-blur-sm">
        <div className={`text-base text-white`}>
          Ethiopian runners took the top four spots.
        </div>
      </figcaption>
    </figure>
  )
}

function MediumEvent() {
  return (
    <figure className="relative h-64 w-full">
      <Image
        className="h-60 lg:w-full rounded-xl object-cover object-center"
        src="/authentication.png"
        alt="nature image"
        width={614}
        height={240}
      />
      <figcaption className="absolute  bottom-0 left-2/4 flex w-full -translate-x-2/4 justify-between rounded-xl border border-[--layer] bg-[--layer] py-2 px-4 saturate-200 backdrop-blur-sm">
        <div className={`text-base text-white`}>
          Ethiopian runners took the top four spots.
        </div>
      </figcaption>
    </figure>
  )
}

export default function NewEvents() {
  return (
    <div className="sm:flex-col xl:flex-row xl:justify-between m-auto sm:w-[500px] xl:w-full max-w-[1152px] justify-center flex gap-4 items-end my-1 ">
      <BigEvent />
      <div className="flex flex-col gap-4">
        <div className="flex w-[500px] gap-4 relative ">
          <SmallEvent />
          <SmallEvent />
        </div>
        <MediumEvent />
      </div>
    </div>
  )
}
