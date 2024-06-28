'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useState } from 'react'
import { Button, Avatar, Textarea, Input } from '@material-tailwind/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faImage } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { XLg } from 'react-bootstrap-icons'
import toast from 'react-hot-toast'
import { nunito } from '@/app/ui/fonts'

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
      <header className="fixed flex items-center gap-1 top-0 w-[80%] px-4 py-2 border-[#eeeeee] border-b-2 mt-20 z-10">
        <p
          className={`${nunito.className} font-medium py-2 text-base w-fit text-nowrap`}>
          Gửi tin nhắn đến:
        </p>
        <Input
          size="lg"
          crossOrigin={undefined}
          containerProps={{
            className: 'w-[80%] font-medium text-black text-lg',
          }}
          // {...register('title', {
          //   onChange: (e) => onSearch(e.target.value),
          // })}
          className="bg-white !border-transparent focus:!border-transparent "
          labelProps={{
            className: 'before:content-none after:content-none',
          }}
        />
      </header>

      <div className="relative w-full h-full max-h-[80vh] px-4 overflow-x-auto scrollbar-webkit flex flex-col z-0 mt-20">
        <div className="mx-auto flex flex-col items-center gap-1">
          <Avatar placeholder={undefined} src="/demo.jpg" size="xl" />
          <p className="font-semibold text-base">Trương Samuel</p>
        </div>
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
