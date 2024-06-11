'use client'
import React, { useState } from 'react'
import { Tabs, TabsHeader, Tab } from '@material-tailwind/react'
import { PROFILE_ABOUT_TABS } from '../../../../constant'
import { usePathname, useRouter } from 'next/navigation'
import clsx from 'clsx'

function ProfileAboutTags({ params }) {
  const pathname = usePathname()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState(() => {
    const parts = pathname.split('/')
    if (parts[4] === undefined || parts[4] === 'posts') return ''
    return parts[4]
  })

  const handleClickTab = (url) => {
    setActiveTab(url)
    router.push(`/profile/${params.id}/about/${url}`)
  }
  return (
    <div className="w-fit h-fit">
      <p className="text-[20px] lg:text-2xl font-bold mb-4">Giới thiệu</p>

      <Tabs
        value={activeTab || ''}
        orientation="vertical"
        className="flex w-[100%]">
        <TabsHeader
          placeholder={undefined}
          className="w-full bg-white"
          indicatorProps={{
            className: 'bg-[#e6f0fb] shadow-none rounded-none z-0',
          }}>
          {PROFILE_ABOUT_TABS.map(({ label, url }) => (
            <Tab
              placeholder={undefined}
              key={label}
              value={label}
              onClick={() => handleClickTab(url)}
              className={clsx({
                'sm:text-wrap xl:text-nowrap sm:w-[190px] lg:w-fit font-bold px-4 py-2 xl:px-6 xl:py-4 flex justify-start text-[14px] lg:text-base':
                  true,
                'sm:text-wrap xl:text-nowrap text-[--blue-05] sm:w-[190px] lg:w-full border-b-2 border-[--blue-05] flex justify-start bg-[#e6f0fb] text-[14px] lg:text-base':
                  activeTab === url,
              })}
              activeClassName="text-[--blue-05] bg-[#e6f0fb]">
              {label}
            </Tab>
          ))}
        </TabsHeader>
      </Tabs>
    </div>
  )
}

export default function GroupLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  return (
    <div className="mt-4">
      <div className="flex items-start justify-between">
        <ProfileAboutTags params={params} />
        <div className="w-[75%]"> {children}</div>
      </div>
    </div>
  )
}
