'use client'

import React from 'react'
import Sidebar from '../../ui/social-page/sidebar'
import ListUser from '../../ui/social-page/list-user'
import TrendingNews from '../../ui/social-page/trending-news'
import HallOfFame from '../../ui/social-page/hall-of-fame'
import NewEvents from '../../ui/social-page/new-events'
import { nunito } from '../../ui/fonts'
import { Button, Avatar, Badge, Textarea } from '@material-tailwind/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPaperPlane,
  faImage,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'

const chatDataTemp = [
  { A: 'Hi, Mandy', B: '' },
  { A: "I've tried the app", B: '' },
  { A: '', B: 'Really ?' },
  { A: "Yeah. It's great", B: '' },
  {
    A: '',
    B: 'Cảm ơn bạn đã tin dùng ứng dụng của chúng tôi. Chúng tôi đảm bảo sẽ cho bạn có trải nghiệm tốt nhất!',
  },
]

function DisplayChat() {
  return (
    <div className="h-[69%] px-4 overflow-x-auto scrollbar-webkit">
      {chatDataTemp.map(({ A, B }, idx) => (
        <div
          key={idx}
          className={` items-center gap-x-2 my-3 ${
            B === '' ? 'flex flex-row-reverse' : 'flex'
          }`}>
          <Avatar
            placeholder={undefined}
            size="sm"
            src={B === '' ? '/demo.jpg' : '/authentication.png'} //Điều kiện này sau này thay đổi + scr ảnh :((
            alt="avatar"
          />
          <div className="py-2 px-3 h-fit max-w-[150px] text-wrap bg-[var(--hcmus-logo)] text-white text-sm font-light rounded-2xl">
            <p>{A === '' ? B : A}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function ChatDialog() {
  return (
    <div className="fixed bottom-0 right-24 w-[350px] h-[455px] bg-white rounded-tl-lg rounded-tr-lg">
      <header className="flex items-center justify-between p-2  bg-[var(--blue-04)] rounded-tl-lg rounded-tr-lg">
        <div className="flex items-center gap-3">
          <Badge color="green" placement="bottom-end">
            <Avatar
              placeholder={undefined}
              src="/authentication.png"
              alt="avatar"
              size="md"
            />
          </Badge>

          <div>
            <p className="text-xs font-bold">Nguyễn Duy</p>
            <p className="text-xs">Đang hoạt động</p>
          </div>
        </div>
        <Button
          placeholder={undefined}
          className="p-1 w-fit h-fit"
          variant="text">
          <FontAwesomeIcon icon={faXmark} className="text-lg" />
        </Button>
      </header>

      <DisplayChat />

      <footer className="flex w-full flex-row items-center  gap-2  p-2">
        <div className="flex">
          <Button
            placeholder={undefined}
            variant="text"
            className="p-2 w-fit h-fit">
            <FontAwesomeIcon
              icon={faImage}
              className="text-xl text-[#64748B]"
            />
          </Button>
        </div>
        <Textarea
          rows={1}
          placeholder="Nhập tin nhắn"
          className="min-h-full border-1 focus:border-transparent rounded-full"
          containerProps={{
            className: 'grid h-full',
          }}
          labelProps={{
            className: 'before:content-none after:content-none',
          }}
        />
        <div>
          <Button
            placeholder={undefined}
            variant="text"
            className="p-2 w-fit h-fit">
            <FontAwesomeIcon
              icon={faPaperPlane}
              className="text-xl text-[#64748B]"
            />
          </Button>
        </div>
      </footer>
    </div>
  )
}

export default function Page() {
  return (
    <div className="relative">
      <Sidebar>
        <ListUser />
      </Sidebar>
      <div
        className={`${nunito.className} -z-10 mt-8 flex flex-col place-items-center justify-center sm:w-[95%] md:w-[90%] relative gap-y-10 `}>
        <NewEvents />
        <TrendingNews />
        <HallOfFame />
      </div>
      <ChatDialog />
    </div>
  )
}
