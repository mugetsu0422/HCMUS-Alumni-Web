'use client'
/* eslint-disable @next/next/no-img-element */

import React from 'react'
import { nunito } from '../../fonts'
import NewsListItem from './news-litst-item'

export default function RelatedNews({ news }) {
  return (
    <div className="mt-8 flex flex-col items-start">
      <p
        className={`${nunito.className} text-2xl text-[--blue-01] font-bold mb-6`}>
        Tin tức liên quan
      </p>
      <div className="flex flex-col gap-6">
        {news.map(
          ({ id, title, summary, publishedAt, faculty, tags, thumbnail }) => (
            <NewsListItem
              id={id}
              key={id}
              title={title}
              summary={summary}
              publishedAt={publishedAt}
              faculty={faculty}
              tags={tags}
              thumbnail={thumbnail}
            />
          )
        )}
      </div>
    </div>
  )
}
