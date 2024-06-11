/* eslint-disable @next/next/no-img-element */
'use client'

import '../../../globals.css'
import React, { useState, useEffect } from 'react'
import { nunito } from '../../../ui/fonts'
import {
  Button,
  Avatar,
  Tab,
  Tabs,
  TabsHeader,
  Tooltip,
} from '@material-tailwind/react'
import Cookies from 'js-cookie'
import { useForm } from 'react-hook-form'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import axios, { AxiosResponse } from 'axios'
import { CheckCircleFill, XCircleFill } from 'react-bootstrap-icons'
import Link from 'next/link'
import { Toaster } from 'react-hot-toast'
import { PROFILE_TABS } from '../../../constant'
import clsx from 'clsx'

const user = {
  fullName: 'Trương Samuel',
  numberOfFriends: 500,
  numberBegin: 2020,
  faculties: 'Công nghệ thông tin',
  MSSV: 20127610,
  DOB: '01/01/2002',
  gender: 'Nam',
  phoneNumber: '0123456789',
  email: 'tsamuel20@clc.fitus.edu.vn',
  verify: true,
}

function AvatarUser() {
  return (
    <div className="relative">
      <img
        src="/thumbnail-social-pages.jpg"
        alt="user cover"
        className="w-full h-40 xl:h-60 object-cover object-center"
      />
      <Avatar
        placeholder={undefined}
        src="/demo.jpg"
        alt="user avatar"
        className="w-24 h-24 lg:w-32 lg:h-32 2xl:w-40 2xl:h-40 border-4 border-white border-radius object-cover absolute top-[68%] ml-[2vw] 2xl:ml-[1.5vw] lg:top-[50%] xl:top-[60%]"
      />
      <div className="mt-6 flex justify-between items-center ml-[24vw] md:ml-[16vw] xl:ml-[17vw] 2xl:ml-[17%]">
        <div className="flex flex-col">
          <p className="text-[28px] font-bold flex items-center gap-2">
            {user.fullName}
            {user.verify ? (
              <Tooltip
                className="bg-[--blue-05] mt-1"
                content="Tài khoản đã xác thực"
                placement="right-end"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 0, y: 25 },
                }}>
                <CheckCircleFill className="text-[20px] text-[--blue-05]" />
              </Tooltip>
            ) : (
              <Tooltip
                className="bg-[--delete] mt-1"
                content="Tài khoản chưa xác thực"
                placement="right-end"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 0, y: 25 },
                }}>
                <XCircleFill className="text-[20px] text-[--delete]" />
              </Tooltip>
            )}
          </p>

          <div className="flex items-center gap-2">
            <p className="text-black font-bold">{user.numberOfFriends}</p>
            <p className="text-[--secondary]">bạn bè</p>
          </div>
        </div>
      </div>
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
  const pathname = usePathname()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(() => {
    const parts = pathname.split('/')
    if (parts[3] === undefined) return ''
    return parts[3]
  })

  const handleClickTab = (url) => {
    setActiveTab(url)
    router.push(`/profile/${params.id}/${url}`)
  }

  return (
    <div
      className={`${nunito.className} max-w-[1350px] min-w-[480px] w-[80%] m-auto overflow-x-hidden mb-10`}>
      <AvatarUser />

      <main className="mt-10">
        <Tabs value={activeTab || ''} className="flex w-[90%] m-auto">
          <TabsHeader
            placeholder={undefined}
            className="w-full bg-white"
            indicatorProps={{
              className: 'bg-[#e6f0fb] shadow-none rounded-none z-0',
            }}>
            {PROFILE_TABS.map(({ label, url }) => (
              <Tab
                placeholder={undefined}
                key={label}
                value={label}
                onClick={() => handleClickTab(url)}
                className={clsx({
                  'text-nowrap w-fit font-bold px-4 py-2 xl:px-6 xl:py-4 flex justify-start text-sm lg:text-base':
                    true,
                  'text-nowrap border-b-2 px-4 py-2 border-[--blue-05]  bg-[#e6f0fb] w-fit text-[--blue-05] flex justify-start text-sm lg:text-base':
                    activeTab === url,
                })}
                activeClassName="text-[--blue-05] bg-[#e6f0fb]">
                {label}
              </Tab>
            ))}
          </TabsHeader>
        </Tabs>

        {children}
      </main>
    </div>
  )
}
