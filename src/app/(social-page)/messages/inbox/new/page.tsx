'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useRef } from 'react'
import { Button, Avatar, Textarea, Input } from '@material-tailwind/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faImage } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { XLg } from 'react-bootstrap-icons'
import toast from 'react-hot-toast'
import { nunito } from '@/app/ui/fonts'
import Cookies from 'js-cookie'
import axios from 'axios'
import { useDebouncedCallback } from 'use-debounce'
import Autosuggest from 'react-autosuggest'
import { JWT_COOKIE, MESSAGE_TYPE } from '@/app/constant'
import { useAppDispatch } from '@/lib/hooks'
import { setActiveInboxId } from '@/lib/features/message/inbox-manager'
import clsx from 'clsx'
import SocketManager from '@/config/socket/socket-manager'
import TextareaAutosize from 'react-textarea-autosize'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  const [previewImages, setPreviewImages] = useState([])
  const [imageFiles, setImageFiles] = useState([])
  const [currentInboxId, setCurrentInboxId] = useState(null)
  const userId = Cookies.get('userId')
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)

  const [messages, setMessages] = useState([])
  const [messageContent, setMessageContent] = useState('')

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setActiveInboxId(null))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const onSearch = useDebouncedCallback((query) => {
    if (!query.trim()) return

    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user?fullName=${query}&pageSize=25`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { users } }) => {
        setSuggestions(users)
      })
      .catch((error) => {})
  }, 500)

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
            setPreviewImages((prev) =>
              prev.concat([{ src: event.target.result }])
            )
          }
          reader.readAsDataURL(file)
        }
      }
    })
  }

  const onSuggestionsFetchRequested = ({ value }) => {
    onSearch(value)
  }
  const onSuggestionsClearRequested = () => {
    setSuggestions([])
  }
  const getSuggestionValue = (suggestion) => {
    return suggestion.fullName
  }
  const renderSuggestion = (suggestion) => (
    <div className="flex flex-row gap-2 cursor-pointer p-2 hover:bg-blue-gray-50 rounded-lg">
      <Avatar placeholder={undefined} size="sm" src={suggestion.avatarUrl} />
      <span className="flex items-center truncate">{suggestion.fullName}</span>
    </div>
  )
  const onSuggestionSelected = (event, { suggestion, method }) => {
    if (method === 'enter') {
      event.preventDefault()
    }
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/messages/inbox/individual/${suggestion.id}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { inboxId } }) => {
        router.push(`/messages/inbox/${inboxId}`)
      })
      .catch((error) => {
        if (error.response?.data?.error?.code === 90505) {
          setSelectedUser(suggestion)
        } else {
          toast.error(
            error.response?.data?.error?.message || 'Lỗi không xác định'
          )
        }
      })
  }

  const sendTextMessage = (inboxId: number) => {
    if (!messageContent.trim()) {
      return
    }

    const socket = SocketManager.getInstance()
    socket.send(inboxId, {}, messageContent, null)
    setMessageContent('')
  }

  const sendMediaMessage = (inboxId: number) => {
    const copy = [...imageFiles]
    setImageFiles([])
    setPreviewImages([])

    copy.forEach((file) => {
      axios
        .postForm(
          `${process.env.NEXT_PUBLIC_SERVER_HOST}/messages/inbox/${inboxId}/media`,
          {
            media: file,
            messageType: MESSAGE_TYPE.IMAGE,
            parentMessageId: null,
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
  const sendMessage = (inboxId: number) => {
    if (messageContent.trim()) {
      sendTextMessage(inboxId)
    }
    if (imageFiles.length > 0) {
      sendMediaMessage(inboxId)
    }
  }

  const handleKeyDown = (event) => {
    if ((event.key === 'Enter' && !event.shiftKey) || event.type === 'click') {
      event.preventDefault()

      // Create new inbox
      axios
        .post(
          `${process.env.NEXT_PUBLIC_SERVER_HOST}/messages/inbox`,
          { members: [{ userId: selectedUser.id }] },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
            },
          }
        )
        .then(({ data: { inboxId } }) => {
          sendMessage(inboxId)
          router.push(`/messages/inbox/${inboxId}`)
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.error?.message || 'Lỗi không xác định'
          )
        })
    }
  }

  return (
    <div className="flex flex-col relative h-full">
      <header className="flex items-center gap-1 top-0 w-full px-4 py-4 border-[#eeeeee] border-b-2 z-10">
        <p
          className={`${nunito.className} font-medium text-base w-fit text-nowrap`}>
          Gửi tin nhắn đến:
        </p>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          onSuggestionSelected={onSuggestionSelected}
          inputProps={{
            spellCheck: false,
            value: query,
            onChange: (_, { newValue }) => {
              setQuery(newValue)
            },
          }}
          theme={{
            input: 'outline-none',
            container: 'relative',
            suggestionsContainer: '',
            suggestionsContainerOpen:
              'block absolute w-[300px] h-[400px] overflow-y-auto scrollbar-webkit bg-white border-2 border-solid rounded-lg border-[--highlight-bg] p-2 shadow-lg shadow-black/30',
          }}
        />

        {/* <Link href="/messages/inbox/">
          <Button
            placeholder={undefined}
            className="cursor-pointer bg-white opacity-75 ml-2 p-0">
            <XLg className="text-black text-base bg-white" />
          </Button>
        </Link> */}
      </header>

      {selectedUser && (
        <div className="w-full flex justify-center pt-4">
          <div className="flex flex-col gap-1 justify-center items-center">
            <Avatar
              placeholder={undefined}
              src={selectedUser.avatarUrl}
              size="lg"
            />
            <p className="font-semibold text-base text-black">
              {selectedUser.fullName}
            </p>
          </div>
        </div>
      )}

      <div
        id="messageList"
        className="w-full h-full px-4 overflow-x-auto scrollbar-webkit flex flex-col-reverse"></div>

      <div className="relative h-fit flex w-full flex-row items-end gap-2 p-2 bg-[white]">
        <Button
          placeholder={undefined}
          variant="text"
          className="p-2 w-fit h-fit grow-0 shrink-0"
          onClick={onClickDropzone}>
          <FontAwesomeIcon icon={faImage} className="text-xl text-[#64748B]" />
        </Button>

        <div className="h-full w-full flex flex-1 flex-col justify-center rounded-xl bg-[--comment-input]">
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
                'rounded-t-none': previewImages.length > 0,
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
          onClick={handleKeyDown}
        >
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="text-xl text-[#64748B]"
          />
        </Button>
      </div>
    </div>
  )
}
