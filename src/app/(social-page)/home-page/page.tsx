'use client'

import React from 'react'
import Sidebar from '../../ui/social-page/sidebar'
import ListUser from '../../ui/social-page/list-user'
import TodayNews from '../../ui/social-page/today-new'
import TrendingNews from '../../ui/social-page/trending-news'
import HallOfFame from '../../ui/social-page/hall-of-fame'
import { nunito } from '../../ui/fonts'

export default function Page() {
  return (
    <div className="relative">
      <Sidebar>
        <ListUser />
      </Sidebar>
      <div
        className={`${nunito.className} -z-10 top-24 flex flex-col place-items-center justify-center sm:w-[95%] md:w-[90%] relative gap-y-10 `}>
        <TodayNews />
        <TrendingNews />
        <HallOfFame />
      </div>
    </div>
  )
}
