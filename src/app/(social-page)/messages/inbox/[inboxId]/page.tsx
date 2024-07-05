'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useState, useRef, useEffect } from 'react'
import { Button, Avatar, Spinner } from '@material-tailwind/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faImage } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { XLg } from 'react-bootstrap-icons'
import toast from 'react-hot-toast'
import axios from 'axios'
import Cookies from 'js-cookie'
import { JWT_COOKIE, MESSAGE_PAGE_SIZE, MESSAGE_TYPE } from '@/app/constant'
import MessageItem from '@/app/ui/social-page/messages/message-item'
import InfiniteScroll from 'react-infinite-scroll-component'
import TextareaAutosize from 'react-textarea-autosize'
import clsx from 'clsx'
import SocketManager from '@/config/socket/socket-manager'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setActiveInboxId } from '@/lib/features/message/socket-response'

export default function Page({ params }: { params: { inboxId: string } }) {
  const [previewImages, setPreviewImages] = useState([])
  const [imageFiles, setImageFiles] = useState([])
  const bottomRef = useRef(null)
  const [totalPages, setTotalPages] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const curPage = useRef(0)
  const [messages, setMessages] = useState([])
  const [messageContent, setMessageContent] = useState('')
  const [inboxInformation, setInboxInformation] = useState([])
  const userId = Cookies.get('userId')
  const [parentMessage, setParentMessage] = useState(null)

  const socketResponse = useAppSelector((state) => state.socketResponse)
  const dispatch = useAppDispatch()

  const onFetchMore = () => {
    curPage.current++
    if (curPage.current >= totalPages) {
      setHasMore(false)
      return
    }

    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/messages/inbox/${params.inboxId}?page=${curPage.current}&pageSize=${MESSAGE_PAGE_SIZE}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { messages } }) => {
        setMessages((prev) => prev.concat(messages))
      })
      .catch((err) => {})
  }

  const sendTextMessage = () => {
    if (!messageContent.trim()) {
      return
    }

    const socket = SocketManager.getInstance()
    socket.send(
      parseInt(params.inboxId),
      {},
      messageContent,
      parentMessage?.id || null
    )
    setMessageContent('')
  }

  const sendMediaMessage = () => {
    const copy = [...imageFiles]
    setImageFiles([])
    setPreviewImages([])

    copy.forEach((file) => {
      axios
        .postForm(
          `${process.env.NEXT_PUBLIC_SERVER_HOST}/messages/inbox/${params.inboxId}/media`,
          {
            media: file,
            messageType: MESSAGE_TYPE.IMAGE,
            parentMessageId: parentMessage?.id || null,
          },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
            },
          }
        )
        .catch((error) => {
          toast.error(
            error.response?.data?.error?.message || 'Lỗi không xác định'
          )
        })
    })
  }

  const handleReply = (message) => {
    setParentMessage(message)
  }

  const sendMessage = () => {
    if (messageContent.trim()) {
      sendTextMessage()
    }
    if (imageFiles.length > 0) {
      sendMediaMessage()
    }
    setParentMessage(null)
  }

  const handleKeyDown = (event) => {
    if ((event.key === 'Enter' && !event.shiftKey) || event.type === 'click') {
      event.preventDefault()
      sendMessage()
    }
  }

  const removeImage = (index, event) => {
    console.log('remove image')
    event.stopPropagation()
    const newImages = previewImages.filter(
      (image, imageIndex) => imageIndex !== index
    )
    setPreviewImages(newImages)
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const onClickDropzone = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/png, image/jpeg'
    input.multiple = true
    input.click()

    input.addEventListener('change', (event) => {
      const files = (event.target as HTMLInputElement).files // Type cast here
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          if (files[i].size > 1024 * 1024 * 5) {
            toast.error('Bạn chỉ được chọn ảnh dưới 5MB')
            return
          }
        }
        if (previewImages.length + files.length > 5) {
          toast.error('Bạn chỉ được chọn tối đa 5 ảnh!')
          return
        }

        const newImages = [...previewImages]
        for (let i = 0; i < files.length; i++) {
          const file = files[i]

          setImageFiles((prev) => prev.concat(file))

          const reader = new FileReader()
          reader.onload = (event) => {
            newImages.push({ src: event.target.result })
            setPreviewImages((prev) =>
              prev.concat([{ src: event.target.result }])
            )
          }
          reader.readAsDataURL(file)
        }
      }
    })
  }

  useEffect(() => {
    dispatch(setActiveInboxId(parseInt(params.inboxId)))

    // Fetch initial messages
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/messages/inbox/${params.inboxId}?pageSize=${MESSAGE_PAGE_SIZE}`,
        {
          headers: { Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}` },
        }
      )
      .then(({ data: { totalPages, messages, inbox } }) => {
        setTotalPages(totalPages)
        setMessages(messages)
        setHasMore(totalPages > 1)
        setInboxInformation(inbox.members)
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.error?.message || 'Lỗi không xác định'
        )
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (socketResponse.message && socketResponse.inbox.id == params.inboxId) {
      setMessages((prev) => {
        if (prev.length === 0) return []
        return [socketResponse.message].concat(prev)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketResponse])

  return (
    <div className="flex flex-col relative h-full">
      <header className="flex flex-0 top-0 w-full px-2 py-1 border-[#eeeeee] border-b-2">
        {inboxInformation
          .filter((e) => e.user.id !== userId)
          .map(({ user }) => (
            <Link
              href={`/profile/${user.id}/about`}
              className="flex items-center gap-3 hover:bg-blue-gray-50 w-fit p-1 rounded-lg"
              key={user.id}>
              <Avatar
                placeholder={undefined}
                src={user.avatarUrl}
                alt="avatar"
                size="md"
              />
              <div>
                <p className="text-md font-bold">{user.fullName}</p>
              </div>
            </Link>
          ))}
      </header>

      <div
        id="messageList"
        className="w-full h-full px-4 overflow-x-auto scrollbar-webkit flex flex-col-reverse">
        <InfiniteScroll
          dataLength={messages.length}
          next={onFetchMore}
          hasMore={hasMore}
          inverse={true}
          scrollableTarget="messageList"
          loader={
            <div className="h-10 flex justify-center scrollbar-webkit">
              <Spinner className="h-8 w-8"></Spinner>
            </div>
          }
          className="flex flex-col-reverse">
          {messages.map((message) => (
            <MessageItem
              message={message}
              key={message.id}
              handleReply={handleReply}
            />
          ))}
        </InfiniteScroll>
      </div>

      <div className="relative h-fit flex w-full flex-row items-end gap-2 p-2 bg-[white]">
        <Button
          placeholder={undefined}
          variant="text"
          className="p-2 w-fit h-fit grow-0 shrink-0"
          onClick={onClickDropzone}>
          <FontAwesomeIcon icon={faImage} className="text-xl text-[#64748B]" />
        </Button>

        <div className="h-full w-full flex flex-1 flex-col justify-center rounded-xl bg-[--comment-input]">
          {parentMessage && (
            <div className="flex items-center gap-2 px-3 pt-3">
              <div className="flex flex-col max-w-[100px] md:max-w-[225px] lg:max-w-[450px]">
                <p className="font-semibold truncate">
                  Đang trả lời{' '}
                  {parentMessage.sender.id === userId
                    ? 'chính mình'
                    : parentMessage.sender.fullName}
                </p>
                <p className="text-sm truncate text-[--text-navbar]">
                  {parentMessage.messageType === 'TEXT'
                    ? parentMessage.content
                    : 'Phương tiện'}
                </p>
              </div>
              <Button
                placeholder={undefined}
                className="p-2 cursor-pointer hover:bg-black opacity-75 h-fit w-fit"
                onClick={() => handleReply(null)}>
                <XLg />
              </Button>
            </div>
          )}

          {previewImages.length > 0 && (
            <div className="w-[calc(100%-1px)] flex flex-1 gap-3 p-2 rounded-t-xl bg-[--comment-input] overflow-x-auto scrollbar-webkit">
              {previewImages.map((image, index) => (
                <div
                  key={index}
                  className="w-fit h-fit shrink-0 grow-0 relative">
                  <div
                    title="Remove image"
                    className="w-fit h-fit p-2 flex items-center justify-center cursor-pointer bg-black hover:bg-black opacity-75 absolute top-0 right-0 rounded-xl"
                    onClick={(event) => removeImage(index, event)} // Pass event object
                  >
                    <XLg className="w-[14px] h-[14px] text-white" />
                  </div>
                  <img
                    src={image.src}
                    alt={`Preview ${index}`}
                    className="w-20 h-20 object-contain rounded-md"
                  />
                </div>
              ))}
            </div>
          )}

          <TextareaAutosize
            spellCheck="false"
            placeholder="Aa"
            className={clsx(
              'h-full w-full scrollbar-webkit resize-none p-1 px-3 rounded-xl bg-[--comment-input] outline-none',
              {
                'rounded-t-none': previewImages.length > 0 || parentMessage,
              }
            )}
            minRows={1}
            maxRows={6}
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <Button
          disabled={!messageContent.trim() && previewImages.length === 0}
          placeholder={undefined}
          variant="text"
          className="p-2 w-fit h-fit grow-0 shrink-0"
          onClick={handleKeyDown}>
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="text-xl text-[#64748B]"
          />
        </Button>
      </div>
    </div>
  )
}
