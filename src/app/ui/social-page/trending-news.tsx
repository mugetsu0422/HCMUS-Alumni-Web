import React from 'react'
import Image from 'next/image'

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
        <div className="flex gap-x-4 h-36 cursor-pointer" key={idx}>
          <Image
            src={imgSrc}
            width={240}
            height={0}
            alt="image news"
            className="rounded-md "
          />
          <div className="w-72 flex flex-col items-center justify-center gap-1">
            <p className="text-lg font-bold">{title}</p>
            <p className="text-xs">{detail}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function BigTrendingNews() {
  return (
    <figure className="relative w-fit h-[600px]">
      <Image
        className="h-[600px] w-full rounded-xl object-cover object-center"
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

export default function TrendingNews() {
  return (
    <div className="flex w-[1104px] h-[600px] bg-[#ebeef3] rounded-md">
      <div className="w-fit h-[45%] px-10 py-6 gap-y-8 flex flex-col">
        <p className="text-3xl leading-9 font-extrabold">Trending News </p>
        <SmallTrendingNews />
      </div>
      <BigTrendingNews />
    </div>
  )
}
