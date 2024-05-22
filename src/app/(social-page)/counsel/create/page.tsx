'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useCallback, useState } from 'react'
import { Button, Input, Textarea } from '@material-tailwind/react'
import { XLg, ArrowLeft, FileEarmarkImage } from 'react-bootstrap-icons'
import { nunito } from '../../../ui/fonts'
import ErrorInput from '../../../ui/error-input'
import { set, useForm } from 'react-hook-form'
import { ReactTags } from 'react-tag-autocomplete'
import styles from '../../../ui/admin/react-tag-autocomplete.module.css'
import { TAGS, JWT_COOKIE } from '../../../constant'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CreatePostDialog() {
  const {
    register,
    handleSubmit,
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
    <div
      className={`${nunito.className} flex flex-col gap-8 mt-8 max-w-[1200px] w-[80%] m-auto`}>
      <Toaster
        containerStyle={{ zIndex: 99999 }}
        toastOptions={{
          success: {
            style: {
              background: '#00a700',
              color: 'white',
            },
          },
          error: {
            style: {
              background: '#ea7b7b',
              color: 'white',
            },
          },
        }}
      />
      <div className="w-full flex">
        <Link href={'/counsel'}>
          <Button
            placeholder={undefined}
            variant="text"
            className="p-2 rounded-full">
            <ArrowLeft className="text-xl" />
          </Button>
        </Link>

        <p className="m-auto text-2xl text-black font-bold">Tạo bài viết mới</p>
      </div>
      {/* className={`${nunito.className} h-[480px] overflow-y-auto scrollbar-webkit-main flex flex-col gap-4`} */}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Input
          size="lg"
          crossOrigin={undefined}
          label="Tiêu đề"
          type="text"
          {...register('title', {
            required: 'Vui lòng nhập tiêu đề',
          })}
        />
        <ErrorInput
          // This is the error message
          errors={errors?.title?.message}
        />
        <Textarea
          rows={8}
          label="Nội dung"
          {...register('content', {
            required: 'Vui lòng nhập nội dung',
          })}
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
                <FileEarmarkImage className="text-[50px] text-[--secondary]" />
                <p className="text-[--secondary]">
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
          size="lg"
          type="submit"
          className={`${nunito.className} h-12 w-full text-center mb-5 py-2 px-4 bg-[var(--blue-05)] normal-case text-base`}>
          Đăng
        </Button>
      </form>
    </div>
  )
}
