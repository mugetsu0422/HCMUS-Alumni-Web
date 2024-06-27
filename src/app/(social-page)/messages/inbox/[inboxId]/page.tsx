'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useState } from 'react'
import { Button, Avatar, Badge, Textarea } from '@material-tailwind/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faImage } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { XLg } from 'react-bootstrap-icons'
import toast from 'react-hot-toast'

const chatDataTemp = [
  {
    id: 1,
    sender: {
      id: 1,
      fullName: 'A',
      avatarUrl: '/demo.jpg',
    },
    content: 'Hi Phúc',
    messageType: 'TEXT',
    parentMessage: '',
    createAt: 'String',
    updateAt: 'String',
    isDelete: 'Boolean',
  },
  {
    id: 2,
    sender: {
      id: 1,
      fullName: 'A',
      avatarUrl: '/demo.jpg',
    },
    content: 'Look at my new picture',
    messageType: 'TEXT',
    parentMessage: '',
    createAt: 'String',
    updateAt: 'String',
    isDelete: 'Boolean',
  },
  {
    id: 3,
    sender: {
      id: 1,
      fullName: 'A',
      avatarUrl: '/demo.jpg',
    },
    content: '/thumbnail-social-pages.jpg',
    messageType: 'IMAGE',
    parentMessage: '',
    createAt: 'String',
    updateAt: 'String',
    isDelete: 'Boolean',
  },
  {
    id: 4,
    sender: {
      id: 1,
      fullName: 'B',
      avatarUrl: '/none-avatar.png',
    },
    content: 'Waoo! That looks great',
    messageType: 'TEXT',
    parentMessage: '',
    createAt: 'String',
    updateAt: 'String',
    isDelete: 'Boolean',
  },
  {
    id: 4,
    sender: {
      id: 1,
      fullName: 'B',
      avatarUrl: '/none-avatar.png',
    },
    content:
      'I see that you have been using our app. Is there anything problems with our app ?',
    messageType: 'TEXT',
    parentMessage: '',
    createAt: 'String',
    updateAt: 'String',
    isDelete: 'Boolean',
  },
  {
    id: 5,
    sender: {
      id: 1,
      fullName: 'A',
      avatarUrl: '/demo.jpg',
    },
    content: 'No. It is great !',
    messageType: 'TEXT',
    parentMessage: '',
    createAt: 'String',
    updateAt: 'String',
    isDelete: 'Boolean',
  },
  {
    id: 3,
    sender: {
      id: 1,
      fullName: 'B',
      avatarUrl: '/none-avatar.png',
    },
    content: '/thumbnail-social-pages.jpg',
    messageType: 'IMAGE',
    parentMessage: '',
    createAt: 'String',
    updateAt: 'String',
    isDelete: 'Boolean',
  },
]

export default function Page() {
  const [previewImages, setPreviewImages] = useState([])
  const [imageFiles, setImageFiles] = useState([])

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
  return (
    <>
      <header className="fixed flex top-0 w-full bg-[--blue-04] px-4 py-2 border-[#eeeeee] border-b-2 mt-20 z-10">
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
            <p className="text-md font-bold">Trần Phúc</p>
            <p className="text-sm">Đang hoạt động</p>
          </div>
        </Link>
      </header>

      <div className="relative w-full h-full max-h-[80vh] px-4 overflow-x-auto scrollbar-webkit flex flex-col z-0 mt-20">
        {chatDataTemp.map((chat) => (
          <div
            key={chat.id}
            className={` items-start gap-x-2 my-3 ${
              chat.sender.fullName === 'B' ? 'flex' : 'flex flex-row-reverse'
            }`}>
            <Avatar
              placeholder={undefined}
              size="md"
              src={chat.sender.avatarUrl} //Điều kiện này sau này thay đổi + scr ảnh :((
              alt="avatar"
            />
            {chat.messageType === 'TEXT' && (
              <div className="py-2 px-3 h-fit w-fit max-w-[200px] lg:max-w-[250px] xl:max-w-[300px]  2xl:max-w-[350px] text-wrap bg-[var(--hcmus-logo)] text-white text-sm font-light rounded-2xl">
                <p>{chat.content}</p>
              </div>
            )}

            {chat.messageType === 'IMAGE' && (
              <img
                src={chat.content}
                alt="message"
                className="w-[200px] h-[112.5px] sm:w-[320px] sm:h-[180px] lg:w-[380px] lg:h-[213px] 2xl:w-[440px] 2xl:h-[247.5px] rounded-xl object-contain object-center"
              />
            )}
          </div>
        ))}
      </div>

      <div className="relative w-full flex-1 flex items-end gap-2 p-2 bg-[#f6f6f6]">
        <Button
          placeholder={undefined}
          variant="text"
          className="p-2 w-fit h-fit"
          onClick={onClickDropzone}>
          <FontAwesomeIcon icon={faImage} className="text-xl text-[#64748B]" />
        </Button>

        <div className="w-full">
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
            rows={1}
            placeholder="Nhập tin nhắn"
            className="min-h-full border-1 focus:border-transparent rounded-full  grow "
            containerProps={{
              className: 'grid h-full',
            }}
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
          />
        </div>

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
    </>
  )
}
