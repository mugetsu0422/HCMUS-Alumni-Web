'use client'
import React from 'react'
import Image from 'next/image'
/* eslint-disable @next/next/no-img-element */
const dataTempSmall = [
  {
    title: '6-Year-Old Horse Dies at Belmont Park After Race Injury',
    detail:
      'NEW YORK—A 6-year-old horse died after being injured in a race at Belmont Park ahead of next week’s',
    imgSrc: '/authentication.png',
  },
  {
    title: 'Savilia Blunk Embraces Longer Season with World Cup',
    detail:
      'Last year, Savilia Blunk took a more conservative approach to her first season as an Elite Class athlete, skipping some',
    imgSrc: '/authentication.png',
  },
  {
    title: 'Ryan Garcia is fighting again, this time on social media',
    detail:
      'Boxing star Ryan Garcia and his promoter, Hall of Fame fighter Oscar De La Hoya, reignited their war of words via Twitter on',
    imgSrc: '/authentication.png',
  },
]

function SmallTrendingNews() {
  return (
    <div className="flex flex-col gap-6">
      {dataTempSmall.map(({ title, detail, imgSrc }, idx) => (
        <div className="flex gap-x-4 sm:h-44 2xl:h-36 cursor-pointer" key={idx}>
          <Image
            src={imgSrc}
            width={240}
            height={0}
            alt="image news"
            className="rounded-md "
          />
          <div className="w-[16rem] flex flex-col items-center justify-center">
            <p className="sm:sm md:text-lg font-bold">{title}</p>
            <p className="text-xs">{detail}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function BigTrendingNews() {
  return (
    <figure className="relative right-0 w-fit sm:h-[300px] 2xl:h-[600px] m-auto">
      <Image
        className="sm:h-[300px] 2xl:h-[600px] sm:w-[500px] 2xl:w-full rounded-xl object-cover object-center"
        src="/authentication.png"
        alt="nature image"
        width={780}
        height={600}
      />
      <figcaption className="absolute bottom-0 left-2/4 flex 2xl:w-full -translate-x-2/4 justify-between rounded-xl border border-[--layer] bg-[--layer] py-2 px-4 saturate-200 backdrop-blur-sm">
        <div className={`text-2xl text-white`}>
          Ethiopian runners took the top four spots.
        </div>
      </figcaption>
    </figure>
  )
}

export default function TrendingNews() {
  return (
    <div className="xl:flex-row sm:flex-col sm:justify-between sm:items-center xl:items-stretch flex w-fit h-fit bg-[#ebeef3] rounded-md ">
      <div className="w-fit h-[45%] pl-8 pr-4 py-6 gap-y-8 flex flex-col">
        <p className="text-3xl leading-9 font-extrabold">Tin nổi bật </p>
        <SmallTrendingNews />
      </div>
      <BigTrendingNews />
    </div>
  )
}
