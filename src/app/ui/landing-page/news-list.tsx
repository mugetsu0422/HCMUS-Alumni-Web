/* eslint-disable @next/next/no-img-element */
'use client'
import Link from 'next/link'
import React from 'react'
import { Card, CardBody, CardFooter } from '@material-tailwind/react'
import { nunito } from '../fonts'
import { Calendar } from 'react-bootstrap-icons'
import moment from 'moment'

function NewsCard({ news }) {
  return (
    <Card placeholder={undefined} className="w-[18rem] sm:w-[24rem] group">
      <Link href={'#'}>
        <div className="h-[10rem] sm:h-[14rem] shadow-lg rounded-xl">
          <img
            className="object-cover w-full h-full rounded-xl group-hover:opacity-80"
            src={news.thumbnail}
            alt="thumbnail"
          />
        </div>
        <CardBody placeholder={undefined} className="pb-1">
          <div
            // placeholder={undefined}
            className="group-hover:text-[var(--blue-05)] font-bold text-lg text-[var(--text)] line-clamp-2">
            {news.title}
          </div>
        </CardBody>
        <CardFooter
          placeholder={undefined}
          className="pt-0 text-[var(--secondary)] flex items-center gap-1">
          <Calendar />
          {moment(news.publishedAt).local().format('DD/MM/YYYY')}
        </CardFooter>
      </Link>
    </Card>
  )
}

function NewsList({ news }) {
  return (
    <div
      className={`${nunito.className} antialiased py-5 sm:py-10 flex flex-col justify-center items-center border-b-2 border-solid border-[var(--cocoa-brown-20)]`}>
      <div
        className={`font-bold text-[1.5rem] sm:text-[2.25rem] text-[var(--blue-02)] text-center`}>
        TIN TỨC
      </div>
      <div className="flex flex-row flex-wrap justify-center gap-6 pt-3 pb-8">
        {news.map((ele, idx) => {
          return <NewsCard key={idx} news={ele} />
        })}
      </div>
      <Link
        className="w-fit text-white bg-[var(--blue-02)] hover:opacity-90 py-4 px-7 font-bold rounded-2xl text-base"
        href={'/news'}>
        Xem thêm
      </Link>
    </div>
  )
}

export default NewsList
