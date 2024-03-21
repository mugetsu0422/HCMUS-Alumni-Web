'use client'

import React from 'react'
import Sidebar from '../../ui/social-page/sidebar'

import ListUser from '../../ui/social-page/list-user'
import RegisteredEvent from '../../ui/social-page/registered-event'

export default function Page() {
  return (
    <div>
      <Sidebar>
        <ListUser />
      </Sidebar>
      <div className="flex flex-col items-center justify-center w-[1250px] ml-44 border-r-2 pr-14">
        <RegisteredEvent />
      </div>
    </div>
  )
}
