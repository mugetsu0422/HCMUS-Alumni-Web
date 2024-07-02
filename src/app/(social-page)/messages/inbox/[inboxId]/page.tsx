'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useState, useRef, useEffect } from 'react'
import { Button, Avatar, Textarea } from '@material-tailwind/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faImage } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { XLg } from 'react-bootstrap-icons'
import toast from 'react-hot-toast'
import axios from 'axios'
import Cookies from 'js-cookie'
import { JWT_COOKIE } from '@/app/constant'
import DisplayMessage from '@/app/ui/social-page/messages/DisplayMessage'
import WebSocketManager from '../../../../../config/WebSocketManager.js'

export default function Page({ params }: { params: { inboxId: string } }) {
  const [previewImages, setPreviewImages] = useState([])
  const [imageFiles, setImageFiles] = useState([])
  const [onReply, setOnReply] = useState(false)
  const bottomRef = useRef(null)
  const [totalPages, setTotalPages] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const curPage = useRef(0)
  const [messages, setMessages] = useState([])
  const [messageContent, setMessageContent] = useState('')

  useEffect(() => {
    // Scroll to the bottom when the component mounts
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })

    // Fetch initial messages
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/messages/inbox/${params.inboxId}`,
        {
          headers: { Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}` },
        }
      )
      .then(({ data: { totalPages, messages } }) => {
        setTotalPages(totalPages)
        setMessages(messages)
        setHasMore(totalPages > 1)
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.error?.message || 'Lỗi không xác định'
        )
      })

    // Connect to WebSocket
    WebSocketManager.connect(params.inboxId, showMessage)

    return () => {
      WebSocketManager.disconnect()
    }
  }, [])

  const showMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message])
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleReply = () => {
    setOnReply((prev) => !prev)
  }

  const removeImage = (index, event) => {
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
            setPreviewImages(newImages)
          }
          reader.readAsDataURL(file)
        }
      }
    })
  }

  const sendMessage = () => {
    if (!messageContent.trim()) {
      return
    }

    // Send message via WebSocket
    WebSocketManager.send(
      '/app/send-message/' + params.inboxId,
      {},
      JSON.stringify({
        senderId: Cookies.get('userId'),
        content: messageContent,
        parentMessageId: null,
      })
    )

    setMessageContent('')
  }

  return (
    <div className="flex flex-col relative h-full">
      <header className="relative flex flex-0 top-0 w-full bg-[--blue-04] px-4 py-2 border-[#eeeeee] border-b-2 z-10 h-[70px]">
        <Link
          href={`/profile/id/about`}
          className="flex items-center gap-3 hover:bg-[#cbcbcb] w-fit p-2 rounded-lg">
          <Avatar
            placeholder={undefined}
            src="/authentication.png"
            alt="avatar"
            size="md"
          />
          <div>
            <p className="text-md font-bold">Trần Phúc</p>
          </div>
        </Link>
      </header>

      <div className="relative w-full h-full px-4 overflow-x-auto scrollbar-webkit flex flex-col z-0">
        {messages.map((message) => (
          <DisplayMessage
            message={message}
            key={message.id}
            handleReply={handleReply}
          />
        ))}
        <div ref={bottomRef}></div>
      </div>

      <div className="relative h-[70px] flex w-full flex-row items-end gap-2 p-2 bg-[#f0f2f5]">
        <Button
          placeholder={undefined}
          variant="text"
          className="p-2 w-fit h-fit"
          onClick={onClickDropzone}>
          <FontAwesomeIcon icon={faImage} className="text-xl text-[#64748B]" />
        </Button>

        <div className="w-full">
          {onReply && (
            <div className="flex items-center gap-2">
              <p> Bạn đang phản hồi tin nhắn </p>
              <Button
                placeholder={undefined}
                className=" p-2 cursor-pointer hover:bg-black opacity-75 h-fit w-fit"
                onClick={handleReply}>
                <XLg />
              </Button>
            </div>
          )}

          {previewImages.length > 0 && (
            <div className="flex flex-wrap gap-3 justify-start p-2">
              {previewImages.map((image, index) => (
                <div key={index} className="relative flex flex-col items-end">
                  <Button
                    placeholder={undefined}
                    className="-mb-8 mr-1 p-2 cursor-pointer bg-black hover:bg-black opacity-75"
                    onClick={(event) => removeImage(index, event)} // Pass event object
                  >
                    <XLg />
                  </Button>
                  <img
                    src={image.src}
                    alt={`Preview ${index}`}
                    className="w-32 h-24 object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          )}

          <Textarea
            rows={1}
            placeholder="Aa"
            className="min-h-[90%] !border-0 focus:border-transparent text-base"
            containerProps={{
              className: 'grid h-[90%]',
            }}
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
          />
        </div>

        <Button
          placeholder={undefined}
          variant="text"
          className="p-2 w-fit h-fit"
          onClick={sendMessage}>
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="text-xl text-[#64748B]"
          />
        </Button>
      </div>
    </div>
  )
}
