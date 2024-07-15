'use client'

import React, { useState, useEffect } from 'react'
import { PROFILE_COUNSEL_TABS } from '@/app/constant'
import { Tab, Tabs, TabsHeader, Button } from '@material-tailwind/react'
import { usePathname, useRouter } from 'next/navigation'
import clsx from 'clsx'
import Cookies from 'js-cookie'
import NotFound404 from '@/app/ui/common/not-found-404'

export default function GroupLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  const pathname = usePathname()

  const router = useRouter()
  const parts = pathname.split('/')
  const [activeTab, setActiveTab] = useState(() => {
    if (parts[5] === undefined) return ''
    return parts[5]
  })
  const [isMounted, setIsMounted] = useState(false)

  const handleClickTab = (url) => {
    setActiveTab(url)
    router.push(`/profile/${params.id}/activities/counsel-posts/${url}`)
  }

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  if (!isMounted) return null
  else {
    if (Cookies.get('userId') !== params.id) return <NotFound404 />
    return (
      <div
        className="w-full flex flex-col gap-4"
        suppressHydrationWarning={true}>
        <p className="text-[18px] lg:text-[22px] font-bold">Tư vấn </p>
        <Tabs value={activeTab || ''} className="flex">
          <TabsHeader
            placeholder={undefined}
            className="w-full bg-white"
            indicatorProps={{
              className: 'bg-[#e6f0fb] shadow-none rounded-none z-0',
            }}>
            {PROFILE_COUNSEL_TABS.map(({ label, url }) => (
              <Tab
                placeholder={undefined}
                key={label}
                value={label}
                onClick={() => handleClickTab(url)}
                className={clsx({
                  'text-nowrap w-fit font-bold px-4 py-2 xl:px-6 xl:py-4 flex justify-start text-sm lg:text-base z-0':
                    true,
                  'text-nowrap border-b-2 px-4 py-2 border-[--blue-05]  bg-[#e6f0fb] w-fit text-[--blue-05] flex justify-start text-sm lg:text-base z-0':
                    activeTab === url,
                })}
                activeClassName="text-[--blue-05] bg-[#e6f0fb]">
                {label}
              </Tab>
            ))}
          </TabsHeader>
        </Tabs>
        {children}
      </div>
    )
  }
}
