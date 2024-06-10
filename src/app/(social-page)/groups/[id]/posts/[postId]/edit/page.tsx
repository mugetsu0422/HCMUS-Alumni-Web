'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useCallback, useEffect, useState } from 'react'
import { Button, Input, Textarea } from '@material-tailwind/react'
import { XLg, ArrowLeft, FileEarmarkImage } from 'react-bootstrap-icons'
import { set, useForm } from 'react-hook-form'
import { ReactTags } from 'react-tag-autocomplete'
import styles from '../../../../../../ui/admin/react-tag-autocomplete.module.css'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { JWT_COOKIE, TAGS } from '../../../../../../constant'
import ErrorInput from '../../../../../../ui/error-input'
import { nunito } from '../../../../../../ui/fonts'
import NoData from '../../../../../../ui/no-data'
import CustomToaster from '@/app/ui/common/custom-toaster'

export default function Page({
  params,
}: {
  params: { id: string; postId: string }
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  const [noData, setNoData] = useState(false)
  const [currentImages, setCurrentImages] = useState([])
  const [previewImages, setPreviewImages] = useState([])
  const [addedImageFiles, setAddedImageFiles] = useState([])
  const [deleteImageIds, setDeleteImageIds] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const router = useRouter()
  const [options, setOptions] = useState([''])
  const [votes, setVotes] = useState([])

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
    if (currentImages.length + previewImages.length + files.length > 5) {
      toast.error('Bạn chỉ được chọn tối đa 5 ảnh!')
      return
    }

    if (files.length > 0) {
      const newImages = [...previewImages]
      for (const file of files) {
        setAddedImageFiles((prev) => prev.concat(file))

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
        if (currentImages.length + previewImages.length + files.length > 5) {
          toast.error('Bạn chỉ được chọn tối đa 5 ảnh!')
          return
        }

        const newImages = [...previewImages]
        for (let i = 0; i < files.length; i++) {
          const file = files[i]

          setAddedImageFiles((prev) => prev.concat(file))

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
  const removeCurrentImage = (index, id, event) => {
    event.stopPropagation()
    setCurrentImages((prev) =>
      prev.filter((image, imageIndex) => imageIndex !== index)
    )
    setDeleteImageIds((prev) => prev.concat(id))
  }
  const removeImage = (index, event) => {
    event.stopPropagation()
    const newImages = previewImages.filter(
      (image, imageIndex) => imageIndex !== index
    )
    setPreviewImages(newImages)
    setAddedImageFiles((prev) => prev.filter((_, i) => i !== index))
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
    const imagesForm = new FormData()
    for (const image of addedImageFiles) {
      imagesForm.append('addedImages', image)
    }
    for (const id of deleteImageIds) {
      imagesForm.append('deletedImageIds', id)
    }

    const postToast = toast.loading('Đang cập nhật bài viết...')

    const updatePromise = axios.put(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/posts/${params.postId}`,
      post,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
    const updateImages = axios.put(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/posts/${params.postId}/images`,
      imagesForm,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )

    Promise.all([updatePromise, updateImages])
      .then(() => {
        toast.success('Cập nhật bài viết thành công', {
          id: postToast,
        })
      })
      .catch((err) => {
        console.error(err)
        toast.error('Có lỗi xảy ra khi cập nhật bài viết', {
          id: postToast,
        })
      })
  }
  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/posts/${params.postId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { title, content, tags, pictures, votes } }) => {
        setValue('title', title)
        setValue('content', content)
        setSelectedTags(
          tags.map((tag) => {
            const { id } = tag
            return TAGS.find(({ value }) => value === id)
          })
        )
        setVotes(votes)
        setCurrentImages(pictures)
      })
      .catch((err) => {
        console.error(err)
        setNoData(true)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (noData) {
    return <NoData />
  }

  return (
    <div
      className={`${nunito.className} flex flex-col gap-8 mt-8 max-w-[1200px] w-[81.25%] m-auto`}>
      <CustomToaster />
      <div className="w-full flex">
        <Button
          onClick={() => router.push(`/groups/${params.id}`)}
          placeholder={undefined}
          variant="text"
          className="p-2 rounded-full">
          <ArrowLeft className="text-xl" />
        </Button>
        <p className="m-auto text-2xl text-black font-bold">
          Chỉnh sửa bài viết
        </p>
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
        <VotingPostForm votes={votes} />

        <AddImagePost
          onDragOver={onDragOver}
          onDrop={onDrop}
          onClickDropzone={onClickDropzone}
          removeImage={removeImage}
          previewImages={previewImages}
        />

        <Button
          placeholder={undefined}
          size="lg"
          type="submit"
          className={`${nunito.className} h-12 w-full text-center mb-5 py-2 px-4 bg-[var(--blue-05)] normal-case text-base`}>
          Cập nhật
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
}) {
  return (
    <div>
      <div className="flex text-gray-700 text-xl font-bold mb-2 ">Thêm ảnh</div>
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

function VotingPostForm({ votes }) {
  return (
    <div className="w-full   rounded-lg ">
      <div className="mb-4">
        <div className="flex text-gray-700 text-xl font-bold mb-2 ">
          Tạo bình chọn
        </div>
        {votes &&
          votes.map(({ name }, index) => (
            <div key={index} className="flex items-center mb-2">
              <Input
                crossOrigin={undefined}
                disabled={true}
                type="text"
                value={name}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                label={`Lựa chọn ${index + 1}`}
              />
              <Button
                placeholder={undefined}
                disabled={true}
                className="ml-2 bg-red-500 text-white rounded text-nowrap normal-case text-[13px]">
                Xóa lựa chọn
              </Button>
            </div>
          ))}
        <Button
          placeholder={undefined}
          disabled={true}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded normal-case">
          Thêm lựa chọn
        </Button>
      </div>
    </div>
  )
}