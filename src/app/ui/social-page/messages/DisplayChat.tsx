'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useState } from 'react'
import { ArrowReturnLeft, ArrowReturnRight } from 'react-bootstrap-icons'
import { Button, Avatar } from '@material-tailwind/react'

export default function DisplayChat({ chat, handleReply }) {
  const [isHovered, setIsHovered] = useState(false)

  const handleHover = () => {
    setIsHovered(!isHovered)
  }
  return (
    <div
      key={chat.id}
      className={` items-end gap-x-2 my-3 ${
        chat.sender.fullName === 'A' ? 'flex flex-row-reverse' : 'flex'
      }`}>
      <Avatar
        placeholder={undefined}
        size="md"
        src={chat.sender.avatarUrl} //Điều kiện này sau này thay đổi + scr ảnh :((
        alt="avatar"
      />
      {chat.messageType === 'TEXT' && (
        <div>
          {/* Content of chat */}
          <div className="flex flex-col items-end">
            {chat.parentMessage != '' && (
              <>
                {chat.messageType === 'TEXT' && (
                  <div className="relative pt-2 pb-4 px-3 h-fit w-fit max-w-[200px] lg:max-w-[250px] xl:max-w-[300px]  2xl:max-w-[350px] text-wrap bg-[#f7f7f7] text-black text-sm font-light rounded-2xl -mb-3 z-0">
                    {chat.content}
                  </div>
                )}
                {chat.messageType === 'IMAGE' && (
                  <img
                    src={chat.content}
                    alt="message"
                    className="relative w-[100px] h-[56.5px] sm:w-[160px] sm:h-[90px] lg:w-[190px] lg:h-[106.5px] 2xl:w-[220px] 2xl:h-[123.75px] rounded-xl object-contain object-center -mb-8 contrast-50 z-0"
                  />
                )}
              </>
            )}

            <div
              className={`gap-2 items-center ${
                chat.sender.fullName === 'A' ? 'flex flex-row-reverse' : 'flex'
              }`}>
              <div
                onMouseEnter={handleHover}
                onMouseLeave={handleHover}
                className="relative py-2 px-3 h-fit w-fit max-w-[200px] lg:max-w-[250px] xl:max-w-[300px]  2xl:max-w-[350px] text-wrap bg-[var(--hcmus-logo)] text-white text-sm font-light rounded-2xl z-10">
                {chat.content}
              </div>
              {isHovered && (
                <Button
                  onClick={handleReply}
                  placeholder={undefined}
                  className="p-2"
                  variant="text">
                  {chat.sender.fullName === 'A' ? (
                    <ArrowReturnRight className="text-base" />
                  ) : (
                    <ArrowReturnLeft className="text-base" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {chat.messageType === 'IMAGE' && (
        <div>
          <div>
            {chat.parentMessage != '' && (
              <>
                {chat.messageType === 'TEXT' && (
                  <div className="relative py-2 px-3 h-fit w-fit max-w-[200px] lg:max-w-[250px] xl:max-w-[300px]  2xl:max-w-[350px] text-wrap bg-[#f7f7f7] text-black text-sm font-light rounded-2xl -mb-1 z-0">
                    {chat.content}
                  </div>
                )}
                {chat.messageType === 'IMAGE' && (
                  <img
                    src={chat.content}
                    alt="message"
                    className=" relative w-[100px] h-[56.5px] sm:w-[160px] sm:h-[90px] lg:w-[190px] lg:h-[106.5px] 2xl:w-[220px] 2xl:h-[123.75px] rounded-xl object-contain object-center -mb-8 contrast-50 -z-10"
                  />
                )}
              </>
            )}
            <div
              className={` ${
                chat.sender.fullName === 'A' ? 'flex flex-row-reverse' : 'flex'
              } gap-2 items-center`}
              onMouseEnter={handleHover}
              onMouseLeave={handleHover}>
              <img
                src={chat.content}
                alt="message"
                className="relative w-[200px] h-[112.5px] sm:w-[320px] sm:h-[180px] lg:w-[380px] lg:h-[213px] 2xl:w-[440px] 2xl:h-[247.5px] rounded-xl object-contain object-center z-10"
              />
              {isHovered && (
                <Button
                  onClick={handleReply}
                  placeholder={undefined}
                  className="p-2"
                  variant="text">
                  {chat.sender.fullName === 'A' ? (
                    <ArrowReturnRight className="text-base" />
                  ) : (
                    <ArrowReturnLeft className="text-base" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
