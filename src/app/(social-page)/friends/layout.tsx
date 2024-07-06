'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Tab, Tabs, TabsHeader } from '@material-tailwind/react'
import { roboto } from '@/app/ui/fonts'
import Thumbnail from '@/app/ui/social-page/thumbnail-image'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { JWT_COOKIE, POST_STATUS, FRIEND_TABS } from '../../constant'
import Cookies from 'js-cookie'
import axios from 'axios'
import clsx from 'clsx'

export default function GroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState(() => {
    const parts = pathname.split('/')
    if (parts[3] === undefined || parts[3] === 'posts') return ''
    return parts[3]
  })

  const handleClickTab = (url) => {
    setActiveTab(url)
    router.push(`/friends/${url}`)
  }

  return (
    <>
      <Thumbnail />
      <div className="max-w-[1000px] flex flex-row justify-center gap-x-8 m-auto mb-8 px-10">
        <div className="w-full flex flex-col gap-y-6 mt-10">
          <p
            className={`${roboto.className} ml-8 lg:ml-0 text-3xl font-bold text-[var(--blue-02)]`}>
            BẠN BÈ
          </p>

          <div>
            <Tabs value={activeTab || ''} className="bg-white z-0">
              <TabsHeader
                placeholder={undefined}
                className="rounded-none border-b border-blue-gray-50 bg-transparent p-0 z-0"
                indicatorProps={{
                  className: 'bg-[#e6f0fb] shadow-none rounded-none z-0',
                }}>
                {FRIEND_TABS.map(({ label, url }) => {
                  return (
                    <Tab
                      key={label}
                      placeholder={undefined}
                      value={url}
                      onClick={() => handleClickTab(url)}
                      className={clsx({
                        'sm:text-wrap xl:text-nowrap w-[150px] font-bold px-4 py-2 xl:px-6 xl:py-4 flex justify-center text-[14px] lg:text-base':
                          true,
                        'sm:text-wrap xl:text-nowrap text-[--blue-05] w-[150px] border-b-2 border-[--blue-05] flex justify-center bg-[#e6f0fb] text-[14px] lg:text-base':
                          activeTab === url,
                      })}
                      activeClassName="text-[--blue-05] bg-[#e6f0fb]">
                      {label}
                    </Tab>
                  )
                })}
              </TabsHeader>
            </Tabs>
          </div>

          {children}
        </div>
      </div>
    </>
  )
}
