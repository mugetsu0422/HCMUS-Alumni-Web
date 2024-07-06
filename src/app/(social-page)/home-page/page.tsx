'use client'

import React from 'react'
import TrendingNews from '../../ui/social-page/trending-news'
import HallOfFame from '../../ui/social-page/hall-of-fame'
import NewEvents from '../../ui/social-page/new-events'
import { nunito } from '../../ui/fonts'

export default function Page() {
  return (
    <div className="relative">
      <div
        className={`${nunito.className} -z-10 mt-8 flex flex-col place-items-center justify-center sm:w-[95%] md:w-[90%] relative gap-y-10 `}>
        <NewEvents />
        <TrendingNews />
        <HallOfFame />
      </div>
    </div>
  )
}
