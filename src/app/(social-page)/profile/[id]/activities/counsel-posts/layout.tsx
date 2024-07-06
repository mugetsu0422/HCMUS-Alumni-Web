'use client'

import React, { useState, useEffect } from 'react'
import { PROFILE_COUNSEL_TABS } from '@/app/constant'
import {
  Tab,
  Tabs,
  TabsHeader,
  Button,
  Dialog,
  DialogFooter,
  DialogBody,
  DialogHeader,
} from '@material-tailwind/react'
import { usePathname, useRouter } from 'next/navigation'
import clsx from 'clsx'
import Cookies from 'js-cookie'

function ConfirmDialog({ open, handleOpen, userIdParams }) {
  const router = useRouter()

  return (
    <Dialog placeholder={undefined} open={open} handler={handleOpen} size="xs">
      <DialogHeader placeholder={undefined}>Thông báo</DialogHeader>
      <DialogBody placeholder={undefined}>
        Bạn không có quyền xem thông tin này !
      </DialogBody>
      <DialogFooter placeholder={undefined}>
        <Button
          placeholder={undefined}
          className="bg-[--blue-05]"
          onClick={() => router.push(`/profile/${userIdParams}/activities`)}>
          Xác nhận
        </Button>
      </DialogFooter>
    </Dialog>
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
  const parts = pathname.split('/')
  const [activeTab, setActiveTab] = useState(() => {
    if (parts[5] === undefined) return ''
    return parts[5]
  })
  const userIdParams = parts[2]
  const userId = Cookies.get('userId')
  const isProfileLoginUser = userId === userIdParams

  const [open, setOpen] = useState(false)
  function handleOpen() {
    setOpen((e) => !e)
  }

  const handleClickTab = (url) => {
    setActiveTab(url)
    router.push(`/profile/${params.id}/activities/counsel-posts/${url}`)
  }

  useEffect(() => {
    {
      isProfileLoginUser && handleOpen()
    }
  }, [isProfileLoginUser])

  return (
    <div className="w-full flex flex-col gap-4">
      <ConfirmDialog
        open={open}
        handleOpen={handleOpen}
        userIdParams={userIdParams}
      />
      <p className="text-[18px] lg:text-[22px] font-bold">Tư vấn & cố vấn</p>
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
