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
    <div className="relative top-24">
      <Sidebar>
        <ListUser />
      </Sidebar>
      <div
        className={`${nunito.className}  flex flex-col items-center justify-center w-[1250px] ml-44 relative gap-y-10`}>
        <TodayNews />
        <TrendingNews />
        <HallOfFame />
      </div>
    </div>
  )
}
