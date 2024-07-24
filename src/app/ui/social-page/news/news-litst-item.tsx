'use client'
import React from 'react'
import Link from 'next/link'
import { Calendar, TagFill } from 'react-bootstrap-icons'
import moment from 'moment'
/* eslint-disable @next/next/no-img-element */

export default function NewsListItem({
  id,
  title,
  summary,
  publishedAt,
  faculty,
  tags,
  thumbnail,
}) {
  return (
    <div className="flex lg:flex-row flex-col items-start gap-6 w-full">
      <Link
        href={`/news/${id}`}
        className="w-[20rem] xl:w-[20rem] h-52 shrink-0">
        <img
          src={thumbnail}
          alt="thumbnail"
          className="w-full h-full object-cover object-center rounded-xl"
        />
      </Link>
      <div className="w-full md:w-fit px-8 md:px-0 flex flex-col gap-y-1 text-black">
        <Link
          href={`/news/${id}`}
          className="font-extrabold w-full sm:w-[400px] md:w-full text-[--blue-05] text-[22px] cursor-pointer hover:text-[--secondary] hover:duration-300">
          {title}
        </Link>
        <p className="w-full sm:w-[400px] md:w-full">{summary}</p>
        <div className="flex gap-x-1 items-center">
          <Calendar className="text-[--blue-02]" />
          <p>{moment(publishedAt).local().format('DD/MM/YYYY')}</p>
        </div>
        {faculty ? <p>Khoa {faculty.name}</p> : null}
        <div className="flex gap-x-2 items-center flex-wrap">
          <TagFill className="text-[--blue-02]" />
          {tags.map(({ name }) => (
            <p
              key={name}
              className="font-extrabold text-[--blue-05] text-md hover:text-[--secondary] hover:duration-300">
              {name}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
