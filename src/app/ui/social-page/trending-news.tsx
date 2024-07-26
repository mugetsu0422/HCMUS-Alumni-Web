'use client'
import React from 'react'
import Link from 'next/link'
/* eslint-disable @next/next/no-img-element */

function SmallTrendingNews({ news }) {
  return (
    <div className="relative flex-1 flex flex-col justify-between w-[60%] gap-6 h-full ">
      {news.slice(1, 4).map(({ id, title, summary, thumbnail }) => (
        <div className="flex gap-x-4 sm:h-44 2xl:h-36" key={id}>
          <Link href={`/news/${id}`} key={id}>
            <img
              src={thumbnail}
              alt="image news"
              className="rounded-md w-[240px] h-full"
            />
          </Link>
          <div className="w-[18rem] flex flex-col items-start justify-center">
            <p className="sm:sm md:text-lg font-bold">{title}</p>
            <p className="text-xs">{summary}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function BigTrendingNews({ news }) {
  return (
    <div className="relative w-[45%] h-full max-h-[480px] flex flex-1">
      {news.slice(0, 1).map(({ id, title, summary, thumbnail }) => (
        <div key={id} className="flex flex-col gap-3">
          <Link href={`/news/${id}`} className="h-full">
            <img
              className="w-full h-full rounded-xl object-cover object-center relative"
              src={thumbnail}
              alt="nature image"
            />
          </Link>
          <div className={`text-xl text-black font-bold`}>{title}</div>
          <p className="text-sm">{summary}</p>
        </div>
      ))}
    </div>
  )
}

export default function TrendingNews({ news }) {
  return (
    <div className="relative flex-1 flex-col sm:justify-between sm:items-center xl:items-stretch flex w-full h-[660px] bg-[#ebeef3] rounded-md p-6">
      <p className="text-3xl leading-9 font-extrabold">Tin nổi bật </p>
      <div className="relative w-full h-[70%] gap-8 flex justify-between mt-2">
        <BigTrendingNews news={news} />

        <SmallTrendingNews news={news} />
      </div>
    </div>
  )
}
