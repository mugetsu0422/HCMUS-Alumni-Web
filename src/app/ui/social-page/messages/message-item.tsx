'use client'
/* eslint-disable @next/next/no-img-element */

import React, { createContext, useContext, useEffect, useState } from 'react'
import { ArrowReturnLeft, ArrowReturnRight } from 'react-bootstrap-icons'
import { Button, Avatar } from '@material-tailwind/react'
import Cookies from 'js-cookie'
import clsx from 'clsx'
import { MESSAGE_TYPE } from '@/app/constant'
import { Tooltip } from 'react-tooltip'
import 'moment/locale/vi'
import DateFormatter from '@/helper/date-formatter'

const MessageItemContext = createContext(null)

export default function MessageItem({ message, handleReply }) {
  const userID = Cookies.get('userId')

  return (
    <MessageItemContext.Provider value={{ message, userID, handleReply }}>
      <div
        key={message.id}
        className={clsx('w-full items-end gap-x-2 my-3 flex group/msg-row', {
          'flex-row-reverse': message.sender.id === userID,
        })}>
        <Avatar
          placeholder={undefined}
          size="md"
          src={message.sender.avatarUrl}
          alt="avatar"
        />
        <MessageContent />
      </div>
    </MessageItemContext.Provider>
  )
}

function ParentMessage({ parentMessage }) {
  let msg = null
  if (parentMessage == null) {
    return null
  } else if (parentMessage.messageType === MESSAGE_TYPE.TEXT) {
    msg = (
      <div className="whitespce-preline relative pt-2 pb-4 px-3 h-fit w-fit max-w-[200px] lg:max-w-[250px] xl:max-w-[300px] 2xl:max-w-[350px] text-wrap bg-[#f7f7f7] text-black text-sm font-light rounded-2xl -mb-3 z-0">
        {parentMessage.content}
      </div>
    )
  } else if (parentMessage.messageType === MESSAGE_TYPE.IMAGE) {
    msg = (
      <img
        src={parentMessage.content}
        alt="message"
        className="relative max-h-[100px] max-w-full -mb-8 contrast-50 z-0 rounded-[1rem] border-2 border-solid border-[#dedede]"
      />
    )
  }

  return msg
}

function MessageContent() {
  const { message, userID, handleReply } = useContext(MessageItemContext)

  let msg = null
  if (message.messageType === MESSAGE_TYPE.TEXT) {
    msg = (
      <div
        id={`msg-${message.id}`}
        className="whitespace-pre-line relative py-2 px-3 h-fit w-fit max-w-[200px] lg:max-w-[250px] xl:max-w-[300px]  2xl:max-w-[350px] text-wrap bg-[var(--hcmus-logo)] text-white text-sm font-light rounded-2xl z-10">
        {message.content}
      </div>
    )
  } else if (message.messageType === MESSAGE_TYPE.IMAGE) {
    msg = (
      <img
        id={`msg-${message.id}`}
        src={message.content}
        alt="message"
        className="relative max-h-[200px] max-w-full z-10 rounded-[1rem] border-2 border-solid border-[#dedede]"
      />
    )
  }

  return (
    <div
      className={clsx('flex', {
        'flex-row-reverse': message.sender.id === userID,
        'flex-row': message.sender.id !== userID,
      })}>
      <div
        className={`flex flex-col ${
          message.sender.id === userID ? 'items-end' : 'items-start'
        } `}>
        <ParentMessage parentMessage={message.parentMessage} />
        <div
          className={`w-full gap-2 items-center ${
            message.sender.id === userID ? 'flex flex-row-reverse' : 'flex'
          }`}>
          <div className="flex-1 flex justify-end">{msg}</div>
          <Tooltip
            anchorSelect={`#msg-${message.id}`}
            content={DateFormatter.formatMessageDate(message.createAt)}
            place="left"
            arrowColor="transparent"
            className="!rounded-lg capitalize"
          />
        </div>
      </div>
      <div
        className={clsx('flex', {
          'items-center': message.parentMessage == null,
          'items-end': message.parentMessage != null,
        })}>
        <Button
          onClick={() => handleReply(message)}
          placeholder={undefined}
          className={'p-2 h-fit shrink-0 grow-0 invisible group-hover/msg-row:visible'}
          variant="text">
          {message.sender.id === userID ? (
            <ArrowReturnRight className="text-base" />
          ) : (
            <ArrowReturnLeft className="text-base" />
          )}
        </Button>
      </div>
    </div>
  )
}
