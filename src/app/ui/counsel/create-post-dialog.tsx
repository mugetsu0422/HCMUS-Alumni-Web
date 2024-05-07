'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useState } from 'react'
import {
  Avatar,
  Button,
  Input,
  Textarea,
  Dialog,
  DialogBody,
  DialogHeader,
} from '@material-tailwind/react'
import { nunito } from '../fonts'
import { XLg } from 'react-bootstrap-icons'
import ErrorInput from '../error-input'
import { useForm } from 'react-hook-form'

export default function CreatePostDialog({
  openCreatePost,
  handleOpenPost,
  user,
}) {
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm()

  const [uploadComment, setUploadComment] = useState('')
  const [images, setImages] = useState([])

  const onDragOver = (event) => {
    event.preventDefault()
  }

  const onDrop = (event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'

    const files = event.dataTransfer.files
    if (images.length + files.length > 5) {
      alert('Bạn chỉ được chọn tối đa 5 ảnh!')
      return
    }

    if (files.length > 0) {
      const newImages = [...images]
      for (const file of files) {
        const reader = new FileReader()
        reader.onload = (event) => {
          newImages.push({ src: event.target.result })
          setImages(newImages)
        }
        reader.readAsDataURL(file)
      }
    }
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
        if (images.length + files.length > 5) {
          alert('Bạn chỉ được chọn tối đa 5 ảnh!')
          return
        }
        const newImages = [...images]
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          const reader = new FileReader()
          reader.onload = (event) => {
            newImages.push({ src: event.target.result })
            setImages(newImages)
          }
          reader.readAsDataURL(file)
        }
      }
    })
  }

  const removeImage = (index, event) => {
    event.stopPropagation()
    const newImages = images.filter((image, imageIndex) => imageIndex !== index)
    setImages(newImages)
  }

  const handleUploadCommentChange = (event) => {
    setUploadComment(event.target.value)
  }

  return (
    <Dialog
      placeholder={undefined}
      open={openCreatePost}
      handler={handleOpenPost}
      size="md">
      <DialogHeader
        placeholder={undefined}
        className={`${nunito.className} sticky top-0 flex items-center cursor-`}>
        <p className="m-auto text-xl text-black">Tạo bài viết mới</p>
        <Button
          onClick={handleOpenPost}
          placeholder={undefined}
          className="rounded-full p-2"
          variant="text">
          <XLg className="text-lg" />
        </Button>
      </DialogHeader>
      <DialogBody
        placeholder={undefined}
        className={`${nunito.className} h-[480px] overflow-y-auto scrollbar-webkit-main flex flex-col gap-4`}>
        <div className="flex items-center gap-2 mb-2">
          <Avatar
            src={user.imageUrl}
            alt="user avatar"
            size="md"
            placeholder={undefined}
          />
          <p className="text-lg font-bold text-black">{user.fullName}</p>
        </div>
        <form>
          <Input
            size="lg"
            crossOrigin={undefined}
            variant="static"
            label="Tiêu đề"
            type="text"
            {...register('title', {
              required: 'Vui lòng nhập tiêu đề',
            })}
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
            className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
          />
          <ErrorInput
            // This is the error message
            errors={errors?.title?.message}
          />
          <Textarea
            onChange={handleUploadCommentChange}
            rows={8}
            variant="standard"
            placeholder="Bạn đang cần tư vấn?"
          />

          <div className="container flex flex-col items-end relative mx-auto my-2">
            <div
              className="border-dashed border-2 w-full border-gray-400 p-4 flex flex-col items-center justify-center"
              onDragOver={onDragOver}
              onDrop={onDrop}
              onClick={onClickDropzone}>
              {images.length == 0 ? (
                <p className="text-gray-500">Kéo và thả ảnh vào đây</p>
              ) : (
                <div className="mt-4 flex flex-wrap gap-3 justify-center">
                  {images.map((image, index) => (
                    <div
                      key={image.src}
                      className="relative flex flex-col items-end">
                      <Button
                        placeholder={undefined}
                        className="z-10 -mb-8 mr-1 p-2 cursor-pointer bg-black hover:bg-black opacity-75"
                        onClick={(event) => removeImage(index, event)} // Pass event object
                      >
                        <XLg />
                      </Button>
                      <img
                        src={image.src}
                        alt="Ảnh được kéo thả"
                        className="w-48 h-48 object-cover rounded-md"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button
            placeholder={undefined}
            size="md"
            disabled={!uploadComment.trim()}
            type="submit"
            className={`${nunito.className} w-full text-center py-2 px-4 bg-[var(--blue-05)] normal-case text-md`}>
            Đăng
          </Button>
        </form>
      </DialogBody>
    </Dialog>
  )
}
