/* eslint-disable @next/next/no-img-element */
'use client'
import React from 'react'
import { Avatar, Button, Tabs, TabsHeader, Tab } from '@material-tailwind/react'
import { Dot, BoxArrowInRight } from 'react-bootstrap-icons'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Discuss from '../../../ui/social-page/groups/discuss'
import ListMember from '../../../ui/social-page/groups/list-member'
import { nunito } from '../../../ui/fonts'

const groups = {
  id: '1',
  name: 'Sinh viên lớp 20CLC11',
  creator: {
    id: '1',
    name: 'Đặng Nguyễn Duy',
    avatarUrl: '/demo.jpg',
  },
  privacy: 'Nhóm kín',
  avatarUrl: '/demo.jpg',
  coverUrl: '/thumbnail-social-pages.jpg',
  website: '',
  status: 'Công khai',
  publicAt: '05-04-2023',
  numberMember: 500,
  isJoined: false,
}

const tabs = [
  {
    label: 'Thảo luận',
  },
  {
    label: 'Thành viên',
  },
]

export default function Page() {
  const [activeTab, setActiveTab] = React.useState('Thảo luận')

  return (
    <div className={`${nunito.className} max-w-[1050px] min-w-[500px] w-[80%] m-auto mb-10`}>
      <div className="relative">
        <img
          src={groups.coverUrl}
          alt="group cover"
          className="w-full h-60 object-cover object-center"
        />
        <div className="flex items-center justify-between">
          <div>
            <p className="flex items-center text-[22px] xl:text-[26px] font-bold ">
              {groups.name}
            </p>

            <p className="flex items-center">
              {groups.privacy != 'Công khai' && (
                <FontAwesomeIcon icon={faLock} className="mr-2" />
              )}{' '}
              {groups.privacy} <Dot /> {groups.numberMember} thành viên tham gia
            </p>
          </div>

          {groups.isJoined ? (
            <Button
              placeholder={undefined}
              className="normal-case px-4 py-2 text-[14px] h-fit bg-[#e4e6eb] text-black ">
              Đã tham gia
            </Button>
          ) : (
            <Button
              placeholder={undefined}
              className="normal-case px-4 py-2 text-[14px] bg-[--blue-04] text-[--blue-05]">
              Tham gia
            </Button>
          )}
        </div>
        {/*  */}

        <div className="flex flex-col gap-1 mt-6">
          <div className="border border-[--delete-filter]"></div>
          <div className="flex justify-between items-center">
            <div>
              <Tabs value="Thảo luận" className="bg-white z-0">
                <TabsHeader
                  placeholder={undefined}
                  className="rounded-none border-b border-blue-gray-50 bg-transparent p-0 z-0"
                  indicatorProps={{
                    className:
                      'bg-transparent border-b-2 border-[--blue-05] shadow-none rounded-none z-0',
                  }}>
                  {tabs.map(({ label }) => (
                    <Tab
                      key={label}
                      placeholder={undefined}
                      value={label}
                      onClick={() => setActiveTab(label)}
                      className={
                        activeTab === label
                          ? 'text-gray-900 text-nowrap w-fit px-6 py-4 text-[--blue-05]'
                          : 'text-nowrap w-fit px-6 py-4'
                      }>
                      {label}
                    </Tab>
                  ))}
                </TabsHeader>
              </Tabs>
            </div>
            {groups.isJoined && (
              <Button
                placeholder={undefined}
                variant="text"
                className="py-2 px-4 flex gap-1 items-center">
                Rời khỏi nhóm
                <BoxArrowInRight className="text-lg" />
              </Button>
            )}
          </div>
        </div>
      </div>
      {activeTab === 'Thảo luận' && <Discuss />}
      {activeTab === 'Thành viên' && <ListMember />}
    </div>
  )
}
