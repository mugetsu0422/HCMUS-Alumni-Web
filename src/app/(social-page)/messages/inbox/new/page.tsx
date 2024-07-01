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
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { JWT_COOKIE } from '@/app/constant'
import Cookies from 'js-cookie'
import axios from 'axios'
import { useDebouncedCallback } from 'use-debounce'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Autosuggest from 'react-autosuggest'

export default function Page() {
  const [previewImages, setPreviewImages] = useState([])
  const [imageFiles, setImageFiles] = useState([])
  const [stompClient, setStompClient] = useState(null)
  const [currentInboxId, setCurrentInboxId] = useState(null)
  const userId = Cookies.get('userId')
  const curPage = useRef(0)
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const [myParams, setMyParams] = useState(`?${params.toString()}`)
  const [hasMore, setHasMore] = useState(true)

  const [suggestions, setSuggestions] = useState([])
  const [friendName, setFriendName] = useState('')

  useEffect(() => {
    if (currentInboxId) {
      connectToWebSocket()
    }
  }, [currentInboxId])

  const resetCurPage = () => {
    params.delete('page')
    curPage.current = 0
    setHasMore(true)
  }

  const onSearch = useDebouncedCallback((keyword) => {
    if (keyword) {
      params.set('title', keyword)
    } else {
      params.delete('title')
    }
    resetCurPage()
    //replace(`${pathname}?${params.toString()}`, { scroll: false })
    setMyParams(`?${params.toString()}`)
  }, 500)

  function connectToWebSocket() {
    const socket = new SockJS('http://localhost:8080/ws')
    const client = Stomp.over(socket)
    client.connect({}, (frame) => {
      console.log('Connected: ' + frame)
      setStompClient(client)
    })
  }

  function sendMessage() {
    const messageInput = document.getElementById('message') as
      | HTMLInputElement
      | HTMLTextAreaElement

    if (!messageInput) {
      console.error('No element found with ID "message"')
      return
    }

    const messageContent = messageInput.value

    if (messageContent && currentInboxId) {
      stompClient.send(
        '/app/send-message/' + currentInboxId,
        {},
        JSON.stringify({
          senderId: userId,
          content: messageContent,
          parentMessageId: null,
        })
      )
      messageInput.value = ''
    }
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

  const renderSuggestion = (suggestion) => <div>{suggestion.fullName}</div>

  return (
    <div className="flex flex-col relative h-full">
      <header className="fixed flex items-start gap-1 top-0 w-[87%] px-4 py-4 border-[#eeeeee] border-b-2 mt-20 z-10">
        <p
          className={`${nunito.className} font-medium text-base w-fit text-nowrap`}>
          Gửi tin nhắn đến:
        </p>
        <label htmlFor="friend">
          <Autosuggest
            inputProps={{
              placeholder: 'Tìm kiếm',
              autoComplete: 'off',
              name: 'friend',
              id: 'friend',
              value: friendName,
              onChange: (_event, { newValue }) => {
                setFriendName(newValue)
              },
            }}
            suggestions={suggestions}
            onSuggestionsFetchRequested={async () => {
              if (!friendName) {
                setSuggestions([])
                return
              }
              try {
                const response = await axios.get(
                  `${process.env.NEXT_PUBLIC_SERVER_HOST}/user?fullName=${friendName}`,
                  {
                    headers: {
                      Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
                    },
                  }
                )
                setSuggestions(
                  response.data.users.map((user) => ({
                    id: user.id,
                    fullName: user.fullName,
                    avatarUrl: user.avatarUrl,
                  }))
                )
                console.log(suggestions)
              } catch (error) {
                toast.error(
                  error.response?.data?.error?.message || 'Lỗi không xác định'
                )
                setSuggestions([])
              }
            }}
            onSuggestionsClearRequested={() => {
              setSuggestions(suggestions)
            }}
            getSuggestionValue={(suggestion) => suggestion.fullName}
            renderSuggestion={renderSuggestion}
            onSuggestionsSelected={(event, { suggestion, method }) => {
              if (method === 'enter') {
                event.preventDefault()
              }
              setFriendName(suggestion.fullName)
            }}
          />
        </label>

        <Link href="/messages/inbox/">
          <Button
            placeholder={undefined}
            className="cursor-pointer bg-white opacity-75 ml-2 p-0">
            <XLg className="text-black text-base bg-white" />
          </Button>
        </Link>
      </header>

      <div className="relative w-full h-full max-h-[80vh] px-4 overflow-x-auto scrollbar-webkit flex flex-col z-0 mt-20">
        <div className="mx-auto flex flex-col items-center gap-1">
          {suggestions.length === 1 &&
            suggestions.map(({ avatarUrl, fullName }) => (
              <>
                <Avatar placeholder={undefined} src={avatarUrl} size="xl" />
                <p className="font-semibold text-base text-black">{fullName}</p>
              </>
            ))}
        </div>
      </div>

      <div className="flex flex-1" id="chat-messages"></div>

      <div className="relative w-full flex-1 flex items-end gap-2 p-2 bg-[#f6f6f6]">
        <Button
          placeholder={undefined}
          variant="text"
          className="p-2 w-fit h-fit"
          onClick={onClickDropzone}>
          <FontAwesomeIcon icon={faImage} className="text-xl text-[#64748B]" />
        </Button>

        <div className="relative h-[70px] flex w-full flex-row items-end gap-2 p-2 bg-[#f0f2f5]">
          {
            <div className="flex flex-wrap gap-3 justify-start p-2">
              {previewImages.map((image, index) => (
                <div
                  key={image.src}
                  className="relative flex flex-col items-end">
                  <Button
                    placeholder={undefined}
                    className="-mb-8 mr-1 p-2 cursor-pointer bg-black hover:bg-black opacity-75"
                    onClick={(event) => removeImage(index, event)} // Pass event object
                  >
                    <XLg />
                  </Button>
                  <img
                    src={image.src}
                    alt="Ảnh được kéo thả"
                    className="w-32 h-24 object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          }

          <Textarea
            id="message"
            rows={1}
            placeholder="Aa"
            className="min-h-[90%] !border-0 focus:border-transparent text-base"
            containerProps={{
              className: 'grid h-[90%]',
            }}
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
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
