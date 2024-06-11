/* eslint-disable jsx-a11y/alt-text */
'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useCallback, useState } from 'react'
import {
  XLg,
  ArrowLeft,
  FileEarmarkImage,
  Image,
  BarChartLine,
} from 'react-bootstrap-icons'
import { Button, Input, Textarea } from '@material-tailwind/react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import { ReactTags } from 'react-tag-autocomplete'
import axios from 'axios'
import Cookies from 'js-cookie'
import styles from '@/app/ui/common/react-tag-autocomplete.module.css'
import CustomToaster from '@/app/ui/common/custom-toaster'
import { JWT_COOKIE } from '@/app/constant'
import ErrorInput from '@/app/ui/error-input'
import { nunito } from '@/app/ui/fonts'

export default function Page({ params }: { params: { id: string } }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const [previewImages, setPreviewImages] = useState([])
  const [imageFiles, setImageFiles] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [openAddingPost, setOpenAddingPost] = useState(false)
  const [openAddinImage, setOpenAddinImage] = useState(false)

  const handleOpenAdingPost = () => {
    setOpenAddingPost((e) => !e)
  }

  const handleOpenAdingImage = () => {
    setOpenAddinImage((e) => !e)
  }

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
      .post(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${params.id}/posts`,
        post,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: postData }) => {
        // Update post if there are images
        const form = new FormData()
        for (const image of imageFiles) {
          form.append('addedImages', image)
        }

        axios
          .put(
            `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/posts/${postData}/images`,
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
            toast.error(err.response?.data?.error?.message, {
              id: postToast,
            })
          })
      })
      .catch((err) => {
        console.error(err)
        toast.error(err.response?.data?.error?.message, {
          id: postToast,
        })
      })
  }

  return (
    <div
      className={`${nunito.className} flex flex-col gap-8 mt-8 max-w-[600px] w-[80%] m-auto`}>
      <CustomToaster />
      <div className="w-full flex">
        <Link href={`/groups/${params.id}`}>
          <Button
            placeholder={undefined}
            variant="text"
            className="p-2 rounded-full">
            <ArrowLeft className="text-xl" />
          </Button>
        </Link>

        <p className="m-auto text-2xl text-black font-bold">Tạo bài viết mới</p>
      </div>

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
          suggestions={[]}
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

        {openAddingPost && (
          <VotingPostForm handleOpenAdingPost={handleOpenAdingPost} />
        )}

        {openAddinImage && (
          <AddImagePost
            handleOpenAdingImage={handleOpenAdingImage}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onClickDropzone={onClickDropzone}
            removeImage={removeImage}
            previewImages={previewImages}
          />
        )}

        {!openAddingPost && (
          <Button
            onClick={handleOpenAdingPost}
            placeholder={undefined}
            className="bg-[--blue-02] w-full m-auto normal-case flex gap-2 items-center justify-center">
            <BarChartLine className="text-xl" />
            Tạo bình chọn
          </Button>
        )}

        {!openAddinImage && (
          <Button
            onClick={handleOpenAdingImage}
            placeholder={undefined}
            className="bg-[--blue-02] w-full m-auto normal-case flex gap-2 items-center justify-center">
            <Image className="text-xl" />
            Chọn ảnh
          </Button>
        )}

        <Button
          placeholder={undefined}
          size="lg"
          type="submit"
          className={`${nunito.className} h-12 w-full m-auto text-center mb-5 py-2 px-4 bg-[var(--blue-05)] normal-case text-base`}>
          Đăng
        </Button>
      </form>
    </div>
  )
}

function AddImagePost({
  onDragOver,
  onDrop,
  onClickDropzone,
  removeImage,
  previewImages,
  handleOpenAdingImage,
}) {
  return (
    <div>
      <div className="flex justify-between text-gray-700 text-xl font-bold mb-2 ">
        Thêm ảnh
        <Button
          variant="text"
          placeholder={undefined}
          className="z-10 mr-1 p-2 cursor-pointer"
          onClick={handleOpenAdingImage} // Pass event object
        >
          <XLg className="text-lg" />
        </Button>
      </div>
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
    </div>
  )
}

function VotingPostForm({ handleOpenAdingPost }) {
  const [title, setTitle] = useState('')
  const [options, setOptions] = useState([''])
  const [posts, setPosts] = useState([])

  const addPost = (post) => {
    setPosts([...posts, post])
  }

  const handleOptionChange = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleAddOption = () => {
    setOptions([...options, ''])
  }

  const handleRemoveOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index)
    setOptions(newOptions)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    addPost({ options })
    setOptions([''])
  }

  return (
    <form onSubmit={handleSubmit} className="w-full   rounded-lg ">
      <div className="mb-4">
        <div className="flex justify-between text-gray-700 text-xl font-bold mb-2 ">
          Tạo bình chọn
          <Button
            variant="text"
            placeholder={undefined}
            className="z-10 mr-1 p-2 cursor-pointer"
            onClick={handleOpenAdingPost} // Pass event object
          >
            <XLg className="text-lg" />
          </Button>
        </div>
        {options.map((option, index) => (
          <div key={index} className="flex items-center mb-2">
            <Input
              size="lg"
              crossOrigin={undefined}
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              label={`Lựa chọn ${index + 1}`}
            />
            <Button
              placeholder={undefined}
              onClick={() => handleRemoveOption(index)}
              className="ml-2 px-3 py-2 bg-red-400 rounded text-nowrap normal-case ">
              <p className="text-black"> Xóa lựa chọn </p>
            </Button>
          </div>
        ))}
        <Button
          placeholder={undefined}
          onClick={handleAddOption}
          className="mt-2 bg-blue-500 text-white px-3 py-2 rounded normal-case">
          Thêm lựa chọn
        </Button>
      </div>
    </form>
  )
}
