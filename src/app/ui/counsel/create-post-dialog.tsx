'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useCallback, useState } from 'react'
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
import { set, useForm } from 'react-hook-form'
import { ReactTags } from 'react-tag-autocomplete'
import styles from '../admin/react-tag-autocomplete.module.css'
import { JWT_COOKIE, TAGS } from '../../constant'
import axios from 'axios'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'

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

  const [previewImages, setPreviewImages] = useState([])
  const [imageFiles, setImageFiles] = useState([])
  const [selectedTags, setSelectedTags] = useState([])

  const onDragOver = (event) => {
    event.preventDefault()
  }
  const onDrop = (event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'

    const files = event.dataTransfer.files

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

    if (files.length > 0) {
      const newImages = [...previewImages]
      for (const file of files) {
        setImageFiles((prev) => prev.concat(file))

        const reader = new FileReader()
        reader.onload = (event) => {
          newImages.push({ src: event.target.result })
          setPreviewImages(newImages)
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
  const removeImage = (index, event) => {
    event.stopPropagation()
    const newImages = previewImages.filter(
      (image, imageIndex) => imageIndex !== index
    )
    setPreviewImages(newImages)
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
  }
  const onAddTags = useCallback(
    (newTag) => {
      setSelectedTags([...selectedTags, newTag])
    },
    [selectedTags]
  )
  const onDeleteTags = useCallback(
    (tagIndex) => {
      setSelectedTags(selectedTags.filter((_, i) => i !== tagIndex))
    },
    [selectedTags]
  )

  const onSubmit = (data) => {
    const post = {
      ...data,
      tags: selectedTags.map((tag) => {
        return { id: tag.value }
      }),
    }

    const postToast = toast.loading('Đang đăng bài viết...')

    // Upload post without images
    axios
      .post(`${process.env.NEXT_PUBLIC_SERVER_HOST}/counsel`, post, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then(({ data: { id } }) => {
        // Update post if there are images
        const form = new FormData()
        for (const image of imageFiles) {
          form.append('addedImages', image)
        }

        axios
          .put(
            `${process.env.NEXT_PUBLIC_SERVER_HOST}/counsel/${id}/images`,
            form,
            {
              headers: {
                Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
              },
            }
          )
          .then(() => {
            toast.success('Đăng thành công', {
              id: postToast,
            })
            handleOpenPost()
          })
          .catch((err) => {
            console.error(err)
            toast.error('Đăng thất bại', {
              id: postToast,
            })
          })
      })
      .catch((err) => {
        console.error(err)
        toast.error('Đăng thất bại', {
          id: postToast,
        })
      })
  }

  return (
    <Dialog
      placeholder={undefined}
      open={openCreatePost}
      handler={handleOpenPost}
      size="lg">
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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
            className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900 focus:border-b-2"
          />
          <ErrorInput
            // This is the error message
            errors={errors?.title?.message}
          />
          <Textarea
            rows={8}
            variant="static"
            label="Nội dung"
            {...register('content', {
              required: 'Vui lòng nhập nội dung',
            })}
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
            className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900 focus:border-b-2"
          />
          <ErrorInput
            // This is the error message
            errors={errors?.content?.message}
          />

          <ReactTags
            activateFirstOption={true}
            placeholderText="Thêm thẻ"
            selected={selectedTags}
            suggestions={TAGS}
            onAdd={onAddTags}
            onDelete={onDeleteTags}
            noOptionsText="No matching countries"
            classNames={{
              root: `${styles['react-tags']}`,
              rootIsActive: `${styles['is-active']}`,
              rootIsDisabled: `${styles['is-disabled']}`,
              rootIsInvalid: `${styles['is-invalid']}`,
              label: `${styles['react-tags__label']}`,
              tagList: `${styles['react-tags__list']}`,
              tagListItem: `${styles['react-tags__list-item']}`,
              tag: `${styles['react-tags__tag']}`,
              tagName: `${styles['react-tags__tag-name']}`,
              comboBox: `${styles['react-tags__combobox']}`,
              input: `${styles['react-tags__combobox-input']}`,
              listBox: `${styles['react-tags__listbox']}`,
              option: `${styles['react-tags__listbox-option']}`,
              optionIsActive: `${styles['is-active']}`,
              highlight: `${styles['react-tags__listbox-option-highlight']}`,
            }}
          />

          <div className="container flex flex-col items-end relative mx-auto my-2">
            <div
              className="border-dashed border-2 w-full border-gray-400 p-4 flex flex-col items-center justify-center hover:cursor-pointer"
              onDragOver={onDragOver}
              onDrop={onDrop}
              onClick={onClickDropzone}>
              {previewImages.length == 0 ? (
                <>
                  <p className="text-gray-500">
                    Chọn hoặc kéo và thả ảnh vào đây
                  </p>
                  <span className="text-red-700">(Tối đa 5 ảnh)</span>
                </>
              ) : (
                <div className="mt-4 flex flex-wrap gap-3 justify-center">
                  {previewImages.map((image, index) => (
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
            type="submit"
            className={`${nunito.className} w-full text-center py-2 px-4 bg-[var(--blue-05)] normal-case text-md`}>
            Đăng
          </Button>
        </form>
      </DialogBody>
    </Dialog>
  )
}
