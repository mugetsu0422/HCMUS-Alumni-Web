'use client'

import React from 'react'
import { Button, Avatar, Badge, Textarea } from '@material-tailwind/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faImage } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

const chatDataTemp = [
  {
    A: 'Dạ không có gì. Niềm vui của bạn cũng là niềm vui của chúng tôi. Nếu bạn có bất cứ thắc mắc gì thì liên hệ với chúng tôi. Chúng tôi sẽ phản hồi sớm nhất có thể !',
    B: '',
  },
  {
    A: '',
    B: 'Cảm ơn bạn đã tin dùng ứng dụng của chúng tôi. Chúng tôi đảm bảo sẽ cho bạn có trải nghiệm tốt nhất!',
  },
  {
    A: 'Dạ không có gì. Niềm vui của bạn cũng là niềm vui của chúng tôi. Nếu bạn có bất cứ thắc mắc gì thì liên hệ với chúng tôi. Chúng tôi sẽ phản hồi sớm nhất có thể !',
    B: '',
  },
  {
    A: '',
    B: 'Cảm ơn bạn đã tin dùng ứng dụng của chúng tôi. Chúng tôi đảm bảo sẽ cho bạn có trải nghiệm tốt nhất!',
  },
  { A: "Yeah. It's great", B: '' },
  { A: '', B: 'Really ?' },
  { A: "I've tried the app", B: '' },
  { A: 'Hi, Mandy', B: '' },
]

function DisplayChat() {
  return (
    <div className="fixed w-[81vw] h-[76%] bottom-[54px] px-4 overflow-x-auto scrollbar-webkit flex flex-col-reverse z-0">
      {chatDataTemp.map(({ A, B }, idx) => (
        <div
          key={idx}
          className={` items-start gap-x-2 my-3 ${
            B === '' ? 'flex flex-row-reverse' : 'flex'
          }`}>
          <Avatar
            placeholder={undefined}
            size="md"
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

export default function Page() {
  return (
    <div className="fixed w-full h-screen">
      <div className="fixed ml-[360px] w-[81vw] h-screen bg-white">
        <header className="fixed top-0 w-[81vw] bg-[--blue-04] px-4 py-2 border-[#eeeeee] border-b-2 mt-20 z-10">
          <Link
            href={`/profile/id/about`}
            className="flex items-center gap-3 hover:bg-[#cbcbcb] w-fit p-2 rounded-lg">
            <Badge color="green" placement="bottom-end">
              <Avatar
                placeholder={undefined}
                src="/authentication.png"
                alt="avatar"
                size="md"
              />
            </Badge>

            <div>
              <p className="text-md font-bold">Nguyễn Duy</p>
              <p className="text-sm">Đang hoạt động</p>
            </div>
          </Link>
        </header>

        <DisplayChat />

        <footer className="fixed bottom-0 flex flex-row items-center w-[81vw] gap-2  p-2">
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
    </div>
  )
}
